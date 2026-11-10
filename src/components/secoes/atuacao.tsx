"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { documentosDa, solucoes } from "@/content/atuacao";
import { corSituacao, formatarReais } from "@/lib/formato";
import { gsap, useGSAP } from "@/lib/gsap";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";
import { BotaoSeta } from "@/components/ui/seta";

export function Atuacao() {
  const ref = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Só no desktop e sem movimento reduzido: a seção fixa e os cards correm na horizontal.
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const t = trilho.current!;
        const distancia = () => t.scrollWidth - window.innerWidth;
        gsap.to(t, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distancia()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        gsap.to(".barra-progresso", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: () => `+=${distancia()}`, scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id="atuacao" ref={ref} className="relative overflow-hidden bg-fundo text-papel lg:h-svh">
      <div ref={trilho} className="flex flex-col gap-4 px-[clamp(1rem,4vw,3rem)] py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-5 lg:py-0">
        <div className="shrink-0 lg:w-[36vw] lg:pr-12">
          <Rotulo className="mb-6 text-rio-claro">(02) Soluções compartilhadas</Rotulo>
          <TituloAnimado className="titulo-display text-[clamp(2.6rem,5vw,5rem)]">
            Contratar junto, <span className="text-rio">planejar melhor.</span>
          </TituloAnimado>
          <p className="mt-8 max-w-sm text-papel/60">
            Licitações próprias do consórcio, publicadas no PNCP, que os municípios usam conforme a necessidade.
          </p>
          <BotaoSeta href="/solucoes" variante="contorno" className="mt-8">Todas as soluções</BotaoSeta>
        </div>

        {solucoes.map((s, i) => {
          const [licitacao] = documentosDa(s);
          const valor = licitacao?.valorHomologado || licitacao?.valorEstimado;
          return (
            <Link
              key={s.slug}
              href={`/solucoes/${s.slug}`}
              className="group relative flex shrink-0 flex-col overflow-hidden rounded-[2rem] border border-papel/10 bg-corrente p-8 transition-colors duration-500 hover:border-rio/60 lg:h-[70vh] lg:w-[min(26rem,30vw)]"
            >
              <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-rio/10 blur-3xl transition-opacity duration-700 group-hover:bg-rio/25" />
              <div className="relative flex items-center justify-between">
                <span className="eyebrow text-rio-claro">{s.area}</span>
                <span className="text-sm tabular-nums text-papel/40">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="relative mt-8 text-[clamp(1.8rem,2.4vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em]">{s.titulo}</h3>
              <p className="relative mt-3 text-papel/60">{s.chamada}</p>

              <div className="relative mt-auto pt-10">
                {valor ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.14em] text-papel/40">
                      {licitacao.valorHomologado ? "Valor homologado" : "Valor estimado"}
                    </p>
                    <p className="mt-1 text-[clamp(2rem,3vw,3rem)] font-bold tabular-nums tracking-[-0.03em]">{formatarReais(valor, true)}</p>
                  </>
                ) : null}
                <div className="mt-6 flex items-center justify-between border-t border-papel/10 pt-5">
                  {licitacao && (
                    <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", corSituacao(licitacao.situacao).replace(/text-\S+/, "text-papel"))}>
                      {licitacao.tipo} · {licitacao.situacao}
                    </span>
                  )}
                  <ArrowUpRight className="size-5 transition-transform duration-500 ease-agua group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                </div>
              </div>
            </Link>
          );
        })}
        <div aria-hidden className="hidden shrink-0 lg:block lg:w-[6vw]" />
      </div>

      <div aria-hidden className="absolute inset-x-[clamp(1rem,4vw,3rem)] bottom-8 hidden h-px bg-papel/10 lg:block">
        <div className="barra-progresso h-full origin-left scale-x-0 bg-rio" />
      </div>
    </section>
  );
}
