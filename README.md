# CERISO — site institucional

**🌐 [ceriso.com.br](https://ceriso.com.br)**

Site institucional do **CERISO — Consórcio de Estudos, Recuperação e Desenvolvimento da Bacia do Rio Sorocaba e Médio Tietê**. O consórcio reúne 29 municípios paulistas em compras compartilhadas, saneamento, resíduos sólidos e saúde.

O site é estático: sem PHP, banco de dados ou painel de administração exposto. Por isso não há superfície para o tipo de invasão que atinge sites em WordPress.

## Stack

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) com `output: "export"` | Gera HTML estático. |
| Linguagem | TypeScript | Todo o conteúdo é tipado em `src/content/`. |
| Estilo | Tailwind CSS v4 | Os tokens da marca ficam em `src/app/globals.css` (`@theme`). |
| Animação | GSAP 3 (ScrollTrigger, SplitText) + `@gsap/react` | Rolagem com pin/scrub, títulos e mapa animado. |
| Rolagem | Lenis | Rolagem suave sincronizada com o ticker do GSAP. |
| Fonte | Plus Jakarta Sans via `next/font` | Auto-hospedada. |
| Mapa | Malhas do IBGE + rios do OpenStreetMap → SVG | `npm run mapa` gera `src/content/mapa-geo.ts` (≈55 KB). |
| Dados | API do PNCP | `npm run pncp` atualiza `src/content/pncp.json` com licitações e contratos reais. |
| Hospedagem | Cloudflare Workers (assets estáticos) | CDN global e HTTPS. Um Worker mínimo atende `/video/*` com respostas parciais (206) para o Safari. |

Todo o movimento respeita `prefers-reduced-motion`. Sem JavaScript, o conteúdo continua visível.

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # gera ./out (site estático)
npm run pncp       # baixa licitações e contratos do PNCP (rodar antes do deploy)
npm run deploy     # build + wrangler deploy
```

## Estrutura

```
src/
  app/                 páginas (/, /institucional, /municipios, /transparencia, /publicacoes, /contato…)
  content/             todo o texto e os dados do site: editar aqui
  components/
    secoes/            seções da home (hero, mapa da bacia, atuação etc.)
    motion/            primitivas de animação (Revelar, TituloAnimado, Contador, RolagemSuave)
    layout/ ui/        cabeçalho, rodapé, botões, marca
public/
  _headers _redirects  cabeçalhos de segurança e redirecionamentos das URLs antigas
worker/                Worker para /video/*
wrangler.jsonc         configuração do deploy (domínios ceriso.com.br e www)
```

## Deploy

```bash
npm run deploy
```

O build gera `./out`, e o `wrangler deploy` publica esses arquivos como assets do Worker `ceriso`, com `ceriso.com.br` e `www.ceriso.com.br` como domínios. O DNS da zona está na Cloudflare. Os registros de e-mail (MX, SPF, `mail`, `imap`, `smtp`, `webmail`) apontam para a KingHost e ficam em **DNS only**, nunca com proxy.

## Desenvolvimento

Desenvolvido por **[Diorgenes George](https://diorgenesgeorge.dev)**.

## Direitos

O código-fonte deste repositório está disponível para consulta. O nome, o logotipo, as fotos, o vídeo e os textos institucionais são do CERISO e não podem ser reutilizados sem autorização. Os dados de licitações vêm do [Portal Nacional de Contratações Públicas](https://pncp.gov.br), e os dados geográficos, do IBGE e do OpenStreetMap (© colaboradores do OpenStreetMap, ODbL).
