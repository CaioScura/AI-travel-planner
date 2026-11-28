import type { Activity, PlaceSuggestion } from "./types";

//FUNCOES PARA EDICAO DE ROTEIRO: recebem a lista de paradas e ddevolvem uma lista nova

const NEW_STOP_GAP_MIN = 90; // nova parada: 1h30 depois da última
const LATEST_TIME_MIN = 23 * 60; // nunca depois das 23:00

/** remove a parada pelo id */
export function removeStop(activities: Activity[], id: string): Activity[] {
  return activities.filter((a) => a.id !== id);
}


export function moveStop(activities: Activity[], index: number, direction: -1 | 1): Activity[] {
  const target = index + direction;
  if (target < 0 || target >= activities.length) return activities;

  const times = activities.map((a) => a.time);
  const reordered = [...activities];
  [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

  return reordered.map((a, i) => ({ ...a, time: times[i] }));
}


/** coloca o lugar escolhido no fim do dia */
export function addStop(activities: Activity[], place: PlaceSuggestion): Activity[] {
  const last = activities.at(-1);

  const newStop: Activity = {
    // Date.now + sorteio: único o bastante, e funciona em qualquer navegador
    id: `extra-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: place.name,
    category: place.category,
    time: last ? addMinutes(last.time, NEW_STOP_GAP_MIN) : "09:00",
    note: place.address,
    coordinates: place.coordinates,
  };

  return [...activities, newStop];
}


function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const total = Math.min(h * 60 + m + minutes, LATEST_TIME_MIN);
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}