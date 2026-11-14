import type { LngLat } from "@/app/lib/trip/types";


//para enquadrar o mapa em todos os pontos de interesse, calcula o retângulo que contém todos eles
export function getBounds(points: LngLat[]): [LngLat, LngLat] {
  const lngs = points.map(([lng]) => lng);
  const lats = points.map(([, lat]) => lat);

  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];
}