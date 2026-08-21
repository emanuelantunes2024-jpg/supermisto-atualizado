import type { Metadata } from "next";
import Link from "next/link";

import { CabecalhoPagina } from "@/components/layout/CabecalhoPagina";
import { Aviso } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";

export const metadata: Metadata = { title: "Assistente Inteligente" };

/** Perguntas que o assistente vai responder quando a integração for ligada. */
const EXEMPLOS = [
  "Tenho farinha, ovos e leite. O que posso fazer?",
  "Quero uma receita barata para vender.",
  "Tenho R$ 50 para começar.",
  "Quero fazer 100 unidades para uma festa.",
  "Quero vender doces no meu trabalho.",
  "Quero fazer algo rápido, em até 30 minutos.",
];

export default function PaginaAssistente() {
  return (
    <div className="flex flex-col gap-4">
      <CabecalhoPagina
        titulo="Assistente Inteligente"
        descricao="A área preparada para responder suas dúvidas e sugerir receitas a partir do que você tem em casa."
      />

      <Aviso tipo="atencao" titulo="Ainda não está ativo">
        A estrutura do assistente já existe no sistema, mas ele{" "}
        <strong>não está funcionando</strong> porque depende de uma chave de API de um provedor de
        IA, que ainda não foi configurada. Preferimos deixar isso claro a mostrar um chat que
        devolve respostas prontas. As instruções de ativação estão em{" "}
        <code className="rounded bg-cream-200 px-1.5 py-0.5 text-[12px]">docs/ASSISTENTE-IA.md</code>.
      </Aviso>

      <section className="cartao p-5">
        <h2 className="font-display text-[15px] font-bold text-ink">
          O que ele vai responder quando for ligado
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {EXEMPLOS.map((exemplo) => (
            <li
              key={exemplo}
              className="flex items-start gap-2.5 rounded-xl border border-line px-3.5 py-3 text-[13px] text-ink-soft"
            >
              <Icone nome="assistente" tamanho={16} className="mt-0.5 shrink-0 text-brand-400" />
              “{exemplo}”
            </li>
          ))}
        </ul>
      </section>

      <section className="cartao p-5">
        <h2 className="font-display text-[15px] font-bold text-ink">Enquanto isso</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
          Estas ferramentas já respondem hoje, sem depender de IA:
        </p>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[
            {
              href: "/buscar",
              titulo: "Buscar por ingrediente",
              texto: "Digite o que você tem em casa, como “morango” ou “polvilho”.",
              icone: "buscar",
            },
            {
              href: "/central-de-renda",
              titulo: "Quanto tenho para investir",
              texto: "Informe o valor e veja as receitas que cabem no seu orçamento.",
              icone: "renda",
            },
            {
              href: "/receitas?tempo=30",
              titulo: "Receitas rápidas",
              texto: "Filtre por tempo de preparo e ache o que dá para fazer agora.",
              icone: "relogio",
            },
          ].map((atalho) => (
            <Link
              key={atalho.href}
              href={atalho.href}
              className="rounded-xl border border-line p-3.5 transition hover:border-brand-300"
            >
              <Icone nome={atalho.icone} tamanho={18} className="mb-1.5 text-brand-500" />
              <p className="text-[13.5px] font-bold text-ink">{atalho.titulo}</p>
              <p className="mt-0.5 text-[12px] text-ink-muted">{atalho.texto}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
