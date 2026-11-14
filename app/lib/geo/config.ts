/**
 * Configuração do provedor de mapa.
 * Se um dia trocar de provedor (MapTiler, Stadia, Google...), é aqui que muda.
 */

// Estilos gratuitos do OpenFreeMap (sem chave): "positron" | "liberty" | "bright"
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";

/** Visão inicial do mapa (Lisboa, por enquanto) */
export const INITIAL_VIEW = {
  longitude: -9.1393,
  latitude: 38.7223,
  zoom: 12.5,
};