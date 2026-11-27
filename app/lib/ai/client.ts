import { ApiError, GoogleGenAI } from "@google/genai";
import type { TripRequest } from "@/app/lib/trip/types";
import { aiTripJsonSchema, aiTripSchema, type AiTrip } from "./schema";
import { buildPrompt, SYSTEM_INSTRUCTION } from "./prompt";

//conversa com o GEMINI: modelo, tempo limite, etc

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const TIMEOUT_MS = 45_000; // desiste se a IA demorar mais que isso

/** Erro com uma mensagem amigável e o status HTTP que a rota deve devolver */
export class AiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Uma chamada ao Gemini -> roteiro já conferido pelo Zod (ou null se veio fora do formato) */
async function askGemini(ai: GoogleGenAI, request: TripRequest): Promise<AiTrip | null> {
  const response = await ai.models.generateContent({
    model: MODEL,
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


//GERA O ROTEIRO
export async function generateItinerary(request: TripRequest): Promise<AiTrip> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AiError("A chave do Gemini não está configurada no servidor (GEMINI_API_KEY).", 500);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    for (let attempt = 1; attempt <= 2; attempt++) {
      const trip = await askGemini(ai, request);
      if (trip) return trip;
    }
    throw new AiError("A IA respondeu num formato inesperado. Tente de novo.", 502);
  } catch (error) {
    if (error instanceof AiError) throw error;

    // 429 = cota gratuita do dia (ou do minuto) acabou
    if (error instanceof ApiError && error.status === 429) {
      throw new AiError("Limite gratuito da IA atingido. Tente de novo mais tarde.", 429);
    }
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new AiError("A IA demorou demais para responder. Tente de novo.", 504);
    }

    console.error("[ai] erro ao chamar o Gemini:", error);
    throw new AiError("Não conseguimos falar com a IA agora. Tente de novo.", 502);
  }
}