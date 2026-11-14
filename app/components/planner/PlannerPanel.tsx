"use client";

import { ArrowLeft, LoaderCircle, LocateFixed, MapPinOff, Search, Sparkles } from "lucide-react";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { Button } from "@/app/components/ui/Button";
import { sampleTrip } from "@/app/lib/trip/sample-trip";
import { usePlanner } from "./PlannerProvider";


//painel da tela de planejamento, que fica sobre o mapa, onde escolhe o destino  e o roteiro
export function PlannerPanel() {
  const { trip } = usePlanner();

  return (
    <GlassPanel
      variant="strong"
      className="pointer-events-auto absolute inset-x-3 bottom-3 p-5 md:inset-x-auto md:top-20 md:bottom-auto md:left-4 md:w-[380px]"
    >
      {trip ? <TripSummary /> : <ChooseDestination />}
    </GlassPanel>
  );
}


//estado inicial, escsolher o destino de viagem
function ChooseDestination() {
  const { setTrip } = usePlanner();

  return (
    <div className="animate-fade-up">
      <h1 className="text-xl font-semibold tracking-tight">Para onde você vai?</h1>
      <p className="mt-1 text-[15px] text-ink-soft">Escolha o destino e a gente monta o roteiro.</p>

      {/* Busca: ganha vida na etapa 11 */}
      <label className="mt-4 flex h-12 items-center gap-3 rounded-full bg-white px-4 shadow-[0_1px_3px_rgb(60_64_67/0.15)]">
        <Search className="size-5 shrink-0 text-ink-faint" />
        <input
          disabled
          placeholder="Buscar cidade ou país"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint disabled:cursor-not-allowed"
        />
        <span className="shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] whitespace-nowrap text-ink-soft">em breve</span>
      </label>

      <LocationStatus />

      <div className="mt-4 border-t border-black/[0.06] pt-4">
        <Button variant="glass" className="w-full" onClick={() => setTrip(sampleTrip)}>
          <Sparkles className="size-4 text-gmap-blue" />
          Ver roteiro de exemplo (Tóquio)
        </Button>
      </div>
    </div>
  );
}


//status da localizacao do usuario
function LocationStatus() {
  const { location, retryLocation } = usePlanner();

  if (location.status === "locating") {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
        <LoaderCircle className="size-4 animate-spin text-gmap-blue" />
        Buscando sua localização…
      </p>
    );
  }

  if (location.status === "found") {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
        <LocateFixed className="size-4 text-gmap-blue" />
        Partindo da sua localização
      </p>
    );
  }

  // "denied" ou "unavailable"
  return (
    <div className="mt-4 flex items-start gap-2 text-sm text-ink-soft">
      <MapPinOff className="mt-0.5 size-4 shrink-0 text-ink-faint" />
      <p>
        {location.status === "denied"
          ? "Localização bloqueada — tudo bem, dá para escolher o destino mesmo assim."
          : "Não conseguimos achar sua localização."}{" "}
        <button onClick={retryLocation} className="font-medium text-gmap-blue hover:underline">
          Tentar de novo
        </button>
      </p>
    </div>
  );
}


//se tiver roteiro, mostra o resumo do roteiro e botão "nova viagem"
function TripSummary() {
  const { trip, setTrip } = usePlanner();
  if (!trip) return null;

  return (
    <div className="animate-fade-up">
      <button
        onClick={() => setTrip(null)}
        className="flex items-center gap-1.5 text-sm font-medium text-gmap-blue hover:underline"
      >
        <ArrowLeft className="size-4" />
        Nova viagem
      </button>

      <h1 className="mt-3 text-xl font-semibold tracking-tight">{trip.title}</h1>
      <p className="text-[15px] text-ink-soft">
        {trip.destination} · {trip.days.length} dias
      </p>

      <p className="mt-3 text-sm text-ink-faint">
        Mostrando o {trip.days[0].label}: {trip.days[0].title}.
      </p>
    </div>
  );
}