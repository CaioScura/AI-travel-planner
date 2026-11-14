"use client";

import { useEffect } from "react";
import { useMap } from "react-map-gl/maplibre";
import { getBounds } from "@/app/lib/geo/bounds";
import { INITIAL_VIEW, USER_LOCATION_ZOOM } from "@/app/lib/geo/config";
import { usePlanner } from "@/app/components/planner/PlannerProvider";


//margem de enquadramento do mapa
function getMapPadding() {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  return isDesktop
    ? { top: 110, bottom: 70, left: 440, right: 90 }
    : { top: 90, bottom: 260, left: 40, right: 40 };
}


//move a camera do mapa para enquadrar o roteiro, a localizacao
export function CameraController() {
  const { current: map } = useMap();
  const { location, trip } = usePlanner();

  const origin = location.status === "found" ? location.coordinates : null;

  useEffect(() => {
    if (!map) return;
    const padding = getMapPadding();

    // 1. Tem roteiro → enquadra as paradas do primeiro dia
    if (trip) {
      const points = trip.days[0].activities.map((a) => a.coordinates);
      if (points.length > 0) {
        map.fitBounds(getBounds(points), { padding, duration: 1600 });
      }
      return;
    }

    // 2. Sem roteiro, mas sabemos onde o usuário está → voa até ele
    if (origin) {
      map.flyTo({ center: origin, zoom: USER_LOCATION_ZOOM, padding, duration: 2000 });
      return;
    }

    // 3. Nada disso → visão do mundo
    map.flyTo({ center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude], zoom: INITIAL_VIEW.zoom, duration: 1200 });
  }, [map, origin, trip]);

  return null;
}