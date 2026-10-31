import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ceriso } from "@/content/institucional";
import { CabecalhoPagina } from "@/components/layout/cabecalho-pagina";
import { Formulario } from "./formulario";

export const metadata: Metadata = {
  title: "Contato",
  description: "Fale com o CERISO: demandas dos municípios, fornecedores, ouvidoria e pedidos de informação.",
};

export default function Contato() {
  const { contato } = ceriso;
  const canais = [
    { icone: Phone, rotulo: "Telefone e WhatsApp", valor: contato.telefone, href: contato.whatsappHref },
    { icone: Mail, rotulo: "E-mail", valor: contato.email, href: `mailto:${contato.email}` },
    { icone: MapPin, rotulo: "Sede", valor: `${contato.endereco}, ${contato.cidade}`, href: contato.mapaHref },
    { icone: Clock, rotulo: "Horário", valor: contato.horario },
  ];
  return (
    <>
      <CabecalhoPagina rotulo="Contato" titulo={<>Vamos <em className="not-italic text-rio">conversar.</em></>}
        texto="Demandas dos municípios, adesões, fornecedores, ouvidoria e pedidos de acesso à informação." />
      <section className="bg-papel py-24 md:py-32">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <ul className="space-y-3 lg:col-span-4">
            {canais.map(({ icone: Icone, rotulo, valor, href }) => {
              const conteudo = (
                <>
                  <Icone className="mt-1 size-5 shrink-0 text-agua" aria-hidden />
                  <span>
                    <span className="block tabular-nums text-xs text-cinza">{rotulo}</span>
                    <span className="mt-1 block font-medium">{valor}</span>
                  </span>
                </>
              );
              return (
                <li key={rotulo}>
                  {href ? (
                    <a href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="flex gap-4 rounded-3xl border border-linha p-6 transition-colors hover:border-tinta">{conteudo}</a>
                  ) : (
                    <div className="flex gap-4 rounded-3xl border border-linha p-6">{conteudo}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="lg:col-span-7 lg:col-start-6">
            <Suspense>
              <Formulario />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
