// Conteúdo institucional extraído do site WordPress (ceriso.com.br) em 30/10/2026.
// Itens marcados com `confirmar` precisam de validação do CERISO antes da publicação.

export const FUNDACAO = new Date("1990-11-01");

export function anosDeAtuacao(hoje = new Date()) {
  let anos = hoje.getFullYear() - FUNDACAO.getFullYear();
  if (hoje.getMonth() < FUNDACAO.getMonth()) anos -= 1;
  return anos;
}

export const ceriso = {
  sigla: "CERISO",
  nome: "Consórcio de Estudos, Recuperação e Desenvolvimento da Bacia do Rio Sorocaba e Médio Tietê",
  cnpj: "67.362.418/0001-10",
  missao:
    "Promover a gestão integrada e sustentável dos recursos hídricos da Bacia do Rio Sorocaba e Médio Tietê, por meio de ações colaborativas entre municípios consorciados, visando a preservação ambiental, o desenvolvimento regional e a melhoria da qualidade de vida das comunidades locais.",
  contato: {
    telefone: "(15) 98808-2577",
    telefoneHref: "tel:+5515988082577",
    whatsappHref: "https://wa.me/5515988082577",
    email: "secretaria@ceriso.com.br",
    horario: "Segunda a sexta, das 8h às 17h",
    endereco: "Av. Vicente Leme dos Santos, 324 — Jardim Karina",
    cidade: "Salto de Pirapora — SP, 18162-000",
    mapaHref: "https://www.google.com/maps/search/?api=1&query=Av.+Vicente+Leme+dos+Santos,+324,+Salto+de+Pirapora+SP",
  },
  redes: {
    instagram: "https://www.instagram.com/cerisoconsorcio/",
    reelInstitucional: "https://www.instagram.com/p/DbgK_ePxnDW/",
    facebook: "https://www.facebook.com/CBHSMT",
  },
  transparenciaTempoReal: "https://ceriso.dcfiorilli.com.br:879/transparencia/",
  // Vídeo institucional tocado dentro do site. Com o arquivo original em mãos, rodar
  // `npm run video -- caminho/do/video.mp4` e preencher `arquivo`; até lá, usa o player
  // oficial do Instagram (carregado só quando a pessoa clica em assistir).
  video: {
    arquivo: null as string | null, // ex.: "/video/institucional.mp4"
    poster: "/img/fotos/assembleia-prefeitos.webp",
    embedInstagram: "https://www.instagram.com/p/DbgK_ePxnDW/embed/",
    titulo: "Encontro de prefeitos do CERISO",
  },
} as const;

// Visão e propósito vêm da proposta de redesign (não constam no site atual): confirmar com o CERISO.
export const visao =
  "Ser referência em cooperação intermunicipal, reconhecido pela qualidade das soluções, pela inovação e pela contribuição ao desenvolvimento da região.";
export const proposito =
  "Unir municípios para resolver juntos desafios comuns, gerando economia, eficiência e melhores serviços para a população.";

export const marcos = [
  { ano: "1990", titulo: "Fundação", texto: "Dez municípios da região de Sorocaba se unem em novembro para cuidar juntos da bacia do Rio Sorocaba." },
  { ano: "1995", titulo: "Comitê de Bacias", texto: "A criação do Comitê da Bacia Hidrográfica do Sorocaba e Médio Tietê amplia a articulação para 34 municípios." },
  { ano: "2021", titulo: "Nova Lei de Licitações", texto: "A Lei 14.133/2021 consolida o consórcio como caminho para contratações compartilhadas entre municípios." },
  { ano: "Hoje", titulo: "29 consorciados", texto: "Saúde, meio ambiente, saneamento e drenagem: o consórcio atua como braço técnico e de compras da região." },
] as const;

export type Dirigente = { nome: string; cargo: string; municipio: string; foto?: string };

// Diretoria 2025–2027: notícia de posse publicada no site do CERISO ("Portal").
// Secretário Executivo: Nykison Linhares, informado pelo responsável pelo projeto em 31/10/2026.
// Os documentos públicos até jul/2026 (PNCP: Contrato 004/2026, Pregão 001/2026) ainda trazem
// Hélder Sebastião Santos; confirmar a data da nomeação com o CERISO.
// Fotos: retratos oficiais nos sites das prefeituras (ver scripts/otimizar-imagens.mjs);
// sem foto pública, o card mostra o brasão do município.
export const diretoria: { mandato: string; membros: Dirigente[] } = {
  mandato: "2025 — 2027",
  membros: [
    { nome: "Matheus Marum de Campos", cargo: "Presidente", municipio: "Salto de Pirapora", foto: "/img/diretoria/matheus-marum.webp" },
    { nome: "José Carlos de Quevedo Júnior", cargo: "Vice-presidente de Captação e Gerenciamento de Recursos", municipio: "Araçoiaba da Serra", foto: "/img/diretoria/quevedo.webp" },
    { nome: "Osmar Pasqualino Rodrigues Ramos Júnior", cargo: "Vice-presidente", municipio: "Pereiras", foto: "/img/diretoria/osmar-pasqualino.webp" },
    { nome: "Antônio Valdecir Berto Filho", cargo: "Vice-presidente de Controle de Obras, Projetos e Convênios", municipio: "Laranjal Paulista", foto: "/img/diretoria/berto-filho.webp" },
    { nome: "Mário Pires de Oliveira Filho", cargo: "Vice-presidente de Assuntos Intermunicipais e Comitê da Bacia", municipio: "Ibiúna", foto: "/img/diretoria/mario-pires.webp" },
    { nome: "Nykison Linhares", cargo: "Secretário Executivo", municipio: "CERISO", foto: "/img/diretoria/nykison-linhares.webp" },
  ],
};

export const baseLegal = [
  { norma: "Constituição Federal, arts. 23 e 241", texto: "Competência comum dos entes e gestão associada de serviços públicos por consórcios." },
  { norma: "Lei 11.107/2005", texto: "Lei dos Consórcios Públicos: regras de constituição, contrato de rateio e programa." },
  { norma: "Decreto 6.017/2007", texto: "Regulamenta a Lei 11.107 e detalha a gestão associada." },
  { norma: "Lei 14.133/2021", texto: "Nova Lei de Licitações: reconhece o consórcio como ente que licita e contrata de forma compartilhada." },
  { norma: "Entendimento do TCE-SP", texto: "Legalidade da contratação por consórcios, observados os requisitos legais." },
  { norma: "Jurisprudência", texto: "Acórdãos reafirmam ganho de escala, redução de custos e capacidade técnica." },
] as const;
