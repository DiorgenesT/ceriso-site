import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ceriso } from "@/content/institucional";
import { noticias } from "@/content/transparencia";
import { projetos } from "@/content/atuacao";
import { formatarData } from "@/lib/formato";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { Revelar } from "@/components/motion/revelar";
import { Video } from "@/components/secoes/video";
import { BotaoSeta } from "@/components/ui/seta";

export const metadata: Metadata = {
  title: "Notícias",
  description: "Notícias, eventos e projetos do CERISO e dos municípios consorciados.",
};

export default function Noticias() {
  return (
    <>
      <CabecalhoPagina rotulo="Notícias" titulo={<>O consórcio <span className="text-rio">em ação.</span></>}
        texto="Assembleias, novas contratações, projetos e resultados nos municípios consorciados." />
      <section className="bg-papel pt-24 md:pt-32">
        <div className="container-site grid gap-6 lg:grid-cols-12">
          {noticias.map((n) => (
            <Revelar as="article" key={n.slug} className="group overflow-hidden rounded-[2rem] bg-areia lg:col-span-8">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={n.foto} alt="" fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover transition-transform duration-1000 ease-agua group-hover:scale-105" />
              </div>
              <div className="p-8 md:p-10">
                <p className="text-sm text-cinza"><span className="font-semibold text-agua">Institucional</span> · <time dateTime={n.data}>{formatarData(n.data, "long")}</time></p>
                <h2 className="mt-3 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold leading-tight tracking-[-0.03em]">{n.titulo}</h2>
                <p className="mt-4 max-w-2xl text-cinza">{n.resumo}</p>
              </div>
            </Revelar>
          ))}
          <Revelar atraso={0.1} className="flex flex-col gap-4 lg:col-span-4">
            <p className="font-bold">Projetos em andamento</p>
            {projetos.map((p) => (
              <a key={p.id} href={p.documento.href} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-3xl border border-linha p-5 transition-colors hover:border-tinta">
                <span>
                  <span className="block font-semibold">{p.titulo}</span>
                  <span className="text-sm text-cinza">{p.texto}</span>
                </span>
                <ArrowUpRight className="size-4 shrink-0" aria-hidden />
              </a>
            ))}
            <div className="mt-auto rounded-3xl bg-marinho p-6 text-papel">
              <p className="font-bold">Acompanhe pelo Instagram</p>
              <p className="mt-1 text-sm text-papel/70">Eventos, trabalhos e bastidores das 29 cidades.</p>
              <BotaoSeta href={ceriso.redes.instagram} variante="claro" className="mt-5">@cerisoconsorcio</BotaoSeta>
            </div>
          </Revelar>
        </div>
      </section>
      <Video />
    </>
  );
}
