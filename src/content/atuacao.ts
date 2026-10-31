// Soluções compartilhadas (contratações reais publicadas no PNCP) e projetos regionais.
// Os dados da ficha (modalidade, número, situação, valores, link) vêm de pncp.json,
// cruzados pelo número de controle PNCP; aqui fica só o texto editorial.

import pncp from "./pncp.json";

export type DocumentoPncp = (typeof pncp.documentos)[number];

export type Solucao = {
  slug: string;
  titulo: string;
  area: string;
  chamada: string;
  resumo: string;
  inclui: string[];
  /** Números de controle PNCP: a licitação primeiro, depois contratos/atas. */
  pncp: string[];
  documento?: { rotulo: string; href: string };
};

export const solucoes: Solucao[] = [
  {
    slug: "servicos-medicos",
    titulo: "Serviços médicos e de saúde",
    area: "Saúde",
    chamada: "Plantões, especialidades e atenção básica",
    resumo:
      "Contratação compartilhada de serviços médicos operacionalizada pelo consórcio, com valores de referência na Tabela de Serviços Médicos (TSM) de cada município.",
    inclui: ["Serviços médicos e de saúde nos municípios consorciados", "Tabela de Serviços Médicos (TSM) por município", "Gestão contratual centralizada no CERISO"],
    pncp: ["67362418000110-1-000010/2026", "67362418000110-2-000004/2026"],
    documento: { rotulo: "Tabela de Serviços Médicos", href: "https://drive.google.com/drive/folders/1ND-IAX3MSDu49mUeiKO98243i5qBijuS" },
  },
  {
    slug: "apoio-tecnico-operacional",
    titulo: "Apoio técnico e operacional",
    area: "Gestão",
    chamada: "Atividades-meio para os municípios",
    resumo:
      "Entidade filantrópica contratada para serviços de apoio técnico, operacional, administrativo e serviços gerais, sempre em atividades-meio acessórias às competências dos municípios.",
    inclui: ["Apoio técnico e operacional", "Apoio administrativo", "Serviços gerais", "Sem transferência de atribuições indelegáveis do poder público"],
    pncp: ["67362418000110-1-000001/2026", "67362418000110-2-000002/2026"],
  },
  {
    slug: "conteineres-residuos",
    titulo: "Contêineres para resíduos",
    area: "Meio ambiente",
    chamada: "Registro de preços regional",
    resumo:
      "Registro de preços de contêineres de 950 a 1.050 litros, em polietileno de alta densidade, para a coleta de resíduos sólidos nos municípios.",
    inclui: ["Contêineres de 950 a 1.050 litros", "Polietileno injetado de alta densidade", "Compra conforme a necessidade de cada município"],
    pncp: ["67362418000110-1-000002/2025"],
  },
  {
    slug: "computadores",
    titulo: "Computadores e notebooks",
    area: "Tecnologia",
    chamada: "Registro de preços com garantia on-site",
    resumo:
      "Registro de preços de desktops com monitor e notebooks corporativos, com periféricos, Windows 11 Pro e garantia on-site de 12 meses, para o CERISO e os municípios.",
    inclui: ["Desktops corporativos com monitor", "Notebooks corporativos", "Mouse, teclado e mochila", "Licença Windows 11 Pro OEM", "Garantia on-site de 12 meses"],
    pncp: ["67362418000110-1-000012/2026"],
  },
  {
    slug: "material-escolar",
    titulo: "Kits de material escolar",
    area: "Educação",
    chamada: "Registro de preços para as redes municipais",
    resumo:
      "Registro de preços de kits de material escolar para as secretarias de Educação dos municípios consorciados.",
    inclui: ["Kits de material escolar", "Atendimento às secretarias municipais de Educação"],
    pncp: ["67362418000110-1-000003/2025"],
  },
];

export type Projeto = { id: string; titulo: string; texto: string; foto: string; documento: { rotulo: string; href: string } };

export const projetos: Projeto[] = [
  {
    id: "residuos",
    titulo: "Plano Regional de Resíduos Sólidos",
    texto: "Planejamento regional para coleta, destinação e reciclagem, com escala que nenhum município teria sozinho.",
    foto: "/img/fotos/residuos-solidos.webp",
    documento: { rotulo: "Plano Regional (PRGIRS)", href: "https://drive.google.com/drive/folders/1pJ8GKLQEYOAS562SXOH5K2rff3-uxZDc" },
  },
  {
    id: "saneamento",
    titulo: "Planos de Saneamento Básico",
    texto: "Revisão dos Planos Municipais de Saneamento: água, esgoto, drenagem e resíduos.",
    foto: "/img/fotos/saneamento.webp",
    documento: { rotulo: "Planos de Saneamento", href: "https://drive.google.com/drive/folders/1jEwVwURr3aJOe48mdhfbvPXHR4-HCSfa" },
  },
  {
    id: "drenagem",
    titulo: "Macrodrenagem urbana e rural",
    texto: "Planos diretores para prevenir enchentes e proteger mananciais.",
    foto: "/img/fotos/macrodrenagem-rural.webp",
    documento: { rotulo: "Macrodrenagem", href: "https://drive.google.com/drive/folders/1Jp3JSx4RRKzNo83yOzglL_AF9SfGxgBj" },
  },
  {
    id: "coleta",
    titulo: "Coleta mecanizada",
    texto: "Projeto para modernizar a limpeza urbana e reduzir custos operacionais.",
    foto: "/img/fotos/coleta-mecanizada.webp",
    documento: { rotulo: "Projeto de Coleta Mecanizada", href: "https://drive.google.com/drive/folders/1WaodWDpvvBppiZU1du5p12iZkLasY7Wa" },
  },
];

export const areas = [
  { titulo: "Saúde", texto: "Serviços assistenciais e profissionais." },
  { titulo: "Meio ambiente e limpeza urbana", texto: "Resíduos, coleta e licenciamento ambiental." },
  { titulo: "Educação", texto: "Materiais e apoio à gestão educacional." },
  { titulo: "Tecnologia", texto: "Equipamentos e sistemas para a gestão." },
  { titulo: "Desenvolvimento urbano", texto: "Saneamento, drenagem e infraestrutura." },
  { titulo: "Gestão e planejamento", texto: "Estudos e apoio técnico à administração." },
] as const;

export const passos = [
  { titulo: "Identificação", texto: "O município compartilha demandas e dificuldades de contratação com a equipe do CERISO." },
  { titulo: "Planejamento conjunto", texto: "O consórcio identifica pontos em comum e estuda a viabilidade da contratação compartilhada." },
  { titulo: "Licitação própria", texto: "O CERISO prepara os estudos técnicos e conduz a licitação pela Lei 14.133/2021, publicada no PNCP." },
  { titulo: "Participação", texto: "O consorciado utiliza a solução, atendidas as condições e os requisitos de participação." },
  { titulo: "Contratação", texto: "O município formaliza a contratação e acompanha a execução com o consórcio." },
] as const;

const porId = new Map(pncp.documentos.map((d) => [d.id, d]));
export const documentosDa = (s: Solucao) => s.pncp.map((id) => porId.get(id)).filter((d): d is DocumentoPncp => Boolean(d));
export const pncpAtualizadoEm = pncp.atualizadoEm;
export const documentosPncp = pncp.documentos;
