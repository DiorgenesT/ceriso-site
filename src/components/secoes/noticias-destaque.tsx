import Image from "next/image";
import { IconeInstagram as Instagram } from "@/components/ui/icone-instagram";
import { noticias } from "@/content/transparencia";
import { ceriso } from "@/content/institucional";
import { BotaoSeta } from "@/components/ui/seta";
import { Revelar } from "@/components/motion/revelar";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";

const formatarData = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

export function NoticiasDestaque() {
  const [principal] = noticias;
  return (
    <section className="bg-papel py-32 md:py-44">
      <div className="container-site">
        <Rotulo className="mb-6 text-cinza">(06) Em movimento</Rotulo>
        <TituloAnimado className="titulo-display mb-16 text-[clamp(2.6rem,5vw,4.8rem)]">
          O consórcio <em className="not-italic text-agua">em ação.</em>
        </TituloAnimado>

        <div className="grid gap-6 lg:grid-cols-12">
          <Revelar as="article" className="group overflow-hidden rounded-[2rem] bg-areia lg:col-span-8">
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image src={principal.foto} alt="Diretoria do CERISO empossada para o mandato 2025–2027" fill
                sizes="(min-width:1024px) 60vw, 100vw" className="object-cover transition-transform duration-1000 ease-agua group-hover:scale-105" />
            </div>
            <div className="p-8 md:p-10">
              <time dateTime={principal.data} className="tabular-nums text-sm text-cinza">{formatarData(principal.data)}</time>
              <h3 className="mt-3 max-w-2xl text-[clamp(1.5rem,2.4vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em]">{principal.titulo}</h3>
              <p className="mt-4 max-w-2xl text-cinza">{principal.resumo}</p>
            </div>
          </Revelar>

          <Revelar atraso={0.15} className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-mata via-agua to-marinho p-8 text-papel md:p-10 lg:col-span-4">
            <Instagram className="size-10" aria-hidden />
            <div className="mt-24">
              <p className="tabular-nums text-sm text-papel/70">@cerisoconsorcio</p>
              <p className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.03em]">
                Eventos, trabalhos e bastidores das 29 cidades.
              </p>
              <BotaoSeta href={ceriso.redes.instagram} variante="claro" className="mt-8">Seguir no Instagram</BotaoSeta>
            </div>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
