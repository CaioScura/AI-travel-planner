"use client";

import { ChevronDown, ChevronUp, Trash2, type LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/cn";
import { usePlanner } from "./PlannerProvider";

type ActivityControlsProps = {
  id: string;
  index: number;
  total: number;
};

//botões de subir, descer e remover uma parada (modo edição)
export function ActivityControls({ id, index, total }: ActivityControlsProps) {
  const { moveActivity, removeActivity } = usePlanner();

  return (
    <div className="mt-1.5 flex gap-1">
      <ControlButton icon={ChevronUp} label="Subir" disabled={index === 0} onClick={() => moveActivity(index, -1)} />
      <ControlButton icon={ChevronDown} label="Descer" disabled={index === total - 1} onClick={() => moveActivity(index, 1)} />
      {/* o dia precisa de pelo menos 1 parada */}
      {total > 1 && <ControlButton icon={Trash2} label="Remover" danger onClick={() => removeActivity(id)} />}
    </div>
  );
}

type ControlButtonProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
};


function ControlButton({ icon: Icon, label, onClick, disabled, danger }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-8 place-items-center rounded-full bg-black/[0.05] transition-colors disabled:opacity-30",
        danger ? "text-gmap-red hover:bg-gmap-red/10" : "text-ink-soft hover:bg-black/[0.09] hover:text-ink",
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}