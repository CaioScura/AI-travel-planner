"use client";

import { useState } from "react";
import { Car, Footprints, MapPin, TrainFront, type LucideIcon } from "lucide-react";
import { sampleItinerary, type TravelMode } from "@/app/lib/content";
import { cn } from "@/app/lib/cn";

const modeIcon: Record<TravelMode, LucideIcon> = {
  walk: Footprints,
  transit: TrainFront,
  car: Car,
};

const modeLabel: Record<TravelMode, string> = {
  walk: "a pé",
  transit: "transporte",
  car: "de carro",
};

export function ItineraryTabs() {
  const [active, setActive] = useState(0);
  const day = sampleItinerary[active];

  return (
    <div>
      <div role="tablist" aria-label="Dias do roteiro" className="flex rounded-full bg-black/[0.05] p-1">
        {sampleItinerary.map((d, i) => (
          <button
            key={d.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={cn(
              "flex-1 rounded-full py-2 text-sm font-medium transition-all duration-200",
              active === i ? "bg-white text-ink shadow-[0_2px_8px_rgb(0_0_0/0.1)]" : "text-ink-soft hover:text-ink",
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 px-2 text-[13px] text-ink-soft">
        <MapPin className="size-4 text-gmap-red" />
        {day.area} · {day.stops.length} paradas
      </div>

      <ol key={active} className="mt-3 px-2">
        {day.stops.map((stop, i) => {
          const Mode = stop.next ? modeIcon[stop.next.mode] : null;
          return (
            <li key={stop.name} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="flex gap-4 py-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border-[2.5px] border-gmap-blue bg-white text-[13px] font-bold text-gmap-blue">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate font-medium">{stop.name}</p>
                    <span className="text-[13px] tabular-nums text-ink-faint">{stop.time}</span>
                  </div>
                  <p className="text-sm text-ink-soft">{stop.note}</p>
                </div>
              </div>

              {stop.next && Mode && (
                <div className="flex items-center gap-4">
                  <span className="flex w-8 justify-center">
                    <span className="h-8 border-l-[3px] border-dotted border-gmap-blue/50" />
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-ink-faint">
                    <Mode className="size-4" />
                    {stop.next.minutes} min {modeLabel[stop.next.mode]}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}