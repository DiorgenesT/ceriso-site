"use client";

import { useDeferredValue, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { municipios } from "@/content/municipios";

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ListaMunicipios() {
  const [busca, setBusca] = useState("");
  const termo = normalizar(useDeferredValue(busca));
  const lista = municipios.filter((m) => normalizar(`${m.nome} ${m.apelido ?? ""}`).includes(termo));

  return (
    <section className="bg-papel py-24 md:py-32">
      <div className="container-site">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h2 className="text-3xl font-semibold tracking-tight">Conheça cada município</h2>
          <label className="flex w-full items-center gap-3 rounded-full border border-linha bg-white px-5 py-3 focus-within:border-tinta md:w-96">
            <Search className="size-4 text-cinza" aria-hidden />
            <span className="sr-only">Buscar município</span>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar município" className="w-full bg-transparent outline-none" />
          </label>
        </div>
        <p className="sr-only" aria-live="polite">{lista.length} municípios encontrados</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((m) => (
            <li key={m.slug} className="group flex gap-5 rounded-3xl border border-linha bg-white p-6 transition-[translate,border-color,box-shadow] duration-500 ease-agua hover:-translate-y-1 hover:border-rio hover:shadow-[0_24px_60px_-30px_rgba(2,174,248,.5)]">
              <Image src={`/img/brasoes/${m.slug}.webp`} alt={`Brasão de ${m.nome}`} width={72} height={72} className="size-18 shrink-0 object-contain transition-transform duration-500 group-hover:scale-110" />
              <div>
                <p className="tabular-nums text-xs text-cinza">Fundação {m.fundacao}</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">{m.nome}</h3>
                {m.apelido && <p className="text-sm font-medium text-agua">{m.apelido}</p>}
                <p className="mt-2 text-sm text-cinza">{m.resumo}</p>
              </div>
            </li>
          ))}
        </ul>
        {lista.length === 0 && <p className="py-16 text-center text-cinza">Nenhum município encontrado para “{busca}”.</p>}
      </div>
    </section>
  );
}
