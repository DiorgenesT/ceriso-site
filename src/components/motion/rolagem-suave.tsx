"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefereMenosMovimento } from "@/lib/gsap";

// Lenis dirige a rolagem e o ticker do GSAP dirige o Lenis, para que
// ScrollTrigger e rolagem suave fiquem no mesmo quadro.
export function RolagemSuave() {
  const lenis = useRef<Lenis | null>(null);
  const caminho = usePathname();

  useEffect(() => {
    if (prefereMenosMovimento()) return;
    const l = new Lenis({ lerp: 0.1, anchors: true });
    lenis.current = l;
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // Página nova começa do topo. O Next até rola para o topo, mas o Lenis guarda a
  // posição anterior e a reaplica; por isso o reset passa por ele. Links com âncora
  // (/#atuacao) ficam por conta do próprio Lenis.
  useEffect(() => {
    if (window.location.hash) return;
    if (lenis.current) lenis.current.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [caminho]);

  // Link para a própria página (Início ou logo estando na home, por exemplo): o Next não
  // navega e nada rola. Nesse caso, volta ao topo com a rolagem suave.
  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      const semBarra = (p: string) => p.replace(/\/$/, "") || "/";
      if (url.origin !== window.location.origin || url.hash || url.search !== window.location.search) return;
      if (semBarra(url.pathname) !== semBarra(window.location.pathname)) return;
      e.preventDefault();
      if (lenis.current) lenis.current.scrollTo(0, { duration: 1.2 });
      else window.scrollTo({ top: 0, behavior: prefereMenosMovimento() ? "auto" : "smooth" });
    };
    // captura: roda antes do onClick do <Link>, que marcaria o evento como tratado
    document.addEventListener("click", aoClicar, true);
    return () => document.removeEventListener("click", aoClicar, true);
  }, []);

  return null;
}
