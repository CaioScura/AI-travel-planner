import type { NextRequest } from "next/server";
import { searchPlaces } from "@/app/lib/geo/geocoding";

//GET para buscar lugares (cidades, estados e países) a partir do texto digitado
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  // validação: pelo menos 2 letras e no máximo 100
  if (query.length < 2 || query.length > 100) {
    return Response.json({ error: "Digite entre 2 e 100 caracteres" }, { status: 400 });
  }

  try {
    const places = await searchPlaces(query);
    return Response.json(places);
  } catch {
    return Response.json({ error: "Serviço de mapas indisponível" }, { status: 502 });
  }
}