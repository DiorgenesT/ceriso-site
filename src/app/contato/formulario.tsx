"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { ceriso } from "@/content/institucional";
import { municipios } from "@/content/municipios";
import { solucoes } from "@/content/atuacao";

// A chave é o que vai na URL (?assunto=adesao), vinda dos botões do site.
const assuntos = {
  demanda: "Sugerir demanda",
  adesao: "Solicitar adesão",
  fornecedores: "Fornecedores",
  ouvidoria: "Ouvidoria",
  lai: "Pedido de informação (LAI)",
  acesso: "Acesso à Área do Consorciado",
  outros: "Outros",
} as const;
type Assunto = keyof typeof assuntos;

// Enquanto o site for estático, o envio monta um e-mail no cliente do visitante.
// Para receber direto num painel, ligar a um endpoint (ex.: Worker com Turnstile).
export function Formulario() {
  const params = useSearchParams();
  const inicial = params.get("assunto");
  const [assunto, setAssunto] = useState<Assunto>(inicial && inicial in assuntos ? (inicial as Assunto) : "demanda");
  const solucao = solucoes.find((s) => s.slug === params.get("solucao"));

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    const corpo = [
      `Nome: ${dados.get("nome")}`,
      `E-mail: ${dados.get("email")}`,
      `Município: ${dados.get("municipio") || "—"}`,
      `Empresa/órgão: ${dados.get("origem") || "—"}`,
      solucao ? `Solução: ${solucao.titulo}` : "",
      "",
      String(dados.get("mensagem")),
    ].filter((l, i) => l || i > 4).join("\n");
    const titulo = `[Site] ${assuntos[assunto]}${solucao ? ` — ${solucao.titulo}` : ""}`;
    window.location.href = `mailto:${ceriso.contato.email}?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(corpo)}`;
  }

  const campo = "w-full rounded-2xl border border-linha bg-white px-5 py-4 outline-none transition-colors focus:border-tinta";
  return (
    <form onSubmit={enviar} className="space-y-6">
      <fieldset>
        <legend className="mb-4 font-semibold">Assunto</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(assuntos) as [Assunto, string][]).map(([chave, rotulo]) => (
            <label key={chave} className={clsx("cursor-pointer rounded-full border px-5 py-2.5 text-sm transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rio",
              assunto === chave ? "border-marinho bg-marinho text-papel" : "border-linha hover:border-tinta")}>
              <input type="radio" name="assunto" value={chave} checked={assunto === chave} onChange={() => setAssunto(chave)} className="sr-only" />
              {rotulo}
            </label>
          ))}
        </div>
      </fieldset>
      {solucao && (
        <p className="rounded-2xl bg-mata/10 px-5 py-4 text-sm">Solução: <strong>{solucao.titulo}</strong></p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="mb-2 block text-sm text-cinza">Nome</span>
          <input name="nome" required autoComplete="name" className={campo} /></label>
        <label className="block"><span className="mb-2 block text-sm text-cinza">E-mail</span>
          <input name="email" type="email" required autoComplete="email" className={campo} /></label>
        <label className="block"><span className="mb-2 block text-sm text-cinza">Município</span>
          <select name="municipio" className={campo} defaultValue="">
            <option value="">Não se aplica</option>
            {municipios.map((m) => <option key={m.slug}>{m.nome}</option>)}
          </select></label>
        <label className="block"><span className="mb-2 block text-sm text-cinza">Empresa ou órgão (opcional)</span>
          <input name="origem" autoComplete="organization" className={campo} /></label>
      </div>
      <label className="block"><span className="mb-2 block text-sm text-cinza">Mensagem</span>
        <textarea name="mensagem" required rows={6} className={campo} /></label>
      <button type="submit" className="rounded-full bg-marinho px-8 py-4 font-semibold text-papel transition-colors hover:bg-mata hover:text-abismo">
        Enviar mensagem
      </button>
    </form>
  );
}
