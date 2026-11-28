"use client";

import { useEffect, useState } from "react";
import type { DayRoute, TripDay } from "@/app/lib/trip/types";

const SETTLE_MS = 500;

export type DayRouteState = {
  route: DayRoute | null;
  loading: boolean;
  failed: boolean;
};


//busca o caminho a pe daquele dia
export function useDayRoute(day: TripDay | undefined): DayRouteState {
  // resultados já buscados: chave do dia → caminho (ou "error")
  const [results, setResults] = useState<Record<string, DayRoute | "error">>({});

  const points = day?.activities.map((a) => a.coordinates) ?? [];
  // a chave são as coordenadas: se as paradas mudarem, a chave muda e busca de novo
  const key = points.length >= 2 ? points.map((p) => p.join(",")).join(";") : null;

  useEffect(() => {
    if (!key || key in results) return;

    const controller = new AbortController();
    const body = JSON.stringify({ points: key.split(";").map((p) => p.split(",").map(Number)) });

    // espera as edições "assentarem": clicar em subir 3x seguidas gera 1 pedido, não 3
    const timer = setTimeout(() => {
      fetch("/api/route", { method: "POST", headers: { "Content-Type": "application/json" }, body, signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
        .then((route: DayRoute) => setResults((prev) => ({ ...prev, [key]: route })))
        .catch((error: Error) => {
          // trocou de dia antes da resposta: não é erro
          if (error.name !== "AbortError") setResults((prev) => ({ ...prev, [key]: "error" }));
        });
    }, SETTLE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [key, results]);

  const result = key ? results[key] : undefined;
  return {
    route: result && result !== "error" ? result : null,
    loading: key !== null && result === undefined,
    failed: result === "error",
  };
}