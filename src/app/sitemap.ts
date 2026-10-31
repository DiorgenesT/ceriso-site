import type { MetadataRoute } from "next";
import { solucoes } from "@/content/atuacao";

export const dynamic = "force-static";

const rotas = ["", "institucional/", "solucoes/", "municipios/", "transparencia/", "publicacoes/", "noticias/", "contato/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...rotas, ...solucoes.map((s) => `solucoes/${s.slug}/`)].map((r) => ({
    url: `https://ceriso.com.br/${r}`,
    changeFrequency: "monthly",
    priority: r ? 0.7 : 1,
  }));
}
