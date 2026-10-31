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

  return null;
}
