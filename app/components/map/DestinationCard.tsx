import { LoaderCircle, MapPinOff, X } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import type { Place } from "@/app/lib/trip/types";
import type { Candidate } from "./useDestinationPicker";


type DestinationCardProps = {
  candidate: Candidate;
  onConfirm: (place: Place) => void;
  onClose: () => void;
};


/** Card de vidro que aparece sobre o ponto clicado no mapa */
export function DestinationCard({ candidate, onConfirm, onClose }: DestinationCardProps) {
  return (
    <div className="glass-strong relative w-64 rounded-[22px] p-4 text-left animate-fade-up">
      <button
        onClick={onClose}
        aria-label="Fechar"
        className="absolute top-3 right-3 grid size-7 place-items-center rounded-full bg-black/[0.05] text-ink-soft transition-colors hover:bg-black/10"
      >
        <X className="size-4" />
      </button>

      {candidate.status === "loading" && (
        <p className="flex items-center gap-2 py-1 pr-8 text-sm text-ink-soft">
          <LoaderCircle className="size-4 animate-spin text-gmap-blue" />
          Identificando o lugar…
        </p>
      )}

      {candidate.status === "found" && (
        <>
          <p className="text-[11px] font-semibold tracking-wide text-gmap-blue uppercase">Destino</p>
          <h3 className="mt-0.5 pr-8 text-lg leading-tight font-semibold">{candidate.place.name}</h3>
          {candidate.place.country && <p className="text-sm text-ink-soft">{candidate.place.country}</p>}

          <Button className="mt-3 w-full" onClick={() => onConfirm(candidate.place)}>
            Definir como destino
          </Button>
        </>
      )}

      {(candidate.status === "empty" || candidate.status === "error") && (
        <p className="flex items-start gap-2 pr-8 text-sm text-ink-soft">
          <MapPinOff className="mt-0.5 size-4 shrink-0 text-ink-faint" />
          {candidate.status === "empty"
            ? "Nenhuma cidade por aqui. Tente clicar mais perto de uma."
            : "Não conseguimos identificar o lugar agora. Tente de novo."}
        </p>
      )}
    </div>
  );
}