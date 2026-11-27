"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { requestUserLocation, type UserLocation } from "@/app/lib/geo/user-location";
import type { Place, Trip, TripRequest } from "@/app/lib/trip/types";


//tudo que o mapa e o painel precisam comporatilhar
type PlannerState = {
  location: UserLocation;
  destination: Place | null; //onde o usuario vai
  trip: Trip | null; //roteiro da viagem
  selectedDay: number;

  lastRequest: TripRequest | null; // o último pedido de roteiro
  generating: boolean;
  generateError: string | null;


  retryLocation: () => void;
  setDestination: (place: Place | null) => void;
  setTrip: (trip: Trip | null) => void;
  setSelectedDay: (index: number) => void;
  generateTrip: (request: TripRequest) => Promise<void>;

  
};

const PlannerContext = createContext<PlannerState | null>(null);


//planejamento da viagem — provedor de contexto
export function PlannerProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>({ status: "locating" });
  const [destination, setDestination] = useState<Place | null>(null);
  const [trip, setTripState] = useState<Trip | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);

  const [lastRequest, setLastRequest] = useState<TripRequest | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);


  // Ao abrir a tela, pede a localização uma vez
  useEffect(() => {
    let cancelled = false;
    requestUserLocation().then((result) => {
      if (!cancelled) setLocation(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);


  // Roteiro novo
  function setTrip(newTrip: Trip | null) {
    setTripState(newTrip);
    setSelectedDay(0);
  }


  //pede um roteiro ao servidor (que chama a IA)
  async function generateTrip(request: TripRequest) {
    setLastRequest(request);
    setGenerating(true);
    setGenerateError(null);

    try {
      const res = await fetch("/api/trips/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = await res.json().catch(() => null);

      // a rota sempre devolve { error: "mensagem amigável" } quando dá errado
      if (!res.ok) throw new Error(data?.error ?? "Não conseguimos gerar o roteiro.");

      setTrip(data as Trip);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Não conseguimos gerar o roteiro.");
    } finally {
      setGenerating(false);
    }
  }


  // Botão "Tentar de novo"
  function retryLocation() {
    setLocation({ status: "locating" });
    requestUserLocation().then(setLocation);
  }

  return (
    <PlannerContext.Provider
        value={{
        location,
        destination,
        trip,
        selectedDay,
        lastRequest,
        generating,
        generateError,
        retryLocation,
        setDestination,
        setTrip,
        setSelectedDay,
        generateTrip,
      }}
    >
      {children}
    </PlannerContext.Provider>
  );
}


//le e altera o estado do planejamento da viagem
export function usePlanner() {
  const context = useContext(PlannerContext);
  if (!context) {
    throw new Error("usePlanner() precisa estar dentro de <PlannerProvider>");
  }
  return context;
}