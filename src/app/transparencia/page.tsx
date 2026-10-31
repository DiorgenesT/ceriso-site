import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { ceriso } from "@/content/institucional";
import { publicacoes, transparencia } from "@/content/transparencia";
import { documentosPncp, pncpAtualizadoEm } from "@/content/atuacao";
import { TabelaDocumentos } from "./tabela";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { CartaoAcervo } from "@/components/ui/cartao-acervo";
import { BotaoSeta } from "@/components/ui/seta";
import { Revelar } from "@/components/motion/revelar";

export const metadata: Metadata = {
  title: "Portal da Transparência",
  description: "Receitas, despesas, contratos, balancetes e licitações do CERISO.",
};

export default function Transparencia() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Portal da Transparência"
        titulo={<>Dinheiro público, <em className="not-italic text-rio">às claras.</em></>}
        texto="Clareza, confiança e compromisso: todos os documentos financeiros e contratuais do consórcio em um só lugar."
      />
      <section className="bg-areia py-24 md:py-32">
        <div className="container-site">
          <Revelar className="mb-12 flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-tinta p-8 text-papel md:flex-row md:items-center md:p-12">
            <div className="flex gap-5">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-mata/15 text-mata">
                <Activity className="size-6" aria-hidden />
              </span>
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Transparência em tempo real</h2>
                <p className="mt-1 max-w-lg text-papel/60">Execução orçamentária, empenhos e pagamentos atualizados diretamente do sistema contábil.</p>
              </div>
            </div>
            <BotaoSeta href={ceriso.transparenciaTempoReal}>Acessar o sistema</BotaoSeta>
          </Revelar>
          <div id="documentos" className="scroll-mt-28">
            <h2 className="mb-2 text-3xl font-bold tracking-tight">Licitações, contratos e contratações diretas</h2>
            <p className="mb-8 max-w-2xl text-cinza">Todos os atos publicados pelo CERISO no Portal Nacional de Contratações Públicas, com busca, filtros e exportação.</p>
            <TabelaDocumentos documentos={documentosPncp} atualizadoEm={pncpAtualizadoEm} />
          </div>

          <div id="acervo" className="mt-24 scroll-mt-28">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Contas e acervo</h2>
            <Revelar emCascata className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {transparencia.map((item) => (
                <CartaoAcervo key={item.titulo} item={item} />
              ))}
            </Revelar>
          </div>

          <div id="publicacoes" className="mt-24 scroll-mt-28">
            <h2 className="mb-8 text-3xl font-bold tracking-tight">Publicações oficiais</h2>
            <Revelar emCascata className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {publicacoes.map((item) => (
                <CartaoAcervo key={item.titulo} item={item} />
              ))}
            </Revelar>
          </div>
          <p className="mt-16 text-sm text-cinza">
            Pedidos de informação (Lei 12.527/2011) podem ser feitos pelo{" "}
            <a href="/contato?assunto=lai" className="underline underline-offset-4 hover:text-tinta">formulário de contato</a>{" "}
            ou pelo e-mail <a href={`mailto:${ceriso.contato.email}`} className="underline underline-offset-4 hover:text-tinta">{ceriso.contato.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
