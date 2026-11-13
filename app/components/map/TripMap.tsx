"use client";

import Map, { Marker } from "react-map-gl/maplibre";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { INITIAL_VIEW } from "@/app/lib/geo/config";
import { getBounds } from "@/app/lib/geo/bounds";
import { sampleTrip } from "@/app/lib/trip/sample-trip";
import { useMapStyle } from "./useMapStyle";
import { MapPin } from "./MapPin";
import { RouteLine } from "./RouteLine";

// O MapLibre processa os dados do mapa num "worker"
// O arquivo é copiado para public/ no postinstall; aqui dizemos onde ele está
setWorkerUrl("/maplibre-gl-worker.mjs");

/** Margem do enquadramento: deixa espaço para o painel (esquerda no desktop, embaixo no celular) */
function getMapPadding() {
  const isDesktop = window.matchMedia("(min-width: 768px)").matches;
  return isDesktop
    ? { top: 110, bottom: 70, left: 440, right: 90 }
    : { top: 90, bottom: 260, left: 40, right: 40 };
}


//mapa real(MapLibre + OpenFreeMap) ocupando a tela toda, atrás do conteúdo
//nao recarrega ao trocar de pagina
export function TripMap() {
  const mapStyle = useMapStyle();

  // Por enquanto, sempre o Dia 1. Na etapa 9 o dia vem do painel.
  const day = sampleTrip.days[0];
  const points = day.activities.map((a) => a.coordinates);

  // Enquanto o estilo carrega, mostra só o fundo na cor do terreno
  if (!mapStyle) {
    return <div className="fixed inset-0 z-0 bg-[#f1f3f4]" />;
  }

  return (
    <div className="fixed inset-0 z-0">
      <Map
        initialViewState={
          points.length > 0
            ? { bounds: getBounds(points), fitBoundsOptions: { padding: getMapPadding() } }
            : INITIAL_VIEW
        }
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
      >
        <RouteLine coordinates={points} />

        {day.activities.map((activity, i) => (
          <Marker
            key={activity.id}
            longitude={activity.coordinates[0]}
            latitude={activity.coordinates[1]}
            anchor="bottom"
          >
            <MapPin category={activity.category} index={i + 1} delay={400 + i * 120} />
          </Marker>
        ))}
      </Map>
    </div>
  );
}