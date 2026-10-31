import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, ExternalLink } from "lucide-react";
import clsx from "clsx";
import { documentosDa, passos, solucoes } from "@/content/atuacao";
import { corSituacao, formatarData, formatarReais } from "@/lib/formato";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { Revelar } from "@/components/motion/revelar";
import { BotaoSeta } from "@/components/ui/seta";

export const dynamicParams = false;
export function generateStaticParams() {
  return solucoes.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solucoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = solucoes.find((x) => x.slug === slug);
  return s ? { title: s.titulo, description: s.resumo } : {};
}

export default async function FichaSolucao({ params }: PageProps<"/solucoes/[slug]">) {
  const { slug } = await params;
  const s = solucoes.find((x) => x.slug === slug);
  if (!s) notFound();
  const docs = documentosDa(s);
  const [lic, ...contratos] = docs;

  const ficha = lic
    ? [
        { rotulo: "Modalidade", valor: `${lic.tipo}${lic.registroDePrecos ? " · Registro de preços" : ""}` },
        { rotulo: "Número", valor: lic.numero },
        { rotulo: "Processo", valor: lic.processo ?? "—" },
        { rotulo: "Publicação no PNCP", valor: formatarData(lic.publicacao) },
        { rotulo: lic.valorHomologado ? "Valor homologado" : "Valor estimado", valor: formatarReais(lic.valorHomologado || lic.valorEstimado) },
      ]
    : [];

  return (
    <>
      <CabecalhoPagina rotulo={`Soluções / ${s.area}`} titulo={s.titulo} texto={s.resumo}>
        <div className="mt-10 flex flex-wrap gap-3">
          <BotaoSeta href={`/contato?assunto=adesao&solucao=${s.slug}`}>Solicitar adesão</BotaoSeta>
          {lic && <BotaoSeta href={lic.pncp} variante="contorno">Ver no PNCP</BotaoSeta>}
        </div>
      </CabecalhoPagina>

      <section className="bg-papel py-20 md:py-28">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <Revelar className="lg:col-span-5">
            <div className="rounded-[2rem] bg-marinho p-8 text-papel">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Ficha da contratação</h2>
                {lic && <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", corSituacao(lic.situacao).replace(/text-\S+/, "text-papel"))}>{lic.situacao}</span>}
              </div>
              <dl className="mt-6 divide-y divide-papel/10">
                {ficha.map((f) => (
                  <div key={f.rotulo} className="flex justify-between gap-6 py-3.5 text-sm">
                    <dt className="text-papel/60">{f.rotulo}</dt>
                    <dd className="text-right font-semibold tabular-nums">{f.valor}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-xs text-papel/50">Fonte: Portal Nacional de Contratações Públicas (PNCP).</p>
            </div>
          </Revelar>

          <div className="space-y-12 lg:col-span-6 lg:col-start-7">
            <Revelar>
              <h2 className="text-2xl font-bold tracking-tight">O que está incluído</h2>
              <ul className="mt-6 space-y-3">
                {s.inclui.map((i) => (
                  <li key={i} className="flex gap-3 text-cinza">
                    <Check className="mt-0.5 size-5 shrink-0 text-mata" aria-hidden /> {i}
                  </li>
                ))}
              </ul>
            </Revelar>
            <Revelar>
              <h2 className="text-2xl font-bold tracking-tight">Objeto</h2>
              <p className="mt-4 text-cinza">{lic?.objeto}</p>
            </Revelar>
            <Revelar>
              <h2 className="text-2xl font-bold tracking-tight">Documentos</h2>
              <ul className="mt-6 divide-y divide-linha border-y border-linha">
                {docs.map((d) => (
                  <li key={d.id}>
                    <a href={d.pncp} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-agua">
                      <span>
                        <span className="block font-semibold">{d.tipo} {d.numero}</span>
                        <span className="text-sm text-cinza">
                          Publicado em {formatarData(d.publicacao)}
                          {"fornecedor" in d && d.fornecedor ? ` · ${d.fornecedor}` : ""}
                        </span>
                      </span>
                      <ExternalLink className="size-4 shrink-0" aria-hidden />
                      <span className="sr-only">(abre o PNCP em nova aba)</span>
                    </a>
                  </li>
                ))}
                {lic?.sistemaOrigem && (
                  <li>
                    <a href={lic.sistemaOrigem} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-agua">
                      <span className="font-semibold">Edital e anexos na plataforma de licitação</span>
                      <ExternalLink className="size-4 shrink-0" aria-hidden />
                    </a>
                  </li>
                )}
                {s.documento && (
                  <li>
                    <a href={s.documento.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 py-4 transition-colors hover:text-agua">
                      <span className="font-semibold">{s.documento.rotulo}</span>
                      <ExternalLink className="size-4 shrink-0" aria-hidden />
                    </a>
                  </li>
                )}
              </ul>
              {contratos.length === 0 && <p className="mt-4 text-sm text-cinza">Contratos e atas aparecem aqui assim que forem publicados no PNCP.</p>}
            </Revelar>
          </div>
        </div>
      </section>

      <section className="bg-areia py-20 md:py-28">
        <div className="container-site">
          <h2 className="titulo-display mb-12 text-[clamp(2.2rem,4vw,3.8rem)]">5 passos até a contratação</h2>
          <Revelar as="ol" emCascata className="grid gap-px overflow-hidden rounded-3xl border border-linha bg-linha sm:grid-cols-2 lg:grid-cols-5">
            {passos.map((p, i) => (
              <li key={p.titulo} className="bg-papel p-7">
                <span className="grid size-10 place-items-center rounded-full bg-marinho text-sm font-bold text-papel">{i + 1}</span>
                <p className="mt-6 font-bold">{p.titulo}</p>
                <p className="mt-2 text-sm text-cinza">{p.texto}</p>
              </li>
            ))}
          </Revelar>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-white p-8 md:flex-row md:items-center">
            <div>
              <p className="text-xl font-bold">Seu município ainda não participa?</p>
              <p className="mt-1 text-cinza">A equipe do CERISO orienta sobre as condições e os documentos necessários.</p>
            </div>
            <BotaoSeta href={`/contato?assunto=adesao&solucao=${s.slug}`} variante="escuro">Solicitar adesão</BotaoSeta>
          </div>
          <Link href="/solucoes" className="mt-10 inline-flex items-center gap-2 font-semibold text-agua hover:underline">
            Ver todas as soluções <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
