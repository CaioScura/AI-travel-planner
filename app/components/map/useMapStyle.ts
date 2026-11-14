"use client";

import { useEffect, useState } from "react";
import type { StyleSpecification } from "maplibre-gl";
import { MAP_STYLE_URL } from "@/app/lib/geo/config";
import { applyGoogleColors } from "@/app/lib/geo/map-style";


//Baixa o estilo do mapa e troca as cores ANTES de entregar ao mapa
//isso é feito para que o mapa padrao nao apareca
export function useMapStyle() {
  const [style, setStyle] = useState<StyleSpecification | string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(MAP_STYLE_URL)
      .then((res) => res.json())
      .then((original: StyleSpecification) => {
        if (!cancelled) setStyle(applyGoogleColors(original));
      })
      .catch(() => {
        if (!cancelled) setStyle(MAP_STYLE_URL);
      });

    // se o componente sair da tela antes da resposta, ignoramos o resultado
    return () => {
      cancelled = true;
    };
  }, []);

  return style;
}