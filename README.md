# CERISO — novo site

Site institucional do Consórcio de Estudos, Recuperação e Desenvolvimento da Bacia do Rio Sorocaba e Médio Tietê.
Ele substitui o WordPress de `ceriso.com.br`.

## Stack

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) com `output: "export"` | Gera HTML estático. Sem PHP, banco ou painel exposto, não há o que invadir. |
| Linguagem | TypeScript | O conteúdo é tipado em `src/content/`. |
| Estilo | Tailwind CSS v4 | Os tokens da marca ficam em `src/app/globals.css` (`@theme`). |
| Animação | GSAP 3 (ScrollTrigger, SplitText) + `@gsap/react` | Cuida da rolagem com pin/scrub, dos títulos e do mapa animado. |
| Rolagem | Lenis | Rolagem suave sincronizada com o ticker do GSAP. |
| Fonte | Plus Jakarta Sans via `next/font` | Uma família só, geométrica como o logotipo, auto-hospedada. |
| Mapa | Malhas do IBGE + rios do OpenStreetMap → SVG | `npm run mapa` gera `src/content/mapa-geo.ts` (≈55 KB). |
| Dados | API do PNCP | `npm run pncp` atualiza `src/content/pncp.json` (licitações e contratos reais). |

Todo o movimento respeita `prefers-reduced-motion`. Sem JavaScript, o conteúdo continua visível.

## Comandos

```bash
npm install
npm run dev                          # http://localhost:3000
npm run build                        # gera ./out (site estático)
npm run pncp                         # baixa licitações e contratos do PNCP (rodar antes do deploy)
npm run mapa                         # regenera o mapa a partir de ../_ref/geo
npm run imagens                      # reconverte as imagens de ../_ref/img para WebP
```

## Estrutura

```
src/
  app/                 páginas (/, /institucional, /municipios, /transparencia, /publicacoes, /contato)
  content/             todo o texto e os dados do site: editar aqui
  components/
    secoes/            seções da home (hero, mapa da bacia, atuação, etc.)
    motion/            primitivas de animação (Revelar, TituloAnimado, Contador, RolagemSuave)
    layout/ ui/        cabeçalho, rodapé, botões, marca
public/
  _headers _redirects  segurança e redirecionamentos para Cloudflare Pages
  .htaccess            o mesmo para Apache (KingHost), se o site continuar lá
```

## Deploy

O `./out` funciona em qualquer hospedagem estática.

- **Recomendado: Cloudflare Pages.** É gratuito, tem CDN e lê `_headers` e `_redirects`.
- **KingHost (hospedagem atual):** basta enviar o conteúdo de `out/` para a raiz. O `.htaccess` aplica os cabeçalhos e redireciona as URLs antigas.

O e-mail (`MX` da KingHost) não pode ser afetado. Ao migrar o DNS, copie os registros MX, SPF e TXT antes de trocar os nameservers.

## Pendências de conteúdo (confirmar com o CERISO)

- [ ] Logotipo oficial em vetor (SVG). Até lá, o site usa um logotipo reconstruído do PNG oficial (408×165): símbolo suavizado, "CERISO" e subtítulo em contornos da Montserrat (a fonte do logo) e dedos redesenhados. A geometria vem de `~/projetos/motion/ceriso/scripts/exportar-logo.mts` (→ `src/components/ui/logo-geo.ts`); `npm run marca` gera `public/img/marca/*` e o favicon. Com o vetor oficial, basta trocar os caminhos.
- [ ] Diretoria 2025–2027. A home do WordPress mostra uma gestão e a notícia de posse mostra outra; o site usa a da notícia.
- [ ] Data da notícia de posse: o WordPress exibe 10/02/2024, mas o mandato é 2025–2027.
- [x] População: 1.983.329 habitantes (Censo IBGE 2022, soma dos 29). O site mostra "2 mi".
- [ ] Visão e propósito: vieram da proposta de redesign, não do site atual.
- [ ] Área do Consorciado: a tela existe, mas o login precisa de back-end (ex.: Supabase Auth com RLS, ou Cloudflare Access + D1).
- [ ] Atualização diária do PNCP: agendar `npm run pncp && npm run build` (GitHub Actions ou Cloudflare).
- [ ] Fotos reais das frentes de atuação. Algumas imagens atuais são ilustrações geradas por IA.
- [ ] Destino do formulário de contato. Hoje ele abre o e-mail do visitante; dá para ligar a um Worker com Turnstile.
- [ ] Arquivo original do vídeo institucional (encontro de prefeitos). Hoje o vídeo toca no site pelo player do Instagram; com o arquivo, rodar `npm run video -- caminho/do/video.mp4` e preencher `ceriso.video.arquivo` em `src/content/institucional.ts` (mais rápido e sem rastreadores do Meta).
