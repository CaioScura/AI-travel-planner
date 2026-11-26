import type { NextRequest } from "next/server";
import { reverseGeocode } from "@/app/lib/geo/geocoding";

/**
 * GET /api/geocode/reverse?lng=135.76&lat=35.01
 * Exemplo: { name: "Kyoto", country: "Japão", coordinates: [135.76, 35.01] }
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lng = Number(params.get("lng") ?? NaN);
  const lat = Number(params.get("lat") ?? NaN);

  // validação: como um $request->validate() do Laravel
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    return Response.json({ error: "Coordenadas inválidas" }, { status: 400 });
  }

  try {
    const place = await reverseGeocode([lng, lat]);
    if (!place) {
      return Response.json({ error: "Nenhum lugar encontrado aqui" }, { status: 404 });
    }
    return Response.json(place);
  } catch {
    return Response.json({ error: "Serviço de mapas indisponível" }, { status: 502 });
  }
}