import { ApiError, GoogleGenAI } from "@google/genai";
import type { TripRequest } from "@/app/lib/trip/types";
import { aiTripJsonSchema, aiTripSchema, type AiTrip } from "./schema";
import { buildPrompt, SYSTEM_INSTRUCTION } from "./prompt";

//conversa com o GEMINI: modelo, tempo limite, etc

//modelo principal e reserva (mais leve, costuma estar menos sobrecarregado)
const MODELS = [
  process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-3.5-flash-lite",
];
const TIMEOUT_MS = 45_000;


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

function isTemporary(error: unknown) {
  return error instanceof ApiError && TEMPORARY_STATUS.includes(error.status);
}

/** Uma chamada ao Gemini -> roteiro já conferido pelo Zod (ou null se veio fora do formato) */
async function askGemini(ai: GoogleGenAI, model: string, request: TripRequest): Promise<AiTrip | null> {
  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(request),
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseJsonSchema: aiTripJsonSchema,
      temperature: 0.7, //de 0 a 1, quanto maior, mais criativa a IA fica para montar o roteiro
      abortSignal: AbortSignal.timeout(TIMEOUT_MS),
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
  // 503 e cia. = servidores do Google sobrecarregados (mesmo depois das novas tentativas)
  if (isTemporary(error)) {
    return new AiError("A IA está sobrecarregada no momento. Tente de novo em alguns minutos.", 503);
  }
  if (error instanceof Error && error.name === "TimeoutError") {
    return new AiError("A IA demorou demais para responder. Tente de novo.", 504);
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
      // a própria biblioteca tenta de novo quando o Google responde com erro temporário:
      // espera ~1 s, depois ~2 s... (backoff exponencial com um pouco de aleatoriedade)
      retryOptions: { attempts: 3, initialDelay: 1, httpStatusCodes: TEMPORARY_STATUS },
    },
  });

  let lastError: unknown;

  for (const model of MODELS) {
    try {
      // até 2 tentativas se a resposta vier fora do formato
      for (let attempt = 1; attempt <= 2; attempt++) {
        const trip = await askGemini(ai, model, request);
        if (trip) return trip;
      }
      throw new AiError("A IA respondeu num formato inesperado. Tente de novo.", 502);
    } catch (error) {
      lastError = error;
      // sobrecarregado mesmo depois das novas tentativas? tenta o modelo reserva
      if (isTemporary(error)) {
        console.warn(`[ai] ${model} sobrecarregado mesmo após novas tentativas`);
        continue;
      }
      break; // outros erros (cota, chave, timeout...) não melhoram trocando de modelo
    }
  }

  throw toAiError(lastError);
}