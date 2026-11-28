/** Tipos de lugar — cada um tem cor e ícone em categories.ts */
export type Category = "attraction" | "food" | "cafe" | "lodging" | "transport";


/** [longitude, latitude] segue essa ordem, é o padrão do MapLibre e do GeoJSON */
export type LngLat = [number, number];

//atividades
export type Activity = {
  id: string;
  name: string;
  category: Category;
  time: string; // "09:00"
  note?: string; // dica curta
  coordinates: LngLat;
};

//um dia da viagem
export type TripDay = {
  id: string;
  label: string; // "Dia 1"
  title: string; // "Asakusa e Ueno"
  activities: Activity[];
};

///viagem inteira
export type Trip = {
  id: string;
  destination: string;
  title: string;
  days: TripDay[];
  notFound?: string[];
};

//lugar escolhido no mapa ou na busca
export type Place = {
  name: string;
  region?: string;
  country?: string;
  coordinates: LngLat;
};


//interesse que o usuario pode escolher
export type Interest = "food" | "culture" | "nature" | "nightlife" | "shopping" | "history";

//ritmo da viagem, influencia qtde de lugares durante a viagem
export type Pace = "relaxed" | "balanced" | "intense";

//pedido da viagem
export type TripRequest = {
  destination: Place;
  origin?: LngLat; //localização do usuario, se ele permitir compartilhar
  days: number;
  interests: Interest[];
  pace: Pace;
  notes: string; //conte o que você quer fazer
};


//VALHALLA: motor de rotas para calcular os destinos andando
/** Um trecho entre duas paradas seguidas */
export type RouteLeg = {
  durationMin: number; // tempo a pé, em minutos
  distanceKm: number;
};

/** O caminho a pé de um dia inteiro, pelas ruas */
export type DayRoute = {
  path: LngLat[];
  legs: RouteLeg[];
};


//lugar achado na busca "Adicionar parada"
export type PlaceSuggestion = {
  name: string;
  address?: string;
  category: Category;
  coordinates: LngLat;
};