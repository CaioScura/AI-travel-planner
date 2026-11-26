import { Castle, Landmark, Moon, ShoppingBag, Trees, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Interest, Pace } from "./types";

//num de dias da viagem
export const MIN_DAYS = 1;
export const MAX_DAYS = 14;

//tamanho maximo do texto de notas do usuário
export const MAX_NOTES = 500;


//pontos de interesse que o usuario vai poder escolher
export const INTERESTS: { id: Interest; label: string; icon: LucideIcon }[] = [
  { id: "food", label: "Comida", icon: UtensilsCrossed },
  { id: "culture", label: "Cultura e museus", icon: Landmark },
  { id: "history", label: "História", icon: Castle },
  { id: "nature", label: "Natureza", icon: Trees },
  { id: "nightlife", label: "Vida noturna", icon: Moon },
  { id: "shopping", label: "Compras", icon: ShoppingBag },
];

//opções de ritmo
export const PACES: { id: Pace; label: string; hint: string }[] = [
  { id: "relaxed", label: "Tranquilo", hint: "2–3 paradas por dia, com tempo livre" },
  { id: "balanced", label: "Equilibrado", hint: "4–5 paradas por dia" },
  { id: "intense", label: "Intenso", hint: "o máximo que der para ver" },
];