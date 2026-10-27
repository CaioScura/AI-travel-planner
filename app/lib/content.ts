import { 
    Coffee,
    Hotel,
    Landmark,
    MessageSquareText,
    Sparkles,
    SlidersHorizontal,
    UtensilsCrossed,
  type LucideIcon } from "lucide-react";

export const siteConfig = {
  name: "TripMind",
  tagline: "seu roteiro de viagem na sua mão",
  description:
    "Conte para onde quer ir e o que gosta. Montamos o roteiro do seu dia a dia para você!",
};

export const navLinks = [
  { label: "Como funciona", panel: "como-funciona" },
  { label: "Exemplo", panel: "exemplo" },
];


/** chips no estilo das categorias do Google Maps -> chips foi visto no curso de angular */
export const categoryChips: { label: string; icon: LucideIcon }[] = [
  { label: "Restaurantes", icon: UtensilsCrossed },
  { label: "Hotéis", icon: Hotel },
  { label: "Atrações", icon: Landmark },
  { label: "Cafés", icon: Coffee },
];

//texto que o card vai digitar
export const heroPrompt =
  "5 dias em Lisboa, curto comida local e museus, orçamento médio";

  /** resultado no card digitado */
export const heroResult = {
  title: "Lisboa · 5 dias",
  meta: "18 paradas · ~€640 por pessoa",
  stops: [
    { time: "09:00", name: "Pastéis de Belém", kind: "Café", color: "bg-amber-500" },
    { time: "10:30", name: "Mosteiro dos Jerónimos", kind: "Museu", color: "bg-gmap-blue" },
    { time: "13:00", name: "Time Out Market", kind: "Almoço", color: "bg-gmap-red" },
    { time: "16:00", name: "Miradouro da Graça", kind: "Vista", color: "bg-gmap-green" },
  ],
};


export const steps: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: "Conte sua viagem",
    text: "Destino, datas, ritmo e o que você curte. Do jeito que você falaria com um amigo.",
    icon: MessageSquareText,
  },
  {
    title: "A IA monta o roteiro",
    text: "Paradas organizadas por dia, na ordem que faz sentido, com tempo de deslocamento entre elas.",
    icon: Sparkles,
  },
  {
    title: "Ajuste no mapa",
    text: "Arraste, troque ou remova lugares. O roteiro se recalcula na hora.",
    icon: SlidersHorizontal,
  },
];



//EXEMPLO
export type TravelMode = "walk" | "transit" | "car";

export type ItineraryStop = {
  time: string;
  name: string;
  note: string;
  //proxima parada
  next?: { mode: TravelMode; minutes: number };
};

export const sampleItinerary: { label: string; area: string; stops: ItineraryStop[] }[] = [
  {
    label: "Dia 1",
    area: "Belém",
    stops: [
      { time: "09:00", name: "Pastéis de Belém", note: "Chegue cedo, a fila cresce rápido", next: { mode: "walk", minutes: 6 } },
      { time: "09:45", name: "Mosteiro dos Jerónimos", note: "Compre o ingresso online", next: { mode: "walk", minutes: 12 } },
      { time: "12:00", name: "Torre de Belém", note: "Melhor luz para fotos", next: { mode: "transit", minutes: 22 } },
      { time: "13:30", name: "Time Out Market", note: "Almoço — prove o bacalhau à brás" },
    ],
  },
  {
    label: "Dia 2",
    area: "Alfama e Graça",
    stops: [
      { time: "09:30", name: "Castelo de São Jorge", note: "Vista de toda a cidade", next: { mode: "walk", minutes: 9 } },
      { time: "11:30", name: "Miradouro de Santa Luzia", note: "Azulejos e vista do rio", next: { mode: "walk", minutes: 14 } },
      { time: "13:00", name: "Tasca do Chico", note: "Almoço com fado à noite", next: { mode: "walk", minutes: 18 } },
      { time: "17:00", name: "Miradouro da Graça", note: "Pôr do sol" },
    ],
  },
  {
    label: "Dia 3",
    area: "Sintra",
    stops: [
      { time: "08:30", name: "Comboio para Sintra", note: "Saída do Rossio, ~40 min", next: { mode: "transit", minutes: 40 } },
      { time: "10:00", name: "Palácio da Pena", note: "Reserve horário de entrada", next: { mode: "walk", minutes: 20 } },
      { time: "13:00", name: "Quinta da Regaleira", note: "Não perca o poço iniciático", next: { mode: "car", minutes: 15 } },
      { time: "16:30", name: "Cabo da Roca", note: "Ponto mais ocidental da Europa" },
    ],
  },
];
