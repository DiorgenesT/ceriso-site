import { ArrowUpRight, FolderOpen } from "lucide-react";
import clsx from "clsx";
import type { Acervo } from "@/content/transparencia";

export function CartaoAcervo({ item, escuro }: { item: Acervo; escuro?: boolean }) {
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer"
      className={clsx(
        "group relative flex min-h-48 flex-col gap-12 overflow-hidden rounded-3xl p-7 transition-colors duration-500",
        escuro ? "bg-corrente text-papel hover:bg-rio hover:text-abismo" : "border border-linha bg-papel hover:border-tinta hover:bg-tinta hover:text-papel",
      )}>
      <div className="flex items-start justify-between">
        <FolderOpen className="size-6 opacity-60" aria-hidden />
        <ArrowUpRight className="size-5 transition-transform duration-500 ease-agua group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
      </div>
      <div>
        <h3 className="text-xl font-semibold tracking-tight">{item.titulo}</h3>
        <p className="mt-1.5 text-sm opacity-65">{item.texto}</p>
      </div>
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  );
}
