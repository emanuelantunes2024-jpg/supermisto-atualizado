"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";

import { INSUMOS_POR_CHAVE } from "@/data/insumos";
import { criarClienteNavegador } from "@/lib/supabase/client";
import type {
  Colecao,
  ItemListaCompras,
  PerfilOnboarding,
  PrecosUsuario,
  Receita,
} from "@/lib/types";

/**
 * Dados que pertencem ao usuário: favoritos, coleções, lista de compras,
 * preços personalizados e respostas do primeiro acesso.
 *
 * Dois modos de persistência, escolhidos automaticamente:
 *
 * 1. LOGADO com Supabase configurado → grava nas tabelas do banco, com a
 *    sessão do próprio usuário (as políticas de RLS garantem o isolamento).
 * 2. SEM LOGIN ou sem Supabase → grava em `localStorage`, no navegador.
 *    É o modo usado pela demonstração pública, e a interface avisa que os
 *    dados ficam apenas naquele aparelho.
 */

const CHAVE_ARMAZENAMENTO = "crr:dados-usuario:v1";

interface EstadoDados {
  favoritos: string[];
  colecoes: Colecao[];
  lista: ItemListaCompras[];
  precos: PrecosUsuario;
  onboarding: PerfilOnboarding | null;
  vistasRecentes: string[];
}

const COLECOES_PADRAO: Colecao[] = [
  { id: "quero-fazer", nome: "Quero fazer", receitas: [], fixa: true },
  { id: "para-vender", nome: "Receitas para vender", receitas: [], fixa: true },
  { id: "festas", nome: "Festas", receitas: [], fixa: true },
];

const ESTADO_INICIAL: EstadoDados = {
  favoritos: [],
  colecoes: COLECOES_PADRAO,
  lista: [],
  precos: {},
  onboarding: null,
  vistasRecentes: [],
};

interface ContextoDados extends EstadoDados {
  carregando: boolean;
  /** `true` quando os dados estão apenas neste navegador. */
  modoLocal: boolean;
  user: User | null;
  alternarFavorito: (slug: string) => void;
  ehFavorito: (slug: string) => boolean;
  criarColecao: (nome: string) => void;
  removerColecao: (id: string) => void;
  alternarNaColecao: (colecaoId: string, slug: string) => void;
  adicionarReceitaNaLista: (receita: Receita, rendimento?: number) => number;
  adicionarItemManual: (texto: string) => void;
  alternarComprado: (id: string) => void;
  removerItem: (id: string) => void;
  limparLista: () => void;
  definirPreco: (chave: string, preco: number | null) => void;
  redefinirPrecos: () => void;
  salvarOnboarding: (perfil: PerfilOnboarding) => void;
  registrarVisita: (slug: string) => void;
}

const Contexto = createContext<ContextoDados | null>(null);

/* --------------------------------------------------------------------------
 * Armazenamento local
 * ----------------------------------------------------------------------- */

function lerLocal(): EstadoDados {
  if (typeof window === "undefined") return ESTADO_INICIAL;
  try {
    const bruto = window.localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!bruto) return ESTADO_INICIAL;
    const dados = JSON.parse(bruto) as Partial<EstadoDados>;
    return {
      ...ESTADO_INICIAL,
      ...dados,
      colecoes: dados.colecoes?.length ? dados.colecoes : COLECOES_PADRAO,
    };
  } catch {
    return ESTADO_INICIAL;
  }
}

function gravarLocal(estado: EstadoDados) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(estado));
  } catch {
    // Armazenamento cheio ou bloqueado: o app continua funcionando em memória.
  }
}

/* --------------------------------------------------------------------------
 * Leitura no Supabase
 * ----------------------------------------------------------------------- */

