"use client";

import { ArrowLeft, Info } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { categories } from "@/app/lib/trip/categories";
import { sampleTrip } from "@/app/lib/trip/sample-trip";
import { usePlanner } from "./PlannerProvider";


//ROTEIRO, abas de dia e lista de paradas
export function TripView({ onBack }: { onBack: () => void }) {
  const { trip, destination, selectedDay, setSelectedDay } = usePlanner();
  if (!trip) return null;

  const day = trip.days[selectedDay];
  const isSample = trip.id === sampleTrip.id;

  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gmap-blue hover:underline"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </button>

      <h1 className="mt-3 text-xl font-semibold tracking-tight">{trip.title}</h1>
      <p className="text-[15px] text-ink-soft">
        {trip.destination} · {trip.days.length} dias
      </p>

      {/* aviso enquanto a IA não existe */}
      {isSample && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-gmap-blue/[0.07] p-3 text-[13px] text-ink-soft">
          <Info className="mt-0.5 size-4 shrink-0 text-gmap-blue" />
          Roteiro de exemplo.
          {destination ? ` Na próxima etapa, a IA monta o de ${destination.name}.` : ""}
        </p>
      )}

      {/* Abas de dia (rolam na horizontal quando há muitos dias) */}
      <div role="tablist" aria-label="Dias do roteiro" className="-mx-1 mt-4 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
        {trip.days.map((d, i) => (
          <button
            key={d.id}
            role="tab"
            aria-selected={i === selectedDay}
            onClick={() => setSelectedDay(i)}
            className={cn(
              "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              i === selectedDay ? "bg-gmap-blue text-white" : "bg-black/[0.05] text-ink-soft hover:text-ink",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-sm font-semibold">
        {day.title} <span className="font-normal text-ink-faint">· {day.activities.length} paradas</span>
      </p>

      {/* Paradas do dia — key={day.id} refaz a animação ao trocar de dia */}
      <ol key={day.id} className="mt-2">
        {day.activities.map((activity, i) => {
          const { color, icon: Icon, label } = categories[activity.category];
          const isLast = i === day.activities.length - 1;

          return (
            <li key={activity.id} className="relative flex gap-3 pb-4 animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              {/* linha pontilhada até a próxima parada */}
              {!isLast && (
                <span className="absolute top-10 bottom-0 left-[17px] border-l-[3px] border-dotted border-black/10" />
              )}

              {/* ícone na cor da categoria — igual ao pin do mapa */}
              <span
                className="relative grid size-9 shrink-0 place-items-center rounded-full text-white"
                style={{ backgroundColor: color }}
                title={label}
              >
                <Icon className="size-4" />
                <span
                  className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-white text-[9px] font-bold shadow"
                  style={{ color }}
                >
                  {i + 1}
                </span>
              </span>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-medium">{activity.name}</p>
                  <span className="shrink-0 text-[13px] text-ink-faint tabular-nums">{activity.time}</span>
                </div>
                {activity.note && <p className="text-[13px] leading-snug text-ink-soft">{activity.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}