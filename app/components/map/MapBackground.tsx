// mapa estilizado estilo google maps

const ROUTE =
  "M640 905 C700 860 750 820 800 790 S880 680 900 600 S960 470 1010 420 S1110 290 1160 250";

const WAYPOINTS = [
  { x: 800, y: 790, n: 1, delay: "1.2s" },
  { x: 900, y: 600, n: 2, delay: "1.9s" },
  { x: 1010, y: 420, n: 3, delay: "2.6s" },
];

const POIS = [
  { x: 470, y: 950, color: "#f29900", label: "Mercado" },
  { x: 1000, y: 700, color: "#1a73e8", label: "Museu" },
  { x: 560, y: 190, color: "#f29900", label: "Café" },
  { x: 1170, y: 640, color: "#d93025", label: "Hotel" },
  { x: 60, y: 760, color: "#1a73e8", label: "Galeria" },
  { x: 1120, y: 120, color: "#188038", label: "Jardim" },
];

//contorno branco no label
const labelHalo = {
  paintOrder: "stroke" as const,
  stroke: "#ffffff",
  strokeWidth: 4,
  strokeLinejoin: "round" as const,
};

const AVENUES = [
  "M-20 600 C300 560 600 640 900 590 S1300 520 1620 560",
  "M700 -20 C680 200 760 400 720 600 S690 900 740 1020",
  "M-20 300 C250 330 500 250 800 300 S1100 380 1250 330",
  "M300 1020 C340 800 280 600 360 400 S420 100 380 -20",
];

const HIGHWAYS = [
  "M-20 120 C300 160 700 60 1000 140 S1300 200 1620 150",
  "M1100 -20 C1050 300 1150 600 1080 1020",
];

export function MapBackground(){
    return(
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <svg
            className="h-full w-full"
            viewBox="0 0 1600 1000"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern id="streets" width="88" height="88" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
                        <path d="M0 0H88M0 0V88" stroke="#ffffff" strokeWidth="6" fill="none" />
                        <path d="M44 0V88" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.7" />
                    </pattern>
                    </defs>

                    {/* 1-2. Terreno + ruas */}
                    <rect width="1600" height="1000" fill="#eceef1" />
                    <rect width="1600" height="1000" fill="url(#streets)" />

                    {/* 3. Parques (stroke da mesma cor arredonda os cantos) */}
                    <g fill="#c8e6c9" stroke="#c8e6c9" strokeWidth="24" strokeLinejoin="round">
                    <path d="M220 190 L450 170 L470 340 L230 370 Z" />
                    <path d="M430 380 L590 350 L625 470 L480 515 Z" />
                    <path d="M880 140 L1020 120 L1050 230 L890 250 Z" />
                    <path d="M1000 540 L1120 530 L1140 630 L1010 640 Z" />
                    </g>

                    {/* 4. Água */}
                    <g fill="#aadaff">
                    <path d="M1260 0 C1210 180 1320 330 1240 500 C1170 650 1300 800 1250 1000 L1600 1000 L1600 0 Z" />
                    <ellipse cx="335" cy="270" rx="70" ry="42" />
                    </g>
                    <path
                    d="M-20 820 C180 770 330 870 520 820 S840 700 1000 760 S1180 860 1250 800"
                    stroke="#aadaff" strokeWidth="46" strokeLinecap="round" fill="none"
                    />

                    {/* 5. Vias: contorno largo embaixo + via mais fina em cima */}
                    <g fill="none" strokeLinecap="round">
                    <g stroke="#dadce0" strokeWidth="18">{AVENUES.map((d) => <path key={d} d={d} />)}</g>
                    <g stroke="#ffffff" strokeWidth="13">{AVENUES.map((d) => <path key={d} d={d} />)}</g>
                    <g stroke="#f6c344" strokeWidth="22">{HIGHWAYS.map((d) => <path key={d} d={d} />)}</g>
                    <g stroke="#fde293" strokeWidth="16">{HIGHWAYS.map((d) => <path key={d} d={d} />)}</g>
                    </g>

                    {/* 6. Rótulos + pontos de interesse */}
                    <text x="290" y="858" fill="#4a7fae" fontSize="15" fontStyle="italic" letterSpacing="2">Rio Tejo</text>
                    <text x="1350" y="480" fill="#4a7fae" fontSize="16" fontStyle="italic" letterSpacing="3">Oceano Atlântico</text>
                    <text x="905" y="200" fill="#188038" fontSize="13" fontWeight="500" style={labelHalo}>Parque Eduardo VII</text>
                    <text x="150" y="975" fill="#5f6368" fontSize="12" fontWeight="600" letterSpacing="2.5" style={labelHalo}>CENTRO HISTÓRICO</text>
                    <text x="60" y="585" fill="#5f6368" fontSize="12" style={labelHalo}>Av. da Liberdade</text>

                    {POIS.map((p) => (
                    <g key={p.label} transform={`translate(${p.x} ${p.y})`}>
                        <circle r="9" fill={p.color} stroke="#ffffff" strokeWidth="2.5" />
                        <text x="15" y="4.5" fontSize="12" fill={p.color} fontWeight="500" style={labelHalo}>{p.label}</text>
                    </g>
                    ))}

                    {/* 7. Rota: contorno branco + linha azul, "desenhada" na entrada */}
                    {[{ c: "#ffffff", w: 14 }, { c: "#1a73e8", w: 8 }].map(({ c, w }) => (
                    <path
                        key={c} d={ROUTE} pathLength={1} strokeDasharray="1"
                        className="animate-route-draw"
                        stroke={c} strokeWidth={w} strokeLinecap="round" fill="none"
                    />
                    ))}

                    {/* Partida: bolinha azul pulsando ("você está aqui") */}
                    <g transform="translate(640 905)">
                    <circle r="11" fill="#1a73e8" className="animate-pulse-ring"
                        style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                    <circle r="11" fill="#1a73e8" stroke="#ffffff" strokeWidth="3.5" />
                    </g>

                    {/* Paradas numeradas */}
                    {WAYPOINTS.map((w) => (
                    <g key={w.n} transform={`translate(${w.x} ${w.y})`}>
                        <g className="animate-pin-drop"
                        style={{ animationDelay: w.delay, transformBox: "fill-box", transformOrigin: "center bottom" }}>
                        <circle r="14" fill="#ffffff" stroke="#1a73e8" strokeWidth="3" />
                        <text y="4.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1a73e8">{w.n}</text>
                        </g>
                    </g>
                    ))}

                    {/* Destino: pin vermelho */}
                    <g transform="translate(1160 250)">
                    <g className="animate-pin-drop"
                        style={{ animationDelay: "3.4s", transformBox: "fill-box", transformOrigin: "center bottom" }}>
                        <ellipse cy="2" rx="7" ry="2.5" fill="#000" opacity="0.18" />
                        <path d="M0 0 C-4 -10 -18 -20 -18 -33 A18 18 0 1 1 18 -33 C18 -20 4 -10 0 0 Z"
                        fill="#ea4335" stroke="#b31412" strokeWidth="1" />
                        <circle cy="-33" r="6.5" fill="#a50e0e" />
                    </g>
                    </g>

            </svg>

            {/* Véus para dar leitura ao texto */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-white/20 to-transparent" />
            <div className="absolute inset-0 bg-white/45 lg:hidden" />

        </div>
    );
}