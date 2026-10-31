"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Eye, EyeOff, Info } from "lucide-react";

// Formulário de entrada. O site é estático; a autenticação real depende do
// back-end da Área do Consorciado, ainda em implantação. Nada é enviado.
export function Login() {
  const [ver, setVer] = useState(false);
  const [aviso, setAviso] = useState(false);

  function entrar(e: FormEvent) {
    e.preventDefault();
    setAviso(true);
  }

  const campo = "w-full rounded-2xl border border-linha bg-white px-5 py-4 outline-none transition-colors focus:border-tinta";
  return (
    <form onSubmit={entrar} className="rounded-[2rem] bg-marinho p-8 text-papel md:p-10" noValidate>
      <h2 className="text-2xl font-bold">Entrar</h2>
      <p className="mt-2 text-sm text-papel/60">Use o e-mail institucional cadastrado pelo seu município.</p>
      <div className="mt-8 space-y-4 text-tinta">
        <label className="block">
          <span className="mb-2 block text-sm text-papel/70">E-mail institucional</span>
          <input type="email" name="email" autoComplete="username" required className={campo} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-papel/70">Senha</span>
          <span className="relative block">
            <input type={ver ? "text" : "password"} name="senha" autoComplete="current-password" required className={`${campo} pr-14`} />
            <button type="button" onClick={() => setVer(!ver)} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-cinza hover:text-tinta"
              aria-label={ver ? "Ocultar senha" : "Mostrar senha"}>
              {ver ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </span>
        </label>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-papel/70">
          <input type="checkbox" className="size-4 accent-[var(--color-mata)]" /> Manter conectado
        </label>
        <Link href="/contato?assunto=acesso" className="text-rio-claro hover:underline">Esqueci minha senha</Link>
      </div>
      <button type="submit" className="mt-8 w-full rounded-full bg-mata py-4 font-semibold text-abismo transition-colors hover:bg-papel">Entrar</button>
      {aviso && (
        <p role="alert" className="mt-6 flex gap-3 rounded-2xl bg-papel/10 p-4 text-sm">
          <Info className="size-5 shrink-0 text-rio-claro" aria-hidden />
          <span>
            A Área do Consorciado está em implantação. Para receber seu acesso,{" "}
            <Link href="/contato?assunto=acesso" className="font-semibold underline">fale com a Secretaria Executiva</Link>.
          </span>
        </p>
      )}
    </form>
  );
}
