import { MapBackground } from "./components/map/MapBackground";


export default function Home() {
  return (
    <>
      <MapBackground/>
      <main className="grid min-h-screen place-items-center">
        <div className="glass rounded-[28px] p-8">
          <h1 className="text-3xl font-semibold">Vidro sobre o mapa</h1>
          <p className="text-ink-soft">A rota deve se desenhar e os pins caírem em sequência.</p>
        </div>
      </main>
      {/* <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#aadaff,#c8e6c9,#fde293)]">
        <div className="glass rounded-[28px] p-8">
          <h1 className="text-3xl font-semibold">Vidro funcionando</h1>
          <p className="text-ink-soft">Tem que dar pra ver as cores atrás, desfocadas.</p>
        </div>
      </main> */}
    </>
    
  );
}
