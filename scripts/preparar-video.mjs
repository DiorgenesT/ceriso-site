// Prepara o vídeo institucional para tocar no próprio site, a partir do arquivo original:
//   - public/video/institucional.mp4  (H.264 + AAC, até 1080p, "faststart" para começar logo)
//   - public/video/institucional.webp (capa, um quadro do vídeo)
// Depois, preencher ceriso.video.arquivo = "/video/institucional.mp4" em src/content/institucional.ts.
//
// Uso: npm run video -- caminho/do/video-original.mp4   (precisa do ffmpeg instalado)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const origem = process.argv[2];
if (!origem) {
  console.error("Informe o arquivo: npm run video -- caminho/do/video.mp4");
  process.exit(1);
}
const pasta = new URL("../public/video/", import.meta.url).pathname;
mkdirSync(pasta, { recursive: true });

execFileSync("ffmpeg", [
  "-y", "-i", origem,
  "-vf", "scale='min(1920,iw)':-2",
  "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "128k",
  "-movflags", "+faststart",
  `${pasta}institucional.mp4`,
], { stdio: "inherit" });

execFileSync("ffmpeg", ["-y", "-ss", "2", "-i", origem, "-frames:v", "1", "-vf", "scale='min(1920,iw)':-2", `${pasta}institucional.webp`], { stdio: "inherit" });
console.log("ok: public/video/institucional.mp4 e institucional.webp");
