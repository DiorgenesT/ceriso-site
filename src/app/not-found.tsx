import { BotaoSeta } from "@/components/ui/seta";

export default function NaoEncontrado() {
  return (
    <section className="grao flex min-h-svh items-center bg-abismo text-papel">
      <div className="container-site">
        <p className="eyebrow mb-6 text-rio-claro">Erro 404</p>
        <h1 className="titulo-display text-[clamp(3rem,8vw,8rem)]">Esse rio <em className="not-italic text-rio">secou.</em></h1>
        <p className="mt-6 max-w-md text-papel/60">A página que você procura não existe ou mudou de endereço.</p>
        <BotaoSeta href="/" className="mt-10">Voltar ao início</BotaoSeta>
      </div>
    </section>
  );
}
