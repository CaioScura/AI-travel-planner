import { Sparkles } from "lucide-react";
import { ButtonLink } from "@/app/components/ui/Button";
import { PromptCard } from "./PromptCard";

export function Hero(){
    return(
        <section className="mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-5 pt-32 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
            {/* Coluna da esquerda: texto */}
            <div className="min-w-0 animate-fade-up">
                <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-ink-soft">
                <Sparkles className="size-4 text-gmap-blue" />
                Planejamento de viagens com IA
                </span>

                <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.4rem)] leading-[1.02] font-semibold tracking-[-0.035em]">
                Diga para onde.
                <br />
                <span className="text-gmap-blue">A gente traça o caminho.</span>
                </h1>

                <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-soft">
                Conte destino, datas e o que você curte. A IA monta o roteiro dia a dia,
                direto no mapa — com rotas, horários e quanto vai custar.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="#lista" size="lg">Planejar minha viagem</ButtonLink>
                <ButtonLink href="#exemplo" variant="glass" size="lg">Ver um exemplo</ButtonLink>
                </div>
            </div>

            {/* Coluna da direita: card animado */}
            <div className="flex min-w-0 justify-center lg:justify-end">
                <PromptCard />
            </div>
        </section>

    );
}
