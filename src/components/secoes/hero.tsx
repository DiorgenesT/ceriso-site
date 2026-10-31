"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { BotaoSeta } from "@/components/ui/seta";
import { MapaBacia } from "./mapa-bacia";

export function Hero({ anos }: { anos: number }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set(".hero-fade", { opacity: 1 });
      if (prefereMenosMovimento()) return;
      gsap.from(".hero-fade", { y: 24, opacity: 0, duration: 1.2, stagger: 0.12, delay: 0.9, ease: "expo.out" });
      // Ao rolar, o mapa afunda e o texto sobe: sensação de mergulho na bacia.
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true } })
        .to(".hero-mapa", { scale: 1.25, yPercent: 12, opacity: 0.25, ease: "none" }, 0)
        .to(".hero-texto", { yPercent: -30, opacity: 0, ease: "none" }, 0);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="grao relative flex min-h-[100svh] flex-col overflow-hidden bg-abismo text-papel">
      {/* halos de luz: gradiente radial dá o mesmo efeito de um blur enorme, sem o custo */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[56rem] bg-[radial-gradient(closest-side,rgb(2_174_248/0.15),transparent)]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-60 -left-40 size-[48rem] bg-[radial-gradient(closest-side,rgb(0_163_144/0.1),transparent)]" />

      {/* Celular/tablet: texto e mapa empilhados. Desktop: duas colunas no mesmo container,
          com o mapa inteiro à direita, centralizado na altura. */}
      <div className="container-site relative z-[3] flex flex-1 flex-col pt-[clamp(6.5rem,15svh,9rem)] lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-[clamp(1rem,3vw,3rem)] lg:pb-[clamp(1rem,4svh,3rem)] lg:pt-[clamp(6rem,12svh,8rem)]">
        <div className="hero-texto pointer-events-none relative z-[3] flex flex-col justify-center pb-6 lg:pb-0">
          <p className="hero-fade eyebrow mb-[clamp(1.25rem,3svh,2rem)] text-rio-claro" data-revelar="">
            Bacia do Rio Sorocaba e Médio Tietê
          </p>
          {/* Tamanho limitado pela largura da coluna E pela altura da tela: notebooks com zoom
              (1280×720, 1366×768) são largos mas baixos. "Uma só corrente." mede ~8em, então
              no desktop a fonte fica em ~6% do container (a coluna de texto tem ~54%).
              Quebra fixa em "29 cidades." / "Uma só corrente."; no celular a segunda frase
              quebra sozinha em "Uma só" / "corrente.". */}
          <TituloAnimado
            as="h1"
            modo="entrada"
            className="titulo-display text-[clamp(2.6rem,14.5vw,5.5rem)] sm:text-[clamp(3rem,min(10vw,11svh),6rem)] lg:text-[clamp(3.25rem,min(calc((min(100vw,88rem)_-_6rem)*0.064),11.5svh),6rem)]"
          >
            29 cidades.
            <br />
            Uma <em className="not-italic text-rio">só corrente.</em>
          </TituloAnimado>
          <p className="hero-fade mt-[clamp(1.25rem,3.5svh,2rem)] max-w-md text-[clamp(1rem,0.9rem+0.3vw,1.125rem)] text-papel/70" data-revelar="">
            Há {anos} anos o CERISO une municípios para contratar melhor, cuidar da água e levar saúde, saneamento e
            desenvolvimento a toda a região.
          </p>
          <div className="hero-fade pointer-events-auto mt-[clamp(1.5rem,4svh,2.5rem)] flex flex-wrap gap-3" data-revelar="">
            <BotaoSeta href="/#atuacao">Conheça a atuação</BotaoSeta>
            <BotaoSeta href="/transparencia" variante="contorno" className="text-papel">Portal da Transparência</BotaoSeta>
          </div>
        </div>

        {/* No desktop o mapa avança por baixo do parágrafo (mais curto que o título) e desce um
            pouco; a folga lateral compensa os cantos que a inclinação 3D gira para fora. */}
        <div className="hero-mapa relative z-[2] mx-auto w-full max-w-[34rem] px-[6%] will-change-transform lg:-ml-[22%] lg:mt-[clamp(0rem,(100svh_-_45rem)*0.25,9rem)] lg:w-[122%] lg:max-w-[min(122%,125svh)] lg:justify-self-end lg:pl-[4%] lg:pr-[7%]">
          <MapaBacia inclinado className="w-full" />
        </div>
      </div>

      <div className="container-site relative z-[3] flex items-end justify-between pb-[clamp(1rem,3svh,2rem)]">
        <p className="hero-fade hidden tabular-nums text-xs text-papel/40 sm:block" data-revelar="">
          Passe o mouse sobre o mapa para ver cada cidade
        </p>
        <a href="#manifesto" className="hero-fade grid size-12 place-items-center rounded-full border border-papel/20 text-papel/70 transition-colors hover:border-rio hover:text-rio" data-revelar="">
          <ArrowDown className="size-4 motion-safe:animate-bounce" aria-hidden />
          <span className="sr-only">Rolar para o conteúdo</span>
        </a>
      </div>
    </section>
  );
}
