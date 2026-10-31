"use client";

import { useSyncExternalStore } from "react";
import { Contrast, AArrowUp } from "lucide-react";

const tamanhos = ["normal", "maior", "max"] as const;

// As preferências vivem em data-attributes do <html> (aplicados antes da pintura
// pelo script em layout.tsx) e no localStorage. O componente só observa o <html>.
function assinar(aviso: () => void) {
  const obs = new MutationObserver(aviso);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-fonte", "data-contraste"] });
  return () => obs.disconnect();
}

function definir(chave: "fonte" | "contraste", valor: string) {
  document.documentElement.dataset[chave] = valor;
  try { localStorage.setItem(`ceriso:${chave}`, valor); } catch {}
}

export function Acessibilidade() {
  const fonte = useSyncExternalStore(assinar, () => document.documentElement.dataset.fonte ?? "normal", () => "normal");
  const contraste = useSyncExternalStore(assinar, () => document.documentElement.dataset.contraste === "alto", () => false);
  const indice = Math.max(0, tamanhos.indexOf(fonte as (typeof tamanhos)[number]));

  const botao = "grid size-9 place-items-center rounded-full border border-current/15 transition-colors hover:border-current/50";
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Acessibilidade">
      <button type="button" className={botao}
        onClick={() => definir("fonte", tamanhos[(indice + 1) % tamanhos.length])}
        aria-label={`Aumentar fonte (atual: ${tamanhos[indice]})`}>
        <AArrowUp className="size-4" aria-hidden />
      </button>
      <button type="button" className={botao} onClick={() => definir("contraste", contraste ? "normal" : "alto")}
        aria-pressed={contraste} aria-label="Alto contraste">
        <Contrast className="size-4" aria-hidden />
      </button>
    </div>
  );
}
