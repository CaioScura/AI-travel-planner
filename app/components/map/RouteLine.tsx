import { Layer, Source } from "react-map-gl/maplibre";
import type { Feature, LineString } from "geojson";
import type { LngLat } from "@/app/lib/trip/types";


//linha azul ligando as paradas que forem marcadas no mapa
export function RouteLine({ coordinates }: { coordinates: LngLat[] }) {
  // GeoJSON: o formato padrão para descrever pontos e linhas num mapa
  const route: Feature<LineString> = {
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates },
  };

  return (
    <Source id="route" type="geojson" data={route}>
      {/* contorno branco (mais grosso, desenhado primeiro) */}
      <Layer
        id="route-casing"
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{ "line-color": "#ffffff", "line-width": 9 }}
      />
      {/* linha azul por cima */}
      <Layer
        id="route-line"
        type="line"
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{ "line-color": "#1a73e8", "line-width": 5 }}
      />
    </Source>
  );
}