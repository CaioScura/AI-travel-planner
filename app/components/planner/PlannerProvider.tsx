"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { requestUserLocation, type UserLocation } from "@/app/lib/geo/user-location";
import type { Activity, Place, PlaceSuggestion, Trip, TripRequest } from "@/app/lib/trip/types";
import { addStop, moveStop, removeStop } from "@/app/lib/trip/edit";

import { useDayRoute, type DayRouteState } from "./useDayRoute";  


//tudo que o mapa e o painel precisam comporatilhar
type PlannerState = {
  location: UserLocation;
  destination: Place | null; //onde o usuario vai
  trip: Trip | null; //roteiro da viagem
  selectedDay: number;

  lastRequest: TripRequest | null; // o último pedido de roteiro
  generating: boolean;
  generateError: string | null;

  dayRoute: DayRouteState;


  retryLocation: () => void;
  setDestination: (place: Place | null) => void;
  setTrip: (trip: Trip | null) => void;
  setSelectedDay: (index: number) => void;
  generateTrip: (request: TripRequest) => Promise<void>;

  
  //edição do dia aberto
  removeActivity: (id: string) => void;
  moveActivity: (index: number, direction: -1 | 1) => void;
  addActivity: (place: PlaceSuggestion) => void;

  
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

  // caminho a pé do dia aberto: fica aqui para o mapa e o painel usarem o MESMO resultado
  const dayRoute = useDayRoute(trip?.days[selectedDay]);


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


  //aplica uma mudança nas paradas do dia aberto, criando um roteiro NOVO
  function editDay(change: (activities: Activity[]) => Activity[]) {
    setTripState((prev) =>
      prev && {
        ...prev,
        days: prev.days.map((day, i) => (i === selectedDay ? { ...day, activities: change(day.activities) } : day)),
      },
    );
  }

  const removeActivity = (id: string) => editDay((list) => removeStop(list, id));
  const moveActivity = (index: number, direction: -1 | 1) => editDay((list) => moveStop(list, index, direction));
  const addActivity = (place: PlaceSuggestion) => editDay((list) => addStop(list, place));


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
        dayRoute,
        retryLocation,
        setDestination,
        setTrip,
        setSelectedDay,
        generateTrip,
        removeActivity,
        moveActivity,
        addActivity,
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