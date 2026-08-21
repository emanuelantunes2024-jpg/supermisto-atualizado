"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Botao } from "@/components/ui/Botao";
import { Icone } from "@/components/ui/Icone";
import { criarClienteNavegador } from "@/lib/supabase/client";

type Modo = "entrar" | "criar" | "recuperar";

interface Props {
  modo: Modo;
  redirecionar?: string;
}

const TEXTOS: Record<Modo, { titulo: string; descricao: string; botao: string }> = {
  entrar: {
    titulo: "Entrar na sua conta",
    descricao: "Acesse a biblioteca de receitas e as suas ferramentas.",
    botao: "Entrar",
  },
  criar: {
    titulo: "Criar sua conta",
    descricao: "Use o mesmo e-mail da sua compra para que o acesso seja liberado.",
    botao: "Criar conta",
  },
  recuperar: {
    titulo: "Recuperar senha",
    descricao: "Enviaremos um link para você definir uma nova senha.",
    botao: "Enviar link",
  },
};

export function FormularioAuth({ modo, redirecionar = "/inicio" }: Props) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const textos = TEXTOS[modo];

  async function enviar(evento: FormEvent) {
    evento.preventDefault();
    setErro(null);
    setSucesso(null);

    const supabase = criarClienteNavegador();
    if (!supabase) {
      setErro(
        "O login ainda não está configurado neste ambiente. Enquanto isso, você pode usar a demonstração — os dados ficam salvos apenas neste navegador.",
      );
      return;
    }

    setCarregando(true);

    try {
      if (modo === "criar") {
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: { nome },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setSucesso(
          "Conta criada. Confira seu e-mail para confirmar o endereço e depois faça login.",
        );
        return;
      }

      if (modo === "recuperar") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?proximo=/configuracoes`,
        });
        if (error) throw error;
        setSucesso("Se este e-mail tiver conta, o link de recuperação chegará em instantes.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
      if (error) throw error;

      router.push(redirecionar);
      router.refresh();
    } catch (falha) {
      const mensagem = falha instanceof Error ? falha.message : "Não foi possível concluir.";
      setErro(traduzirErro(mensagem));
    } finally {
      setCarregando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3.5">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-ink">{textos.titulo}</h1>
        <p className="mt-1 text-[13.5px] text-ink-muted">{textos.descricao}</p>
      </div>

      {modo === "criar" && (
        <label>
          <span className="rotulo">Seu nome</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoComplete="name"
            className="campo"
          />
        </label>
      )}

      <label>
        <span className="rotulo">E-mail</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="campo"
        />
      </label>

      {modo !== "recuperar" && (
        <label>
          <span className="rotulo">Senha</span>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            minLength={6}
            autoComplete={modo === "criar" ? "new-password" : "current-password"}
            className="campo"
          />
          {modo === "criar" && (
            <span className="mt-1 block text-[11.5px] text-ink-muted">
              Use pelo menos 6 caracteres.
            </span>
          )}
        </label>
      )}

      {erro && (
        <p role="alert" className="rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5 text-[13px] text-brand-700">
          {erro}
        </p>
      )}

      {sucesso && (
        <p role="status" className="rounded-xl border border-money-500/30 bg-money-50 px-3.5 py-2.5 text-[13px] text-money-700">
          {sucesso}
        </p>
      )}

      <Botao type="submit" disabled={carregando} blocoTotal tamanho="lg">
        {carregando ? "Aguarde..." : textos.botao}
        {!carregando && <Icone nome="seta-direita" tamanho={17} />}
      </Botao>

      <div className="flex flex-wrap justify-between gap-2 text-[13px]">
        {modo === "entrar" ? (
          <>
            <Link href="/recuperar-senha" className="font-semibold text-ink-muted hover:text-brand-600">
              Esqueci minha senha
            </Link>
            <Link href="/criar-conta" className="font-semibold text-brand-600 hover:underline">
              Criar conta
            </Link>
          </>
        ) : (
          <Link href="/entrar" className="font-semibold text-brand-600 hover:underline">
            Já tenho conta, quero entrar
          </Link>
        )}
      </div>
    </form>
  );
}

/** Deixa as mensagens do Supabase compreensíveis para o cliente final. */
function traduzirErro(mensagem: string): string {
  const texto = mensagem.toLowerCase();

  if (texto.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (texto.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Procure a mensagem na sua caixa de entrada.";
  }
  if (texto.includes("user already registered")) {
    return "Este e-mail já tem conta. Tente entrar ou recuperar a senha.";
  }
  if (texto.includes("password should be")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (texto.includes("rate limit") || texto.includes("too many")) {
    return "Muitas tentativas seguidas. Espere um minuto e tente de novo.";
  }

  return mensagem;
}
