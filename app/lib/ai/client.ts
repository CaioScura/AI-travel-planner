import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import type { TripRequest } from "@/app/lib/trip/types";
import { aiTripJsonSchema, aiTripSchema, type AiTrip } from "./schema";
import { buildPrompt, SYSTEM_INSTRUCTION } from "./prompt";

//conversa com o GEMINI: modelo, tempo limite, etc

//modelo principal e reserva (mais leve e mais rápido)
//thinking = quanto a IA "pensa" antes de responder: menos pensamento = resposta mais rápida
const MODELS = [
  { name: process.env.GEMINI_MODEL ?? "gemini-3.8-flash", thinking: ThinkingLevel.LOW },
  { name: process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite", thinking: ThinkingLevel.MINIMAL },
];

const ATTEMPT_TIMEOUT_MS = 30_000; // tempo máximo de CADA tentativa (não da soma delas)
const ATTEMPTS_PER_MODEL = 2; // a original + 1 nova tentativa

const TEMPORARY_STATUS = [500, 502, 503, 504];

/** Erro com uma mensagem amigável e o status HTTP que a rota deve devolver */
export class AiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Google sobrecarregado (5xx) */
function isOverloaded(error: unknown) {
  return error instanceof ApiError && TEMPORARY_STATUS.includes(error.status);
}

/** A tentativa passou do tempo limite e foi cancelada */
function isTimeout(error: unknown) {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

/** Uma chamada ao Gemini -> roteiro já conferido pelo Zod (ou null se veio fora do formato) */
async function askGemini(
  ai: GoogleGenAI,
  model: (typeof MODELS)[number],
  request: TripRequest,
): Promise<AiTrip | null> {
  const response = await ai.models.generateContent({
    model: model.name,
    contents: buildPrompt(request),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseJsonSchema: aiTripJsonSchema,
      temperature: 0.7, //de 0 a 1, quanto maior, mais criativa a IA fica para montar o roteiro
      thinkingConfig: { thinkingLevel: model.thinking },
    },
  });

  try {
    // a IA garante JSON válido, mas não que o conteúdo faça sentido: conferimos
    const result = aiTripSchema.safeParse(JSON.parse(response.text ?? ""));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/** Transforma qualquer erro numa mensagem amigável + status HTTP */
function toAiError(error: unknown): AiError {
  if (error instanceof AiError) return error;

  // 429 = cota gratuita do dia (ou do minuto) acabou
  if (error instanceof ApiError && error.status === 429) {
    return new AiError("Limite gratuito da IA atingido. Tente de novo mais tarde.", 429);
  }
  if (isOverloaded(error)) {
    return new AiError("A IA está sobrecarregada no momento. Tente de novo em alguns minutos.", 503);
  }
  if (isTimeout(error)) {
    return new AiError("A IA demorou demais para responder. Tente de novo em instantes.", 504);
  }

  console.error("[ai] erro ao chamar o Gemini:", error);
  return new AiError("Não conseguimos falar com a IA agora. Tente de novo.", 502);
}

//GERA O ROTEIRO
export async function generateItinerary(request: TripRequest): Promise<AiTrip> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiError("A chave do Gemini não está configurada no servidor (GEMINI_API_KEY).", 500);
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      timeout: ATTEMPT_TIMEOUT_MS, // vale para cada tentativa separadamente
      // a biblioteca tenta de novo sozinha quando o Google responde com erro temporário
      // ou quando a tentativa estoura o tempo (espera ~1 s entre elas)
      retryOptions: { attempts: ATTEMPTS_PER_MODEL, initialDelay: 1, httpStatusCodes: TEMPORARY_STATUS },
    },
  });

  let lastError: unknown;

  for (const model of MODELS) {
    const startedAt = Date.now();
    try {
      // até 2 pedidos se a resposta vier fora do formato
      for (let attempt = 1; attempt <= 2; attempt++) {
        const trip = await askGemini(ai, model, request);
        if (trip) {
          console.info(`[ai] ${model.name} respondeu em ${Date.now() - startedAt} ms`);
          return trip;
        }
      }
      throw new AiError("A IA respondeu num formato inesperado. Tente de novo.", 502);
    } catch (error) {
      lastError = error;
      const seconds = Math.round((Date.now() - startedAt) / 1000);

      // sobrecarregado ou lento demais? o modelo reserva (mais leve) pode resolver
      if (isOverloaded(error) || isTimeout(error)) {
        console.warn(`[ai] ${model.name} falhou após ${seconds} s (${isTimeout(error) ? "tempo esgotado" : "sobrecarga"})`);
        continue;
      }
      break; // outros erros (cota, chave...) não melhoram trocando de modelo
    }
  }

  throw toAiError(lastError);
}