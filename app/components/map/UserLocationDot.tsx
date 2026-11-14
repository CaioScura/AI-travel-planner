//bolinha azul mostrando a localização do usuario
export function UserLocationDot() {
  return (
    <div className="relative grid size-5 place-items-center" title="Você está aqui">
      <span className="absolute inset-0 rounded-full bg-gmap-blue animate-pulse-ring" />
      <span className="relative size-4 rounded-full border-[3px] border-white bg-gmap-blue shadow-[0_1px_4px_rgb(0_0_0/0.35)]" />
    </div>
  );
}