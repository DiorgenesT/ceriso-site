import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { IconeInstagram as Instagram } from "@/components/ui/icone-instagram";
import { ceriso } from "@/content/institucional";
import { Marca } from "@/components/ui/marca";
import { atalhos, navegacao } from "./navegacao";
import { AssinaturaRodape } from "./assinatura-rodape";

export function Rodape() {
  const { contato } = ceriso;
  return (
    <footer className="grao relative overflow-hidden bg-abismo text-papel">
      <div className="container-site relative z-[2] grid gap-14 pb-10 pt-24 md:grid-cols-12">
        <div className="md:col-span-4">
          <Marca className="h-16" />
          <p className="mt-6 max-w-sm text-papel/60">{ceriso.nome}</p>
          <p className="mt-2 tabular-nums text-xs text-papel/40">CNPJ {ceriso.cnpj}</p>
        </div>

        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <p className="eyebrow mb-5 text-papel/40">Navegue</p>
            <ul className="space-y-2.5">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-papel/80 transition-colors hover:text-rio">{item.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-5 text-papel/40">Serviços</p>
            <ul className="space-y-2.5">
              {atalhos.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-papel/80 transition-colors hover:text-rio">{item.rotulo}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <address className="space-y-4 not-italic md:col-span-4">
          <p className="eyebrow mb-5 text-papel/40">Atendimento</p>
          <a href={contato.mapaHref} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-papel/80 hover:text-rio">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>{contato.endereco}<br />{contato.cidade}</span>
          </a>
          <a href={contato.telefoneHref} className="flex gap-3 text-papel/80 hover:text-rio">
            <Phone className="mt-0.5 size-4 shrink-0" aria-hidden />
            {contato.telefone}
          </a>
          <a href={`mailto:${contato.email}`} className="flex gap-3 text-papel/80 hover:text-rio">
            <Mail className="mt-0.5 size-4 shrink-0" aria-hidden />
            {contato.email}
          </a>
          <a href={ceriso.redes.instagram} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-papel/80 hover:text-rio">
            <Instagram className="mt-0.5 size-4 shrink-0" aria-hidden />
            @cerisoconsorcio
          </a>
          <p className="pt-2 text-sm text-papel/50">{contato.horario}</p>
        </address>
      </div>

      <div className="container-site relative z-[2] pb-[clamp(1.5rem,3vw,3rem)] pt-6" aria-hidden>
        <AssinaturaRodape />
      </div>

      <div className="container-site relative z-[2]">
        <div className="flex flex-col justify-between gap-3 border-t border-papel/10 py-6 text-xs text-papel/40 sm:flex-row">
        <p>© {new Date().getFullYear()} CERISO. Todos os direitos reservados.</p>
        <p>Bacia do Rio Sorocaba e Médio Tietê · São Paulo</p>
        </div>
      </div>
    </footer>
  );
}
