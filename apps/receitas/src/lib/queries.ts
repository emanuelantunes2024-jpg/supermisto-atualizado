import type { SupabaseClient } from "@supabase/supabase-js";

import { CATEGORIAS } from "@/data/categorias";
import { RECEITAS } from "@/data/receitas";
import { custoReferencia } from "@/lib/calculos";
import { normalizar } from "@/lib/texto";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Categoria, Dificuldade, Objetivo, Receita } from "@/lib/types";

/**
 * Leitura do catálogo.
 *
 * Quando o Supabase está configurado, tudo vem do banco com filtro e
 * paginação feitos no servidor — é o que permite crescer para milhares de
 * receitas sem carregar tudo de uma vez. Sem banco, a aplicação roda em modo
 * demonstração sobre o catálogo curado em `src/data`.
 */

export interface FiltrosReceita {
  busca?: string;
  categoria?: string;
  subcategoria?: string;
  dificuldade?: Dificuldade;
  /** Tempo máximo em minutos. */
  tempoMaximo?: number;
  objetivo?: Objetivo;
  /** Somente receitas marcadas para produção comercial. */
  paraVender?: boolean;
  /** Custo estimado máximo da receita, em reais (faixa de investimento). */
  investimentoMaximo?: number;
  /** Publicadas a partir desta data (ISO), para a área de novidades. */
  desde?: string;
  pagina?: number;
  porPagina?: number;
  ordem?: "recentes" | "nome" | "tempo" | "faceis";
}

export interface ResultadoReceitas {
  itens: Receita[];
  total: number;
  pagina: number;
  porPagina: number;
  /** `true` quando os dados vieram do catálogo local, sem banco. */
  demonstracao: boolean;
}

const POR_PAGINA_PADRAO = 12;

/* --------------------------------------------------------------------------
 * Conversão banco → aplicação
 * ----------------------------------------------------------------------- */

interface LinhaReceita {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  categoria_slug: string;
  subcategoria: string | null;
  imagem: string | null;
  tempo_minutos: number;
  dificuldade: Dificuldade;
  rendimento: number;
  rendimento_unidade: string;
  preparo: unknown;
  dicas: unknown;
  conservacao: string | null;
  equipamentos: unknown;
  tags: unknown;
  objetivos: unknown;
  linha: string;
  para_vender: boolean;
  embalagem_por_unidade: number | null;
  margem_sugerida: number | null;
  custo_estimado: number | null;
  publicada_em: string;
  novidade_ate: string | null;
  publicada: boolean;
  destaque: boolean | null;
  receita_ingredientes?: Array<{
    insumo_chave: string;
    qtd: number;
    unidade: string;
    base: number;
    grupo: string | null;
    observacao: string | null;
    opcional: boolean | null;
    ordem: number | null;
  }>;
}

function paraArray<T>(valor: unknown): T[] {
  return Array.isArray(valor) ? (valor as T[]) : [];
}

function converterReceita(linha: LinhaReceita): Receita {
  const ingredientes = (linha.receita_ingredientes ?? [])
    .slice()
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((i) => ({
      insumo: i.insumo_chave,
      qtd: Number(i.qtd),
      unidade: i.unidade,
      base: Number(i.base),
      grupo: i.grupo ?? undefined,
      observacao: i.observacao ?? undefined,
      opcional: i.opcional ?? undefined,
    }));

  return {
    id: linha.id,
    slug: linha.slug,
    nome: linha.nome,
    descricao: linha.descricao,
    categoria: linha.categoria_slug,
    subcategoria: linha.subcategoria ?? undefined,
    imagem: linha.imagem ?? undefined,
    tempoMinutos: linha.tempo_minutos,
    dificuldade: linha.dificuldade,
    rendimento: linha.rendimento,
    rendimentoUnidade: linha.rendimento_unidade,
    ingredientes,
    preparo: paraArray(linha.preparo),
    dicas: paraArray(linha.dicas),
    conservacao: linha.conservacao ?? "",
    equipamentos: paraArray(linha.equipamentos),
    tags: paraArray(linha.tags),
    objetivos: paraArray(linha.objetivos),
    linha: (linha.linha ?? "outros") as Receita["linha"],
    paraVender: linha.para_vender,
    embalagemPorUnidade: linha.embalagem_por_unidade ?? undefined,
    margemSugerida: linha.margem_sugerida ?? undefined,
    custoEstimado: linha.custo_estimado ?? undefined,
    publicadaEm: linha.publicada_em,
    novidadeAte: linha.novidade_ate ?? undefined,
    publicada: linha.publicada,
    destaque: linha.destaque ?? undefined,
  };
}

