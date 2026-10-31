import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { areas, documentosDa, projetos, solucoes } from "@/content/atuacao";
import { corSituacao, formatarReais } from "@/lib/formato";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { Revelar } from "@/components/motion/revelar";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { BotaoSeta } from "@/components/ui/seta";
import { ComoFunciona } from "@/components/secoes/como-funciona";

export const metadata: Metadata = {
  title: "Soluções",
  description: "Contratações compartilhadas do CERISO para os municípios consorciados: saúde, meio ambiente, educação, tecnologia e gestão.",
};

export default function Solucoes() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Soluções CERISO"
        titulo={<>Contratações compartilhadas <span className="text-rio">para o seu município.</span></>}
        texto="Editais com base técnica e estrutura jurídica, construídos a partir das necessidades comuns dos municípios consorciados."
      />

      <section className="bg-papel py-24 md:py-32">
        <div className="container-site">
          <Revelar emCascata className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {solucoes.map((s) => {
              const [lic] = documentosDa(s);
              return (
                <Link key={s.slug} href={`/solucoes/${s.slug}`}
                  className="group flex min-h-80 flex-col rounded-[2rem] border border-linha bg-white p-8 transition-all duration-500 ease-agua hover:-translate-y-1 hover:border-marinho hover:shadow-[0_30px_60px_-30px_rgba(0,25,77,.4)]">
                  <div className="flex items-center justify-between">
                    <span className="eyebrow text-agua">{s.area}</span>
                    <ArrowUpRight className="size-5 text-cinza transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-tinta" aria-hidden />
                  </div>
                  <h2 className="mt-6 text-3xl font-bold leading-tight tracking-[-0.03em]">{s.titulo}</h2>
                  <p className="mt-3 text-cinza">{s.resumo}</p>
                  {lic && (
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
                      <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", corSituacao(lic.situacao))}>{lic.situacao}</span>
                      <span className="text-sm tabular-nums text-cinza">{formatarReais(lic.valorHomologado || lic.valorEstimado, true)}</span>
                    </div>
                  )}
                </Link>
              );
            })}
            <Link href="/contato?assunto=demanda"
              className="group flex min-h-80 flex-col justify-between rounded-[2rem] bg-marinho p-8 text-papel transition-colors duration-500 hover:bg-mata">
              <span className="eyebrow text-papel/60">Sua demanda aqui</span>
              <div>
                <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em]">Sugira uma nova solução</h2>
                <p className="mt-3 text-papel/70">Quanto mais conhecemos a realidade do seu município, mais soluções construímos juntos para a região.</p>
              </div>
            </Link>
          </Revelar>
        </div>
      </section>

      <section className="bg-areia py-24 md:py-32">
        <div className="container-site">
          <p className="eyebrow mb-6 text-cinza">Atuação multifinalitária</p>
          <TituloAnimado className="titulo-display mb-14 max-w-[18ch] text-[clamp(2.4rem,4.5vw,4.4rem)]">Áreas de abrangência</TituloAnimado>
          <Revelar as="ul" emCascata className="grid gap-px overflow-hidden rounded-3xl border border-linha bg-linha sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((a, i) => (
              <li key={a.titulo} className="bg-papel p-8">
                <span className="text-sm font-semibold tabular-nums text-agua">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-6 text-xl font-bold tracking-tight">{a.titulo}</p>
                <p className="mt-2 text-sm text-cinza">{a.texto}</p>
              </li>
            ))}
          </Revelar>
        </div>
      </section>

      <section className="bg-papel py-24 md:py-32">
        <div className="container-site">
          <p className="eyebrow mb-6 text-cinza">Projetos regionais</p>
          <TituloAnimado className="titulo-display mb-14 max-w-[18ch] text-[clamp(2.4rem,4.5vw,4.4rem)]">Planejar a região inteira.</TituloAnimado>
          <Revelar emCascata className="grid gap-4 md:grid-cols-2">
            {projetos.map((p) => (
              <a key={p.id} href={p.documento.href} target="_blank" rel="noopener noreferrer" className="group relative flex min-h-80 flex-col justify-end overflow-hidden rounded-[2rem] text-papel">
                <Image src={p.foto} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-1000 ease-agua group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-abismo via-abismo/50 to-transparent" />
                <div className="relative p-8">
                  <h3 className="text-2xl font-bold tracking-tight">{p.titulo}</h3>
                  <p className="mt-2 max-w-md text-papel/70">{p.texto}</p>
                  <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">{p.documento.rotulo} <ArrowUpRight className="size-4" aria-hidden /></p>
                </div>
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            ))}
          </Revelar>
          <div className="mt-12">
            <BotaoSeta href="/contato?assunto=demanda" variante="escuro">Fale com o consórcio sobre sua demanda</BotaoSeta>
          </div>
        </div>
      </section>
      <ComoFunciona />
    </>
  );
}
