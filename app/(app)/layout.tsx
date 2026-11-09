import { TripMap } from "@/app/components/map/TripMap";
import { AppHeader } from "@/app/components/planner/AppHeader";

/**
 * Casca de todas as telas do app (/planejar, /roteiro...).
 * O mapa e a barra ficam aqui; cada página só troca o que vem em {children}.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TripMap />
      <AppHeader />
      {/* pointer-events-none: deixa o mouse "atravessar" até o mapa onde não há painel */}
      <div className="pointer-events-none relative z-10 h-svh">{children}</div>
    </>
  );
}