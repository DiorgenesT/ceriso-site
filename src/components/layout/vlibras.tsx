"use client";

import Script from "next/script";

declare global {
  interface Window {
    VLibras?: { Widget: new (url: string) => unknown };
  }
}

// Tradutor de Libras do Governo Federal (vlibras.gov.br), carregado só depois que a página fica ociosa.
export function VLibras() {
  return (
    <>
      <div {...{ vw: "" }} className="enabled">
        <div {...{ "vw-access-button": "" }} className="active" />
        <div {...{ "vw-plugin-wrapper": "" }}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="lazyOnload"
        onLoad={() => window.VLibras && new window.VLibras.Widget("https://vlibras.gov.br/app")}
      />
    </>
  );
}
