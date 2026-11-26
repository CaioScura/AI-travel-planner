"use client";

import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";
import { getBounds } from "@/app/lib/geo/bounds";
import { DESTINATION_ZOOM, INITIAL_VIEW, USER_LOCATION_ZOOM } from "@/app/lib/geo/config";
import { usePlanner } from "@/app/components/planner/PlannerProvider";



//margem de enquadramento do mapa
//no celular, com roteiro aberto, o painel de baixo fica mais alto (até 55% da tela)
function getMapPadding(hasTrip: boolean) {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  if (isDesktop) return { top: 110, bottom: 70, left: 440, right: 90 };

  const bottom = hasTrip ? Math.round(window.innerHeight * 0.55) + 24 : 260;
  return { top: 90, bottom, left: 40, right: 40 };
}


//move a camera do mapa para enquadrar o roteiro, a localizacao
export function CameraController() {
  const { current: map } = useMap();
  const { location, trip, destination, selectedDay } = usePlanner();

  const origin = location.status === "found" ? location.coordinates : null;

  useEffect(() => {
    if (!map) return;
        const padding = getMapPadding(Boolean(trip));


    // 1. Tem roteiro → enquadra as paradas do dia aberto no painel
    if (trip) {
      const points = trip.days[selectedDay].activities.map((a) => a.coordinates);
      if (points.length > 0) {
        map.fitBounds(getBounds(points), { padding, duration: 1600 });
      }
      return;
    }

    // 2. Escolheu um destino → voa até ele
    if (destination) {
      map.flyTo({ center: destination.coordinates, zoom: DESTINATION_ZOOM, padding, duration: 2000 });
      return;
    }

    // 3. Sem roteiro, mas sabemos onde o usuário está → voa até ele
    if (origin) {
      map.flyTo({ center: origin, zoom: USER_LOCATION_ZOOM, padding, duration: 2000 });
      return;
    }

    // 4. Nada disso → visão do mundo
    map.flyTo({ center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude], zoom: INITIAL_VIEW.zoom, duration: 1200 });
  }, [map, origin, trip, destination, selectedDay]);

  return null;
}