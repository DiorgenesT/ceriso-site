import { Contador } from "@/components/motion/contador";
import { Revelar } from "@/components/motion/revelar";

export function Numeros({ anos }: { anos: number }) {
  const itens = [
    { valor: 29, sufixo: "", rotulo: "municípios consorciados", nota: "do Alto Sorocaba ao Médio Tietê" },
    { valor: anos, sufixo: "", rotulo: "anos de atuação", nota: "fundado em novembro de 1990" },
    { valor: 2, sufixo: " mi", rotulo: "de habitantes", nota: "população aproximada da região atendida" },
    { valor: 2, sufixo: "", rotulo: "rios, uma bacia", nota: "Sorocaba e Tietê" },
  ];
  return (
    <section aria-label="O CERISO em números" className="bg-papel pb-32">
      <div className="container-site">
      <Revelar emCascata className="grid border-t border-linha sm:grid-cols-2 lg:grid-cols-4">
        {itens.map((item) => (
          <div key={item.rotulo} className="border-b border-linha py-10 sm:odd:border-r lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0">
            <p className="titulo-display text-[clamp(4rem,8vw,7.5rem)] text-tinta">
              <Contador valor={item.valor} />
              <span className="text-rio">{item.sufixo}</span>
            </p>
            <p className="mt-4 text-lg font-medium">{item.rotulo}</p>
            <p className="mt-1 text-sm text-cinza">{item.nota}</p>
          </div>
        ))}
      </Revelar>
      </div>
    </section>
  );
}
