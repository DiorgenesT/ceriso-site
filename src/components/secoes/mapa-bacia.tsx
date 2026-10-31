"use client";

import { memo, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";
import Image from "next/image";
import clsx from "clsx";
import { mapaGeo } from "@/content/mapa-geo";
import { municipios } from "@/content/municipios";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";

const { largura: W, altura: H } = mapaGeo;
const SEDE = "salto-de-pirapora";
const sede = mapaGeo.municipios.find((m) => m.slug === SEDE)!;
const info = Object.fromEntries(municipios.map((m) => [m.slug, m]));
// Camadas deslocadas do contorno que dão espessura ao "bloco" da região.
const ESPESSURA = [10, 8, 6, 4, 2];
const PRINCIPAIS = new Set(["tiete", "sorocaba"]);

// Roteiro da água, em segundos: [início, duração] de cada rio, das nascentes à foz.
// Sorocamirim e Sorocabuçu enchem a Represa de Itupararanga, de onde sai o Sorocaba;
// os afluentes chegam ao Sorocaba quando ele passa pela foz deles; o Tietê entra pelo leste.
const AGUA: Record<string, [number, number]> = {
  sorocamirim: [0.1, 0.8],
  sorocabucu: [0.1, 0.8],
  tiete: [0.3, 3.2],
  sorocaba: [1.1, 2.6],
  pirapora: [0.9, 0.8],
  sarapui: [1.0, 1.3],
  tatui: [1.5, 1.3],
};
const REPRESA = 0.7;
// Depois dos rios, as cidades emergem na ordem em que a água chegou a cada uma
// (ponto de rio mais próximo + distância até ele), espalhadas entre CIDADES e CIDADES + ONDA.
const CIDADES = 2.6;
const ONDA = 1.9;
const agua = (m: (typeof mapaGeo.municipios)[number]) => {
  const [inicio, duracao] = AGUA[m.rio] ?? [1, 2];
  return inicio + m.fracao * duracao + m.distancia * 3;
};
const [primeira, ultima] = [Math.min(...mapaGeo.municipios.map(agua)), Math.max(...mapaGeo.municipios.map(agua))];
const chegada = Object.fromEntries(
  mapaGeo.municipios.map((m) => [m.slug, CIDADES + ((agua(m) - primeira) / (ultima - primeira)) * ONDA]),
);
const FINAL = CIDADES + ONDA + 0.7;

const idMunicipio = (slug: string) => `mapa-m-${slug}`;
const idCurso = (rio: string, i: number) => `mapa-r-${rio}-${i}`;

type Props = {
  className?: string;
  /** Inclina o mapa em perspectiva e reage ao ponteiro (hero). */
  inclinado?: boolean;
};

// Mapa real da região: divisas do IBGE e rios do OpenStreetMap. A água se forma no sentido
// da correnteza e as cidades surgem à medida que ela passa.
// Desempenho: a geometria existe uma vez só (<defs> + <use>); a base é estática e não
// re-renderiza no hover; o que se move sempre (correnteza, pulso, destaque) fica num SVG
// leve por cima, em camada própria, e pausa fora da tela.
export function MapaBacia({ className, inclinado = false }: Props) {
  const raiz = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const [ativo, setAtivo] = useState<string | null>(null);

  useGSAP(
    (_, contextSafe) => {
      const el = raiz.current!;
      // Animações contínuas só rodam com o mapa visível.
      const observador = new IntersectionObserver(([e]) => el.toggleAttribute("data-pausado", !e.isIntersecting));
      observador.observe(el);
      const limpar = () => observador.disconnect();

      if (prefereMenosMovimento()) {
        gsap.set(palco.current, { opacity: 1 });
        return limpar;
      }

      const tl = gsap.timeline({ delay: 0.15 });
      tl.from(".vizinhos", { opacity: 0, duration: 2.4, ease: "power1.out" }, 0);

      // Rios: cada curso se desenha da nascente para a foz, com uma "frente" de água brilhante.
      const cursos = gsap.utils.toArray<SVGGElement>(".curso");
      const maiorPorRio: Record<string, number> = {};
      const comprimentos = cursos.map((g) => {
        const L = (document.getElementById(g.dataset.ref!) as unknown as SVGPathElement).getTotalLength();
        maiorPorRio[g.dataset.rio!] = Math.max(maiorPorRio[g.dataset.rio!] ?? 0, L);
        return L;
      });
      cursos.forEach((g, i) => {
        const L = comprimentos[i];
        const [inicio, duracao] = AGUA[g.dataset.rio!] ?? [1, 2];
        // cursos do mesmo rio correm na mesma velocidade
        const d = duracao * (L / maiorPorRio[g.dataset.rio!]);
        const frente = g.nextElementSibling as SVGElement;
        const rastro = Math.min(46, L * 0.3);
        tl.fromTo(g, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: d, ease: "sine.inOut" }, inicio)
          .fromTo(frente, { strokeDasharray: `${rastro} ${L + rastro}`, strokeDashoffset: rastro, opacity: 1 },
            { strokeDashoffset: -L + rastro, duration: d, ease: "sine.inOut" }, inicio)
          .to(frente, { opacity: 0, duration: 0.5 }, inicio + d - 0.15);
      });
      tl.from(".represa", { opacity: 0, scale: 0.6, transformOrigin: "50% 50%", duration: 1.1, ease: "power2.out" }, REPRESA);

      // Cidades: surgem em sequência, conforme a água chega a cada uma.
      tl.from(".bloco", { opacity: 0, y: 24, duration: 2.2, ease: "power2.out" }, CIDADES - 0.2);
      gsap.utils.toArray<SVGElement>(".municipio").forEach((m) => {
        tl.from(m, { opacity: 0, y: -14, strokeOpacity: 1, duration: 1, ease: "power3.out" }, chegada[m.dataset.slug!]);
      });
      tl.from(".borda", { opacity: 0, duration: 1.4 }, FINAL - 1.2)
        .from(".sede", { scale: 0, transformOrigin: "50% 50%", duration: 0.9, ease: "back.out(3)" }, FINAL)
        .from(".correnteza", { opacity: 0, duration: 1.6 }, FINAL);

      // Tudo pronto e escondido: agora o palco pode aparecer, sem piscar.
      gsap.set(palco.current, { opacity: 1 });

      if (!inclinado || !palco.current) return limpar;
      // Leve paralaxe 3D seguindo o ponteiro.
      const rx = gsap.quickTo(palco.current, "rotationX", { duration: 1.2, ease: "power3" });
      const rz = gsap.quickTo(palco.current, "rotationZ", { duration: 1.2, ease: "power3" });
      const mover = contextSafe!((e: PointerEvent) => {
        rx(42 - (e.clientY / window.innerHeight - 0.5) * 8);
        rz(-14 + (e.clientX / window.innerWidth - 0.5) * 8);
      });
      window.addEventListener("pointermove", mover, { passive: true });
      return () => {
        limpar();
        window.removeEventListener("pointermove", mover);
      };
    },
    { scope: raiz },
  );

  // Hover e foco por delegação: a base não precisa re-renderizar.
  const apontar = (e: SyntheticEvent) => setAtivo((e.target as Element).closest?.("[data-slug]")?.getAttribute("data-slug") ?? null);
  const atual = ativo ? mapaGeo.municipios.find((m) => m.slug === ativo) : null;

  return (
    <div
      ref={raiz}
      className={clsx("mapa-bacia relative", className)}
      style={inclinado ? { perspective: "1800px" } : undefined}
      onPointerOver={apontar}
      onPointerLeave={() => setAtivo(null)}
      onFocus={apontar}
      onBlur={() => setAtivo(null)}
    >
      <div
        ref={palco}
        className="mapa-palco relative will-change-transform"
        style={inclinado ? { transform: "rotateX(42deg) rotateZ(-14deg)" } : undefined}
      >
        <Base />

        {/* camada viva: só o que se move ou muda no hover */}
        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible will-change-transform" aria-hidden>
          {atual && (
            <use href={`#${idMunicipio(atual.slug)}`} fill="#02aef8" fillOpacity=".9" stroke="#bfeaff" strokeWidth="1.5" strokeLinejoin="round" />
          )}
          <g className="correnteza">
            {mapaGeo.rios.filter((r) => PRINCIPAIS.has(r.id)).flatMap((r) =>
              r.cursos.map((_, i) => (
                <use key={idCurso(r.id, i)} href={`#${idCurso(r.id, i)}`} fill="none" stroke="#e6f7ff" opacity=".8"
                  strokeWidth={r.id === "tiete" ? 1.6 : 1.2} strokeLinecap="round" strokeDasharray="3 22"
                  className="motion-safe:animate-[correnteza_1.8s_linear_infinite]" />
              )),
            )}
          </g>
          <g className="sede" transform={`translate(${sede.cx} ${sede.cy})`}>
            <circle r="22" fill="none" stroke="#00a390" strokeWidth="1.5" className="motion-safe:animate-[pulso_2.4s_ease-out_infinite] [transform-box:fill-box] [transform-origin:center]" />
            <circle r="6" fill="#faf8f3" stroke="#00a390" strokeWidth="3" />
          </g>
        </svg>
      </div>

      {/* etiqueta do município sob o ponteiro (fora do plano inclinado, sempre legível) */}
      <div aria-live="polite" className="pointer-events-none absolute inset-0 z-10">
        {atual && !inclinado && (
          <Etiqueta slug={atual.slug} style={{ left: `${(atual.cx / W) * 100}%`, top: `${(atual.cy / H) * 100}%` }} />
        )}
      </div>
      {atual && inclinado && <Etiqueta slug={atual.slug} fixa />}
    </div>
  );
}

