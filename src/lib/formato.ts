export const formatarData = (iso: string, mes: "long" | "short" | "2-digit" = "2-digit") =>
  new Date(`${iso.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: mes, year: "numeric" });

export const formatarReais = (valor: number | null | undefined, compacto = false) =>
  valor == null || valor === 0
    ? "—"
    : valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        ...(compacto ? { notation: "compact", maximumFractionDigits: 1 } : { maximumFractionDigits: 0 }),
      });

const cores: Record<string, string> = {
  Aberta: "bg-mata/15 text-[#007a6b]",
  Publicada: "bg-rio/15 text-agua",
  "Em andamento": "bg-rio/15 text-agua",
  Homologada: "bg-marinho/10 text-marinho",
  Vigente: "bg-mata/15 text-[#007a6b]",
  Suspensa: "bg-amber-500/15 text-amber-800",
  Encerrado: "bg-cinza/15 text-cinza",
  Revogada: "bg-cinza/15 text-cinza",
};
export const corSituacao = (s: string) => cores[s] ?? "bg-cinza/15 text-cinza";
