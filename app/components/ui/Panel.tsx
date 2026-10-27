import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/app/lib/cn";

type PanelProps = {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};


//CARD de como funciona e exemplo
export function Panel({ id, title, subtitle, children, className }: PanelProps) {
  return (
    <div
      id={id}
      popover="auto"
      aria-label={title}
      className={cn(
        "panel glass-strong text-ink",
        // celular = "bottom sheet" | desktop = card abaixo da navbar
        "fixed inset-x-3 top-auto bottom-3 mx-auto my-0 w-auto max-w-md",
        "md:top-24 md:bottom-auto",
        "max-h-[80svh] overflow-y-auto rounded-[28px] p-0",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-4 px-5 pt-5 pb-3">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-ink-soft">{subtitle}</p>}
        </div>
        <button
          popoverTarget={id}
          popoverTargetAction="hide"
          aria-label="Fechar"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-black/[0.05] text-ink-soft transition-colors hover:bg-black/10"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}