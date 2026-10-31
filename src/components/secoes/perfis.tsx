"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Landmark, Users } from "lucide-react";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";

const perfis = [
  {
    icone: Landmark,
    titulo: "Sou município",
    texto: "Soluções disponíveis, adesão, contratos e rateio.",
    links: [
      { rotulo: "Soluções para aderir", href: "/solucoes" },
      { rotulo: "Área do Consorciado", href: "/area-do-consorciado" },
    ],
  },
  {
    icone: Building2,
    titulo: "Sou fornecedor",
    texto: "Licitações abertas, atas e resultados publicados no PNCP.",
    links: [
      { rotulo: "Licitações e editais", href: "/transparencia#documentos" },
      { rotulo: "Falar com o setor de compras", href: "/contato?assunto=fornecedores" },
    ],
  },
  {
    icone: Users,
    titulo: "Sou cidadão",
    texto: "Contas públicas, contratos, ouvidoria e acesso à informação.",
    links: [
      { rotulo: "Portal da Transparência", href: "/transparencia" },
      { rotulo: "Pedido de informação (LAI)", href: "/contato?assunto=lai" },
    ],
  },
];

// Atalhos por perfil logo abaixo do hero: cada público chega ao que procura em um clique.
// No hover (ou foco), o cartão "enche" de azul-marinho de baixo para cima, como água subindo.
export function Perfis() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.set(".perfil", { opacity: 1 });
      if (prefereMenosMovimento()) return;
      gsap.timeline({ scrollTrigger: { trigger: ".perfis-grade", start: "top 85%", once: true } })
        .from(".perfil", { clipPath: "inset(100% 0% 0% 0% round 2rem)", y: 60, duration: 1.2, stagger: 0.12, ease: "expo.out" })
        .from(".perfil-icone", { scale: 0, rotation: -90, duration: 0.8, stagger: 0.12, ease: "back.out(2.2)" }, 0.3)
        .from(".perfil-conteudo > *", { y: 20, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out" }, 0.45);
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="Acesso rápido por perfil" className="bg-papel pt-20 md:pt-28">
      <div className="container-site">
        <Rotulo className="mb-4 text-cinza">Acesso rápido</Rotulo>
        <TituloAnimado as="h2" className="titulo-display text-[clamp(2.2rem,4.2vw,3.8rem)] text-marinho">
          Por onde você quer começar?
        </TituloAnimado>

        <div className="perfis-grade mt-10 grid gap-4 md:mt-14 md:grid-cols-3">
          {perfis.map(({ icone: Icone, titulo, texto, links }, i) => (
            <article
              key={titulo}
              data-revelar=""
              className="perfil group relative flex min-h-[22rem] flex-col overflow-hidden rounded-[2rem] border border-linha bg-white p-7 text-tinta md:p-8"
            >
              {/* água subindo no hover */}
              <div aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-marinho transition-transform duration-700 ease-agua group-focus-within:scale-y-100 group-hover:scale-y-100" />
              <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(closest-side,rgb(0_163_144/0.35),transparent)] opacity-0 transition-opacity duration-700 group-focus-within:opacity-100 group-hover:opacity-100" />

              <div className="perfil-conteudo relative flex flex-1 flex-col">
                <div className="flex items-start justify-between">
                  <span className="perfil-icone grid size-14 place-items-center rounded-2xl bg-marinho text-papel transition-colors duration-500 group-hover:bg-mata group-focus-within:bg-mata">
                    <Icone className="size-6" aria-hidden />
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-cinza transition-colors duration-500 group-hover:text-papel/50 group-focus-within:text-papel/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-10 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] transition-colors duration-500 group-hover:text-papel group-focus-within:text-papel">
                  {titulo}
                </h3>
                <p className="mt-3 text-cinza transition-colors duration-500 group-hover:text-papel/70 group-focus-within:text-papel/70">{texto}</p>
                <ul className="mt-auto pt-8">
                  {links.map((l) => (
                    <li key={l.href} className="border-t border-linha transition-colors duration-500 group-hover:border-papel/15 group-focus-within:border-papel/15">
                      <Link
                        href={l.href}
                        className="group/link flex items-center justify-between py-3.5 text-sm font-semibold transition-colors duration-500 group-hover:text-papel group-focus-within:text-papel hover:!text-rio-claro"
                      >
                        {l.rotulo}
                        <ArrowUpRight className="size-4 transition-transform duration-500 ease-agua group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
