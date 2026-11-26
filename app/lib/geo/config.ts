
//podendo alterar o mapa(google, maptiler, etc)


//estilos gratuitos do OpenFreeMap (sem chave): "positron" | "liberty" | "bright"
export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/positron";


/**zoom ao voar até o destino escolhido */
export const DESTINATION_ZOOM = 11;


/**visão inicial do mapa */
export const INITIAL_VIEW = {
  longitude: 0,
  latitude: 20,
  zoom: 1.6,
};

//zoom para centralizar o mapa no local do usuário
export const USER_LOCATION_ZOOM = 11;