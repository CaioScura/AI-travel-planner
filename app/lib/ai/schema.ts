import { z } from "zod";


//formato que a IA deve devolver
export const aiActivitySchema = z.object({
  name: z.string().min(1).describe("Nome do lugar para mostrar ao usuário, em português"),
  searchQuery: z
    .string()
    .min(1)
    .describe("Nome oficial do lugar para buscar no mapa (inglês ou idioma local), sem descrições"),
  category: z.enum(["attraction", "food", "cafe", "lodging", "transport"]),
  time: z.string().regex(/^\d{2}:\d{2}$/).describe("Horário de chegada, formato HH:MM"),
  note: z.string().describe("Dica curta e útil, em português, até 90 caracteres"),
});

export const aiDaySchema = z.object({
  title: z.string().describe("Bairros ou região do dia, ex.: 'Higashiyama e Gion'"),
  activities: z.array(aiActivitySchema).min(1).max(8),
});

export const aiTripSchema = z.object({
  title: z.string().describe("Título curto do roteiro, ex.: 'Kyoto em 5 dias'"),
  days: z.array(aiDaySchema).min(1).max(14),
});

export type AiTrip = z.infer<typeof aiTripSchema>;

// Regras que o Gemini não aceita no schema: elas multiplicam as combinações que ele
// precisa controlar ao gerar a resposta (ex.: até 14 dias × até 8 paradas cada).
// Tiramos do schema enviado à IA — mas o Zod continua conferindo tudo na resposta.
const RULES_ONLY_FOR_ZOD = ["minItems", "maxItems", "minLength", "maxLength", "pattern"];

/** Copia o schema removendo (em todos os níveis) as regras da lista acima */
function simplifyForGemini(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(simplifyForGemini);
  if (typeof node !== "object" || node === null) return node;

  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => !RULES_ONLY_FOR_ZOD.includes(key))
      .map(([key, value]) => [key, simplifyForGemini(value)]),
  );
}

/** O formato em JSON Schema, simplificado — é o que vai para o Gemini */
export const aiTripJsonSchema = simplifyForGemini(z.toJSONSchema(aiTripSchema));