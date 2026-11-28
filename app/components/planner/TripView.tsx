"use client";

import { useState } from "react";
import { ArrowLeft, Check, Footprints, Info, LoaderCircle, MapPinOff, Pencil, RefreshCw } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { categories } from "@/app/lib/trip/categories";
import { sampleTrip } from "@/app/lib/trip/sample-trip";
import { getCenter } from "@/app/lib/geo/bounds";
import type { RouteLeg } from "@/app/lib/trip/types";
import { usePlanner } from "./PlannerProvider";

import { ActivityControls } from "./ActivityControls";
import { AddActivitySearch } from "./AddActivitySearch";


//ROTEIRO, abas de dia e lista de paradas
export function TripView({ onBack }: { onBack: () => void }) {
  const { trip, selectedDay, setSelectedDay, lastRequest, generating, generateError, generateTrip, dayRoute } = usePlanner();
    const [editing, setEditing] = useState(false); //modo edição
  
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


      {/* roteiro de exemplo */}
      {isSample && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-gmap-blue/[0.07] p-3 text-[13px] text-ink-soft">
          <Info className="mt-0.5 size-4 shrink-0 text-gmap-blue" />
          Roteiro de exemplo. Escolha um destino para a IA montar o seu.
        </p>
      )}

      {/* lugares que a IA sugeriu mas não achamos no mapa */}
      {trip.notFound && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-500/10 p-3 text-[13px] text-ink-soft">
          <MapPinOff className="mt-0.5 size-4 shrink-0 text-amber-600" />
          Não achamos no mapa: {trip.notFound.join(", ")}.
        </p>
      )}

      {/* gerar outra versão com as mesmas escolhas */}
      {lastRequest && !isSample && (
        <button
          onClick={() => generateTrip(lastRequest)}
          disabled={generating}
          className="mt-3 flex items-center gap-1.5 text-sm font-medium text-gmap-blue hover:underline disabled:opacity-60"
        >
          {generating ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          {generating ? "Gerando outra versão…" : "Gerar de novo"}
        </button>
      )}
      {generateError && <p className="mt-2 text-sm text-gmap-red">{generateError}</p>}



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

            <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">
          {day.title} <span className="font-normal text-ink-faint">· {day.activities.length} paradas</span>
        </p>
        <button
          onClick={() => setEditing(!editing)}
          aria-pressed={editing}
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-gmap-blue hover:underline"
        >
          {editing ? <Check className="size-4" /> : <Pencil className="size-3.5" />}
          {editing ? "Concluir" : "Editar"}
        </button>
      </div>


      {/* situação do cálculo dos caminhos a pé */}
      {dayRoute.loading && (
        <p className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-faint">
          <LoaderCircle className="size-3.5 animate-spin" />
          Calculando os caminhos a pé…
        </p>
      )}
      {dayRoute.failed && (
        <p className="mt-1 text-[12px] text-ink-faint">
          Não deu para calcular os caminhos agora — o mapa mostra linhas retas.
        </p>
      )}
      
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
                
                {/* trecho até a PRÓXIMA parada: legs[i] liga a parada i à i+1 */}
                {!isLast && dayRoute.route?.legs[i] && <LegInfo leg={dayRoute.route.legs[i]} />}
                
                {editing && <ActivityControls id={activity.id} index={i} total={day.activities.length} />}

              </div>
            </li>
          );
        })}
      </ol>

      
      {/* busca perto do centro das paradas do dia */}
      {editing && <AddActivitySearch near={getCenter(day.activities.map((a) => a.coordinates))} />}

      
      <p className="mt-2 text-[11px] text-ink-faint">Caminhos a pé: Valhalla (FOSSGIS) · dados © OpenStreetMap</p>

      
    </div>
  );
}


//trecho a pé até a próxima parada
function LegInfo({ leg }: { leg: RouteLeg }) {
  const tooFar = leg.durationMin > 40;

  return (
    <p className={cn("mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[12px]", tooFar ? "text-amber-700" : "text-ink-faint")}>
      <Footprints className="size-3.5" />
      {formatDuration(leg.durationMin)} · {formatDistance(leg.distanceKm)}
      {tooFar && <span>· longe para ir a pé, considere transporte</span>}
    </p>
  );
}



function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}


function formatDistance(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;
}