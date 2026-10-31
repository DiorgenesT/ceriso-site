"use client";

import { useRef, type ElementType, type ComponentPropsWithoutRef } from "react";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

type Props<T extends ElementType> = {
  as?: T;
  atraso?: number;
  /** Anima os filhos diretos em sequência em vez do bloco inteiro. */
  emCascata?: boolean;
} & ComponentPropsWithoutRef<T>;

export function Revelar<T extends ElementType = "div">({ as, atraso = 0, emCascata, children, ...resto }: Props<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      const alvos = emCascata ? Array.from(el.children) : [el];
      if (prefereMenosMovimento()) {
        gsap.set(el, { opacity: 1 });
        return;
      }
      gsap.set(el, { opacity: 1 });
      // fromTo com destino explícito: um gsap.from leria o estado "final" do CSS, que pode
      // estar no meio de uma transição e deixar o card preso transparente e deslocado.
      // No fim, limpa os estilos para o hover (translate/sombra) do próprio card funcionar.
      // A opacidade do próprio bloco não é limpa: o CSS de [data-revelar] o esconderia de novo.
      gsap.fromTo(alvos, { y: 48, opacity: 0 }, {
        y: 0,
        opacity: 1,
        clearProps: emCascata ? "transform,translate,opacity" : "transform,translate",
        duration: 1.1,
        delay: atraso,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-revelar="" {...resto}>
      {children}
    </Tag>
  );
}
