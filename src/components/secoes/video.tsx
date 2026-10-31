"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { ceriso } from "@/content/institucional";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";

type InfoVideo = {
  arquivo: string | null;
  poster: string;
  legendas: string | null;
  embedInstagram: string | null;
  titulo: string;
};

// Bloco de vídeo com capa grande. O vídeo toca dentro do site, numa janela sobre a página:
// arquivo próprio quando houver (rápido, sem rastreadores, com legendas) ou o player oficial
// do Instagram, carregado só depois do clique.
// Padrão: a apresentação institucional na home. Outras páginas passam o vídeo e os textos.
export function Video({
  video = ceriso.video,
  rotulo = `Vídeo · ${ceriso.video.duracao}`,
  titulo = <>Conheça o <span className="text-rio">CERISO</span> em um minuto e meio.</>,
  texto = "A história, a atuação e o propósito do consórcio que une 29 municípios da Bacia do Sorocaba e Médio Tietê.",
}: { video?: InfoVideo; rotulo?: string; titulo?: ReactNode; texto?: string }) {
  const ref = useRef<HTMLElement>(null);
  const janela = useRef<HTMLDialogElement>(null);
  const [aberto, setAberto] = useState(false);

  useGSAP(
    () => {
      if (prefereMenosMovimento()) return;
      gsap.fromTo(".video-moldura", { clipPath: "inset(12% 10% 12% 10% round 2.5rem)" }, {
        clipPath: "inset(0% 0% 0% 0% round 2.5rem)",
        ease: "none",
        scrollTrigger: { trigger: ".video-moldura", start: "top 90%", end: "top 25%", scrub: true },
      });
      gsap.fromTo(".video-img", { scale: 1.25 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: ".video-moldura", start: "top bottom", end: "bottom top", scrub: true },
      });
    },
    { scope: ref },
  );

  const abrir = () => {
    setAberto(true);
    janela.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  // fechar desmonta o player: o vídeo para de tocar
  const aoFechar = () => {
    setAberto(false);
    document.documentElement.style.overflow = "";
  };

  return (
    <section ref={ref} className="bg-papel py-24 md:py-32">
      <div className="container-site">
        <div className="video-moldura group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-abismo text-papel sm:aspect-[4/3] md:aspect-[16/9]">
          <Image src={video.poster} alt="" fill sizes="100vw" className="video-img object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-abismo via-abismo/30 to-transparent" />
          {/* desktop: play no centro do cartão (o título é baixo o bastante para não alcançá-lo) */}
          <div className="absolute inset-0 hidden place-items-center lg:grid">
            <BotaoPlay />
          </div>
          {/* celular e tablet: play acima do texto, centralizado, no mesmo fluxo (nunca se sobrepõem) */}
          <div className="absolute inset-x-0 bottom-0 p-7 md:p-12">
            <div className="mb-6 flex justify-center md:mb-8 lg:hidden">
              <BotaoPlay />
            </div>
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Rotulo className="mb-4 text-rio-claro">{rotulo}</Rotulo>
              <TituloAnimado as="p" className="titulo-display max-w-[15ch] text-[clamp(2rem,4.4vw,4.25rem)]">
                {titulo}
              </TituloAnimado>
            </div>
            <p className="max-w-xs text-papel/70 sm:hidden md:block">{texto}</p>
            </div>
          </div>
          {/* o cartão inteiro é o botão de assistir */}
          <button type="button" onClick={abrir} aria-haspopup="dialog" className="absolute inset-0 z-10 cursor-pointer rounded-[2.5rem]">
            <span className="sr-only">Assistir ao vídeo: {video.titulo}</span>
          </button>
        </div>
      </div>

      {/* <dialog> nativo: prende o foco, fecha com Esc e devolve o foco ao botão */}
      <dialog
        ref={janela}
        onClose={aoFechar}
        onClick={(e) => e.target === e.currentTarget && janela.current?.close()}
        aria-label={video.titulo}
        data-lenis-prevent
        className="m-auto max-h-none max-w-none overflow-visible bg-transparent p-0 backdrop:bg-abismo/90 backdrop:backdrop-blur-sm open:animate-[subir_.5s_var(--ease-agua)_both]"
      >
        <div className="relative">
          <button
            type="button"
            onClick={() => janela.current?.close()}
            className="absolute -top-14 right-0 grid size-11 place-items-center rounded-full bg-papel/10 text-papel transition-colors hover:bg-papel hover:text-abismo"
          >
            <X className="size-5" aria-hidden />
            <span className="sr-only">Fechar vídeo</span>
          </button>
          {aberto &&
            (video.arquivo ? (
              <video
                src={video.arquivo}
                poster={video.poster}
                controls
                autoPlay
                playsInline
                crossOrigin="anonymous"
                className="block max-h-[85svh] w-[min(92vw,70rem)] rounded-3xl bg-abismo"
              >
                {video.legendas && <track kind="captions" src={video.legendas} srcLang="pt-BR" label="Português" />}
              </video>
            ) : (
              video.embedInstagram && <iframe
                src={video.embedInstagram}
                title={video.titulo}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                className="block h-[min(82svh,37rem)] w-[min(92vw,34rem)] rounded-3xl bg-white"
              />
            ))}
        </div>
      </dialog>
    </section>
  );
}

// Botão de play (decorativo: o cartão inteiro é o botão de assistir).
function BotaoPlay() {
  return (
    <span aria-hidden className="relative grid size-16 place-items-center rounded-full bg-papel text-marinho shadow-2xl transition-transform duration-700 ease-agua group-hover:scale-110 md:size-24 lg:size-28">
      <span className="absolute inset-0 rounded-full border-2 border-papel/60 motion-safe:animate-[pulso_2.4s_ease-out_infinite]" />
      <Play className="ml-1 size-6 fill-current md:size-8 lg:size-10" />
    </span>
  );
}
