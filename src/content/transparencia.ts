// Acervo documental. Hoje os arquivos ficam em pastas do Google Drive do CERISO;
// quando houver um repositório próprio, basta trocar os `href`.

export type Acervo = { titulo: string; texto: string; href: string };

const drive = (id: string) => `https://drive.google.com/drive/folders/${id}`;

export const transparencia: Acervo[] = [
  { titulo: "Receitas", texto: "Fontes de arrecadação que sustentam as atividades do consórcio.", href: drive("1hDNGGIlw-0imDcDxGDA9PpFG7K6u3jmv") },
  { titulo: "Despesas", texto: "Aplicação dos recursos no desenvolvimento das ações.", href: drive("1qH154wRn8HhMw5q7WLrnS4_gw_TXV3iY") },
  { titulo: "Prestação de contas", texto: "Demonstração da gestão dos recursos públicos.", href: drive("1bHeagKXaiRRNr7EuTBMLocDoYoDj7Xjj") },
  { titulo: "Balancetes", texto: "Relatórios de equilíbrio financeiro.", href: drive("1w3G8RYlwLjnrecvBezFD-uzxC4VMnHQ5") },
  { titulo: "Contratos", texto: "Acordos para a execução de serviços essenciais.", href: drive("1hgHh3K52-DpraI0VoLFTtnSrjjYsfhqY") },
  { titulo: "Contratos de rateio", texto: "Compromissos de uso compartilhado dos recursos.", href: drive("1MRGwmuxMb0APQkrg7qffgpCG9o75JNao") },
  { titulo: "Atas de registro de preços", texto: "Atas para as demandas do consórcio e dos entes consorciados.", href: drive("1xHEV1p2otSV9QZ40oVs8bdCDsaNKHx3E") },
  { titulo: "Editais de licitação", texto: "Processos licitatórios em andamento e encerrados.", href: drive("1I3697IicoZfr8drtm_DmOnMHNnq9KKk2") },
];

export const publicacoes: Acervo[] = [
  { titulo: "Estatuto e Protocolo de Intenções", texto: "Normas e diretrizes fundamentais do consórcio.", href: drive("11gnzkROWKg8PMRym9Dbm_SH7_-DrUyB1") },
  { titulo: "Atas de reuniões", texto: "Deliberações e decisões das assembleias.", href: drive("1z3NkKBW9gfx9fgUPUh-zwu2CA_Qmnkzh") },
  { titulo: "Editais e convocações", texto: "Comunicados para assembleias e reuniões.", href: drive("11cidLXgofZaI8qa0-BhexYW6rRJLz9hY") },
  { titulo: "Resoluções", texto: "Determinações que formalizam decisões institucionais.", href: drive("1fQnwS3y1Vp9I6WhXkrv2x-GaL6LpA7vB") },
  { titulo: "Processos seletivos", texto: "Contratação temporária para o quadro do CERISO.", href: drive("1ShFuA8eeUmc1qiJsCT-aJrHlIVc49f_h") },
  { titulo: "Portarias e nomeações", texto: "Atos de nomeação e portarias.", href: drive("1VG2sEnmXY3qFFGUi01PHa4w8QUAGssIs") },
  { titulo: "Tabela de Serviços Médicos", texto: "TSM vigente por município consorciado.", href: drive("1ND-IAX3MSDu49mUeiKO98243i5qBijuS") },
  { titulo: "Plano de Contratação Anual", texto: "PCA: planejamento de contratações e licitações.", href: drive("1W3vW007AIm9WWwphlTnfUiFwpe4J6VWw") },
];

export const noticias = [
  {
    slug: "encontro-de-prefeitos-e-posse-da-diretoria",
    data: "2025-02-10", // o WordPress mostra 10/02/2024, mas o mandato empossado é 2025–2027: confirmar
    titulo: "CERISO reúne prefeitos e secretários de Estado e empossa nova diretoria",
    resumo:
      "No auditório do Adimax, em Salto de Pirapora, prefeitos consorciados encontraram a secretária de Infraestrutura e Meio Ambiente, Natália Resende, e o secretário de Parcerias e Investimentos, Rafael Benini. Na assembleia, tomou posse a diretoria do mandato 2025–2027.",
    foto: "/img/fotos/posse-diretoria-2025.webp",
  },
];
