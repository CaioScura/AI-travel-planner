import { INTERESTS, MAX_DAYS, MAX_NOTES, MIN_DAYS, PACES } from "./preferences";
import type { Interest, LngLat, Pace, TripRequest } from "./types";

const INTEREST_IDS: string[] = INTERESTS.map((i) => i.id);
const PACE_IDS: string[] = PACES.map((p) => p.id);


//validação de latitude e longitude
function isLngLat(value: unknown): value is LngLat {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}


//confere o JSON que chegou do navegador
export function parseTripRequest(body: unknown): TripRequest | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const dest = b.destination as Record<string, unknown> | null | undefined;

  if (!dest || typeof dest.name !== "string" || !isLngLat(dest.coordinates)) return null;
  if (typeof b.days !== "number" || !Number.isInteger(b.days)) return null;
  if (b.days < MIN_DAYS || b.days > MAX_DAYS) return null;
  if (!Array.isArray(b.interests) || !b.interests.every((i) => INTEREST_IDS.includes(i))) return null;
  if (typeof b.pace !== "string" || !PACE_IDS.includes(b.pace)) return null;
  if (typeof b.notes !== "string" || b.notes.length > MAX_NOTES) return null;
  if (b.origin !== undefined && !isLngLat(b.origin)) return null;

  // montamos um objeto novo só com os campos conhecidos
  return {
    destination: {
      name: dest.name,
      region: typeof dest.region === "string" ? dest.region : undefined,
      country: typeof dest.country === "string" ? dest.country : undefined,
      coordinates: dest.coordinates,
    },
    origin: b.origin,
    days: b.days,
    interests: b.interests as Interest[],
    pace: b.pace as Pace,
    notes: b.notes.trim(),
  };
}