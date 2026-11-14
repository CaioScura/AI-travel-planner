import { BedDouble, Camera, Coffee, TrainFront, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { Category } from "./types";

type CategoryStyle = {
  label: string;
  color: string; // cor do pin e do ícone no painel
  icon: LucideIcon;
};


//cor e icone de cada categoria, para usar no painel e no mapa, o ícone é do pacote lucide-react
export const categories: Record<Category, CategoryStyle> = {
  attraction: { label: "Atração", color: "#0b8a7d", icon: Camera },
  food: { label: "Comida", color: "#e8710a", icon: UtensilsCrossed },
  cafe: { label: "Café", color: "#a0522d", icon: Coffee },
  lodging: { label: "Hospedagem", color: "#7e57c2", icon: BedDouble },
  transport: { label: "Transporte", color: "#3949ab", icon: TrainFront },
};