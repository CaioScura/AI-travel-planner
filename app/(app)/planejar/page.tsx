import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { GlassPanel } from "@/app/components/ui/GlassPanel";

export const metadata: Metadata = {
  title: "Planejar viagem — TripMind",
};

export default function PlanejarPage() {
  return (
    <GlassPanel
      variant="strong"
      className="pointer-events-auto absolute inset-x-3 bottom-3 p-6 md:inset-x-auto md:top-20 md:bottom-auto md:left-4 md:w-[380px]"
    >
      <span className="grid size-10 place-items-center rounded-full bg-gmap-blue text-white">
        <Sparkles className="size-5" />
      </span>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">Planejar viagem</h1>
      <p className="mt-1 text-ink-soft">
        Aqui vai ficar o painel com o roteiro. Por enquanto, arraste e dê zoom no mapa.
      </p>
    </GlassPanel>
  );
}