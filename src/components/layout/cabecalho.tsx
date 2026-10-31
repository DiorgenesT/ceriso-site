"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { LockKeyhole, Menu, X } from "lucide-react";
import { Marca } from "@/components/ui/marca";
import { gsap, useGSAP, prefereMenosMovimento } from "@/lib/gsap";
import { atalhos, navegacao } from "./navegacao";
import { Acessibilidade } from "./acessibilidade";

// Cabeçalho fixo: transparente sobre o hero escuro, vidro fosco após rolar,
// recolhe ao descer e volta ao subir.
export function Cabecalho() {
  const caminho = usePathname();
  const [rolou, setRolou] = useState(false);
  const [oculto, setOculto] = useState(false);
  // O menu guarda em qual página foi aberto: ao navegar, fecha sozinho.
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === caminho;
  const setAberto = (v: boolean) => setAbertoEm(v ? caminho : null);
  const ref = useRef<HTMLElement>(null);

  // Entrada ao abrir o site (o cabeçalho vive no layout, então roda uma vez só):
  // a logo se monta e os itens do menu descem em cascata.
  useGSAP(
    () => {
      if (!prefereMenosMovimento()) {
        gsap.from(".cab-item", { y: -18, opacity: 0, duration: 0.9, stagger: 0.06, delay: 0.45, ease: "expo.out" });
      }
      // estado inicial montado: libera o cabeçalho (escondido via CSS para não piscar)
      gsap.set(".cabecalho-intro", { opacity: 1 });
    },
    { scope: ref },
  );

  useEffect(() => {
    let ultimo = window.scrollY;
    const aoRolar = () => {
      const y = window.scrollY;
      setRolou(y > 40);
      setOculto(y > 400 && y > ultimo);
      ultimo = y;
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = aberto ? "hidden" : "";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbertoEm(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [aberto]);

  return (
    <header
      ref={ref}
      className={clsx(
        "fixed inset-x-0 top-0 z-50 text-papel transition-transform duration-500 ease-agua",
        oculto && !aberto && "-translate-y-[160%]",
      )}
    >
      <div
        className={clsx(
          "cabecalho-intro container-site mt-3 flex h-16 items-center justify-between gap-6 rounded-full transition-all duration-500",
          rolou && !aberto && "bg-abismo/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,.5)] backdrop-blur-xl",
        )}
        style={{ maxWidth: "min(88rem, calc(100% - 1.5rem))" }}
      >
        <Link href="/" aria-label="CERISO, página inicial" className="relative z-10 shrink-0">
          <Marca animada className="h-9 sm:h-11" atraso={0.1} />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {navegacao.map((item) => {
              const ativo = item.href === "/" ? caminho === "/" : caminho.startsWith(item.href);
              return (
                <li key={item.href} className="cab-item">
                  <Link
                    href={item.href}
                    aria-current={ativo ? "page" : undefined}
                    className={clsx(
                      "whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors xl:px-4",
                      ativo ? "bg-papel/10 text-papel" : "text-papel/70 hover:text-papel",
                    )}
                  >
                    {item.rotulo}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative z-10 flex items-center gap-3">
          <div className="cab-item hidden sm:block">
            <Acessibilidade />
          </div>
          <Link href="/area-do-consorciado"
            className="cab-item hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-mata px-4 py-2.5 text-sm font-semibold text-abismo transition-colors hover:bg-papel xl:inline-flex">
            <LockKeyhole className="size-4" aria-hidden /> Área do Consorciado
          </Link>
          <button
            type="button"
            onClick={() => setAberto(!aberto)}
            aria-expanded={aberto}
            aria-controls="menu-movel"
            className="cab-item grid size-11 place-items-center rounded-full bg-papel/10 lg:hidden"
          >
            {aberto ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        hidden={!aberto}
        data-lenis-prevent
        className="fixed inset-0 -z-10 overflow-y-auto bg-abismo px-6 pb-10 pt-28 lg:hidden"
      >
        <nav aria-label="Menu móvel">
          <ul className="space-y-2">
            {navegacao.map((item, i) => (
              <li key={item.href} style={{ animationDelay: `${i * 50}ms` }} className="animate-[subir_.6s_var(--ease-agua)_both]">
                <Link href={item.href} className="block border-b border-papel/10 py-3 text-3xl font-bold tracking-tight">
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="mt-8 flex flex-wrap gap-2">
          {atalhos.map((a) => (
            <li key={a.href}>
              <Link href={a.href} className="inline-block rounded-full border border-papel/20 px-4 py-2 text-sm text-papel/80">{a.rotulo}</Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 sm:hidden">
          <Acessibilidade />
        </div>
      </div>
    </header>
  );
}
