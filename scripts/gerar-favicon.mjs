// Gera o favicon do CERISO a partir do símbolo do logotipo (arco e aperto de mão), o mesmo
// do bloco "Quem somos", usando os caminhos vetorizados de src/components/ui/logo-geo.ts.
//   - src/app/icon.svg        símbolo em vetor; no tema escuro do navegador o arco fica branco
//   - src/app/favicon.ico     16, 32 e 48 px (PNG dentro do ICO), sobre fundo claro arredondado
//   - src/app/apple-icon.png  180 px, fundo opaco (exigência do iOS)
//   - public/img/marca/icone-192.png e icone-512.png (manifesto, compartilhamento)
// Uso: npm run favicon
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const fonte = readFileSync("src/components/ui/logo-geo.ts", "utf8");
const geo = JSON.parse(fonte.slice(fonte.indexOf("{"), fonte.lastIndexOf("}") + 1));
const MARINHO = "#00194d";
const VERDE = "#00a390";
const PAPEL = "#faf8f3";
// recorte quadrado em volta do símbolo (o mesmo enquadramento do SimboloCeriso)
const VB = "-7 1 164 164";

// a mão verde recorta uma fresta fina no arco, como no desenho original
const simbolo = (corArco, extraArco = "") => `
  <defs>
    <g id="v">${geo.simboloVerde.map((d) => `<path d="${d}"/>`).join("")}</g>
    <mask id="f" maskUnits="userSpaceOnUse" x="-40" y="-40" width="240" height="245">
      <rect x="-40" y="-40" width="240" height="245" fill="#fff"/>
      <use href="#v" fill="#000" stroke="#000" stroke-width="${geo.fresta * 2}" stroke-linejoin="round"/>
    </mask>
  </defs>
  <g fill-rule="evenodd">
    <g mask="url(#f)" fill="${corArco}" ${extraArco}>${geo.simbolo.map((d) => `<path d="${d}"/>`).join("")}</g>
    <use href="#v" fill="${VERDE}"/>
  </g>`;

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
console.log("favicon: src/app/{icon.svg,favicon.ico,apple-icon.png} e public/img/marca/icone-{192,512}.png");
