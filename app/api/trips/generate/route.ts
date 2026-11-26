import { parseTripRequest } from "@/app/lib/trip/validate";
import { sampleTrip } from "@/app/lib/trip/sample-trip";


//POST /api/trips/generate
//recebe o JSON e devolve o roteiro
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const tripRequest = parseTripRequest(body);

  if (!tripRequest) {
    return Response.json({ error: "Pedido de roteiro inválido" }, { status: 400 });
  }

  // simula o tempo que a IA vai levar para pensar
  await new Promise((resolve) => setTimeout(resolve, 1200));

  return Response.json(sampleTrip);
}