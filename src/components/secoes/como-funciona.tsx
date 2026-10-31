"use client";

import { useRef } from "react";
import { passos } from "@/content/atuacao";
import { baseLegal } from "@/content/institucional";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";
import { Revelar } from "@/components/motion/revelar";
import { BotaoSeta } from "@/components/ui/seta";

export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefereMenosMovimento()) return;
      gsap.fromTo(".linha-rio", { scaleY: 0 }, {
        scaleY: 1, ease: "none",
        scrollTrigger: { trigger: ".lista-passos", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".passo").forEach((el) => {
        gsap.from(el.querySelector(".passo-ponto"), {
          scale: 0, backgroundColor: "#dcd7cb", duration: 0.6, ease: "back.out(3)",
          scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="bg-areia py-32 md:py-44">
      <div className="container-site grid gap-16 lg:grid-cols-12">
        <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
          <Rotulo className="mb-6 text-cinza">(03) Como funciona</Rotulo>
          <p className="text-xl font-semibold text-cinza">Afinal, é carona de ata?</p>
          <TituloAnimado className="titulo-display mt-2 text-[clamp(4.5rem,10vw,9rem)] text-marinho">
            Não<span className="text-mata">.</span>
          </TituloAnimado>
          <Revelar className="mt-8 max-w-md space-y-4 text-lg text-cinza">
            <p>
              O CERISO realiza <strong className="text-tinta">licitações próprias</strong>: identifica necessidades comuns entre
              os municípios e estrutura editais específicos, conforme a legislação.
            </p>
            <p>
              Não é adesão a uma ata qualquer, e sim contratações compartilhadas e planejadas, com segurança jurídica, melhores
              condições e soluções adequadas à realidade dos consorciados.
            </p>
            <BotaoSeta href="/contato?assunto=demanda" variante="escuro" className="!mt-8">Sugerir uma demanda</BotaoSeta>
          </Revelar>
        </div>

        <ol className="lista-passos relative lg:col-span-6 lg:col-start-7">
          <div aria-hidden className="absolute bottom-6 left-[11px] top-6 w-0.5 bg-linha">
            <div className="linha-rio h-full w-full origin-top bg-gradient-to-b from-rio to-mata" />
          </div>
          {passos.map((p, i) => (
            <li key={p.titulo} className="passo relative grid grid-cols-[24px_1fr] gap-8 pb-16 last:pb-0">
              <span aria-hidden className="passo-ponto relative z-[1] mt-2 size-6 rounded-full border-4 border-areia bg-rio" />
              <div>
                <p className="tabular-nums text-sm text-cinza">Etapa {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-[clamp(1.6rem,2.6vw,2.4rem)] font-semibold tracking-[-0.03em]">{p.titulo}</h3>
                <p className="mt-2 max-w-md text-cinza">{p.texto}</p>
              </div>
            </li>
          ))}
          <li className="ml-14 rounded-2xl border border-linha bg-papel p-5 text-sm text-cinza">
            <strong className="text-tinta">Importante:</strong> a participação não é automática. Cada contratação depende das
            regras do procedimento, dos instrumentos jurídicos e do cumprimento das condições exigidas.
          </li>
        </ol>
      </div>

      <div className="container-site mt-28">
        <Rotulo className="mb-6 text-cinza">Retaguarda jurídica</Rotulo>
        <Revelar emCascata className="grid gap-px overflow-hidden rounded-3xl border border-linha bg-linha sm:grid-cols-2 lg:grid-cols-3">
          {baseLegal.map((b) => (
            <div key={b.norma} className="bg-papel p-7">
              <p className="font-semibold tracking-tight">{b.norma}</p>
              <p className="mt-2 text-sm text-cinza">{b.texto}</p>
            </div>
          ))}
        </Revelar>
      </div>
    </section>
  );
}
