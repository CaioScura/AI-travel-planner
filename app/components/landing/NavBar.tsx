import Link from "next/link";
import { navLinks } from "@/app/lib/content";
import { ButtonLink } from "../ui/Button";
import { Logo } from "../ui/Logo";

export function NavBar(){
    return(
        <header className="fixed inset-x-0 top-4 z-50 px-4">
            <nav className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pr-2 pl-5">
                <Link href="/" aria-label="Inicio">
                    <Logo/>
                </Link>

                <ul className="hidden items-center gap-1 md:flex">
                    {navLinks.map((l) => (
                        <li key={l.href}>
                        <a
                            href={l.href}
                            className="rounded-full px-4 py-2 text-[15px] text-ink-soft transition-colors hover:bg-white/60 hover:text-ink"
                        >
                            {l.label}
                        </a>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center gap-1">
                    <a href="#" className="hidden rounded-full px-4 py-2 text-[15px] text-ink-soft hover:text-ink sm:block">
                        Entrar
                    </a>
                    
                    <ButtonLink href="#lista" className="h-10 px-4 text-sm">
                        Começar grátis
                    </ButtonLink>

                </div>

            </nav>

        </header>
    );
}
