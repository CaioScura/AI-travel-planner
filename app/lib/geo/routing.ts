import type { DayRoute, LngLat } from "@/app/lib/trip/types";

//VALHALLA: rotas a pé, servidor público da FOSSGIS (OpenStreetMap)
//roda so no servidor
//Regra de uso do servidor público: no máximo 1 pedido por segundo.
const VALHALLA_URL = process.env.ROUTING_URL ?? "https://valhalla1.openstreetmap.de";
const MIN_INTERVAL_MS = 1_100; // um pouco mais de 1 s, por segurança
const TIMEOUT_MS = 15_000;


/** Erro com mensagem amigável e status HTTP para a rota da API */
export class RoutingError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}


//decodifica um "encoded polyline"
//cada coordenada vira poucos caracteres
export function decodePolyline6(encoded: string): LngLat[] {
  const points: LngLat[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  // lê um número do texto (latitude ou longitude, como diferença)
  function readValue() {
    let result = 0;
    let shift = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  }

  while (index < encoded.length) {
    lat += readValue();
    lng += readValue();
    points.push([lng / 1e6, lat / 1e6]);
  }
  return points;
}


// "Fila" simples: cada pedido espera o anterior + 1,1 s
let nextSlot = 0;
async function waitForSlot() {
  const now = Date.now();
  const wait = Math.max(0, nextSlot - now);
  nextSlot = Math.max(now, nextSlot) + MIN_INTERVAL_MS;
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
}

// Cache na memória: o mesmo dia não é pedido duas vezes ao Valhalla
const cache = new Map<string, DayRoute>();
const MAX_CACHE = 200;

/** O pedaço da resposta do Valhalla que nos interessa */
type ValhallaResponse = {
  trip: {
    legs: { shape: string; summary: { time: number; length: number } }[];
  };
};


/** Caminho a pé passando por todas as paradas, na ordem */
export async function getWalkingRoute(points: LngLat[]): Promise<DayRoute> {
  const key = points.map((p) => p.join(",")).join(";");
  const cached = cache.get(key);
  if (cached) return cached;

  await waitForSlot();

  let res: Response;
  try {
    res = await fetch(new URL("/route", VALHALLA_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "TripMind/0.1 (projeto pessoal)" },
      body: JSON.stringify({
        locations: points.map(([lon, lat]) => ({ lat, lon })),
        costing: "pedestrian",
        units: "kilometers",
        directions_type: "none",
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new RoutingError("Serviço de rotas indisponível.", 502);
  }

  if (res.status === 400) {
    throw new RoutingError("Não há caminho a pé entre essas paradas.", 422);
  }
  if (!res.ok) throw new RoutingError("Serviço de rotas indisponível.", 502);

  const data: ValhallaResponse = await res.json();


  const route: DayRoute = {
    // junta os trechos numa linha só (cada trecho começa onde o anterior terminou)
    path: data.trip.legs.flatMap((leg, i) => decodePolyline6(leg.shape).slice(i === 0 ? 0 : 1)),
    legs: data.trip.legs.map((leg) => ({
      durationMin: Math.max(1, Math.round(leg.summary.time / 60)),
      distanceKm: Math.round(leg.summary.length * 10) / 10,
    })),
  };

  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!); // tira o mais antigo
  cache.set(key, route);
  return route;
}