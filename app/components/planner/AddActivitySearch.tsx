"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { categories } from "@/app/lib/trip/categories";
import type { LngLat, PlaceSuggestion } from "@/app/lib/trip/types";
import { usePlanner } from "./PlannerProvider";

type SearchStatus = "idle" | "loading" | "done" | "error";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;


//campo "Adicionar parada": busca lugares perto do roteiro e põe no fim do dia
export function AddActivitySearch({ near }: { near: LngLat }) {
  const { addActivity } = usePlanner();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSuggestion[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");

  const term = query.trim();
  const showList = term.length >= MIN_CHARS && status !== "idle";
  const [lng, lat] = near;


  // mesmo "debounce" da busca de destino (etapa 11)
  useEffect(() => {
    if (term.length < MIN_CHARS) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setStatus("loading");
      const params = new URLSearchParams({ q: term, lng: String(lng), lat: String(lat) });
      fetch(`/api/geocode/nearby?${params}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
        .then((places: PlaceSuggestion[]) => {
          setResults(places);
          setStatus("done");
        })
        .catch((error: Error) => {
          if (error.name !== "AbortError") setStatus("error");
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, lng, lat]);


  function choose(place: PlaceSuggestion) {
    addActivity(place);
    setQuery(""); // limpa para adicionar outra, se quiser
    setResults([]);
    setStatus("idle");
  }

  
  return (
    <div className="mt-1">
      <label className="flex h-11 items-center gap-2.5 rounded-full bg-white px-4 shadow-[0_1px_3px_rgb(60_64_67/0.15)] focus-within:ring-4 focus-within:ring-gmap-blue/20">
        {status === "loading" && term.length >= MIN_CHARS ? (
          <LoaderCircle className="size-4 shrink-0 animate-spin text-gmap-blue" />
        ) : (
          <Plus className="size-4 shrink-0 text-ink-faint" />
        )}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            // Enter escolhe o primeiro resultado
            if (e.key === "Enter" && results[0]) choose(results[0]);
            if (e.key === "Escape") setQuery("");
          }}
          placeholder="Adicionar parada (ex.: ramen, templo)"
          aria-label="Adicionar parada"
          className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-ink-faint"
        />
      </label>

      {/* a lista fica DENTRO do painel (e não flutuando), pois o painel rola */}
      {showList && (
        <ul className="mt-2 overflow-hidden rounded-2xl bg-white py-1 shadow-[0_1px_3px_rgb(60_64_67/0.15)] animate-fade-up">
          {status === "error" && <li className="px-4 py-2.5 text-sm text-ink-soft">Busca indisponível agora.</li>}
          {status === "done" && results.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-ink-soft">Nada encontrado por perto para “{term}”.</li>
          )}

          {status !== "error" &&
            results.map((place) => {
              const { color, icon: Icon, label } = categories[place.category];
              return (
                <li key={`${place.name}-${place.coordinates.join(",")}`}>
                  <button
                    onClick={() => choose(place)}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gmap-blue/[0.07]"
                  >
                    <span
                      className="grid size-7 shrink-0 place-items-center rounded-full text-white"
                      style={{ backgroundColor: color }}
                      title={label}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[14px] font-medium">{place.name}</span>
                      {place.address && <span className="block truncate text-[12px] text-ink-soft">{place.address}</span>}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}