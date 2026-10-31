import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { documentosPncp } from "@/content/atuacao";
import { ceriso } from "@/content/institucional";
import { corSituacao, formatarData, formatarReais } from "@/lib/formato";
import { BotaoSeta } from "@/components/ui/seta";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";
import { Revelar } from "@/components/motion/revelar";

const atalhos = [
  { rotulo: "Licitações e editais", href: "/transparencia#documentos" },
  { rotulo: "Receitas, despesas e balancetes", href: "/transparencia#acervo" },
  { rotulo: "Contratos de rateio", href: "/transparencia#acervo" },
  { rotulo: "Atos oficiais e estatuto", href: "/publicacoes" },
  { rotulo: "SIC / Lei de Acesso à Informação", href: "/contato?assunto=lai" },
];

export function TransparenciaDestaque() {
  const recentes = documentosPncp.slice(0, 5);
  return (
    <section className="grao relative overflow-hidden bg-abismo py-32 text-papel md:py-44">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 size-[50rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rio/10 blur-[120px]" />
      <div className="container-site relative z-[2]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Rotulo className="mb-6 text-rio-claro">(05) Transparência</Rotulo>
            <TituloAnimado className="titulo-display text-[clamp(2.6rem,5.5vw,5.5rem)]">
              Clareza. Confiança. <span className="text-rio">Compromisso.</span>
            </TituloAnimado>
          </div>
          <Revelar className="space-y-6 lg:col-span-4 lg:col-start-9">
            <p className="text-papel/65">
              Cada contratação do consórcio é pública, com link direto para o Portal Nacional de Contratações Públicas.
            </p>
            <BotaoSeta href="/transparencia">Abrir o Portal da Transparência</BotaoSeta>
          </Revelar>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-12">
          <Revelar className="overflow-hidden rounded-[2rem] border border-papel/10 bg-corrente/60 lg:col-span-8">
            <p className="flex items-center justify-between border-b border-papel/10 px-7 py-5 text-sm">
              <span className="font-semibold">Publicações recentes no PNCP</span>
              <span className="text-papel/40">dados oficiais</span>
            </p>
            <ul className="divide-y divide-papel/10">
              {recentes.map((d) => (
                <li key={d.id}>
                  <a href={d.pncp} target="_blank" rel="noopener noreferrer" className="group grid gap-2 px-7 py-5 transition-colors hover:bg-papel/5 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
                    <div className="min-w-0">
                      <p className="text-xs text-papel/50">{d.tipo} {d.numero} · {formatarData(d.publicacao)}</p>
                      <p className="mt-1 line-clamp-2 font-medium">{d.objeto}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="tabular-nums text-papel/70">{formatarReais(d.valorHomologado || d.valorEstimado, true)}</span>
                      <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", corSituacao(d.situacao).replace(/text-\S+/, "text-papel"))}>{d.situacao}</span>
                      <ArrowUpRight className="size-4 shrink-0 text-papel/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </div>
                    <span className="sr-only">(abre o PNCP em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Revelar>
          <Revelar atraso={0.1} className="flex flex-col rounded-[2rem] bg-corrente p-7 lg:col-span-4">
            <p className="font-semibold">Acesso rápido</p>
            <ul className="mt-4 divide-y divide-papel/10">
              {atalhos.map((a) => (
                <li key={a.rotulo}>
                  <Link href={a.href} className="flex items-center justify-between py-3.5 text-papel/80 transition-colors hover:text-rio">
                    {a.rotulo} <ArrowUpRight className="size-4" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <BotaoSeta href={ceriso.transparenciaTempoReal} variante="contorno" className="mt-auto self-start pt-2">Execução em tempo real</BotaoSeta>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
