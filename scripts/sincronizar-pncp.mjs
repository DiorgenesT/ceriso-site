// Baixa do PNCP (Portal Nacional de Contratações Públicas) as contratações, atas e contratos
// publicados pelo CERISO e grava em src/content/pncp.json. Roda antes de cada build;
// se a API falhar, mantém o arquivo anterior para o build não quebrar.
//
// Uso: npm run pncp  (rodar no deploy ou diariamente em CI)
import { readFile, writeFile } from "node:fs/promises";

const CNPJ = "67362418000110";
const API = "https://pncp.gov.br/api/consulta/v1";
const SAIDA = new URL("../src/content/pncp.json", import.meta.url);
const INICIO = new Date("2024-01-01");
const MODALIDADES = Array.from({ length: 13 }, (_, i) => i + 1);

const ymd = (d) => d.toISOString().slice(0, 10).replaceAll("-", "");

// A API aceita no máximo 365 dias por consulta.
function janelas() {
  const lista = [];
  for (let ini = new Date(INICIO); ini < new Date(); ) {
    const fim = new Date(Math.min(ini.getTime() + 364 * 864e5, Date.now()));
    lista.push([ymd(ini), ymd(fim)]);
    ini = new Date(fim.getTime() + 864e5);
  }
  return lista;
}

async function paginas(caminho) {
  const itens = [];
  for (let pagina = 1; ; pagina++) {
    const r = await fetch(`${API}${caminho}&pagina=${pagina}&tamanhoPagina=50`, { signal: AbortSignal.timeout(40_000) });
    if (r.status === 204) break;
    if (!r.ok) throw new Error(`${r.status} em ${caminho}`);
    const corpo = await r.json();
    itens.push(...(corpo.data ?? []));
    if (pagina >= (corpo.totalPaginas ?? 1)) break;
  }
  return itens;
}

const linkCompra = (c) => `https://pncp.gov.br/app/editais/${CNPJ}/${c.anoCompra}/${c.sequencialCompra}`;

function situacao(c) {
  if (/suspens/i.test(c.situacaoCompraNome)) return "Suspensa";
  if (/revogad|anulad/i.test(c.situacaoCompraNome)) return "Revogada";
  if (c.valorTotalHomologado) return "Homologada";
  if (c.dataEncerramentoProposta && new Date(c.dataEncerramentoProposta) > new Date()) return "Aberta";
  return "Publicada";
}

const limpar = (texto = "") => texto.replace(/^[:\s]+/, "").replace(/\s+/g, " ").trim();

async function principal() {
  // Consultas em paralelo: a API é lenta, mas aguenta algumas dezenas simultâneas.
  const consultas = janelas().flatMap(([ini, fim]) => [
    ...MODALIDADES.map((m) =>
      paginas(`/contratacoes/publicacao?dataInicial=${ini}&dataFinal=${fim}&cnpj=${CNPJ}&codigoModalidadeContratacao=${m}`).then((r) => ["c", r]),
    ),
    paginas(`/contratos?dataInicial=${ini}&dataFinal=${fim}&cnpjOrgao=${CNPJ}`).then((r) => ["k", r]),
  ]);
  const resultados = await Promise.all(consultas);
  const compras = resultados.filter(([t]) => t === "c").flatMap(([, r]) => r);
  const contratos = resultados.filter(([t]) => t === "k").flatMap(([, r]) => r);

  const documentos = [
    ...compras.map((c) => ({
      id: c.numeroControlePNCP,
      tipo: c.modalidadeNome,
      numero: `${c.numeroCompra}/${c.anoCompra}`,
      processo: c.processo ?? null,
      objeto: limpar(c.objetoCompra),
      situacao: situacao(c),
      publicacao: c.dataPublicacaoPncp.slice(0, 10),
      abertura: c.dataAberturaProposta?.slice(0, 10) ?? null,
      encerramento: c.dataEncerramentoProposta?.slice(0, 10) ?? null,
      valorEstimado: c.valorTotalEstimado ?? null,
      valorHomologado: c.valorTotalHomologado ?? null,
      registroDePrecos: Boolean(c.srp),
      pncp: linkCompra(c),
      sistemaOrigem: c.linkSistemaOrigem || null,
    })),
    ...contratos.map((k) => ({
      id: k.numeroControlePNCP,
      tipo: k.tipoContrato?.nome ?? "Contrato",
      numero: k.numeroContratoEmpenho.includes("/") ? k.numeroContratoEmpenho : `${k.numeroContratoEmpenho}/${k.anoContrato}`,
      processo: k.processo ?? null,
      objeto: limpar(k.objetoContrato),
      situacao: k.dataVigenciaFim && new Date(k.dataVigenciaFim) < new Date() ? "Encerrado" : "Vigente",
      publicacao: k.dataPublicacaoPncp.slice(0, 10),
      abertura: k.dataVigenciaInicio ?? null,
      encerramento: k.dataVigenciaFim ?? null,
      valorEstimado: null,
      valorHomologado: k.valorGlobal ?? null,
      registroDePrecos: false,
      pncp: `https://pncp.gov.br/app/contratos/${CNPJ}/${k.anoContrato}/${k.sequencialContrato}`,
      sistemaOrigem: null,
      fornecedor: k.nomeRazaoSocialFornecedor ?? null,
    })),
  ].sort((a, b) => b.publicacao.localeCompare(a.publicacao));

  await writeFile(SAIDA, JSON.stringify({ atualizadoEm: new Date().toISOString(), documentos }, null, 2) + "\n");
  console.log(`PNCP: ${compras.length} contratações e ${contratos.length} contratos sincronizados.`);
}

principal().catch(async (erro) => {
  const existe = await readFile(SAIDA).then(() => true, () => false);
  console.warn(`PNCP indisponível (${erro.message}). ${existe ? "Mantendo dados anteriores." : "Gerando arquivo vazio."}`);
  if (!existe) await writeFile(SAIDA, JSON.stringify({ atualizadoEm: null, documentos: [] }, null, 2) + "\n");
});