async function carregarDoBanco(supabase: SupabaseClient, userId: string): Promise<EstadoDados> {
  const [favoritos, colecoes, itens, precos, perfil, vistas] = await Promise.all([
    supabase.from("favoritos").select("receita_slug").eq("user_id", userId),
    supabase
      .from("colecoes")
      .select("id, nome, fixa, colecao_receitas(receita_slug)")
      .eq("user_id", userId),
    supabase
      .from("lista_itens")
      .select("id, insumo_chave, base, comprado, origens, manual")
      .eq("user_id", userId),
    supabase.from("precos_usuario").select("insumo_chave, preco").eq("user_id", userId),
    supabase.from("perfis").select("preferencias").eq("id", userId).maybeSingle(),
    supabase
      .from("visualizacoes")
      .select("receita_slug, vista_em")
      .eq("user_id", userId)
      .order("vista_em", { ascending: false })
      .limit(12),
  ]);

  const colecoesConvertidas: Colecao[] = (colecoes.data ?? []).map((c) => ({
    id: c.id as string,
    nome: c.nome as string,
    fixa: Boolean(c.fixa),
    receitas: ((c.colecao_receitas ?? []) as Array<{ receita_slug: string }>).map(
      (r) => r.receita_slug,
    ),
  }));

  return {
    favoritos: (favoritos.data ?? []).map((f) => f.receita_slug as string),
    colecoes: colecoesConvertidas.length ? colecoesConvertidas : COLECOES_PADRAO,
    lista: (itens.data ?? []).map((i) => ({
      id: i.id as string,
      insumo: i.insumo_chave as string,
      base: Number(i.base),
      comprado: Boolean(i.comprado),
      origens: (i.origens as string[]) ?? [],
      manual: (i.manual as string) ?? undefined,
    })),
    precos: Object.fromEntries(
      (precos.data ?? []).map((p) => [p.insumo_chave as string, Number(p.preco)]),
    ),
    onboarding: (perfil.data?.preferencias as PerfilOnboarding) ?? null,
    vistasRecentes: (vistas.data ?? []).map((v) => v.receita_slug as string),
  };
}

/* --------------------------------------------------------------------------
 * Provider
 * ----------------------------------------------------------------------- */

