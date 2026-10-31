import type { Metadata } from "next";
import Image from "next/image";
import { anosDeAtuacao, ceriso, diretoria, marcos, proposito, visao } from "@/content/institucional";
import { municipios } from "@/content/municipios";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { Revelar } from "@/components/motion/revelar";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { ChamadaFinal } from "@/components/secoes/chamada-final";

export const metadata: Metadata = {
  title: "O Consórcio",
  description: "História, missão e diretoria do CERISO, consórcio de 29 municípios da Bacia do Rio Sorocaba e Médio Tietê.",
};


export default function Institucional() {
  return (
    <>
      <CabecalhoPagina
        rotulo="O Consórcio"
        titulo={<>A força da <em className="not-italic text-rio">cooperação.</em></>}
        texto={`${anosDeAtuacao()} anos unindo municípios em torno da água, da saúde e do desenvolvimento regional.`}
      />

      <section className="bg-papel py-28 md:py-40">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <Revelar className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:col-span-6">
            <Image src="/img/fotos/assembleia-prefeitos.webp" alt="Prefeitos dos municípios consorciados reunidos em assembleia do CERISO" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </Revelar>
          <div className="space-y-10 lg:col-span-5 lg:col-start-8">
            {[
              { rotulo: "Missão", texto: ceriso.missao },
              { rotulo: "Visão", texto: visao },
              { rotulo: "Propósito", texto: proposito },
            ].map((b) => (
              <Revelar key={b.rotulo}>
                <p className="eyebrow mb-3 text-agua">{b.rotulo}</p>
                <p className="text-lg font-medium leading-relaxed">{b.texto}</p>
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-areia py-28 md:py-40">
        <div className="container-site">
          <p className="eyebrow mb-6 text-cinza">Linha do tempo</p>
          <TituloAnimado className="titulo-display mb-16 text-[clamp(2.4rem,4.5vw,4.4rem)]">De dez para vinte e nove.</TituloAnimado>
          <Revelar as="ol" emCascata className="grid gap-px overflow-hidden rounded-3xl border border-linha bg-linha md:grid-cols-4">
            {marcos.map((m) => (
              <li key={m.ano} className="bg-papel p-8">
                <p className="titulo-display text-6xl text-agua">{m.ano}</p>
                <p className="mt-6 text-lg font-semibold">{m.titulo}</p>
                <p className="mt-2 text-sm text-cinza">{m.texto}</p>
              </li>
            ))}
          </Revelar>
        </div>
      </section>

      <section className="bg-papel py-28 md:py-40">
        <div className="container-site">
          <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-6 text-cinza">Diretoria · mandato {diretoria.mandato}</p>
              <TituloAnimado className="titulo-display text-[clamp(2.4rem,4.5vw,4.4rem)]">Quem conduz o consórcio.</TituloAnimado>
            </div>
            <p className="max-w-sm text-cinza">Prefeitos eleitos em assembleia pelos municípios consorciados.</p>
          </div>
          <Revelar as="ul" emCascata className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {diretoria.membros.map((d, i) => {
              const brasao = municipios.find((m) => m.nome === d.municipio)?.slug;
              return (
                <li key={d.nome} className={`group flex flex-col overflow-hidden rounded-[2rem] ${i === 0 ? "bg-tinta text-papel" : "bg-areia"}`}>
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {d.foto ? (
                      <Image src={d.foto} alt={`Retrato de ${d.nome}`} fill sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw" className="object-cover object-top transition-transform duration-1000 ease-agua group-hover:scale-105" />
                    ) : (
                      // sem foto pública: o brasão da cidade que o prefeito governa
                      <div className="absolute inset-0 grid place-items-center">
                        {brasao && (
                          <span className="grid aspect-square w-3/5 place-items-center rounded-full bg-white shadow-[0_30px_60px_-30px_rgba(0,25,77,.35)] transition-transform duration-1000 ease-agua group-hover:scale-105">
                            <Image src={`/img/brasoes/${brasao}.webp`} alt={`Brasão de ${d.municipio}`} width={240} height={240} className="w-3/5" />
                          </span>
                        )}
                      </div>
                    )}
                    {i === 0 && <span className="absolute left-5 top-5 rounded-full bg-mata px-3 py-1 text-xs font-semibold text-abismo">Presidente</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <p className={`text-xs font-semibold uppercase tracking-[0.14em] ${i === 0 ? "text-rio-claro" : "text-agua"}`}>{d.municipio}</p>
                    <p className="mt-2 text-xl font-semibold leading-snug tracking-tight">{d.nome}</p>
                    <p className={`mt-1 text-sm ${i === 0 ? "text-papel/65" : "text-cinza"}`}>{d.cargo}</p>
                  </div>
                </li>
              );
            })}
          </Revelar>
        </div>
      </section>
      <ChamadaFinal />
    </>
  );
}
