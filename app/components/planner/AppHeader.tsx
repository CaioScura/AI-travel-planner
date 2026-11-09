import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/app/components/ui/Logo";

/** Barra compacta das telas do app (substitui a NavBar da landing) */
export function AppHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-between px-4">
      <Link href="/" aria-label="Início" className="glass pointer-events-auto flex h-12 items-center rounded-full px-4">
        <Logo />
      </Link>

      <Link
        href="/"
        className="glass pointer-events-auto flex h-12 items-center gap-2 rounded-full px-4 text-[15px] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Link>
    </header>
  );
}