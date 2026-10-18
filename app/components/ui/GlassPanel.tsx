import type { ComponentProps } from "react";
import { cn } from "@/app/lib/cn";

const variants = {
  default: "glass",
  strong: "glass-strong",
  dark: "glass-dark text-white",
};

type GlassPanelProps = ComponentProps<"div"> & {
  variant?: keyof typeof variants;
};

export function GlassPanel({ variant = "default", className, ...props }: GlassPanelProps) {
  return <div className={cn(variants[variant], "rounded-[28px]", className)} {...props} />;
}