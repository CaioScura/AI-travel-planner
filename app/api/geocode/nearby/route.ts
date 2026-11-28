import type { NextRequest } from "next/server";
import { searchNearby } from "@/app/lib/geo/geocoding";


//GET: busca os lugares com a preferencia procurada(ex: cafe, busca lugares proximos com cafe)
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim() ?? "";

  // sem o parâmetro vira NaN (e não 0), e o isFinite recusa
  const lng = Number(params.get("lng") ?? NaN);
  const lat = Number(params.get("lat") ?? NaN);

  if (query.length < 2 || query.length > 100) {
    return Response.json({ error: "Digite entre 2 e 100 caracteres" }, { status: 400 });
  }
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) {
    return Response.json({ error: "Coordenadas inválidas" }, { status: 400 });
  }

  try {
    return Response.json(await searchNearby(query, [lng, lat]));
  } catch {
    return Response.json({ error: "Serviço de mapas indisponível" }, { status: 502 });
  }
}