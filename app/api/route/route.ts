import { getWalkingRoute, RoutingError } from "@/app/lib/geo/routing";
import { isRateLimited } from "@/app/lib/rate-limit";
import type { LngLat } from "@/app/lib/trip/types";

const MAX_POINTS = 10;

function isLngLat(value: unknown): value is LngLat {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((n) => typeof n === "number" && Number.isFinite(n)) &&
    Math.abs(value[0]) <= 180 &&
    Math.abs(value[1]) <= 90
  );
}


//POST /api/route
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (isRateLimited(`route:${ip}`, 30)) {
    return Response.json({ error: "Muitos pedidos seguidos. Espere um minuto." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const points: unknown = body?.points;

  if (!Array.isArray(points) || points.length < 2 || points.length > MAX_POINTS || !points.every(isLngLat)) {
    return Response.json({ error: `Envie de 2 a ${MAX_POINTS} pontos [longitude, latitude].` }, { status: 400 });
  }

  try {
    return Response.json(await getWalkingRoute(points, request.signal));
  } catch (error) {
    if (error instanceof RoutingError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("[route]", error);
    return Response.json({ error: "Erro inesperado ao calcular a rota." }, { status: 500 });
  }
}