"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** "entrada" anima ao montar (hero); "rolagem" anima ao entrar na tela. */
  modo?: "entrada" | "rolagem";
  atraso?: number;
};

// Revela o título linha a linha, com as palavras subindo por trás de uma máscara.
export function TituloAnimado({ children, as: Tag = "h2", className, modo = "rolagem", atraso = 0 }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      gsap.set(el, { opacity: 1 });
      if (prefereMenosMovimento()) return;
      const split = SplitText.create(el, { type: "lines,words", mask: "lines", autoSplit: true,
        onSplit: (self) => {
          // A máscara de cada linha corta descendentes (p, ç, g) com line-height apertado:
          // folga embaixo compensada com margem negativa, sem mudar o espaçamento.
          self.masks.forEach((m) => Object.assign((m as HTMLElement).style, { paddingBottom: "0.14em", marginBottom: "-0.14em" }));
          // palavras sobem de trás da máscara com uma leve inclinação que se endireita
          return gsap.from(self.words, {
            yPercent: 115,
            rotation: 6,
            transformOrigin: "0% 100%",
            duration: 1.5,
            delay: atraso,
            stagger: 0.06,
            ease: "power4.out",
            scrollTrigger: modo === "rolagem" ? { trigger: el, start: "top 82%", once: true } : undefined,
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} data-revelar="" className={className}>
      {children}
    </Tag>
  );
}
