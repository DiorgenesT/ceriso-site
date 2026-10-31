"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { SimboloCeriso } from "@/components/ui/marca";
import { Rotulo } from "@/components/motion/rotulo";

const texto =
  "Em 1990, dez prefeituras decidiram cuidar juntas de um rio. Desde então o CERISO prova uma ideia simples: o que é difícil para uma cidade sozinha fica possível para uma região inteira.";

// "Quem somos": conforme a rolagem, o arco do símbolo gira até a posição e a mão verde
// chega para o aperto de mão, enquanto o texto acende palavra a palavra.
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const p = ref.current!.querySelector(".manifesto-texto")!;
      if (prefereMenosMovimento()) return;
      const split = SplitText.create(p, { type: "words" });
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", end: "center 40%", scrub: 0.8 } })
        // o arco gira até a posição e a mão verde chega: as duas mãos se encontram
        .fromTo(".simbolo", { rotation: -80, scale: 0.7, opacity: 0, svgOrigin: "75 84" },
          { rotation: 0, scale: 1, opacity: 1, ease: "power2.out", duration: 0.7 }, 0)
        .fromTo(".simbolo-verde", { x: 55, rotation: 18, opacity: 0, svgOrigin: "75 84" },
          { x: 0, rotation: 0, opacity: 1, ease: "power2.out", duration: 0.45 }, 0.35)
        .fromTo(split.words, { opacity: 0.12 }, { opacity: 1, stagger: 0.03, ease: "none", duration: 0.2 }, 0.1);
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <section id="manifesto" ref={ref} className="overflow-hidden bg-papel py-28 md:py-44">
      <div className="container-site grid items-center gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <Rotulo className="mb-8 text-cinza md:mb-12">(01) Quem somos</Rotulo>
          <SimboloCeriso className="w-[min(55%,12rem)] md:w-[min(80%,16rem)]" />
        </div>
        <p className="manifesto-texto text-[clamp(1.8rem,3.8vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.03em] [word-spacing:0.12em] text-tinta md:col-span-8">
          {texto}
        </p>
      </div>
    </section>
  );
}
