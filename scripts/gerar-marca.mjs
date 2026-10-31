// Gera os arquivos da marca a partir do logotipo reconstruído (src/components/ui/logo-geo.ts,
// exportado por ~/projetos/motion/ceriso/scripts/exportar-logo.mts):
//   - public/img/marca/ceriso.svg e ceriso-claro.svg (logotipo completo, para download/uso externo)
// e o favicon, a partir do símbolo (arco e aperto de mão), o mesmo do bloco "Quem somos":
//   - src/app/icon.svg        símbolo em vetor; no tema escuro do navegador o arco fica branco
//   - src/app/favicon.ico     16, 32 e 48 px (PNG dentro do ICO), sobre fundo claro arredondado
//   - src/app/apple-icon.png  180 px, fundo opaco (exigência do iOS)
//   - public/img/marca/icone-192.png e icone-512.png (manifesto, compartilhamento)
// Uso: npm run marca
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const fonte = readFileSync("src/components/ui/logo-geo.ts", "utf8");
const geo = JSON.parse(fonte.slice(fonte.indexOf("{"), fonte.lastIndexOf("}") + 1));
const MARINHO = "#00194d";
const VERDE = "#00a390";
const PAPEL = "#faf8f3";
// recorte quadrado em volta do símbolo (o mesmo enquadramento do SimboloCeriso)
const VB = "-7 1 164 164";

// a mão verde recorta uma fresta fina no arco; dedos verdes em cápsulas e frestas nos dedos
// marinho, como no desenho original (mesma montagem do componente Marca)
const capsulas = geo.capsulas
  .map(([cx, cy, c, e, a]) => `<rect x="${cx - c / 2}" y="${cy - e / 2}" width="${c}" height="${e}" rx="${e / 2}" transform="rotate(${a} ${cx} ${cy})"/>`)
  .join("");
const simbolo = (corArco, extraArco = "") => `
  <defs>
    <clipPath id="s"><path d="${geo.semDedos}"/></clipPath>
    <g id="v"><g clip-path="url(#s)">${geo.simboloVerde.map((d) => `<path d="${d}"/>`).join("")}</g>${capsulas}</g>
    <mask id="f" maskUnits="userSpaceOnUse" x="-40" y="-40" width="240" height="245">
      <rect x="-40" y="-40" width="240" height="245" fill="#fff"/>
      <use href="#v" fill="#000" stroke="#000" stroke-width="${geo.fresta * 2}" stroke-linejoin="round"/>
      ${geo.dedos.map((d) => `<path d="${d}" stroke="#000" stroke-width="0.95" stroke-linecap="round"/>`).join("")}
      <path d="${geo.sobDedos}" fill="#000"/>
    </mask>
  </defs>
  <g fill-rule="evenodd">
    <g mask="url(#f)" fill="${corArco}" ${extraArco}>${geo.simbolo.map((d) => `<path d="${d}"/>`).join("")}</g>
    <use href="#v" fill="${VERDE}"/>
  </g>`;

// logotipo completo (símbolo + CERISO + subtítulo)
const logotipo = (cor) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408 165"><title>CERISO</title>
  ${simbolo(cor)}
  <path fill="${cor}" d="${[...geo.letras, geo.subtitulo].join("")}"/>
</svg>
`;
writeFileSync("public/img/marca/ceriso.svg", logotipo(MARINHO));
writeFileSync("public/img/marca/ceriso-claro.svg", logotipo("#ffffff"));
await sharp(Buffer.from(logotipo(MARINHO)), { density: 300 }).resize(1224).webp({ quality: 92 }).toFile("public/img/marca/ceriso.webp");
await sharp(Buffer.from(logotipo("#ffffff")), { density: 300 }).resize(1224).webp({ quality: 92 }).toFile("public/img/marca/ceriso-claro.webp");

// SVG: transparente, arco marinho; no tema escuro, arco branco
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}">
  <style>.arco{fill:${MARINHO}}@media (prefers-color-scheme:dark){.arco{fill:#fff}}</style>
  ${simbolo(MARINHO, 'class="arco"')}
</svg>
`;
writeFileSync("src/app/icon.svg", svg);

// PNG: símbolo sobre um quadrado claro arredondado (legível em abas claras e escuras)
const comFundo = (margem, raio) => {
  const [x, y, w] = VB.split(" ").map(Number);
  const lado = w * (1 + 2 * margem);
  const ox = x - w * margem;
  const oy = y - w * margem;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ox} ${oy} ${lado} ${lado}">
    <rect x="${ox}" y="${oy}" width="${lado}" height="${lado}" rx="${lado * raio}" fill="${PAPEL}"/>
    ${simbolo(MARINHO)}
  </svg>`;
};
const png = (svgTexto, px) => sharp(Buffer.from(svgTexto), { density: 72 * (px / 40) }).resize(px, px).png().toBuffer();

// ICO com PNGs embutidos (aceito por todos os navegadores atuais)
const tamanhos = [16, 32, 48];
const imagens = await Promise.all(tamanhos.map((t) => png(comFundo(0.06, 0.22), t)));
const cabecalho = Buffer.alloc(6 + 16 * imagens.length);
cabecalho.writeUInt16LE(0, 0);
cabecalho.writeUInt16LE(1, 2);
cabecalho.writeUInt16LE(imagens.length, 4);
let deslocamento = cabecalho.length;
imagens.forEach((img, i) => {
  const o = 6 + i * 16;
  cabecalho.writeUInt8(tamanhos[i], o);
  cabecalho.writeUInt8(tamanhos[i], o + 1);
  cabecalho.writeUInt16LE(1, o + 4);
  cabecalho.writeUInt16LE(32, o + 6);
  cabecalho.writeUInt32LE(img.length, o + 8);
  cabecalho.writeUInt32LE(deslocamento, o + 12);
  deslocamento += img.length;
});
writeFileSync("src/app/favicon.ico", Buffer.concat([cabecalho, ...imagens]));

// iOS: fundo opaco e sem cantos (o sistema arredonda)
writeFileSync("src/app/apple-icon.png", await png(comFundo(0.16, 0), 180));
writeFileSync("public/img/marca/icone-192.png", await png(comFundo(0.14, 0.22), 192));
writeFileSync("public/img/marca/icone-512.png", await png(comFundo(0.14, 0.22), 512));
console.log("marca: public/img/marca/ceriso{,-claro}.{svg,webp}; favicon: src/app/{icon.svg,favicon.ico,apple-icon.png} e public/img/marca/icone-{192,512}.png");
