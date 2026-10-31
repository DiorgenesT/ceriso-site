import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & { variante?: "rio" | "claro" | "escuro" | "contorno" };

const estilos = {
  rio: "bg-rio text-abismo hover:bg-rio-claro",
  claro: "bg-papel text-tinta hover:bg-white",
  escuro: "bg-tinta text-papel hover:bg-corrente",
  contorno: "border border-current/25 hover:border-current/60",
};

// Botão-pílula com seta que gira ao passar o mouse. Links externos abrem em nova aba.
export function BotaoSeta({ variante = "rio", className, children, href, ...resto }: Props) {
  const externo = typeof href === "string" && /^https?:/.test(href);
  return (
    <Link
      href={href}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={clsx(
        "group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-[0.95rem] font-medium transition-colors duration-300",
        estilos[variante],
        className,
      )}
      {...resto}
    >
      {children}
      <span className="grid size-9 place-items-center rounded-full bg-current/10 transition-transform duration-500 ease-agua group-hover:rotate-45">
        <ArrowUpRight className="size-4" aria-hidden />
      </span>
      {externo && <span className="sr-only">(abre em nova aba)</span>}
    </Link>
  );
}
