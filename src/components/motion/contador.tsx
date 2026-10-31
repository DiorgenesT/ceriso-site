"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

// Número que conta de 0 até `valor` quando entra na tela.
// O valor final já vem no HTML, então funciona sem JS e com movimento reduzido.
export function Contador({ valor, casas = 0 }: { valor: number; casas?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatar = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });

  useGSAP(() => {
    if (prefereMenosMovimento()) return;
    const obj = { n: 0 };
    gsap.to(obj, {
      n: valor,
      duration: 2.2,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
      onUpdate: () => { if (ref.current) ref.current.textContent = formatar(obj.n); },
    });
  });

  return <span ref={ref}>{formatar(valor)}</span>;
}
