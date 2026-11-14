// Copia o "worker" do MapLibre para a pasta public/, de onde o navegador consegue baixá-lo.
// Roda sozinho depois de cada `npm install` (script "postinstall" no package.json).
import { copyFileSync } from "node:fs";

copyFileSync(
  "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
  "public/maplibre-gl-worker.mjs",
);
console.log("✓ maplibre-gl-worker.mjs copiado para public/");