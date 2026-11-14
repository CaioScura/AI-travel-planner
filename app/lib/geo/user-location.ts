import type { LngLat } from "@/app/lib/trip/types";

export type UserLocation =
  | { status: "locating" }
  | { status: "found"; coordinates: LngLat }
  | { status: "denied" } //usuario bloqueou o acesso da localizacao
  | { status: "unavailable" };


  //pergunta ao navegador a lopcalizacao do usuario
  export function requestUserLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (!("geolocation" in navigator)) {
      resolve({ status: "unavailable" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          status: "found",
          coordinates: [position.coords.longitude, position.coords.latitude],
        }),
      (error) =>
        resolve({ status: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable" }),
      {
        timeout: 10_000, // desiste depois de 10 s
        maximumAge: 5 * 60_000, // aceita uma posição de até 5 min atrás (mais rápido)
      },
    );
  });
}