const CAMPOS = `
  id, slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada, destaque
`;

/* --------------------------------------------------------------------------
 * Filtro local (modo demonstração e busca por ingrediente)
 * ----------------------------------------------------------------------- */

export function filtrarLocal(lista: Receita[], filtros: FiltrosReceita): Receita[] {
  let itens = lista.filter((r) => r.publicada);

  if (filtros.categoria) itens = itens.filter((r) => r.categoria === filtros.categoria);
  if (filtros.subcategoria) itens = itens.filter((r) => r.subcategoria === filtros.subcategoria);
  if (filtros.dificuldade) itens = itens.filter((r) => r.dificuldade === filtros.dificuldade);
  if (filtros.tempoMaximo) itens = itens.filter((r) => r.tempoMinutos <= filtros.tempoMaximo!);
  if (filtros.objetivo) itens = itens.filter((r) => r.objetivos.includes(filtros.objetivo!));
  if (filtros.paraVender) itens = itens.filter((r) => r.paraVender);
  if (filtros.investimentoMaximo) {
    const teto = filtros.investimentoMaximo;
    itens = itens.filter((r) => (r.custoEstimado ?? custoReferencia(r)) <= teto);
  }
  if (filtros.desde) itens = itens.filter((r) => r.publicadaEm >= filtros.desde!);

  if (filtros.busca) {
    const termo = normalizar(filtros.busca);
    itens = itens.filter((r) => {
      const alvo = normalizar(
        [r.nome, r.descricao, r.categoria, r.subcategoria ?? "", r.tags.join(" ")].join(" "),
      );
      // Busca também pelo nome dos insumos, atendendo "buscar por ingrediente".
      const ingredientes = normalizar(r.ingredientes.map((i) => i.insumo).join(" "));
      return alvo.includes(termo) || ingredientes.includes(termo.replace(/\s+/g, "-"));
    });
  }

  return ordenarLocal(itens, filtros.ordem);
}

function ordenarLocal(itens: Receita[], ordem: FiltrosReceita["ordem"]): Receita[] {
  const copia = itens.slice();
  switch (ordem) {
    case "nome":
      return copia.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    case "tempo":
      return copia.sort((a, b) => a.tempoMinutos - b.tempoMinutos);
    case "faceis": {
      const peso = { facil: 0, medio: 1, avancado: 2 };
      return copia.sort((a, b) => peso[a.dificuldade] - peso[b.dificuldade]);
    }
    default:
      return copia.sort((a, b) => b.publicadaEm.localeCompare(a.publicadaEm));
  }
}

/* --------------------------------------------------------------------------
 * Consultas
 * ----------------------------------------------------------------------- */

