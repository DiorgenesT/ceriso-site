import type { Metadata } from "next";
import { CalendarDays, FileSignature, FolderLock, LifeBuoy, PieChart, Puzzle, ShieldCheck } from "lucide-react";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { Revelar } from "@/components/motion/revelar";
import { Login } from "./login";

export const metadata: Metadata = {
  title: "Área do Consorciado",
  description: "Acesso restrito dos municípios consorciados: soluções, contratos, chamados, rateio e assembleias.",
  robots: { index: false },
};

const modulos = [
  { icone: Puzzle, titulo: "Minhas soluções", texto: "Soluções aderidas pelo município e solicitação de novas adesões." },
  { icone: FileSignature, titulo: "Contratos", texto: "Contratos ativos, aditivos, vigências e saldos." },
  { icone: LifeBuoy, titulo: "Chamados", texto: "Pedidos e ocorrências com número de protocolo e prazo." },
  { icone: PieChart, titulo: "Rateio", texto: "Contrato de rateio, parcelas e comprovantes." },
  { icone: FolderLock, titulo: "Documentos", texto: "Arquivos exclusivos para os consorciados." },
  { icone: CalendarDays, titulo: "Assembleias", texto: "Pautas, convocações e atas das assembleias." },
];

export default function AreaDoConsorciado() {
  return (
    <>
      <CabecalhoPagina
        rotulo="Acesso restrito"
        titulo={<>Área do <span className="text-rio">Consorciado.</span></>}
        texto="Adesões, contratos, rateio e chamados do seu município em um só lugar, com login individual."
      />
      <section className="bg-areia py-20 md:py-28">
        <div className="container-site grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Login />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="text-3xl font-bold tracking-tight">O que o município encontra no painel</h2>
            <Revelar as="ul" emCascata className="mt-8 grid gap-3 sm:grid-cols-2">
              {modulos.map(({ icone: Icone, titulo, texto }) => (
                <li key={titulo} className="rounded-3xl bg-papel p-6">
                  <Icone className="size-6 text-mata" aria-hidden />
                  <p className="mt-4 font-bold">{titulo}</p>
                  <p className="mt-1 text-sm text-cinza">{texto}</p>
                </li>
              ))}
            </Revelar>
            <p className="mt-8 flex gap-3 rounded-3xl border border-linha p-6 text-sm text-cinza">
              <ShieldCheck className="size-5 shrink-0 text-marinho" aria-hidden />
              Acesso com e-mail institucional cadastrado pelo município, verificação em duas etapas e opção de entrar com gov.br.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
