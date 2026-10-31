import Image from "next/image";
import { municipios } from "@/content/municipios";
import { BotaoSeta } from "@/components/ui/seta";
import { TituloAnimado } from "@/components/motion/titulo-animado";
import { Rotulo } from "@/components/motion/rotulo";

// Duas faixas de brasões correndo em sentidos opostos (CSS puro, pausa ao passar o mouse).
function Faixa({ lista, reversa }: { lista: typeof municipios; reversa?: boolean }) {
  const itens = [...lista, ...lista];
  return (
    <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul
        className={`flex w-max shrink-0 gap-4 py-2 pr-4 motion-safe:animate-[faixa_70s_linear_infinite] group-hover:[animation-play-state:paused] ${reversa ? "[animation-direction:reverse]" : ""}`}
      >
        {itens.map((m, i) => (
          <li key={`${m.slug}-${i}`} aria-hidden={i >= lista.length || undefined}
            className="flex w-56 shrink-0 items-center gap-4 rounded-2xl border border-linha bg-papel p-4 transition-colors hover:border-rio">
            <Image src={`/img/brasoes/${m.slug}.webp`} alt="" width={56} height={56} className="size-14 object-contain" />
            <div>
              <p className="font-medium leading-tight">{m.nome}</p>
              <p className="tabular-nums text-xs text-cinza">desde {m.fundacao}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MunicipiosFaixa() {
  const meio = Math.ceil(municipios.length / 2);
  return (
    <section className="overflow-hidden bg-papel py-32">
      <div className="container-site mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <Rotulo className="mb-6 text-cinza">(04) Municípios</Rotulo>
          <TituloAnimado className="titulo-display max-w-[14ch] text-[clamp(2.6rem,5vw,4.8rem)]">
            Cada brasão, <em className="not-italic text-agua">uma voz</em> na assembleia.
          </TituloAnimado>
        </div>
        <BotaoSeta href="/municipios" variante="escuro">Ver os 29 municípios</BotaoSeta>
      </div>
      <div className="space-y-4">
        <Faixa lista={municipios.slice(0, meio)} />
        <Faixa lista={municipios.slice(meio)} reversa />
      </div>
    </section>
  );
}