export async function listarReceitas(filtros: FiltrosReceita = {}): Promise<ResultadoReceitas> {
  const pagina = Math.max(filtros.pagina ?? 1, 1);
  const porPagina = filtros.porPagina ?? POR_PAGINA_PADRAO;
  const supabase = await criarClienteServidor();

  if (!supabase) {
    const todas = filtrarLocal(RECEITAS, filtros);
    const inicio = (pagina - 1) * porPagina;
    return {
      itens: todas.slice(inicio, inicio + porPagina),
      total: todas.length,
      pagina,
      porPagina,
      demonstracao: true,
    };
  }

  let consulta = supabase
    .from("receitas")
    .select(`${CAMPOS}, receita_ingredientes(*)`, { count: "exact" })
    .eq("publicada", true);

  if (filtros.categoria) consulta = consulta.eq("categoria_slug", filtros.categoria);
  if (filtros.subcategoria) consulta = consulta.eq("subcategoria", filtros.subcategoria);
  if (filtros.dificuldade) consulta = consulta.eq("dificuldade", filtros.dificuldade);
  if (filtros.tempoMaximo) consulta = consulta.lte("tempo_minutos", filtros.tempoMaximo);
  if (filtros.paraVender) consulta = consulta.eq("para_vender", true);
  if (filtros.investimentoMaximo)
    consulta = consulta.lte("custo_estimado", filtros.investimentoMaximo);
  if (filtros.desde) consulta = consulta.gte("publicada_em", filtros.desde);
  if (filtros.objetivo) consulta = consulta.contains("objetivos", [filtros.objetivo]);

  if (filtros.busca) {
    // `busca_texto` é uma coluna gerada com nome, descrição, tags e insumos.
    const termo = filtros.busca.replace(/[%,()]/g, " ").trim();
    consulta = consulta.ilike("busca_texto", `%${termo}%`);
  }

  switch (filtros.ordem) {
    case "nome":
      consulta = consulta.order("nome", { ascending: true });
      break;
    case "tempo":
      consulta = consulta.order("tempo_minutos", { ascending: true });
      break;
    default:
      consulta = consulta.order("publicada_em", { ascending: false });
  }

  const inicio = (pagina - 1) * porPagina;
  const { data, count, error } = await consulta.range(inicio, inicio + porPagina - 1);

  if (error) {
    // Banco indisponível ou schema ainda não migrado: cai na demonstração em
    // vez de derrubar a página. O erro fica no log do servidor.
    console.error("[queries] listarReceitas:", error.message);
    const todas = filtrarLocal(RECEITAS, filtros);
    return {
      itens: todas.slice(inicio, inicio + porPagina),
      total: todas.length,
      pagina,
      porPagina,
      demonstracao: true,
    };
  }

  return {
    itens: (data as unknown as LinhaReceita[]).map(converterReceita),
    total: count ?? 0,
    pagina,
    porPagina,
    demonstracao: false,
  };
}

export async function obterReceita(slug: string): Promise<Receita | null> {
  const supabase = await criarClienteServidor();

  if (!supabase) {
    return RECEITAS.find((r) => r.slug === slug && r.publicada) ?? null;
  }

  const { data, error } = await supabase
    .from("receitas")
    .select(`${CAMPOS}, receita_ingredientes(*)`)
    .eq("slug", slug)
    .eq("publicada", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[queries] obterReceita:", error.message);
    return RECEITAS.find((r) => r.slug === slug && r.publicada) ?? null;
  }

  return converterReceita(data as unknown as LinhaReceita);
}

/** Receitas parecidas: mesma categoria primeiro, depois mesma linha. */
export async function receitasRelacionadas(receita: Receita, limite = 4): Promise<Receita[]> {
  const { itens } = await listarReceitas({
    categoria: receita.categoria,
    porPagina: limite + 1,
  });

  const mesmas = itens.filter((r) => r.slug !== receita.slug).slice(0, limite);
  if (mesmas.length >= limite) return mesmas;

  const { itens: extras } = await listarReceitas({ porPagina: limite * 2 });
  const complemento = extras.filter(
    (r) => r.slug !== receita.slug && !mesmas.some((m) => m.slug === r.slug),
  );

  return [...mesmas, ...complemento].slice(0, limite);
}

/** Total de receitas publicadas — alimenta o contador da Home. */
export async function contarReceitas(): Promise<number> {
  const supabase = await criarClienteServidor();

  if (!supabase) return RECEITAS.filter((r) => r.publicada).length;

  // A contagem passa por uma função do banco: assim a página pública mostra
  // o número real sem que o visitante consiga ler o catálogo inteiro.
  const { data, error } = await supabase.rpc("total_receitas_publicadas");

  if (!error && typeof data === "number") return data;
  if (error) console.error("[queries] contarReceitas:", error.message);

  const { count } = await supabase
    .from("receitas")
    .select("id", { count: "exact", head: true })
    .eq("publicada", true);

  return count ?? RECEITAS.filter((r) => r.publicada).length;
}

function diasAtras(dias: number): string {
  const data = new Date();
  data.setDate(data.getDate() - dias);
  return data.toISOString().slice(0, 10);
}

export interface ResumoNovidades {
  hoje: number;
  semana: number;
  mes: number;
  recentes: Receita[];
}

/** Novidades: contagens por período e as receitas adicionadas mais recentemente. */
export async function obterNovidades(limite = 8): Promise<ResumoNovidades> {
  const [hoje, semana, mes] = await Promise.all([
    listarReceitas({ desde: diasAtras(0), porPagina: 1 }),
    listarReceitas({ desde: diasAtras(7), porPagina: limite }),
    listarReceitas({ desde: diasAtras(30), porPagina: 1 }),
  ]);

  return {
    hoje: hoje.total,
    semana: semana.total,
    mes: mes.total,
    recentes: semana.itens.length > 0 ? semana.itens : (await listarReceitas({ porPagina: limite })).itens,
  };
}

