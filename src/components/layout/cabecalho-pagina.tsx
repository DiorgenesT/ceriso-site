"use client";

import { useRef, type ReactNode } from "react";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

// Abertura das páginas internas, com a mesma linguagem do hero: o halo acende, o rótulo
// é revelado da esquerda, o título sobe palavra a palavra e o resto vem em seguida.
export function CabecalhoPagina({ rotulo, titulo, texto, children }: { rotulo: string; titulo: ReactNode; texto?: string; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set(".entra", { opacity: 1 });
      if (prefereMenosMovimento()) return;
      gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".halo", { opacity: 0, scale: 0.6, duration: 2.2 }, 0)
        .fromTo(".rotulo", { clipPath: "inset(0% 100% 0% 0%)", x: -12 }, { clipPath: "inset(0% 0% 0% 0%)", x: 0, duration: 1, ease: "power3.inOut" }, 0.05)
        .from(".entra", { y: 32, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.55);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="grao relative overflow-hidden bg-abismo pb-20 pt-44 text-papel md:pb-28 md:pt-52">
      <div aria-hidden className="halo pointer-events-none absolute -right-40 -top-40 size-[48rem] bg-[radial-gradient(closest-side,rgb(2_174_248/0.15),transparent)]" />
      <div className="container-site relative z-[2]">
        <p className="rotulo eyebrow mb-8 text-rio-claro">{rotulo}</p>
        <TituloAnimado as="h1" modo="entrada" atraso={0.15} className="titulo-display max-w-[16ch] text-[clamp(2.75rem,min(7.5vw,12svh),7.5rem)]">
          {titulo}
        </TituloAnimado>
        {texto && <p className="entra mt-8 max-w-xl text-lg text-papel/65" data-revelar="">{texto}</p>}
        {children && <div className="entra" data-revelar="">{children}</div>}
      </div>
    </section>
  );
}
