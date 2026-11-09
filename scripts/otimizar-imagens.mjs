// Converte as imagens originais do WordPress (_ref/img) para WebP no tamanho de uso.
import sharp from "sharp";
import { readdirSync } from "node:fs";
import { join } from "node:path";

const origem = new URL("../../_ref/img/", import.meta.url).pathname;
const destino = new URL("../public/img/", import.meta.url).pathname;

const slug = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/-1$|-$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const municipios = new Set(["Alambari","Aluminio","Aracariguama","Aracoiaba-da-Serra","Bofete","Boituva","Cabreuva","Capela-do-Alto","Cerquilho","Cesario-Lange","Conchas","Ibiuna","Ipero","Itu","Jumirim","Laranjal-Paulista","Mairinque","Pereiras","Piedade","Porangaba","Porto-Feliz","Salto-de-Pirapora","Sao-Roque-1","Sarapui","Sorocaba","Tatui","Tiete","Vargem-Grande-Paulista","Votorantim"]);
const fotos = {
  "Sobre-nos.png": "assembleia-prefeitos",
  "reuniao-encontro-de-gestores.png": "posse-diretoria-2025",
  "Imagem-residuos-solidos-site.png": "residuos-solidos",
  "Flux_Dev_Ilustrao_realista_de_um_sistema_mecanizado_de_coleta__1.jpg": "coleta-mecanizada",
  "african-woman-pouring-water-recipient-outdoors-scaled.jpg": "saneamento",
  "ChatGPT-Image-10-de-abr.-de-2025-17_01_06.png": "macrodrenagem-rural",
  "whatsapp_image_2019_05_29_at_11_24_00.jpeg": "macrodrenagem-urbana",
};

// Retratos da diretoria (_ref/diretoria), recortados em 4:5 a partir do topo.
// Fontes: Matheus Marum, retrato oficial do mandato 2025–2028 (site da Prefeitura de Salto de
// Pirapora; recorte sem a moldura); Nykson Marques, site da Fundação Beta (foto de palco);
// Osmar Pasqualino, página do Gabinete (Prefeitura de Pereiras); Mário Pires,
// página do Gabinete (Prefeitura de Ibiúna); Berto Filho, quadro da entrevista à TVS+ (jul/2025),
// provisório até o CERISO enviar o retrato oficial; José Carlos de Quevedo Jr., foto de candidato
// (padrão TSE, 161×225) enviada pelo responsável pelo projeto: ampliada com lanczos + nitidez leve.
const retratos = [
  { arquivo: "matheus-sp.png", nome: "matheus-marum", recorte: { left: 82, top: 82, width: 476, height: 595 } },
  { arquivo: "nykison-fundacaobeta.jpeg", nome: "nykison-linhares", recorte: { left: 290, top: 380, width: 520, height: 650 } },
  { arquivo: "osmar-pereiras.jpeg", nome: "osmar-pasqualino", recorte: { left: 106, top: 0, width: 470, height: 588 } },
  { arquivo: "quevedo-tse.jpg", nome: "quevedo", recorte: { left: 0, top: 0, width: 161, height: 201 }, ampliar: true },
  { arquivo: "tvs-laranjal.jpg", nome: "berto-filho", recorte: { left: 130, top: 0, width: 400, height: 500 } },
  { arquivo: "mario-ibiuna.jpg", nome: "mario-pires", recorte: { left: 110, top: 40, width: 548, height: 685 } },
];
const pastaRetratos = new URL("../../_ref/diretoria/", import.meta.url).pathname;
for (const r of retratos) {
  let img = sharp(join(pastaRetratos, r.arquivo)).extract(r.recorte);
  img = r.ampliar
    ? img.resize({ width: 480, kernel: "lanczos3" }).sharpen({ sigma: 0.8 })
    : img.resize({ width: 600, withoutEnlargement: true });
  await img.webp({ quality: 82 }).toFile(join(destino, "diretoria", `${r.nome}.webp`));
}

for (const arquivo of readdirSync(origem)) {
  const base = arquivo.replace(/\.(png|jpe?g)$/i, "");
  const entrada = join(origem, arquivo);
  if (municipios.has(base)) {
    await sharp(entrada).resize(240, 240, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 82 }).toFile(join(destino, "brasoes", `${slug(base)}.webp`));
  } else if (fotos[arquivo]) {
    const nome = fotos[arquivo];
    await sharp(entrada).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 78 })
      .toFile(join(destino, "fotos", nome) + ".webp");
  }
}
console.log("ok");
