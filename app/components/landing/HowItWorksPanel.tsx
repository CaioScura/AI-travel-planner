import { steps } from "@/app/lib/content";
import { Panel } from "@/app/components/ui/Panel";

export function HowItWorksPanel() {
  return (
    <Panel id="como-funciona" title="Como funciona" subtitle="Do pedido ao roteiro em segundos">
      <ol>
        {steps.map(({ title, text, icon: Icon }, i) => (
          <li key={title} className="relative flex gap-4 pb-5 last:pb-0">
            {i < steps.length - 1 && (
              <span className="absolute top-11 bottom-1 left-[19px] border-l-[3px] border-dotted border-gmap-blue/40" />
            )}
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gmap-blue text-white shadow-[0_6px_16px_-6px_rgb(26_115_232/0.7)]">
              <Icon className="size-[18px]" />
            </span>
            <div className="pt-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-0.5 text-[15px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}