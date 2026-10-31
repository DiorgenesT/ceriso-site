import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ceriso } from "@/content/institucional";
import { RolagemSuave } from "@/components/motion/rolagem-suave";
import { Cabecalho } from "@/components/layout/cabecalho";
import { Rodape } from "@/components/layout/rodape";
import { VLibras } from "@/components/layout/vlibras";

// Uma família só, geométrica como o logotipo; a hierarquia vem de peso e tamanho.
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"] });
export const metadata: Metadata = {
  metadataBase: new URL("https://ceriso.com.br"),
  title: {
    default: "CERISO — Consórcio de municípios da Bacia do Sorocaba e Médio Tietê",
    template: "%s · CERISO",
  },
  description:
    "29 municípios, uma só força. O CERISO une as cidades da Bacia do Rio Sorocaba e Médio Tietê em contratações compartilhadas de saúde, meio ambiente, saneamento e drenagem.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "CERISO",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#031019",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  name: ceriso.nome,
  alternateName: ceriso.sigla,
  url: "https://ceriso.com.br",
  email: ceriso.contato.email,
  telephone: "+55-15-98808-2577",
  foundingDate: "1990-11",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Vicente Leme dos Santos, 324",
    addressLocality: "Salto de Pirapora",
    addressRegion: "SP",
    postalCode: "18162-000",
    addressCountry: "BR",
  },
  sameAs: [ceriso.redes.instagram],
};

// Roda antes da pintura: marca "com JS" e reaplica fonte/contraste salvos pelo visitante.
const preferencias = `(function(d){d.classList.add('js');try{var f=localStorage.getItem('ceriso:fonte'),c=localStorage.getItem('ceriso:contraste');if(f)d.dataset.fonte=f;if(c)d.dataset.contraste=c}catch(e){}})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${jakarta.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferencias }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh font-sans">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-rio focus:px-5 focus:py-3 focus:text-abismo"
        >
          Ir para o conteúdo
        </a>
        <RolagemSuave />
        <Cabecalho />
        <main id="conteudo">{children}</main>
        <Rodape />
        <VLibras />
      </body>
    </html>
  );
}
