"use client";

import { useRef } from "react";
import clsx from "clsx";
import { gsap, SplitText, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

/** Rótulo de seção ("(02) Soluções compartilhadas"): as letras surgem em sequência rápida
 *  quando a seção entra na tela, um pouco antes do título. */
export function Rotulo({ children, className }: { children: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      gsap.set(el, { opacity: 1 });
      if (prefereMenosMovimento()) return;
      const split = SplitText.create(el, { type: "chars" });
      gsap.from(split.chars, {
        opacity: 0,
        y: "0.5em",
        duration: 0.6,
        stagger: 0.018,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} data-revelar="" className={clsx("eyebrow", className)}>
      {children}
    </p>
  );
}
