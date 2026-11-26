"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { LoaderCircle, MapPin, Search } from "lucide-react";
import type { Place } from "@/app/lib/trip/types";
import { cn } from "@/app/lib/cn";
import { usePlanner } from "./PlannerProvider";

type SearchStatus = "idle" | "loading" | "done" | "error";

const MIN_CHARS = 2;
const DEBOUNCE_MS = 300;

/** Campo "Buscar cidade ou país" com sugestões enquanto digita */
export function DestinationSearch() {
  const { setDestination } = usePlanner();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const term = query.trim();
  const showList = open && term.length >= MIN_CHARS;
  const isLoading = status === "loading" && term.length >= MIN_CHARS;

  
  // Busca com "debounce": só chama a API 300 ms depois da última tecla
  useEffect(() => {
    if (term.length < MIN_CHARS) return;

    const controller = new AbortController(); // permite cancelar o pedido

    const timer = setTimeout(() => {
      setStatus("loading");
      fetch(`/api/geocode/search?q=${encodeURIComponent(term)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
        .then((places: Place[]) => {
          setResults(places);
          setActiveIndex(places.length > 0 ? 0 : -1);
          setStatus("done");
        })
        .catch((error: Error) => {
          // pedido cancelado de propósito (o usuário continuou digitando) não é erro
          if (error.name !== "AbortError") setStatus("error");
        });
    }, DEBOUNCE_MS);

    // nova tecla antes dos 300 ms? cancela o timer e o pedido anterior
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [term]);

  function choose(place: Place) {
    setDestination(place);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  // Navegação pelo teclado: ↑ ↓ Enter Esc
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false); // Esc fecha a lista, mesmo sem resultados
      return;
    }
    if (!showList || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault(); // impede o cursor de pular para o fim do texto
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      choose(results[activeIndex]);
    }
  }

  return (
    <div className="relative mt-4">
      <label className="flex h-12 items-center gap-3 rounded-full bg-white px-4 shadow-[0_1px_3px_rgb(60_64_67/0.15)] focus-within:ring-4 focus-within:ring-gmap-blue/20">
        {isLoading ? (
          <LoaderCircle className="size-5 shrink-0 animate-spin text-gmap-blue" />
        ) : (
          <Search className="size-5 shrink-0 text-ink-faint" />
        )}
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar cidade ou país"
          aria-label="Buscar destino"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
        />
      </label>

      {showList && (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-14 z-20 overflow-hidden rounded-2xl bg-white py-1.5 shadow-[0_12px_32px_-8px_rgb(60_64_67/0.35)] animate-fade-up"
        >
          {status === "error" && (
            <li className="px-4 py-2.5 text-sm text-ink-soft">Busca indisponível agora. Tente de novo.</li>
          )}

          {status === "done" && results.length === 0 && (
            <li className="px-4 py-2.5 text-sm text-ink-soft">Nenhum lugar encontrado para “{term}”.</li>
          )}

          {status !== "error" &&
            results.map((place, i) => (
              <li
                key={`${place.name}-${place.coordinates.join(",")}`}
                role="option"
                aria-selected={i === activeIndex}
                // onMouseDown (e não onClick): acontece ANTES do campo perder o foco
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(place);
                }}
                onMouseEnter={() => setActiveIndex(i)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-4 py-2.5",
                  i === activeIndex && "bg-gmap-blue/[0.07]",
                )}
              >
                <MapPin className="size-4 shrink-0 text-ink-faint" />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium">{place.name}</p>
                  <p className="truncate text-[13px] text-ink-soft">
                    {[place.region, place.country].filter(Boolean).join(", ") || "País"}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}