import type { Metadata } from "next";
import Link from "next/link";

import { CATEGORIAS_POR_SLUG } from "@/data/categorias";
import { Aviso } from "@/components/ui/Aviso";
import { Icone } from "@/components/ui/Icone";
import { Selo } from "@/components/ui/Selo";
import { formatarDataRelativa } from "@/lib/format";
import { listarReceitasAdmin, obterEstatisticas } from "@/lib/queries";
import { criarClienteServidor } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Painel" };
export const dynamic = "force-dynamic";

const ACOES = [
  { href: "/admin/receitas/nova", rotulo: "Nova receita", icone: "mais" },
  { href: "/admin/categorias", rotulo: "Ver categorias", icone: "categorias" },
  { href: "/admin/receitas", rotulo: "Gerenciar receitas", icone: "receitas" },
  { href: "/admin/usuarios", rotulo: "Gerenciar acesso", icone: "usuarios" },
];

export default async function PaginaAdmin() {
  const supabase = await criarClienteServidor();
  const [estatisticas, { itens }] = await Promise.all([
    obterEstatisticas(supabase),
    listarReceitasAdmin(supabase),
  ]);

  const recentes = itens.slice(0, 6);

  const cartoes = [
    { rotulo: "Total de receitas", valor: estatisticas.totalReceitas, icone: "receitas", cor: "text-brand-500" },
    { rotulo: "Novas esta semana", valor: `+${estatisticas.novasSemana}`, icone: "novidades", cor: "text-amber-500" },
    { rotulo: "Usuários cadastrados", valor: estatisticas.usuarios, icone: "usuarios", cor: "text-purple-500" },
    { rotulo: "Receitas favoritadas", valor: estatisticas.favoritos, icone: "coracao", cor: "text-pink-500" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">Painel Administrativo</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Cadastre receitas, controle o que está publicado e acompanhe o crescimento da biblioteca.
        </p>
      </div>

      {estatisticas.demonstracao && (
        <Aviso tipo="atencao" titulo="Banco de dados ainda não conectado">
          O painel está mostrando o catálogo local, em modo somente leitura. Para cadastrar e
          editar receitas de verdade, configure as variáveis do Supabase e rode a migração —
          o passo a passo está em <code className="rounded bg-cream-200 px-1.5 py-0.5">docs/SUPABASE.md</code>.
        </Aviso>
      )}

      <div className="grid grid-cols-2 gap-2.5 app:grid-cols-4">
        {cartoes.map((cartao) => (
          <div key={cartao.rotulo} className="cartao p-4">
            <span className={`mb-2 grid h-9 w-9 place-items-center rounded-xl bg-cream-100 ${cartao.cor}`}>
              <Icone nome={cartao.icone} tamanho={18} />
            </span>
            <p className="font-display text-2xl font-extrabold text-ink">{cartao.valor}</p>
            <p className="text-[12px] text-ink-muted">{cartao.rotulo}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 app:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] app:items-start">
        <section className="cartao overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Receitas adicionadas recentemente
            </h2>
            <Link href="/admin/receitas" className="text-[12.5px] font-semibold text-brand-600 hover:underline">
              Ver todas
            </Link>
          </div>

          <ul className="divide-y divide-line/60">
            {recentes.map((receita) => (
              <li key={receita.slug} className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream-100 text-brand-500">
                  <Icone nome="receitas" tamanho={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-semibold text-ink">{receita.nome}</p>
                  <p className="text-[12px] text-ink-muted">
                    {CATEGORIAS_POR_SLUG[receita.categoria]?.nome ?? receita.categoria}
                  </p>
                </div>

                {!receita.publicada && <Selo tom="ambar">Rascunho</Selo>}

                <span className="shrink-0 text-[12px] text-ink-muted">
                  {formatarDataRelativa(receita.publicadaEm)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-4">
          <section className="cartao overflow-hidden">
            <h2 className="border-b border-line px-4 py-3 text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Ações rápidas
            </h2>
            <div className="flex flex-col gap-1.5 p-3">
              {ACOES.map((acao) => (
                <Link
                  key={acao.href}
                  href={acao.href}
                  className="flex items-center gap-2.5 rounded-xl border border-line px-3.5 py-2.5 text-[13.5px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
                >
                  <Icone nome={acao.icone} tamanho={16} />
                  {acao.rotulo}
                </Link>
              ))}
            </div>
          </section>

          <section className="cartao p-4">
            <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink-muted">
              Situação da biblioteca
            </h2>
            <dl className="mt-2.5 flex flex-col gap-2">
              <div className="flex justify-between text-[13px]">
                <dt className="text-ink-soft">Publicadas</dt>
                <dd className="font-bold text-ink">{estatisticas.totalReceitas}</dd>
              </div>
              <div className="flex justify-between text-[13px]">
                <dt className="text-ink-soft">Rascunhos</dt>
                <dd className="font-bold text-ink">{estatisticas.naoPublicadas}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
