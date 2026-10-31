import { ceriso } from "@/content/institucional";
import { BotaoSeta } from "@/components/ui/seta";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";

export function ChamadaFinal() {
  return (
    <section className="bg-papel pb-32">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-tinta px-8 py-20 text-papel md:px-16 md:py-28">
          <svg aria-hidden viewBox="0 0 800 400" className="absolute -right-20 bottom-0 w-[60rem] max-w-none opacity-30">
            <path d="M0 300 C 200 200, 300 380, 500 260 S 760 120, 820 160" fill="none" stroke="#02aef8" strokeWidth="2" />
            <path d="M0 340 C 220 260, 320 400, 520 300 S 760 180, 820 210" fill="none" stroke="#00a390" strokeWidth="1.5" />
          </svg>
          <Rotulo className="relative mb-6 text-rio-claro">Fale com o CERISO</Rotulo>
          <TituloAnimado className="titulo-display relative max-w-[16ch] text-[clamp(2.6rem,6vw,6rem)]">
            Sua cidade tem uma demanda? <em className="not-italic text-rio">A região responde.</em>
          </TituloAnimado>
          <div className="relative mt-12 flex flex-wrap gap-3">
            <BotaoSeta href="/contato">Enviar mensagem</BotaoSeta>
            <BotaoSeta href={ceriso.contato.whatsappHref} variante="contorno">WhatsApp {ceriso.contato.telefone}</BotaoSeta>
          </div>
        </div>
      </div>
    </section>
  );
}
