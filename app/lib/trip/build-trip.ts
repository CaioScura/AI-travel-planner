import { findPlace } from "@/app/lib/geo/geocoding";
import type { AiTrip } from "@/app/lib/ai/schema";
import type { Activity, Trip, TripRequest } from "./types";


function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}


//roteiro da IA com as coordenadas
export async function buildTrip(aiTrip: AiTrip, request: TripRequest): Promise<Trip> {
  const near = request.destination.coordinates;
  const notFound: string[] = [];

  const days = await Promise.all(
    aiTrip.days.map(async (day, dayIndex) => {
      const located = await Promise.all(
        day.activities.map(async (a, i): Promise<Activity | null> => {

          //se o Photon falhar para um lugar = "não encontrado"
          const coordinates = await findPlace(a.searchQuery, near).catch(() => null);
          if (!coordinates) {
            notFound.push(a.name);
            return null;
          }
          return {
            id: `d${dayIndex + 1}-${i + 1}-${slugify(a.searchQuery)}`,
            name: a.name,
            category: a.category,
            time: a.time,
            note: a.note,
            coordinates,
          };
        }),
      );

      return {
        id: `dia-${dayIndex + 1}`,
        label: `Dia ${dayIndex + 1}`,
        title: day.title,
        //tira os lugares não encontrados
        activities: located.filter((a): a is Activity => a !== null),
      };
    }),
  );

  const { name, country } = request.destination;
  return {
    id: crypto.randomUUID(),
    destination: country ? `${name}, ${country}` : name,
    title: aiTrip.title,
    days,
    notFound: notFound.length > 0 ? notFound : undefined,
  };
}