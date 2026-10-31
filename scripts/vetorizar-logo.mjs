// Vetoriza o logotipo do CERISO (só existe em PNG 408×165) e gera:
//   - src/components/ui/logo-geo.ts  (caminhos separados por parte, para animar)
//   - public/img/marca/ceriso.svg e ceriso-claro.svg (arquivos estáticos)
// Amplia a imagem, separa o branco do verde-água e traça cada cor com o potrace.
// Quando o CERISO enviar o vetor oficial, substituir por ele.
//
// Uso: npm run logo
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import potrace from "potrace";

const ORIGEM = new URL("../../_ref/artifact/img/logo-light.png", import.meta.url);
const ESCALA = 6;
const VERDE = "#00a390";
const MARINHO = "#00194d";
// largura da fresta entre a mão clara e a verde, em px do original
export const FRESTA = 1.1;

const { data, info } = await sharp(ORIGEM.pathname)
  .resize({ width: 408 * ESCALA, kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;

// Máscara de uma cor: forma escura sobre fundo branco (o potrace traça o escuro).
// Usa a transparência suavizada da imagem (tons de cinza, não preto e branco): assim as
// frestas de 1px (entre dedos, entre as mãos) sobrevivem e as bordas saem lisas com pouco
// desfoque. `peso` diz quanto cada pixel pertence à cor (0 a 1).
async function mascara(peso, desfoque, limiar = 128) {
  const px = Buffer.alloc(W * H, 255);
  for (let i = 0; i < W * H; i++) {
    const [r, g, b, a] = data.subarray(i * 4, i * 4 + 4);
    px[i] = 255 - Math.round(a * peso(r, g, b));
  }
  return sharp(px, { raw: { width: W, height: H, channels: 1 } }).blur(ESCALA * desfoque).threshold(limiar).png().toBuffer();
}
const ehVerde = (r, g, b) => g - r > 70 && b - r > 60;
// quanto um pixel é "verde" (bordas misturadas ganham peso intermediário)
const verdor = (r, g, b) => Math.min(1, Math.max(0, (g - r - 40) / 60));

const tracar = (buf) =>
  new Promise((ok, erro) =>
    potrace.trace(buf, { threshold: 128, turdSize: 120, optTolerance: 0.8, alphaMax: 1.1 }, (e, svg) =>
      e ? erro(e) : ok(svg.match(/ d="([^"]+)"/)[1]),
    ),
  );

// Reescreve um subcaminho do potrace (M/L/C absolutos) em comandos relativos, na escala
// original e arredondados a 0,1: a mesma forma em ~40% menos texto.
const n = (v) => {
  const t = String(Math.round(v * 10) / 10);
  return t.replace(/^(-?)0\./, "$1.");
};
function relativo(s) {
  const tokens = s.match(/[MLCZ]|-?\d+(\.\d+)?/gi);
  let i = 0, cmd = "", x = 0, y = 0, saida = "", ultimo = "";
  const par = () => [Number(tokens[i++]) / ESCALA, Number(tokens[i++]) / ESCALA];
  const r = (v) => Math.round(v * 10) / 10;
  while (i < tokens.length) {
    if (/[MLCZ]/i.test(tokens[i])) cmd = tokens[i++].toUpperCase();
    if (cmd === "Z") { saida += "z"; continue; }
    const letra = { M: "m", L: "l", C: "c" }[cmd];
    const qtd = cmd === "C" ? 3 : 1;
    const pts = Array.from({ length: qtd }, par).map(([a, b]) => [r(a), r(b)]);
    const nums = pts.flatMap(([a, b]) => [a - x, b - y]).map(n);
    let trecho = nums.map((v, k) => (k === 0 || v.startsWith("-") ? v : " " + v)).join("");
    // cada subcaminho começa com M absoluto: assim as partes podem ser recombinadas em qualquer ordem
    const prefixo = cmd === "M" ? "M" : letra === ultimo ? (trecho.startsWith("-") ? "" : " ") : letra;
    saida += prefixo + trecho;
    ultimo = cmd === "M" ? "" : letra; // depois de M absoluto, sempre repetir a letra do próximo comando
    [x, y] = pts[pts.length - 1];
  }
  return saida;
}

// O potrace marca furos (miolo do O, frestas dos dedos) por sobreposição: desenhar com fill-rule="evenodd".
// Divide um path em subcaminhos com caixa delimitadora, arredondando para o tamanho real.
function subcaminhos(d) {
  return d
    .split(/(?=M)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const nums = s.match(/-?\d+(\.\d+)?/g).map(Number);
      const xs = nums.filter((_, i) => i % 2 === 0).map((v) => v / ESCALA);
      const ys = nums.filter((_, i) => i % 2 === 1).map((v) => v / ESCALA);
      const caixa = { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) };
      const texto = relativo(s);
      return { d: texto, ...caixa, cx: (caixa.x0 + caixa.x1) / 2, cy: (caixa.y0 + caixa.y1) / 2, area: (caixa.x1 - caixa.x0) * (caixa.y1 - caixa.y0) };
    });
}

