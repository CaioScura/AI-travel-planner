"use client";

import { useState } from "react";
import { ArrowLeft, LoaderCircle, MapPin, Minus, Plus, WandSparkles } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { cn } from "@/app/lib/cn";
import { INTERESTS, MAX_DAYS, MAX_NOTES, MIN_DAYS, PACES } from "@/app/lib/trip/preferences";
import type { Interest, Pace, TripRequest } from "@/app/lib/trip/types";
import { usePlanner } from "./PlannerProvider";

/** Passo 2: "Como vai ser a viagem?" */
export function TripPreferences({ onBack }: { onBack: () => void }) {
  const { destination, location, lastRequest, generating, generateError, generateTrip } = usePlanner();

  // começa com as escolhas do último pedido (se houver) — voltar não perde nada
  const [days, setDays] = useState(lastRequest?.days ?? 3);
  const [interests, setInterests] = useState<Interest[]>(lastRequest?.interests ?? []);
  const [pace, setPace] = useState<Pace>(lastRequest?.pace ?? "balanced");
  const [notes, setNotes] = useState(lastRequest?.notes ?? "");

  if (!destination) return null;

  // marca/desmarca um interesse
  function toggleInterest(id: Interest) {
    setInterests((current) =>
      current.includes(id) ? current.filter((i) => i !== id) : [...current, id],
    );
  }

    function generate() {
    if (!destination) return;

    const request: TripRequest = {
      destination,
      origin: location.status === "found" ? location.coordinates : undefined,
      days,
      interests,
      pace,
      notes: notes.trim(),
    };
    generateTrip(request);
  }

  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-medium text-gmap-blue hover:underline"
      >
        <ArrowLeft className="size-4" />
        Trocar destino
      </button>

      <h1 className="mt-3 text-xl font-semibold tracking-tight">Como vai ser a viagem?</h1>
      <p className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-soft">
        <MapPin className="size-4 text-gmap-red" />
        {destination.name}
        {destination.country && `, ${destination.country}`}
      </p>

      {/* Dias */}
      <Section title="Quantos dias?">
        <div className="flex items-center gap-3">
          <StepButton label="Menos um dia" onClick={() => setDays(days - 1)} disabled={days <= MIN_DAYS}>
            <Minus className="size-4" />
          </StepButton>
          <span className="w-16 text-center text-lg font-semibold tabular-nums">
            {days} {days === 1 ? "dia" : "dias"}
          </span>
          <StepButton label="Mais um dia" onClick={() => setDays(days + 1)} disabled={days >= MAX_DAYS}>
            <Plus className="size-4" />
          </StepButton>
        </div>
      </Section>

      {/* Interesses */}
      <Section title="Do que você gosta?" hint="Escolha quantos quiser">
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(({ id, label, icon: Icon }) => {
            const selected = interests.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleInterest(id)}
                aria-pressed={selected}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                  selected
                    ? "border-gmap-blue bg-gmap-blue text-white"
                    : "border-black/[0.08] bg-white/70 text-ink-soft hover:text-ink",
                )}
              >
                <Icon className="size-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Ritmo — segmented control estilo iOS */}
      <Section title="Ritmo">
        <div role="radiogroup" className="flex rounded-full bg-black/[0.05] p-1">
          {PACES.map((p) => (
            <button
              key={p.id}
              role="radio"
              aria-checked={pace === p.id}
              onClick={() => setPace(p.id)}
              className={cn(
                "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
                pace === p.id ? "bg-white text-ink shadow-[0_2px_8px_rgb(0_0_0/0.1)]" : "text-ink-soft",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="mt-1.5 px-1 text-[13px] text-ink-faint">{PACES.find((p) => p.id === pace)?.hint}</p>
      </Section>

      {/* Texto livre */}
      <Section title="Conte o que você quer fazer" hint="Opcional">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={MAX_NOTES}
          rows={3}
          placeholder="Ex.: quero ver o pôr do sol num templo e comer em lugares frequentados por locais"
          className="w-full resize-none rounded-2xl bg-white px-4 py-3 text-[15px] shadow-[0_1px_3px_rgb(60_64_67/0.15)] outline-none placeholder:text-ink-faint focus:ring-4 focus:ring-gmap-blue/20"
        />
        <p className="text-right text-[11px] text-ink-faint tabular-nums">
          {notes.length}/{MAX_NOTES}
        </p>
      </Section>


      {generateError && <p className="mt-3 text-sm text-gmap-red">{generateError}</p>}
      <p className="mt-4 text-[12px] leading-snug text-ink-faint">
        O roteiro é criado por IA (Google Gemini) a partir das suas escolhas. Confira horários e
        funcionamento antes de ir.
      </p>



      <Button className="mt-3 w-full" onClick={generate} disabled={generating}>
        {generating ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            Montando seu roteiro…
          </>
        ) : (
          <>
            <WandSparkles className="size-4" />
            Gerar roteiro
          </>
        )}
      </Button>
    </div>
  );
}

/** Bloco com título (e dica opcional) */
function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 flex items-baseline justify-between text-sm font-semibold">
        {title}
        {hint && <span className="text-[12px] font-normal text-ink-faint">{hint}</span>}
      </h2>
      {children}
    </section>
  );
}

/** Botão redondo de − / + */
function StepButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-9 place-items-center rounded-full bg-white text-ink shadow-[0_1px_3px_rgb(60_64_67/0.2)] transition-opacity disabled:opacity-40"
    >
      {children}
    </button>
  );
}