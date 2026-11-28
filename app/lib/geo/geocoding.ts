import type { Category, LngLat, Place, PlaceSuggestion } from "@/app/lib/trip/types";

/**
 * Geocodificação com o Photon (OpenStreetMap)
 * Este arquivo roda só no SERVIDOR (é chamado pela rota /api/geocode/...).
 */
const PHOTON_URL = process.env.GEOCODER_URL ?? "https://photon.komoot.io";

const NEARBY_BOX = 1;


/** resposta do photon */
type PhotonFeature = {
  geometry: { coordinates: LngLat };
  properties: {
    name?: string;
    city?: string;
    county?: string;
    state?: string;
    country?: string;
    countrycode?: string;
    type?: string; //cidade, estado, pais
    street?: string;
    district?: string;
    osm_key?: string;
    osm_value?: string;
  };
};


/** Chama o Photon e devolve a lista de lugares encontrados */
async function photon(path: string, params: Record<string, string | string[]>) {
  const url = new URL(path, PHOTON_URL);
  for (const [key, value] of Object.entries(params)) {
    for (const v of [value].flat()) url.searchParams.append(key, v);
  }

  const res = await fetch(url, {
    // serviços gratuitos pedem que você se identifique
    headers: { "User-Agent": "TripMind/0.1 (projeto pessoal)" },
  });
  if (!res.ok) throw new Error(`Photon respondeu ${res.status}`);

  const data: { features: PhotonFeature[] } = await res.json();
  return data.features;
}


/** usando os nomes de país do próprio JavaScript */
function countryName(code?: string, fallback?: string) {
  if (!code) return fallback;
  try {
    return new Intl.DisplayNames(["pt-BR"], { type: "region" }).of(code.toUpperCase()) ?? fallback;
  } catch {
    return fallback;
  }
}


/** Converte a resposta do Photon para o nosso tipo Place */
function toPlace(feature: PhotonFeature, isCity: boolean): Place {
  const p = feature.properties;
  return {
    // se veio uma cidade, o "name" é a cidade; senão usamos a região mais próxima
    name: (isCity ? p.name : (p.city ?? p.county ?? p.state ?? p.name)) ?? "Lugar sem nome",
    country: countryName(p.countrycode, p.country),
    coordinates: feature.geometry.coordinates,
  };
}

/**
 * Ponto no mapa → cidade
 */
export async function reverseGeocode([lng, lat]: LngLat): Promise<Place | null> {
  const base = { lon: String(lng), lat: String(lat), lang: "en", limit: "1" };

  const [city] = await photon("/reverse", { ...base, layer: "city", radius: "30" });
  if (city) return toPlace(city, true);

  const [anything] = await photon("/reverse", base);
  return anything ? toPlace(anything, false) : null;
}



/** Converte um resultado da busca: cidade, estado ou país */
function toSearchPlace(feature: PhotonFeature): Place {
  const p = feature.properties;

  // buscou um país
  if (p.type === "country") {
    return {
      name: countryName(p.countrycode, p.name) ?? "País sem nome",
      coordinates: feature.geometry.coordinates,
    };
  }

  return {
    name: p.name ?? "Lugar sem nome",
    region: p.state !== p.name ? p.state : undefined, // evita "Tóquio, Tóquio"
    country: countryName(p.countrycode, p.country),
    coordinates: feature.geometry.coordinates,
  };
}


//lista lugares na cidade buscada
export async function searchPlaces(query: string): Promise<Place[]> {
  const features = await photon("/api", {
    q: query,
    lang: "en",
    limit: "6",
    layer: ["city", "state", "country"],
  });

  // o Photon às vezes repete o mesmo lugar: removemos duplicados
  const seen = new Set<string>();
  return features.map(toSearchPlace).filter((place) => {
    const key = `${place.name}|${place.region}|${place.country}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}


export async function findPlace(query: string, near: LngLat): Promise<LngLat | null> {
  const [first] = await photon("/api", { q: query, lang: "en", limit: "1", ...nearParams(near) });
  return first ? first.geometry.coordinates : null;
}


//parâmetros que limitam a busca à região: prioriza o centro e corta o que estiver fora do quadrado
function nearParams([lng, lat]: LngLat) {
  const box = NEARBY_BOX;
  return {
    lon: String(lng),
    lat: String(lat),
    bbox: [lng - box, lat - box, lng + box, lat + box].join(","),
  };
}


//etiqueta do OpenStreetMap → nossa categoria
const FOOD = ["restaurant", "fast_food", "food_court", "bar", "pub", "biergarten", "ice_cream"];
const CAFE = ["cafe", "bakery", "confectionery", "coffee", "tea"];
const LODGING = ["hotel", "hostel", "guest_house", "motel", "apartment"];

function categoryFromOsm(key?: string, value = ""): Category {
  if (CAFE.includes(value)) return "cafe";
  if (key === "amenity" && FOOD.includes(value)) return "food";
  if (key === "tourism" && LODGING.includes(value)) return "lodging";
  if (key === "railway" || key === "public_transport" || key === "aeroway" || value === "bus_station") return "transport";
  return "attraction"; // museu, templo, parque, mirante...
}


//busca lugares (templos, restaurantes, cafés...) perto do roteiro: "Adicionar parada"
export async function searchNearby(query: string, near: LngLat): Promise<PlaceSuggestion[]> {
  const features = await photon("/api", { q: query, lang: "en", limit: "8", ...nearParams(near) });

  return features
    .filter((f) => f.properties.name) // sem nome não serve como parada
    .map((f) => {
      const p = f.properties;
      return {
        name: p.name!,
        address: [p.street, p.district ?? p.city].filter(Boolean).join(", ") || undefined,
        category: categoryFromOsm(p.osm_key, p.osm_value),
        coordinates: f.geometry.coordinates,
      };
    });
}
