import type { Metadata } from "next";
import { publicacoes } from "@/content/transparencia";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { CartaoAcervo } from "@/components/ui/cartao-acervo";
import { Revelar } from "@/components/motion/revelar";

export const metadata: Metadata = {
  title: "Publicações Oficiais",
  description: "Estatuto, atas, editais, resoluções, portarias, TSM e Plano de Contratação Anual do CERISO.",
};

export default function Publicacoes() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Publicações Oficiais"
        titulo={<>Atos que <em className="not-italic text-rio">fazem a regra.</em></>}
        texto="Estatuto, atas, editais, resoluções e demais documentos que garantem a integridade do consórcio."
      />
      <section className="bg-papel py-24 md:py-32">
        <Revelar emCascata className="container-site grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {publicacoes.map((item) => (
            <CartaoAcervo key={item.titulo} item={item} />
          ))}
        </Revelar>
      </section>
    </>
  );
}
