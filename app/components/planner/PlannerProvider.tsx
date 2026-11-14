"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { requestUserLocation, type UserLocation } from "@/app/lib/geo/user-location";
import type { Place, Trip } from "@/app/lib/trip/types";


//tudo que o mapa e o painel precisam comporatilhar
type PlannerState = {
  location: UserLocation; //localizacao do usuario
  destination: Place | null; //onde o usuario vai
  trip: Trip | null; //roteiroda viagem

  retryLocation: () => void;
  setDestination: (place: Place | null) => void;
  setTrip: (trip: Trip | null) => void;
};

const PlannerContext = createContext<PlannerState | null>(null);


//planejamento da viagem — provedor de contexto
export function PlannerProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation>({ status: "locating" });
  const [destination, setDestination] = useState<Place | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

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

  // Botão "Tentar de novo"
  function retryLocation() {
    setLocation({ status: "locating" });
    requestUserLocation().then(setLocation);
  }

  return (
    <PlannerContext.Provider
      value={{ location, destination, trip, retryLocation, setDestination, setTrip }}
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