// Base estática: desenhada uma vez. Sem props, então o memo impede qualquer re-render.
const Base = memo(function Base() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible will-change-transform" role="img" aria-labelledby="mapa-titulo">
      <title id="mapa-titulo">Mapa dos 29 municípios consorciados ao CERISO e dos rios Tietê e Sorocaba</title>
      <defs>
        {/* geometria guardada uma única vez; o resto do mapa a reaproveita com <use> */}
        <path id="mapa-contorno" d={mapaGeo.contorno} />
        {mapaGeo.municipios.map((m) => <path key={m.slug} id={idMunicipio(m.slug)} d={m.d} />)}
        {mapaGeo.rios.flatMap((r) => r.cursos.map((d, i) => <path key={idCurso(r.id, i)} id={idCurso(r.id, i)} d={d} />))}
        <linearGradient id="g-topo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f3a52" />
          <stop offset="1" stopColor="#0a2536" />
        </linearGradient>
        {/* os vizinhos somem nas bordas, para o mapa não "vazar" pela página */}
        <radialGradient id="g-vinheta" cx={sede.cx / W} cy={0.45} r="0.6">
          <stop offset="0.35" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="m-vinheta" maskContentUnits="userSpaceOnUse">
          <rect width={W} height={H} fill="url(#g-vinheta)" />
        </mask>
      </defs>

      {/* municípios vizinhos, só para contexto */}
      <path className="vizinhos" d={mapaGeo.vizinhos} fill="none" stroke="#7fd8ff" strokeOpacity=".1" strokeWidth="1" mask="url(#m-vinheta)" />

      {/* espessura do bloco: o contorno da região repetido para baixo */}
      <g className="bloco" aria-hidden>
        {ESPESSURA.map((dy, i) => (
          <use key={dy} href="#mapa-contorno" y={dy} fill={i === 0 ? "#010a10" : "#031520"} />
        ))}
      </g>

      {/* topo: um polígono por município, com a divisa no próprio traço */}
      <g stroke="#7fd8ff" strokeOpacity=".28" strokeWidth="1" strokeLinejoin="round">
        {mapaGeo.municipios.map((m) => {
          const ehSede = m.slug === SEDE;
          return (
            <use
              key={m.slug}
              href={`#${idMunicipio(m.slug)}`}
              data-slug={m.slug}
              className="municipio cursor-pointer outline-none"
              fill={ehSede ? "#00a390" : "url(#g-topo)"}
              fillOpacity={ehSede ? 0.75 : 1}
              tabIndex={0}
              role="button"
              aria-label={info[m.slug]?.nome ?? m.nome}
            />
          );
        })}
      </g>
      <use className="borda" href="#mapa-contorno" fill="none" stroke="#7fd8ff" strokeOpacity=".4" strokeWidth="1.2" pointerEvents="none" />

      {/* água: brilho em traços largos e translúcidos (sem filtro de desfoque, que é caro) */}
      <g aria-hidden pointerEvents="none" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path className="represa" d={mapaGeo.represa} fill="#02aef8" fillOpacity=".55" stroke="#7fd8ff" strokeWidth=".8" />
        {mapaGeo.rios.flatMap((r) =>
          r.cursos.map((_, i) => {
            const id = idCurso(r.id, i);
            const principal = PRINCIPAIS.has(r.id);
            const largura = r.id === "tiete" ? 2.6 : principal ? 1.8 : 1.2;
            return [
              <g key={id} className="curso" data-rio={r.id} data-ref={id}>
                {principal && <use href={`#${id}`} stroke="#02aef8" strokeWidth={largura * 5} strokeOpacity=".08" />}
                {principal && <use href={`#${id}`} stroke="#02aef8" strokeWidth={largura * 2.4} strokeOpacity=".16" />}
                <use href={`#${id}`} stroke={principal ? "#4fc3f7" : "#7fd8ff"} strokeOpacity={principal ? 1 : 0.5} strokeWidth={largura} />
              </g>,
              <use key={`${id}-frente`} href={`#${id}`} className="opacity-0" stroke="#f2fbff" strokeWidth={largura + 1.6} />,
            ];
          }),
        )}
      </g>
    </svg>
  );
});

function Etiqueta({ slug, style, fixa }: { slug: string; style?: CSSProperties; fixa?: boolean }) {
  const m = info[slug];
  if (!m) return null;
  return (
    <div
      style={style}
      className={clsx(
        "pointer-events-none flex items-center gap-3 rounded-2xl bg-papel/95 py-2 pl-2 pr-5 text-tinta shadow-2xl backdrop-blur",
        fixa ? "absolute bottom-[8%] right-[6%] z-10" : "absolute -translate-x-1/2 -translate-y-[130%] whitespace-nowrap",
      )}
    >
      <Image src={`/img/brasoes/${slug}.webp`} alt="" width={40} height={40} className="size-10 object-contain" />
      <span>
        <span className="block font-semibold leading-tight">{m.nome}</span>
        <span className="text-xs text-cinza">{m.apelido ?? `Fundação ${m.fundacao}`}</span>
      </span>
    </div>
  );
}
