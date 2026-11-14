"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { INITIAL_VIEW } from "@/app/lib/geo/config";
import { usePlanner } from "@/app/components/planner/PlannerProvider";
import { useMapStyle } from "./useMapStyle";
import { CameraController } from "./CameraController";
import { UserLocationDot } from "./UserLocationDot";
import { MapPin } from "./MapPin";
import { RouteLine } from "./RouteLine";

// O MapLibre processa os dados do mapa num "worker"
// O arquivo é copiado para public/ no postinstall; aqui dizemos onde ele está
setWorkerUrl("/maplibre-gl-worker.mjs");

//mapa real(MapLibre + OpenFreeMap) ocupando a tela toda, atrás do conteúdo
//nao recarrega ao trocar de pagina
export function TripMap() {
  const mapStyle = useMapStyle();
  const { location, trip } = usePlanner();

  // Por enquanto, sempre o Dia 1 do roteiro (a troca de dia vem depois)
  const day = trip?.days[0];

  // Enquanto o estilo carrega, mostra só o fundo na cor do terreno
  if (!mapStyle) {
    return <div className="fixed inset-0 z-0 bg-[#f1f3f4]" />;
  }

  return (
    <div className="fixed inset-0 z-0">
      <Map
        initialViewState={INITIAL_VIEW}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
      >
        <CameraController />

        {/* "Você está aqui" */}
        {location.status === "found" && (
          <Marker longitude={location.coordinates[0]} latitude={location.coordinates[1]} anchor="center">
            <UserLocationDot />
          </Marker>
        )}

        {/* Roteiro: só aparece quando existe um */}
        {day && (
          <>
            <RouteLine coordinates={day.activities.map((a) => a.coordinates)} />

            {day.activities.map((activity, i) => (
              <Marker
                key={activity.id}
                longitude={activity.coordinates[0]}
                latitude={activity.coordinates[1]}
                anchor="bottom"
              >
                <MapPin category={activity.category} index={i + 1} delay={600 + i * 120} />
              </Marker>
            ))}
          </>
        )}
      </Map>
    </div>
  );
}