"use client";

import { useId, useRef } from "react";
import clsx from "clsx";
import { logoGeo } from "./logo-geo";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

const ALT = "CERISO — Consórcio de Desenvolvimento da Região Bacia do Rio Sorocaba e Médio Tietê";
const VERDE = "#00a390";
const COR = { claro: "#ffffff", escuro: "#00194d" } as const;
// centro do símbolo (mão e onda), em unidades do viewBox 408×165
const CENTRO_SIMBOLO = "72 84";

type Props = {
  className?: string;
  /** "claro" para fundos escuros, "escuro" para fundos claros. */
  tom?: "claro" | "escuro";
  /** Entrada animada (cabeçalho): o arco gira, a mão verde chega, as letras sobem, o subtítulo é revelado
   *  e um brilho atravessa a marca; o brilho se repete ao passar o mouse. */
  animada?: boolean;
  atraso?: number;
};

// Símbolo em duas camadas: a parte escura/clara (arco e mão) e a mão verde por cima.
// A mão verde fica em <defs> e é usada duas vezes: desenhada e recortando, na máscara, uma
// fresta fina na outra camada (como no desenho original). Animar o grupo verde move os dois.
function CamadasSimbolo({ id, cor, classe }: { id: string; cor: string; classe: string }) {
  return (
    <>
      <defs>
        <clipPath id={`${id}-sem-dedos`}>
          <path d={logoGeo.semDedos} />
        </clipPath>
        <g id={`${id}-verde`} className={`${classe}-verde`}>
          <g clipPath={`url(#${id}-sem-dedos)`}>
            {logoGeo.simboloVerde.map((d, i) => <path key={i} d={d} />)}
          </g>
          {/* dedos verdes: quatro cápsulas separadas, como no desenho original */}
          {logoGeo.capsulas.map(([cx, cy, c, e, a]) => (
            <rect key={cx} x={cx - c / 2} y={cy - e / 2} width={c} height={e} rx={e / 2} transform={`rotate(${a} ${cx} ${cy})`} />
          ))}
        </g>
        <mask id={`${id}-fresta`} maskUnits="userSpaceOnUse" x="-40" y="-40" width="240" height="245">
          <rect x="-40" y="-40" width="240" height="245" fill="#fff" />
          <use href={`#${id}-verde`} fill="#000" stroke="#000" strokeWidth={logoGeo.fresta * 2} strokeLinejoin="round" />
          {/* frestas entre os dedos da mão marinho e o branco sob os dedos verdes */}
          {logoGeo.dedos.map((d) => <path key={d} d={d} stroke="#000" strokeWidth={0.95} strokeLinecap="round" />)}
          <path d={logoGeo.sobDedos} fill="#000" />
        </mask>
      </defs>
      <g className={classe}>
        <g mask={`url(#${id}-fresta)`} fill={cor}>
          {logoGeo.simbolo.map((d, i) => <path key={i} d={d} />)}
        </g>
        <use href={`#${id}-verde`} fill={VERDE} />
      </g>
    </>
  );
}

// Logotipo reconstruído (logo-geo.ts): símbolo suavizado do PNG oficial, letras em contornos da
// Montserrat (a fonte do logotipo) e dedos redesenhados. Gerado em ~/projetos/motion/ceriso.
export function Marca({ className, tom = "claro", animada = false, atraso = 0 }: Props) {
  const raiz = useRef<SVGSVGElement>(null);
  const brilho = useRef<gsap.core.Tween | null>(null);
  const id = useId().replace(/[^\w-]/g, "");
  const cor = COR[tom];

  useGSAP(
    () => {
      if (!animada || prefereMenosMovimento()) return;
      brilho.current = gsap.fromTo(`#${id}-brilho`, { attr: { x1: -220, x2: -60 } },
        { attr: { x1: 470, x2: 630 }, duration: 1.2, ease: "power2.inOut", paused: true });

      gsap.timeline({ delay: atraso })
        // símbolo: o arco gira até a posição e a mão verde chega para o aperto de mão
        .from(".marca-simbolo", { rotation: -50, scale: 0.7, opacity: 0, svgOrigin: CENTRO_SIMBOLO, duration: 1.3, ease: "expo.out" }, 0)
        .from(".marca-simbolo-verde", { x: 26, rotation: 12, opacity: 0, svgOrigin: CENTRO_SIMBOLO, duration: 1, ease: "power3.out" }, 0.35)
        // CERISO: letra a letra, subindo por trás da máscara
        .from(".marca-letra", { y: 62, duration: 0.9, stagger: 0.06, ease: "expo.out" }, 0.35)
        // subtítulo: revelado da esquerda para a direita
        .fromTo(`#${id}-cortina`, { attr: { width: 0 } }, { attr: { width: 260 }, duration: 0.9, ease: "power3.inOut" }, 0.7)
        .add(() => { brilho.current?.restart(); }, 1.35);
    },
    { scope: raiz, dependencies: [animada] },
  );

  return (
    <svg
      ref={raiz}
      viewBox={`0 0 ${logoGeo.largura} ${logoGeo.altura}`}
      role="img"
      aria-label={ALT}
      className={clsx("h-11 w-auto overflow-visible", className)}
      onPointerEnter={() => brilho.current && !brilho.current.isActive() && brilho.current.restart()}
    >
      <title>{ALT}</title>
      <defs>
        <clipPath id={`${id}-palavra`}>
          <rect x="140" y="0" width="268" height="97" />
        </clipPath>
        <clipPath id={`${id}-subtitulo`}>
          <rect id={`${id}-cortina`} x="148" y="96" width="260" height="69" />
        </clipPath>
        {/* faixa de luz que atravessa a marca (só na versão animada) */}
        <linearGradient id={`${id}-brilho`} gradientUnits="userSpaceOnUse" x1="-220" y1="0" x2="-60" y2="40">
          <stop offset="0" stopColor="#7fd8ff" stopOpacity="0" />
          <stop offset=".5" stopColor="#7fd8ff" />
          <stop offset="1" stopColor="#7fd8ff" stopOpacity="0" />
        </linearGradient>
        <g id={`${id}-tudo`}>
          {logoGeo.simbolo.map((d, i) => <path key={`b${i}`} d={d} />)}
          <use href={`#${id}-verde`} />
          {logoGeo.letras.map((d, i) => <path key={`l${i}`} d={d} />)}
          <path d={logoGeo.subtitulo} />
        </g>
      </defs>

      <g fillRule="evenodd">
        <CamadasSimbolo id={id} cor={cor} classe="marca-simbolo" />
        <g clipPath={`url(#${id}-palavra)`} fill={cor}>
          {logoGeo.letras.map((d, i) => <path key={i} d={d} className="marca-letra" />)}
        </g>
        <path d={logoGeo.subtitulo} fill={cor} clipPath={`url(#${id}-subtitulo)`} />
        {animada && <use href={`#${id}-tudo`} fill={`url(#${id}-brilho)`} pointerEvents="none" />}
      </g>
    </svg>
  );
}

/** Só o símbolo (arco e aperto de mão), para usos grandes. Classes para animar:
 *  "simbolo" (o conjunto) e "simbolo-verde" (a mão verde). */
export function SimboloCeriso({ className, tom = "escuro" }: { className?: string; tom?: "claro" | "escuro" }) {
  const id = useId().replace(/[^\w-]/g, "");
  return (
    <svg viewBox="-2 1 154 164" aria-hidden className={clsx("overflow-visible", className)} fillRule="evenodd">
      <CamadasSimbolo id={id} cor={COR[tom]} classe="simbolo" />
    </svg>
  );
}
