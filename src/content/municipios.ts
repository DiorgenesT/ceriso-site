// Os 29 municípios consorciados. A geometria do mapa vem de mapa-geo.ts (IBGE/OSM).

export type Municipio = {
  slug: string;
  nome: string;
  fundacao: string;
  apelido?: string;
  resumo: string;
  lat: number;
  lon: number;
};

export const municipios: Municipio[] = [
  { slug: "alambari", nome: "Alambari", fundacao: "1961", lat: -23.55, lon: -47.9, resumo: "Município de forte influência rural, com paisagens naturais e produção de café, cana-de-açúcar e hortaliças." },
  { slug: "aluminio", nome: "Alumínio", fundacao: "1962", lat: -23.53, lon: -47.26, resumo: "Polo da indústria metalúrgica, abriga uma das maiores fábricas de alumínio do Brasil." },
  { slug: "aracariguama", nome: "Araçariguama", fundacao: "1891", lat: -23.44, lon: -47.06, resumo: "Vocação agrícola, produção de alimentos e frutas, e paisagens rurais que atraem visitantes." },
  { slug: "aracoiaba-da-serra", nome: "Araçoiaba da Serra", fundacao: "1890", lat: -23.51, lon: -47.61, resumo: "Tradição agrícola no cultivo de frutas e hortaliças, cercada por paisagens naturais." },
  { slug: "bofete", nome: "Bofete", fundacao: "1889", lat: -23.1, lon: -48.26, resumo: "Ambiente rural e tranquilo, economia movida pela agricultura e hospitalidade reconhecida." },
  { slug: "boituva", nome: "Boituva", fundacao: "1891", apelido: "Capital do Paraquedismo", lat: -23.28, lon: -47.67, resumo: "Referência nacional em paraquedismo, com forte presença na agricultura." },
  { slug: "cabreuva", nome: "Cabreúva", fundacao: "1953", lat: -23.31, lon: -47.13, resumo: "Montanhas, áreas de lazer ao ar livre, turismo e produção de frutas." },
  { slug: "capela-do-alto", nome: "Capela do Alto", fundacao: "1894", lat: -23.47, lon: -47.73, resumo: "Tradição no cultivo de milho e café, com economia voltada ao agronegócio." },
  { slug: "cerquilho", nome: "Cerquilho", fundacao: "1891", lat: -23.17, lon: -47.74, resumo: "Grande produtor de cana-de-açúcar, com festas tradicionais que celebram sua história." },
  { slug: "cesario-lange", nome: "Cesário Lange", fundacao: "1892", lat: -23.23, lon: -47.95, resumo: "Vocação agrícola e turismo rural em meio a belas paisagens." },
  { slug: "conchas", nome: "Conchas", fundacao: "1887", lat: -23.02, lon: -48.01, resumo: "Nome inspirado nas conchas do rio local; convite ao turismo rural e ecológico." },
  { slug: "ibiuna", nome: "Ibiúna", fundacao: "1857", apelido: "Capital do Caqui", lat: -23.66, lon: -47.22, resumo: "Represas e áreas de preservação, esportes aquáticos, ecoturismo e agricultura." },
  { slug: "ipero", nome: "Iperó", fundacao: "1965", lat: -23.35, lon: -47.69, resumo: "Guarda a Floresta Nacional de Ipanema e um rico patrimônio histórico." },
  { slug: "itu", nome: "Itu", fundacao: "1610", apelido: "Cidade dos Exageros", lat: -23.26, lon: -47.3, resumo: "Centro histórico colonial preservado e polo turístico e cultural." },
  { slug: "jumirim", nome: "Jumirim", fundacao: "1993", lat: -23.09, lon: -47.78, resumo: "Uma das cidades mais novas do estado, organizada e com forte senso de comunidade." },
  { slug: "laranjal-paulista", nome: "Laranjal Paulista", fundacao: "1917", lat: -23.05, lon: -47.84, resumo: "Terras férteis e tradições culturais marcantes, polo agrícola da região." },
  { slug: "mairinque", nome: "Mairinque", fundacao: "1890", lat: -23.55, lon: -47.18, resumo: "História ferroviária e industrial, hoje polo logístico e econômico." },
  { slug: "pereiras", nome: "Pereiras", fundacao: "1877", lat: -23.08, lon: -47.98, resumo: "Clima pacato, raízes agrícolas e festas tradicionais." },
  { slug: "piedade", nome: "Piedade", fundacao: "1840", lat: -23.71, lon: -47.43, resumo: "Cachoeiras, reservas ambientais e produção agrícola sustentável." },
  { slug: "porangaba", nome: "Porangaba", fundacao: "1872", lat: -23.18, lon: -48.12, resumo: "Paisagens encantadoras e eventos que celebram sua herança histórica." },
  { slug: "porto-feliz", nome: "Porto Feliz", fundacao: "1797", lat: -23.21, lon: -47.52, resumo: "Ponto de partida das monções, com centro histórico preservado." },
  { slug: "salto-de-pirapora", nome: "Salto de Pirapora", fundacao: "1889", lat: -23.65, lon: -47.57, resumo: "Sede do CERISO, com base agrícola e industrial e belas quedas d'água." },
  { slug: "sao-roque", nome: "São Roque", fundacao: "1657", apelido: "Terra do Vinho", lat: -23.53, lon: -47.14, resumo: "Vinícolas, eventos culturais e o Morro do Cruzeiro." },
  { slug: "sarapui", nome: "Sarapuí", fundacao: "1865", lat: -23.64, lon: -47.82, resumo: "Tradição rural, agronegócio e clima acolhedor." },
  { slug: "sorocaba", nome: "Sorocaba", fundacao: "1654", lat: -23.5, lon: -47.46, resumo: "Um dos principais polos industriais de São Paulo, referência em qualidade de vida." },
  { slug: "tatui", nome: "Tatuí", fundacao: "1826", apelido: "Capital da Música", lat: -23.36, lon: -47.86, resumo: "Sede do Conservatório de Tatuí, referência nacional e internacional." },
  { slug: "tiete", nome: "Tietê", fundacao: "1842", lat: -23.1, lon: -47.71, resumo: "Arquitetura histórica, carnaval e festas religiosas tradicionais." },
  { slug: "vargem-grande-paulista", nome: "Vargem Grande Paulista", fundacao: "1981", lat: -23.6, lon: -46.99, resumo: "Cidade jovem e estratégica, polo logístico com áreas verdes preservadas." },
  { slug: "votorantim", nome: "Votorantim", fundacao: "1965", lat: -23.55, lon: -47.44, resumo: "Cidade industrial que combina modernidade, lazer e cultura." },
];