// Desfoque forte nas formas grandes (curvas lisas) e leve no subtítulo (letras pequenas
// empastariam e perderiam os furos).
const ehBranco = (r, g, b) => 1 - verdor(r, g, b);
const brancos = subcaminhos(await tracar(await mascara(ehBranco, 0.9)));
const brancosFinos = subcaminhos(await tracar(await mascara(ehBranco, 0.35)));
// Símbolo: a camada clara é a silhueta inteira (inclui o verde) e o verde vem por cima.
// A fresta fina entre as duas mãos, que existe no desenho original, é recriada no SVG
// com uma máscara (contorno do verde recortando a camada clara), sem depender do fundo.
const silhueta = subcaminhos(await tracar(await mascara(() => 1, 0.75, 112)));
const verdes = subcaminhos(await tracar(await mascara(verdor, 0.75, 112)));

// Regiões (px da imagem original): símbolo à esquerda, CERISO em cima, subtítulo embaixo.
const LIMITE_SIMBOLO = 150;
const LIMITE_SUBTITULO = 96;
const simbolo = silhueta.filter((s) => s.cx < LIMITE_SIMBOLO);
const texto = brancos.filter((s) => s.cx >= LIMITE_SIMBOLO);
const palavra = texto.filter((s) => s.cy < LIMITE_SUBTITULO);
const subtitulo = brancosFinos.filter((s) => s.cx >= LIMITE_SIMBOLO && s.cy >= LIMITE_SUBTITULO);

// Letras de CERISO: cada contorno externo com os furos que ele contém (R, O).
const contem = (a, b) => a !== b && b.x0 >= a.x0 && b.x1 <= a.x1 && b.y0 >= a.y0 && b.y1 <= a.y1;
const externos = palavra.filter((s) => !palavra.some((o) => contem(o, s))).sort((a, b) => a.x0 - b.x0);
const letras = externos.map((e) => [e, ...palavra.filter((s) => contem(e, s))].map((s) => s.d).join(""));

const juntar = (lista) => lista.map((s) => s.d).join("");
const geo = {
  largura: 408,
  altura: 165,
  // o símbolo vai em pedaços para cada traço se desenhar ao mesmo tempo
  simbolo: simbolo.filter((s) => !simbolo.some((o) => contem(o, s))).map((e) => [e, ...simbolo.filter((s) => contem(e, s))].map((s) => s.d).join("")),
  simboloVerde: verdes.filter((s) => !verdes.some((o) => contem(o, s))).map((e) => [e, ...verdes.filter((s) => contem(e, s))].map((s) => s.d).join("")),
  letras,
  subtitulo: juntar(subtitulo),
  fresta: FRESTA,
};

await writeFile(
  new URL("../src/components/ui/logo-geo.ts", import.meta.url),
  "// Gerado por scripts/vetorizar-logo.mjs a partir do PNG oficial — não editar à mão.\n" +
    `export const logoGeo = ${JSON.stringify(geo)} as const;\n`,
);

const verde = geo.simboloVerde.join("");
const svg = (cor) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 408 165"><title>CERISO</title>` +
  `<defs><mask id="f" maskUnits="userSpaceOnUse" x="0" y="0" width="408" height="165">` +
  `<rect width="408" height="165" fill="#fff"/><path d="${verde}" fill="#000" stroke="#000" stroke-width="${FRESTA * 2}" stroke-linejoin="round"/></mask></defs>` +
  `<path fill="${cor}" fill-rule="evenodd" mask="url(#f)" d="${geo.simbolo.join("")}"/>` +
  `<path fill="${cor}" fill-rule="evenodd" d="${[...geo.letras, geo.subtitulo].join("")}"/>` +
  `<path fill="${VERDE}" fill-rule="evenodd" d="${verde}"/></svg>\n`;
await writeFile(new URL("../public/img/marca/ceriso-claro.svg", import.meta.url), svg("#ffffff"));
await writeFile(new URL("../public/img/marca/ceriso.svg", import.meta.url), svg(MARINHO));

console.log(
  `ok: símbolo ${geo.simbolo.length} partes + ${geo.simboloVerde.length} verdes, ${letras.length} letras, ` +
    `subtítulo ${subtitulo.length} contornos; svg ${(svg("#fff").length / 1024).toFixed(1)} KB`,
);
