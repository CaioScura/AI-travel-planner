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

/** O mesmo formato em JSON Schema — é o que vai para o Gemini */
export const aiTripJsonSchema = z.toJSONSchema(aiTripSchema);