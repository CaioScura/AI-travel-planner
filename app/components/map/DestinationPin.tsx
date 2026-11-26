/** Pin vermelho do destino escolhido -> pin do Google Maps */
export function DestinationPin({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center animate-pin-drop" title={label}>
      <svg viewBox="0 0 36 48" className="h-12 w-9 drop-shadow-[0_3px_4px_rgb(0_0_0/0.3)]" aria-hidden>
        <path
          d="M18 1C8.6 1 1 8.4 1 17.6 1 30 18 47 18 47s17-17 17-29.4C35 8.4 27.4 1 18 1Z"
          fill="#ea4335"
          stroke="#b31412"
          strokeWidth="1.5"
        />
        <circle cx="18" cy="17.5" r="6.5" fill="#a50e0e" />
      </svg>
    </div>
  );
}