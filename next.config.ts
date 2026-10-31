import type { NextConfig } from "next";

// Exportação estática: o site vira HTML/CSS/JS puro, sem servidor nem banco de dados
// para invadir. As imagens já são otimizadas no build (scripts/otimizar-imagens.mjs).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
