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
};