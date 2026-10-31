"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { ceriso } from "@/content/institucional";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";

const { video } = ceriso;

// Bloco de vídeo institucional. O vídeo toca dentro do site, numa janela sobre a página:
// o arquivo próprio quando houver (rápido, sem rastreadores) ou o player oficial do
// Instagram, que só é carregado depois do clique.
export function Video() {
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
        <div className="video-moldura group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-abismo text-papel sm:aspect-[16/9]">
          <Image src={video.poster} alt="" fill sizes="100vw" className="video-img object-cover opacity-70 transition-opacity duration-700 group-hover:opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-abismo via-abismo/30 to-transparent" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="relative grid size-24 place-items-center rounded-full bg-papel text-marinho shadow-2xl transition-transform duration-700 ease-agua group-hover:scale-110 md:size-32">
              <span aria-hidden className="absolute inset-0 rounded-full border-2 border-papel/60 motion-safe:animate-[pulso_2.4s_ease-out_infinite]" />
              <Play className="ml-1 size-8 fill-current md:size-10" aria-hidden />
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-6 p-7 md:flex-row md:items-end md:p-12">
            <div>
              <Rotulo className="mb-4 text-rio-claro">Vídeo · Encontro de prefeitos</Rotulo>
              <TituloAnimado as="p" className="titulo-display max-w-[14ch] text-[clamp(2.2rem,5vw,4.5rem)]">
                A união para <span className="text-rio">fortalecer</span> os municípios.
              </TituloAnimado>
            </div>
            <p className="max-w-xs text-papel/70">
              Prefeitos, parceiros e especialistas reunidos para trocar experiências e soluções.
            </p>
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
                className="block max-h-[85svh] w-[min(92vw,70rem)] rounded-3xl bg-abismo"
              />
            ) : (
              <iframe
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
