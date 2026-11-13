import { categories } from "@/app/lib/trip/categories";
import type { Category } from "@/app/lib/trip/types";

type MapPinProps = {
  category: Category;
  index: number; // ordem da parada no dia (1, 2, 3...)
  delay?: number; //animacao de entrada, um leve atraso
};


//pin com a cort e o icone da categoria
//pin é um svg com a ponta no ponto exato do mapa, o icone da categoria e o numero da parada
export function MapPin({ category, index, delay = 0 }: MapPinProps) {
  const { color, icon: Icon, label } = categories[category];

  return (
    <div
      className="relative animate-pin-drop"
      style={{ animationDelay: `${delay}ms` }}
      title={`${index}. ${label}`}
    >
      {/* a gota: a ponta de baixo é o ponto exato no mapa */}
      <svg viewBox="0 0 34 44" className="h-11 w-[34px] drop-shadow-[0_3px_4px_rgb(0_0_0/0.3)]" aria-hidden>
        <path
          d="M17 1C8.2 1 1 8 1 16.7 1 28.5 17 43 17 43s16-14.5 16-26.3C33 8 25.8 1 17 1Z"
          fill={color}
          stroke="#fff"
          strokeWidth="2"
        />
      </svg>

      <Icon className="absolute top-[9px] left-1/2 size-4 -translate-x-1/2 text-white" strokeWidth={2.5} />

      {/* número da parada */}
      <span
        className="absolute -top-1.5 -right-2 grid size-[18px] place-items-center rounded-full bg-white text-[10px] font-bold shadow-[0_1px_3px_rgb(0_0_0/0.3)]"
        style={{ color }}
      >
        {index}
      </span>
    </div>
  );
}