export function ProvedorDadosUsuario({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => criarClienteNavegador(), []);
  const [estado, setEstado] = useState<EstadoDados>(ESTADO_INICIAL);
  const [user, setUser] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);

  const modoLocal = !supabase || !user;

  // Carga inicial: banco quando há sessão, navegador nos demais casos.
  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      if (!supabase) {
        if (ativo) {
          setEstado(lerLocal());
          setCarregando(false);
        }
        return;
      }

      const {
        data: { user: usuario },
      } = await supabase.auth.getUser();

      if (!ativo) return;
      setUser(usuario);

      if (!usuario) {
        setEstado(lerLocal());
        setCarregando(false);
        return;
      }

      try {
        const dados = await carregarDoBanco(supabase, usuario.id);
        if (ativo) setEstado(dados);
      } catch (erro) {
        console.error("[dados-usuario] falha ao carregar do banco:", erro);
        if (ativo) setEstado(lerLocal());
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void iniciar();
    return () => {
      ativo = false;
    };
  }, [supabase]);

  // Espelha tudo no navegador: serve de cache e mantém a demonstração viva.
  useEffect(() => {
    if (!carregando) gravarLocal(estado);
  }, [estado, carregando]);

  /** Executa a escrita no banco só quando há sessão; erros não travam a interface. */
  const sincronizar = useCallback(
    async (acao: (cliente: SupabaseClient, userId: string) => Promise<unknown>) => {
      if (!supabase || !user) return;
      try {
        await acao(supabase, user.id);
      } catch (erro) {
        console.error("[dados-usuario] falha ao sincronizar:", erro);
      }
    },
    [supabase, user],
  );

  const alternarFavorito = useCallback(
    (slug: string) => {
      setEstado((atual) => {
        const jaTem = atual.favoritos.includes(slug);
        void sincronizar(async (cliente, userId) => {
          if (jaTem) {
            await cliente.from("favoritos").delete().eq("user_id", userId).eq("receita_slug", slug);
          } else {
            await cliente
              .from("favoritos")
              .upsert({ user_id: userId, receita_slug: slug }, { onConflict: "user_id,receita_slug" });
          }
        });
        return {
          ...atual,
          favoritos: jaTem
            ? atual.favoritos.filter((f) => f !== slug)
            : [...atual.favoritos, slug],
        };
      });
    },
    [sincronizar],
  );

  const ehFavorito = useCallback((slug: string) => estado.favoritos.includes(slug), [estado.favoritos]);

  const criarColecao = useCallback(
    (nome: string) => {
      const id = crypto.randomUUID();
      setEstado((atual) => ({
        ...atual,
        colecoes: [...atual.colecoes, { id, nome, receitas: [] }],
      }));
      void sincronizar(async (cliente, userId) => {
        await cliente.from("colecoes").insert({ id, user_id: userId, nome });
      });
    },
    [sincronizar],
  );

  const removerColecao = useCallback(
    (id: string) => {
      setEstado((atual) => ({
        ...atual,
        colecoes: atual.colecoes.filter((c) => c.id !== id || c.fixa),
      }));
      void sincronizar(async (cliente, userId) => {
        await cliente.from("colecoes").delete().eq("id", id).eq("user_id", userId);
      });
    },
    [sincronizar],
  );

  const alternarNaColecao = useCallback(
    (colecaoId: string, slug: string) => {
      setEstado((atual) => {
        const colecao = atual.colecoes.find((c) => c.id === colecaoId);
        const jaTem = colecao?.receitas.includes(slug) ?? false;

        void sincronizar(async (cliente, userId) => {
          // Coleções padrão não existem no banco até serem usadas.
          await cliente
            .from("colecoes")
            .upsert(
              { id: colecaoId, user_id: userId, nome: colecao?.nome ?? "Coleção", fixa: colecao?.fixa ?? false },
              { onConflict: "id" },
            );

          if (jaTem) {
            await cliente
              .from("colecao_receitas")
              .delete()
              .eq("colecao_id", colecaoId)
              .eq("receita_slug", slug);
          } else {
            await cliente
              .from("colecao_receitas")
              .upsert(
                { colecao_id: colecaoId, receita_slug: slug },
                { onConflict: "colecao_id,receita_slug" },
              );
          }
        });

        return {
          ...atual,
          colecoes: atual.colecoes.map((c) =>
            c.id !== colecaoId
              ? c
              : {
                  ...c,
                  receitas: jaTem
                    ? c.receitas.filter((r) => r !== slug)
                    : [...c.receitas, slug],
                },
          ),
        };
      });
    },
    [sincronizar],
  );

  /**
   * Soma os ingredientes da receita à lista, consolidando o que já existe.
   * Devolve quantos itens foram somados, para a mensagem de confirmação.
   */
  const adicionarReceitaNaLista = useCallback(
    (receita: Receita, rendimento?: number) => {
      const fator =
        rendimento && receita.rendimento > 0 ? rendimento / receita.rendimento : 1;

      setEstado((atual) => {
        const lista = atual.lista.slice();

        for (const ingrediente of receita.ingredientes) {
          const quantidade = ingrediente.base * fator;
          const existente = lista.find((i) => i.insumo === ingrediente.insumo && !i.manual);

          if (existente) {
            existente.base += quantidade;
            if (!existente.origens.includes(receita.nome)) {
              existente.origens = [...existente.origens, receita.nome];
            }
            existente.comprado = false;
            void sincronizar(async (cliente, userId) => {
              await cliente
                .from("lista_itens")
                .update({ base: existente.base, origens: existente.origens, comprado: false })
                .eq("id", existente.id)
                .eq("user_id", userId);
            });
          } else {
            const novo: ItemListaCompras = {
              id: crypto.randomUUID(),
              insumo: ingrediente.insumo,
              base: quantidade,
              comprado: false,
              origens: [receita.nome],
            };
            lista.push(novo);
            void sincronizar(async (cliente, userId) => {
              await cliente.from("lista_itens").insert({
                id: novo.id,
                user_id: userId,
                insumo_chave: novo.insumo,
                base: novo.base,
                comprado: false,
                origens: novo.origens,
              });
            });
          }
        }

        return { ...atual, lista };
      });

      return receita.ingredientes.length;
    },
    [sincronizar],
  );

  const adicionarItemManual = useCallback(
    (texto: string) => {
      const item: ItemListaCompras = {
        id: crypto.randomUUID(),
        insumo: "",
        base: 0,
        comprado: false,
        origens: [],
        manual: texto,
      };
      setEstado((atual) => ({ ...atual, lista: [...atual.lista, item] }));
      void sincronizar(async (cliente, userId) => {
        await cliente.from("lista_itens").insert({
          id: item.id,
          user_id: userId,
          insumo_chave: null,
          base: 0,
          comprado: false,
          origens: [],
          manual: texto,
        });
      });
    },
    [sincronizar],
  );

  const alternarComprado = useCallback(
    (id: string) => {
      setEstado((atual) => {
        const item = atual.lista.find((i) => i.id === id);
        const novoValor = !item?.comprado;
        void sincronizar(async (cliente, userId) => {
          await cliente
            .from("lista_itens")
            .update({ comprado: novoValor })
            .eq("id", id)
            .eq("user_id", userId);
        });
        return {
          ...atual,
          lista: atual.lista.map((i) => (i.id === id ? { ...i, comprado: novoValor } : i)),
        };
      });
    },
    [sincronizar],
  );

  const removerItem = useCallback(
    (id: string) => {
      setEstado((atual) => ({ ...atual, lista: atual.lista.filter((i) => i.id !== id) }));
      void sincronizar(async (cliente, userId) => {
        await cliente.from("lista_itens").delete().eq("id", id).eq("user_id", userId);
      });
    },
    [sincronizar],
  );

  const limparLista = useCallback(() => {
    setEstado((atual) => ({ ...atual, lista: [] }));
    void sincronizar(async (cliente, userId) => {
      await cliente.from("lista_itens").delete().eq("user_id", userId);
    });
  }, [sincronizar]);

  const definirPreco = useCallback(
    (chave: string, preco: number | null) => {
      setEstado((atual) => {
        const precos = { ...atual.precos };
        if (preco === null || Number.isNaN(preco)) delete precos[chave];
        else precos[chave] = preco;
        return { ...atual, precos };
      });

      void sincronizar(async (cliente, userId) => {
        if (preco === null || Number.isNaN(preco)) {
          await cliente
            .from("precos_usuario")
            .delete()
            .eq("user_id", userId)
            .eq("insumo_chave", chave);
        } else {
          await cliente
            .from("precos_usuario")
            .upsert(
              { user_id: userId, insumo_chave: chave, preco },
              { onConflict: "user_id,insumo_chave" },
            );
        }
      });
    },
    [sincronizar],
  );

  const redefinirPrecos = useCallback(() => {
    setEstado((atual) => ({ ...atual, precos: {} }));
    void sincronizar(async (cliente, userId) => {
      await cliente.from("precos_usuario").delete().eq("user_id", userId);
    });
  }, [sincronizar]);

  const salvarOnboarding = useCallback(
    (perfil: PerfilOnboarding) => {
      setEstado((atual) => ({ ...atual, onboarding: perfil }));
      void sincronizar(async (cliente, userId) => {
        await cliente.from("perfis").update({ preferencias: perfil }).eq("id", userId);
      });
    },
    [sincronizar],
  );

  const registrarVisita = useCallback(
    (slug: string) => {
      setEstado((atual) => ({
        ...atual,
        vistasRecentes: [slug, ...atual.vistasRecentes.filter((s) => s !== slug)].slice(0, 12),
      }));
      void sincronizar(async (cliente, userId) => {
        await cliente.from("visualizacoes").insert({ user_id: userId, receita_slug: slug });
      });
    },
    [sincronizar],
  );

  const valor: ContextoDados = {
    ...estado,
    carregando,
    modoLocal,
    user,
    alternarFavorito,
    ehFavorito,
    criarColecao,
    removerColecao,
    alternarNaColecao,
    adicionarReceitaNaLista,
    adicionarItemManual,
    alternarComprado,
    removerItem,
    limparLista,
    definirPreco,
    redefinirPrecos,
    salvarOnboarding,
    registrarVisita,
  };

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useDadosUsuario(): ContextoDados {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useDadosUsuario precisa estar dentro de ProvedorDadosUsuario");
  }
  return contexto;
}

/** Nome legível de um item da lista de compras. */
export function nomeItemLista(item: ItemListaCompras): string {
  if (item.manual) return item.manual;
  return INSUMOS_POR_CHAVE[item.insumo]?.nome ?? item.insumo;
}
