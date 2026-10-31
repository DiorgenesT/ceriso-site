import type { Metadata } from "next";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { MapaBacia } from "@/components/secoes/mapa-bacia";
import { ListaMunicipios } from "./lista";

export const metadata: Metadata = {
  title: "Municípios",
  description: "Os 29 municípios consorciados ao CERISO na Bacia do Rio Sorocaba e Médio Tietê.",
};

export default function Municipios() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Municípios consorciados"
        titulo={<>29 cidades, <em className="not-italic text-rio">uma bacia.</em></>}
        texto="Do Alto Sorocaba ao Médio Tietê, municípios de todos os portes decidem juntos em assembleia."
      >
        <div className="mt-16 rounded-[2rem] border border-papel/10 bg-fundo/60 p-4 md:p-10">
          <MapaBacia className="mx-auto w-full max-w-4xl" />
          <p className="mt-4 text-xs text-papel/40">Divisas municipais: IBGE. Rios e Represa de Itupararanga: © colaboradores do OpenStreetMap. Em verde, a sede em Salto de Pirapora.</p>
        </div>
      </CabecalhoPagina>
      <ListaMunicipios />
    </>
  );
}
