import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// Ícones gerados por scripts/gerar-marca.mjs (npm run marca).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CERISO — Consórcio da Bacia do Rio Sorocaba e Médio Tietê",
    short_name: "CERISO",
    start_url: "/",
    display: "browser",
    background_color: "#faf8f3",
    theme_color: "#00194d",
    icons: [
      { src: "/img/marca/icone-192.png", sizes: "192x192", type: "image/png" },
      { src: "/img/marca/icone-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
