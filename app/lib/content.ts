import { Coffee, Hotel, Landmark, UtensilsCrossed, type LucideIcon } from "lucide-react";

export const siteConfig = {
  name: "TripMind",
  tagline: "seu roteiro de viagem na sua mão",
  description:
    "Conte para onde quer ir e o que gosta. Montamos o roteiro do seu dia a dia para você!",
};

export const navLinks = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Exemplo", href: "#exemplo" },
];


/** Chips no estilo das categorias do Google Maps -> chips foi visto no curso de angular */
export const categoryChips: { label: string; icon: LucideIcon }[] = [
  { label: "Restaurantes", icon: UtensilsCrossed },
  { label: "Hotéis", icon: Hotel },
  { label: "Atrações", icon: Landmark },
  { label: "Cafés", icon: Coffee },
];

//texto que o card vai digitar
export const heroPrompt =
  "5 dias em Lisboa, curto comida local e museus, orçamento médio";

  /** Resultado que aparece depois de "pensar" */
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