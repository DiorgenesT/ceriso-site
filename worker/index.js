// Worker mínimo na frente dos arquivos estáticos, só para /video/* (run_worker_first):
// o servidor de assets responde sempre 200 com o arquivo inteiro, e o Safari (iPhone/Mac)
// só toca <video> se o servidor atender pedidos parciais (Range → 206). Aqui o Worker
// busca o arquivo nos assets e devolve o pedaço pedido. O resto do site nem passa por aqui.
export default {
  async fetch(request, env) {
    const resposta = await env.ASSETS.fetch(request.url);
    const intervalo = request.headers.get("Range");
    if (!resposta.ok || !intervalo) {
      const r = new Response(resposta.body, resposta);
      r.headers.set("Accept-Ranges", "bytes");
      return r;
    }
    const corpo = await resposta.arrayBuffer();
    const total = corpo.byteLength;
    const m = /^bytes=(\d*)-(\d*)$/.exec(intervalo.trim());
    let inicio, fim;
    if (m && m[1] === "" && m[2] !== "") {
      // "bytes=-N": os últimos N bytes
      inicio = Math.max(0, total - Number(m[2]));
      fim = total - 1;
    } else if (m) {
      inicio = Number(m[1]);
      fim = m[2] === "" ? total - 1 : Math.min(Number(m[2]), total - 1);
    }
    if (!m || inicio > fim || inicio >= total) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${total}` } });
    }
    const cabecalhos = new Headers(resposta.headers);
    cabecalhos.set("Accept-Ranges", "bytes");
    cabecalhos.set("Content-Range", `bytes ${inicio}-${fim}/${total}`);
    cabecalhos.set("Content-Length", String(fim - inicio + 1));
    return new Response(corpo.slice(inicio, fim + 1), { status: 206, headers: cabecalhos });
  },
};
