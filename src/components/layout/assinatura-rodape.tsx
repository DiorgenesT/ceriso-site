"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

// "CERISO" gigante e vazado no rodapé. As letras são construídas com retas e arcos
// (traço grosso, estilo geométrico do logotipo) e o contorno sai de um filtro que pega
// só a borda externa da forma: curvas perfeitas em qualquer tamanho e nenhuma linha
// interna onde os traços se cruzam (como acontecia no R com text-stroke).
// Ao aparecer na tela, cada letra se desenha.

const T = 22; // espessura do traço das letras (altura das letras = 100)
const LETRAS: { x: number; d: string[] }[] = [
  // C: arco aberto à direita
  { x: 0, d: ["M79.9 24.9A39 39 0 1 0 79.9 75.1"] },
  // E
  { x: 116, d: ["M11 0V100", "M0 11H80", "M0 50H72", "M0 89H80"] },
  // R
  { x: 214, d: ["M11 0V100", "M0 11H48A22.5 22.5 0 0 1 48 56H11", "M44 56L80 100"] },
  // I
  { x: 312, d: ["M11 0V100"] },
  // S
  { x: 352, d: ["M79 24C72 8 50 11 42 11 26 11 15 19 15 31 15 46 30 48 46 50 66 52 80 56 80 70 80 84 66 89 50 89 34 89 20 86 12 74"] },
  // O
  { x: 452, d: ["M50 11A39 39 0 1 1 50 89A39 39 0 1 1 50 11Z"] }, // fechado: sem emenda
];
const LARGURA = 552;

export function AssinaturaRodape() {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (prefereMenosMovimento()) return;
      gsap.from(".traco", {
        strokeDashoffset: 1,
        duration: 1.6,
        stagger: 0.08,
        ease: "power2.inOut",
        scrollTrigger: { trigger: ref.current, start: "top 95%", once: true },
      });
    },
    { scope: ref },
  );

  return (
    <svg ref={ref} viewBox={`-2 -2 ${LARGURA + 4} 104`} aria-hidden className="block h-auto w-full overflow-visible">
      <defs>
        {/* corta o que passa da altura das letras (pontas inclinadas da perna do R) */}
        <clipPath id="assinatura-altura">
          <rect x="-2" y="0" width={LARGURA + 4} height="100" />
        </clipPath>
        {/* forma - (forma erodida) = só o contorno externo, com ~1px de largura */}
        <filter id="assinatura-contorno" x="-2%" y="-5%" width="104%" height="110%">
          <feMorphology in="SourceAlpha" operator="erode" radius="0.45" result="miolo" />
          <feComposite in="SourceAlpha" in2="miolo" operator="out" result="borda" />
          <feFlood floodColor="rgb(127 216 255)" floodOpacity="0.28" />
          <feComposite in2="borda" operator="in" />
        </filter>
      </defs>
      <g filter="url(#assinatura-contorno)" fill="none" stroke="#000" strokeWidth={T} strokeLinecap="butt" strokeLinejoin="miter">
        {LETRAS.map((l) => (
          <g key={l.x} transform={`translate(${l.x} 0)`} clipPath="url(#assinatura-altura)">
            {l.d.map((d) => <path key={d} d={d} className="traco" pathLength={1} strokeDasharray="1 1" />)}
          </g>
        ))}
      </g>
    </svg>
  );
}
