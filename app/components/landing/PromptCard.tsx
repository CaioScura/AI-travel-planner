"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Map as MapIcon, Mic, Sparkles } from "lucide-react";
import { categoryChips, heroPrompt, heroResult } from "@/app/lib/content";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { cn } from "@/app/lib/cn";

type Phase = "typing" | "thinking" | "done";

const TYPE_SPEED_MS = 38; // tempo entre cada letra
const THINKING_MS = 1100; // quanto tempo fica "pensando"

export function PromptCard(){
  // ─── ESTADO ──────────────────────────────────────────────
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  //roda a animacao
  useEffect(() => {
    //possivel pular a animacao quem quiser
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const skip = setTimeout(() => {
        setTyped(heroPrompt);
        setPhase("done");
      }, 0);
      return () => clearTimeout(skip);
    }

    let i = 0;
    let thinkingTimer: ReturnType<typeof setTimeout>;

    const typer = setInterval(() => {
      i++;
      setTyped(heroPrompt.slice(0, i));

      if (i >= heroPrompt.length) {
        clearInterval(typer);
        setPhase("thinking");
        thinkingTimer = setTimeout(() => setPhase("done"), THINKING_MS);
      }
    }, TYPE_SPEED_MS);


    //se o componente sair da tela, os timers param
    return () => {
      clearInterval(typer);
      clearTimeout(thinkingTimer);
    };
  }, []);

  return(
    <GlassPanel variant="strong" className="w-full min-w-0 max-w-[440px] p-3 animate-float">
        {/* Barra de busca estilo Maps */}
        <div className="flex min-h-14 items-center gap-3 rounded-[22px] bg-white px-4 py-3 shadow-[0_1px_3px_rgb(60_64_67/0.15)]">
            <Sparkles className="size-5 shrink-0 text-gmap-blue" />
            <p className="flex-1 text-[15px] leading-snug text-ink" aria-label={heroPrompt}>
                {typed}
                {phase === "typing" && (
                    <span className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] bg-gmap-blue animate-caret" />
                )}
            </p>
            <Mic className="size-5 shrink-0 text-ink-faint" />
        </div>


        {/* Chips de categoria */}
        <div className="mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
            {categoryChips.map(({ label, icon: Icon }) => (
            <span
                key={label}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/70 px-3 py-1.5 text-[13px] text-ink-soft"
            >
                <Icon className="size-3.5" />
                {label}
            </span>
            ))}
        </div>


        {/* Área do resultado */}
        <div className="mt-2 min-h-[292px] px-2 pt-2 pb-1">
            {phase !== "done" ? (
            <ThinkingState active={phase === "thinking"} />
            ) : (
                <div className="animate-fade-up">
                    <div className="flex items-baseline justify-between">
                        <h3 className="text-[17px] font-semibold">{heroResult.title}</h3>
                        <span className="text-xs text-ink-faint">Dia 1</span>
                    </div>
                    <p className="text-[13px] text-ink-soft">{heroResult.meta}</p>

                    <ol className="mt-4 space-y-1">
                    {heroResult.stops.map((s, i) => (
                        <li
                        key={s.name}
                        className="flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-white/70 animate-fade-up"
                        style={{ animationDelay: `${i * 90}ms` }}
                        >
                            <span className="w-11 text-[13px] tabular-nums text-ink-faint">{s.time}</span>
                            <span className={cn("size-2.5 shrink-0 rounded-full ring-4 ring-white", s.color)} />
                            <span className="flex-1 truncate text-[15px] font-medium">{s.name}</span>
                            <span className="rounded-full bg-black/[0.04] px-2 py-0.5 text-[11px] text-ink-soft">
                                {s.kind}
                            </span>
                        </li>
                    ))}
                    </ol>

                    <div className="mt-4 flex gap-2">
                        <span className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-gmap-blue text-sm font-medium text-white">
                            <MapIcon className="size-4" /> Ver no mapa
                        </span>
                        <span className="flex h-10 items-center justify-center gap-1 rounded-full border border-black/[0.08] bg-white/70 px-4 text-sm font-medium text-gmap-blue">
                            Ajustar <ArrowRight className="size-4" />
                        </span>
                    </div>
                </div>
            )}
        </div>
    </GlassPanel>
  );

}

/** Esqueleto que aparece enquanto digita */
function ThinkingState({ active }: { active: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", active ? "opacity-100" : "opacity-40")}>
      <p className="flex items-center gap-2 text-[13px] text-ink-soft">
        <Sparkles className={cn("size-4 text-gmap-blue", active && "animate-pulse")} />
        {active ? "Montando seu roteiro…" : "Descreva sua viagem"}
      </p>
      <div className="mt-4 space-y-3">
        {[80, 64, 72, 56].map((w, i) => (
          <div key={i} className="flex items-center gap-3 px-2">
            <span className="h-3 w-9 rounded-full bg-black/[0.06]" />
            <span className="size-2.5 rounded-full bg-black/[0.08]" />
            <span
              className={cn("h-3.5 rounded-full bg-black/[0.06]", active && "animate-pulse")}
              style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}