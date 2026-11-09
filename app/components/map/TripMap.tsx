"use client";

import Map from "react-map-gl/maplibre";
import { setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { INITIAL_VIEW, MAP_STYLE_URL } from "@/app/lib/geo/config";

// O MapLibre processa os dados do mapa num "worker" (um script que roda em paralelo).
// O arquivo é copiado para public/ no postinstall; aqui dizemos onde ele está.
setWorkerUrl("/maplibre-gl-worker.mjs");

/**
 * Mapa real (MapLibre + OpenFreeMap) ocupando a tela toda, atrás do conteúdo.
 * Fica no layout do app, então não recarrega ao trocar de página.
 */
export function TripMap() {
  return (
    <div className="fixed inset-0 z-0">
      <Map
        initialViewState={INITIAL_VIEW}
        mapStyle={MAP_STYLE_URL}
        style={{ width: "100%", height: "100%" }}
        attributionControl={{ compact: true }}
      />
    </div>
  );
}