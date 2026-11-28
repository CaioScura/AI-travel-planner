"use client";

import { useState } from "react";
import { ArrowRight, LoaderCircle, LocateFixed, MapPin, MapPinOff, MousePointerClick } from "lucide-react";
import { DestinationSearch } from "./DestinationSearch";
import { TripPreferences } from "./TripPreferences";
import { TripView } from "./TripView";

import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/cn";
import { usePlanner } from "./PlannerProvider";


//painel da tela de planejamento, que fica sobre o mapa, onde escolhe o destino  e o roteiro
export function PlannerPanel() {
  const { trip, destination, setTrip } = usePlanner();

  // Em qual passo o usuário está (o roteiro tem prioridade: se existe, mostra ele)
  const [step, setStep] = useState<"destination" | "preferences">("destination");

  let content;
  if (trip) {
    content = <TripView onBack={() => setTrip(null)} />;
  } else if (step === "preferences" && destination) {
    content = <TripPreferences onBack={() => setStep("destination")} />;
  } else {
    content = <ChooseDestination onContinue={() => setStep("preferences")} />;
  }

  return (
    <GlassPanel
      variant="strong"
      className={cn(
        "pointer-events-auto absolute inset-x-3 bottom-3 p-5 md:inset-x-auto md:top-20 md:bottom-auto md:left-4 md:w-[380px]",
        // preferências e roteiro são longos: o painel rola por dentro
        (trip || step === "preferences") && "max-h-[55svh] overflow-y-auto md:max-h-[calc(100svh-6.5rem)]",
      )}
    >
      {content}
    </GlassPanel>
  );
}


//estado inicial, escsolher o destino de viagem
function ChooseDestination({ onContinue }: { onContinue: () => void }) {
  const { destination } = usePlanner();

  return (
    <div className="animate-fade-up">
      <h1 className="text-xl font-semibold tracking-tight">Para onde você vai?</h1>
      <p className="mt-1 text-[15px] text-ink-soft">Escolha o destino e a gente monta o roteiro.</p>

      {/* Busca: ganha vida na etapa 11 */}
      {/* <label className="mt-4 flex h-12 items-center gap-3 rounded-full bg-white px-4 shadow-[0_1px_3px_rgb(60_64_67/0.15)]">
        <Search className="size-5 shrink-0 text-ink-faint" />
        <input
          disabled
          placeholder="Buscar cidade ou país"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint disabled:cursor-not-allowed"
        />
        <span className="shrink-0 rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] whitespace-nowrap text-ink-soft">em breve</span>
      </label> */}

      <DestinationSearch />
      
      <DestinationStatus />

      

      <LocationStatus />

      <div className="mt-4 border-t border-black/[0.06] pt-4">
          {/* com destino escolhido, segue para as preferências */}
          {destination && (
            <Button className="mt-4 w-full" onClick={onContinue}>
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          )}
      </div>
    </div>
  );
}



//destino escolhido (ou a dica de clicar no mapa)
function DestinationStatus() {
  const { destination, setDestination } = usePlanner();

  if (!destination) {
    return (
      <p className="mt-2 flex items-center gap-2 px-1 text-sm text-ink-faint">
        <MousePointerClick className="size-4" />
        ou clique no mapa para escolher a cidade
      </p>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/70 p-3 animate-fade-up">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gmap-red/10 text-gmap-red">
        <MapPin className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{destination.name}</p>
        {destination.country && <p className="truncate text-sm text-ink-soft">{destination.country}</p>}
      </div>
      <button
        onClick={() => setDestination(null)}
        className="shrink-0 text-sm font-medium text-gmap-blue hover:underline"
      >
        Trocar
      </button>
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
