import { generateItinerary, AiError } from "@/app/lib/ai/client";
import { buildTrip } from "@/app/lib/trip/build-trip";
import { parseTripRequest } from "@/app/lib/trip/validate";
import { isRateLimited } from "@/app/lib/rate-limit";


//POST /api/trips/generate
//JSON -> IA (nomes dos lugares) -> Photon (coordenadas) -> Trip
export async function POST(request: Request) {

  // 1. limite de pedidos por IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Muitos pedidos seguidos. Espere um minuto." }, { status: 429 });
  }

  // 2. valida o pedido
  const body = await request.json().catch(() => null);
  const tripRequest = parseTripRequest(body);
  if (!tripRequest) {
    return Response.json({ error: "Pedido de roteiro inválido" }, { status: 400 });
  }

  try {

    // 3. IA escolhe os lugares
    const aiTrip = await generateItinerary(tripRequest);

    // 4. Photon dá a posição real de cada um
    const trip = await buildTrip(aiTrip, tripRequest);
    return Response.json(trip);
    
  } catch (error) {
    if (error instanceof AiError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("[trips/generate]", error);
    return Response.json({ error: "Erro inesperado ao gerar o roteiro." }, { status: 500 });
  }
}