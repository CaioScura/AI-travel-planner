//cores do mapa iguakl do google maps
import type { LayerSpecification, StyleSpecification } from "maplibre-gl";

//paleta de dores do google maps
const COLORS = {
  land: "#f1f3f4",
  residential: "#eceef1",
  building: "#e8eaed",
  buildingOutline: "#dadce0",
  park: "#c8e6c9",
  wood: "#d4ebd5",
  water: "#aadaff",
  waterLabel: "#4a7fae",
  road: "#ffffff",
  roadCasing: "#dadce0",
  highway: "#fde293",
  highwayCasing: "#f6c344",
  rail: "#c8cbd0",
  label: "#5f6368",
};

const PAINT_BY_LAYER: Record<string, Record<string, string>> = {
  background: { "background-color": COLORS.land },
  landuse_residential: { "fill-color": COLORS.residential },
  park: { "fill-color": COLORS.park },
  landcover_wood: { "fill-color": COLORS.wood },
  water: { "fill-color": COLORS.water },
  waterway: { "line-color": COLORS.water },
  building: { "fill-color": COLORS.building, "fill-outline-color": COLORS.buildingOutline },

  // ruas comuns: brancas com contorno cinza
  highway_path: { "line-color": COLORS.road },
  highway_minor: { "line-color": COLORS.road },
  highway_major_casing: { "line-color": COLORS.roadCasing },
  highway_major_inner: { "line-color": COLORS.road },
  highway_major_subtle: { "line-color": COLORS.road },

  // rodovias: amarelas
  highway_motorway_casing: { "line-color": COLORS.highwayCasing },
  highway_motorway_inner: { "line-color": COLORS.highway },
  highway_motorway_subtle: { "line-color": COLORS.highway },
  highway_motorway_bridge_casing: { "line-color": COLORS.highwayCasing },
  highway_motorway_bridge_inner: { "line-color": COLORS.highway },
  tunnel_motorway_casing: { "line-color": COLORS.highwayCasing },
  tunnel_motorway_inner: { "line-color": COLORS.highway },

  railway: { "line-color": COLORS.rail },
  railway_transit: { "line-color": COLORS.rail },
  railway_service: { "line-color": COLORS.rail },
};


function labelPaint(layerId: string): Record<string, string> | undefined {
  if (layerId.startsWith("water")) return { "text-color": COLORS.waterLabel };
  if (layerId.startsWith("label_") || layerId.startsWith("highway-name")) {
    return { "text-color": COLORS.label };
  }
  return undefined;
}



//Recebe o estilo original e devolve uma cópia com as cores do Google
//Não altera o original — cria objetos novos
export function applyGoogleColors(style: StyleSpecification): StyleSpecification {
  return {
    ...style,
    layers: style.layers.map((layer) => {
      const paint =
        PAINT_BY_LAYER[layer.id] ?? (layer.type === "symbol" ? labelPaint(layer.id) : undefined);

      if (!paint) return layer;
      return { ...layer, paint: { ...layer.paint, ...paint } } as LayerSpecification;
    }),
  };
}