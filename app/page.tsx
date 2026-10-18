import { MapBackground } from "./components/map/MapBackground";
import { MapControls } from "@/app/components/map/MapControls";
import { NavBar } from "@/app/components/landing/NavBar";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { ButtonLink } from "@/app/components/ui/Button";


export default function Home() {
  return (
    <>
      <MapBackground/>
      <MapControls />
      <NavBar />

      <main className="grid min-h-screen place-items-center gap-4 p-5">
        <div className="flex flex-wrap justify-center gap-4">
          <GlassPanel className="p-6">glass</GlassPanel>
          <GlassPanel variant="strong" className="p-6">glass-strong</GlassPanel>
          <GlassPanel variant="dark" className="p-6">glass-dark</GlassPanel>
        </div>

        <div className="flex gap-3">
          <ButtonLink href="#">Primário</ButtonLink>
          <ButtonLink href="#" variant="glass">Vidro</ButtonLink>
        </div>
      </main>
      
      {/* <main className="grid min-h-screen place-items-center">
        <div className="glass rounded-[28px] p-8">
          <h1 className="text-3xl font-semibold">Vidro sobre o mapa</h1>
          <p className="text-ink-soft">A rota deve se desenhar e os pins caírem em sequência.</p>
        </div>
      </main> */}
      {/* <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#aadaff,#c8e6c9,#fde293)]">
        <div className="glass rounded-[28px] p-8">
          <h1 className="text-3xl font-semibold">Vidro funcionando</h1>
          <p className="text-ink-soft">Tem que dar pra ver as cores atrás, desfocadas.</p>
        </div>
      </main> */}
    </>
    
  );
}
