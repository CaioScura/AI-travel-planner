import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/app/lib/cn";

const base =
"inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gmap-blue/30";


const variants = {
  primary: "bg-gmap-blue text-white shadow-[0_8px_24px_-8px_rgb(26_115_232/0.6)] hover:bg-gmap-blue-dark",
  glass: "glass text-ink hover:bg-white/75",
};

const sizes = {
    md:"h-11 px-5 text-[15px]",
    lg:"h-13 px-7 text-base",
}

type Variant = { variant?: keyof typeof variants; size?: keyof typeof sizes };


/** Botão que navega (link) */
export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ComponentProps<typeof Link> & Variant) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}


/** Botão que executa ação (onClick) */
export function Button({ variant = "primary", size = "md", className, ...props }: ComponentProps<"button"> & Variant) {
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}