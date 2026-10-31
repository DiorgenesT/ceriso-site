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
      gsap.from(alvos, {
        y: 48,
        opacity: 0,
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
