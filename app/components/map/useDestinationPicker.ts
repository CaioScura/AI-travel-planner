"use client";

import { useRef, useState } from "react";
import type { LngLat, Place } from "@/app/lib/trip/types";


export type Candidate =
  | { status: "loading"; coordinates: LngLat }
  | { status: "found"; coordinates: LngLat; place: Place } //cidade
  | { status: "empty"; coordinates: LngLat } //vazio
  | { status: "error"; coordinates: LngLat }; //erro


/** Pergunta para a API qual cidade fica no ponto clicado */
async function lookup(coordinates: LngLat): Promise<Candidate> {
  try {
    const res = await fetch(`/api/geocode/reverse?lng=${coordinates[0]}&lat=${coordinates[1]}`);
    if (res.status === 404) return { status: "empty", coordinates };
    if (!res.ok) return { status: "error", coordinates };

    const place: Place = await res.json();
    
    return { status: "found", coordinates: place.coordinates, place };
  } catch {
    return { status: "error", coordinates };
  }
}


export function useDestinationPicker() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);

  const lastRequest = useRef(0);

  function pick(coordinates: LngLat) {
    const requestId = ++lastRequest.current;
    setCandidate({ status: "loading", coordinates });

    lookup(coordinates).then((result) => {
      if (requestId === lastRequest.current) setCandidate(result);
    });
  }

  function clear() {
    lastRequest.current++;
    setCandidate(null);
  }

  return { candidate, pick, clear };
}