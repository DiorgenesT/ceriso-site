"use client";

import { useDeferredValue, useMemo, useState } from "react";
import clsx from "clsx";
import { Download, ExternalLink, Search } from "lucide-react";
import type { DocumentoPncp } from "@/content/atuacao";
import { corSituacao, formatarData, formatarReais } from "@/lib/formato";

const categoria = (d: DocumentoPncp) =>
  /contrato/i.test(d.tipo) ? "Contratos" : /dispensa|inexigibilidade/i.test(d.tipo) ? "Contratações diretas" : "Licitações";

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function baixarCsv(linhas: DocumentoPncp[]) {
  const cab = ["Tipo", "Número", "Processo", "Objeto", "Situação", "Publicação", "Valor estimado", "Valor homologado/global", "Link PNCP"];
  const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const corpo = linhas.map((d) =>
    [d.tipo, d.numero, d.processo, d.objeto, d.situacao, d.publicacao, d.valorEstimado, d.valorHomologado, d.pncp].map(esc).join(";"),
  );
  // BOM para o Excel abrir com acentos corretos
  const blob = new Blob(["﻿" + [cab.map(esc).join(";"), ...corpo].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "ceriso-transparencia.csv" });
  a.click();
  URL.revokeObjectURL(a.href);
}

export function TabelaDocumentos({ documentos, atualizadoEm }: { documentos: DocumentoPncp[]; atualizadoEm: string | null }) {
  const [busca, setBusca] = useState("");
  const [cat, setCat] = useState("Todos");
  const [ano, setAno] = useState("Todos");
  const [sit, setSit] = useState("Todas");
  const termo = normalizar(useDeferredValue(busca));

  const categorias = ["Todos", "Licitações", "Contratos", "Contratações diretas"];
  const anos = useMemo(() => ["Todos", ...new Set(documentos.map((d) => d.publicacao.slice(0, 4)))], [documentos]);
  const situacoes = useMemo(() => ["Todas", ...new Set(documentos.map((d) => d.situacao))], [documentos]);

  const filtrados = documentos.filter(
    (d) =>
      (cat === "Todos" || categoria(d) === cat) &&
      (ano === "Todos" || d.publicacao.startsWith(ano)) &&
      (sit === "Todas" || d.situacao === sit) &&
      (!termo || normalizar(`${d.tipo} ${d.numero} ${d.objeto} ${d.processo ?? ""}`).includes(termo)),
  );

  const seletor = "rounded-full border border-linha bg-white px-4 py-2.5 text-sm outline-none focus:border-tinta";
  return (
    <div>
      <div role="tablist" aria-label="Categorias" className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {categorias.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
            className={clsx("shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors",
              cat === c ? "bg-marinho text-papel" : "bg-white text-tinta hover:bg-linha/60")}>
            {c} <span className="ml-1 opacity-60">{c === "Todos" ? documentos.length : documentos.filter((d) => categoria(d) === c).length}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex flex-1 items-center gap-3 rounded-full border border-linha bg-white px-5 py-2.5 focus-within:border-tinta">
          <Search className="size-4 text-cinza" aria-hidden />
          <span className="sr-only">Buscar documentos</span>
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por objeto, número ou processo" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex flex-wrap gap-3">
          <label className="sr-only" htmlFor="f-ano">Ano</label>
          <select id="f-ano" value={ano} onChange={(e) => setAno(e.target.value)} className={seletor}>
            {anos.map((a) => <option key={a} value={a}>{a === "Todos" ? "Todos os anos" : a}</option>)}
          </select>
          <label className="sr-only" htmlFor="f-sit">Situação</label>
          <select id="f-sit" value={sit} onChange={(e) => setSit(e.target.value)} className={seletor}>
            {situacoes.map((s) => <option key={s} value={s}>{s === "Todas" ? "Todas as situações" : s}</option>)}
          </select>
          <button type="button" onClick={() => baixarCsv(filtrados)} className="inline-flex items-center gap-2 rounded-full bg-tinta px-5 py-2.5 text-sm font-semibold text-papel transition-colors hover:bg-marinho">
            <Download className="size-4" aria-hidden /> Exportar CSV
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm text-cinza" aria-live="polite">
        {filtrados.length} {filtrados.length === 1 ? "documento" : "documentos"}
        {atualizadoEm && <> · dados do PNCP atualizados em {formatarData(atualizadoEm)}</>}
      </p>

      <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-linha bg-white">
        <table className="w-full text-left text-sm">
          <thead className="hidden bg-areia text-xs uppercase tracking-[0.12em] text-cinza md:table-header-group">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Documento</th>
              <th scope="col" className="px-6 py-4 font-semibold">Objeto</th>
              <th scope="col" className="px-6 py-4 font-semibold">Situação</th>
              <th scope="col" className="px-6 py-4 text-right font-semibold">Valor</th>
              <th scope="col" className="px-6 py-4"><span className="sr-only">Link</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-linha">
            {filtrados.map((d) => (
              <tr key={d.id} className="grid gap-2 p-5 transition-colors hover:bg-papel md:table-row md:p-0">
                <td className="md:px-6 md:py-5 md:align-top">
                  <p className="font-semibold">{d.tipo}</p>
                  <p className="text-cinza">nº {d.numero} · {formatarData(d.publicacao)}</p>
                </td>
                <td className="max-w-xl md:px-6 md:py-5 md:align-top">
                  <p className="line-clamp-3">{d.objeto}</p>
                  {"fornecedor" in d && d.fornecedor && <p className="mt-1 text-xs text-cinza">Contratada: {d.fornecedor}</p>}
                </td>
                <td className="md:px-6 md:py-5 md:align-top">
                  <span className={clsx("inline-block rounded-full px-3 py-1 text-xs font-semibold", corSituacao(d.situacao))}>{d.situacao}</span>
                </td>
                <td className="tabular-nums md:px-6 md:py-5 md:text-right md:align-top">{formatarReais(d.valorHomologado || d.valorEstimado)}</td>
                <td className="md:px-6 md:py-5 md:align-top">
                  <a href={d.pncp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-agua hover:underline">
                    PNCP <ExternalLink className="size-3.5" aria-hidden />
                    <span className="sr-only">: {d.tipo} {d.numero} (abre em nova aba)</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtrados.length === 0 && <p className="p-10 text-center text-cinza">Nenhum documento encontrado com esses filtros.</p>}
      </div>
    </div>
  );
}