/** Categorias com a contagem real de receitas publicadas em cada uma. */
export async function listarCategorias(): Promise<Array<Categoria & { total: number }>> {
  const supabase = await criarClienteServidor();

  if (!supabase) {
    return CATEGORIAS.map((c) => ({
      ...c,
      total: RECEITAS.filter((r) => r.categoria === c.slug && r.publicada).length,
    }));
  }

  // Mesma ideia da contagem total: uma função do banco devolve só os números.
  const { data, error } = await supabase.rpc("contagem_por_categoria");

  if (error || !Array.isArray(data)) {
    if (error) console.error("[queries] listarCategorias:", error.message);
    return CATEGORIAS.map((c) => ({
      ...c,
      total: RECEITAS.filter((r) => r.categoria === c.slug && r.publicada).length,
    }));
  }

  const contagem = new Map<string, number>();
  for (const linha of data as Array<{ categoria_slug: string; total: number }>) {
    contagem.set(linha.categoria_slug, Number(linha.total));
  }

  return CATEGORIAS.map((c) => ({ ...c, total: contagem.get(c.slug) ?? 0 }));
}

/** Receitas em destaque para a Home. */
export async function receitasDestaque(limite = 6): Promise<Receita[]> {
  const { itens } = await listarReceitas({ porPagina: limite });
  return itens;
}

/* --------------------------------------------------------------------------
 * Administração
 * ----------------------------------------------------------------------- */

export interface EstatisticasAdmin {
  totalReceitas: number;
  novasSemana: number;
  usuarios: number;
  favoritos: number;
  naoPublicadas: number;
  demonstracao: boolean;
}

export async function obterEstatisticas(supabase: SupabaseClient | null): Promise<EstatisticasAdmin> {
  if (!supabase) {
    return {
      totalReceitas: RECEITAS.filter((r) => r.publicada).length,
      novasSemana: RECEITAS.filter((r) => r.publicadaEm >= diasAtras(7)).length,
      usuarios: 0,
      favoritos: 0,
      naoPublicadas: RECEITAS.filter((r) => !r.publicada).length,
      demonstracao: true,
    };
  }

  const [total, novas, usuarios, favoritos, rascunhos] = await Promise.all([
    supabase.from("receitas").select("id", { count: "exact", head: true }).eq("publicada", true),
    supabase
      .from("receitas")
      .select("id", { count: "exact", head: true })
      .gte("publicada_em", diasAtras(7)),
    supabase.from("perfis").select("id", { count: "exact", head: true }),
    supabase.from("favoritos").select("id", { count: "exact", head: true }),
    supabase.from("receitas").select("id", { count: "exact", head: true }).eq("publicada", false),
  ]);

  return {
    totalReceitas: total.count ?? 0,
    novasSemana: novas.count ?? 0,
    usuarios: usuarios.count ?? 0,
    favoritos: favoritos.count ?? 0,
    naoPublicadas: rascunhos.count ?? 0,
    demonstracao: false,
  };
}

/** Lista para o painel: inclui receitas ainda não publicadas. */
export async function listarReceitasAdmin(
  supabase: SupabaseClient | null,
  busca?: string,
): Promise<{ itens: Receita[]; demonstracao: boolean }> {
  if (!supabase) {
    const itens = busca
      ? RECEITAS.filter((r) => normalizar(r.nome).includes(normalizar(busca)))
      : RECEITAS;
    return { itens: ordenarLocal(itens, "recentes"), demonstracao: true };
  }

  let consulta = supabase
    .from("receitas")
    .select(`${CAMPOS}, receita_ingredientes(*)`)
    .order("publicada_em", { ascending: false })
    .limit(100);

  if (busca) consulta = consulta.ilike("nome", `%${busca}%`);

  const { data, error } = await consulta;

  if (error) {
    console.error("[queries] listarReceitasAdmin:", error.message);
    return { itens: RECEITAS, demonstracao: true };
  }

  return { itens: (data as unknown as LinhaReceita[]).map(converterReceita), demonstracao: false };
}
