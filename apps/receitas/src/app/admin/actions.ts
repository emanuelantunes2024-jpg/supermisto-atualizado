"use server";

import { revalidatePath } from "next/cache";

import { calcularCusto } from "@/lib/calculos";
import { exigirAdmin } from "@/lib/auth";
import { criarClienteServidor } from "@/lib/supabase/server";
import type { Receita } from "@/lib/types";

/**
 * Ações do painel administrativo.
 *
 * Toda ação confere se quem chamou é administrador. As políticas de RLS do
 * Supabase repetem essa checagem no banco: mesmo que alguém chame a ação por
 * fora, sem o papel de admin a escrita é recusada.
 */

export interface ResultadoAcao {
  ok: boolean;
  mensagem: string;
}

const SEM_PERMISSAO: ResultadoAcao = {
  ok: false,
  mensagem: "Você não tem permissão para esta ação.",
};

const SEM_BANCO: ResultadoAcao = {
  ok: false,
  mensagem:
    "O Supabase ainda não está configurado neste ambiente. Preencha as variáveis de ambiente para poder salvar receitas.",
};

/** Dados que o formulário do painel envia. */
export interface EntradaReceita {
  id?: string;
  slug: string;
  nome: string;
  descricao: string;
  categoria: string;
  subcategoria?: string;
  imagem?: string;
  tempoMinutos: number;
  dificuldade: Receita["dificuldade"];
  rendimento: number;
  rendimentoUnidade: string;
  ingredientes: Receita["ingredientes"];
  preparo: Receita["preparo"];
  dicas: string[];
  conservacao: string;
  equipamentos: string[];
  tags: string[];
  objetivos: Receita["objetivos"];
  linha: Receita["linha"];
  paraVender: boolean;
  embalagemPorUnidade?: number;
  margemSugerida?: number;
  publicadaEm: string;
  novidadeAte?: string;
  publicada: boolean;
  destaque: boolean;
}

/** Gera o slug a partir do nome, sem acentos e sem caracteres estranhos. */
export async function gerarSlug(nome: string): Promise<string> {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function salvarReceita(entrada: EntradaReceita): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();
  if (!sessao) return SEM_PERMISSAO;

  const supabase = await criarClienteServidor();
  if (!supabase) return SEM_BANCO;

  if (!entrada.nome.trim()) return { ok: false, mensagem: "O nome da receita é obrigatório." };
  if (!entrada.slug.trim()) return { ok: false, mensagem: "O endereço (slug) é obrigatório." };
  if (entrada.ingredientes.length === 0) {
    return { ok: false, mensagem: "Cadastre pelo menos um ingrediente." };
  }

  // O custo estimado é gravado junto para permitir filtrar por faixa de
  // investimento sem recalcular tudo a cada consulta.
  const custoEstimado = calcularCusto({
    ...(entrada as unknown as Receita),
    id: entrada.id ?? entrada.slug,
  }).custoTotal;

  const linha = {
    slug: entrada.slug.trim(),
    nome: entrada.nome.trim(),
    descricao: entrada.descricao.trim(),
    categoria_slug: entrada.categoria,
    subcategoria: entrada.subcategoria || null,
    imagem: entrada.imagem || null,
    tempo_minutos: entrada.tempoMinutos,
    dificuldade: entrada.dificuldade,
    rendimento: entrada.rendimento,
    rendimento_unidade: entrada.rendimentoUnidade,
    preparo: entrada.preparo,
    dicas: entrada.dicas,
    conservacao: entrada.conservacao,
    equipamentos: entrada.equipamentos,
    tags: entrada.tags,
    objetivos: entrada.objetivos,
    linha: entrada.linha,
    para_vender: entrada.paraVender,
    embalagem_por_unidade: entrada.embalagemPorUnidade ?? null,
    margem_sugerida: entrada.margemSugerida ?? null,
    custo_estimado: Number(custoEstimado.toFixed(2)),
    publicada_em: entrada.publicadaEm,
    novidade_ate: entrada.novidadeAte || null,
    publicada: entrada.publicada,
    destaque: entrada.destaque,
    atualizada_em: new Date().toISOString(),
  };

  const { data, error } = entrada.id
    ? await supabase.from("receitas").update(linha).eq("id", entrada.id).select("id").single()
    : await supabase.from("receitas").insert(linha).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, mensagem: "Já existe uma receita com esse endereço (slug)." };
    }
    return { ok: false, mensagem: `Não foi possível salvar: ${error.message}` };
  }

  const receitaId = data.id as string;

  // Ingredientes são regravados por inteiro: é mais simples e mais seguro
  // do que tentar casar linha a linha o que mudou no formulário.
  await supabase.from("receita_ingredientes").delete().eq("receita_id", receitaId);

  const ingredientes = entrada.ingredientes.map((ingrediente, ordem) => ({
    receita_id: receitaId,
    insumo_chave: ingrediente.insumo,
    qtd: ingrediente.qtd,
    unidade: ingrediente.unidade,
    base: ingrediente.base,
    grupo: ingrediente.grupo || null,
    observacao: ingrediente.observacao || null,
    opcional: ingrediente.opcional ?? false,
    ordem,
  }));

  const { error: erroIngredientes } = await supabase
    .from("receita_ingredientes")
    .insert(ingredientes);

  if (erroIngredientes) {
    return {
      ok: false,
      mensagem: `A receita foi salva, mas os ingredientes falharam: ${erroIngredientes.message}`,
    };
  }

  revalidarTudo(entrada.slug);

  return { ok: true, mensagem: entrada.id ? "Receita atualizada." : "Receita criada." };
}

export async function alternarPublicacao(id: string, publicada: boolean): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();
  if (!sessao) return SEM_PERMISSAO;

  const supabase = await criarClienteServidor();
  if (!supabase) return SEM_BANCO;

  const { error } = await supabase.from("receitas").update({ publicada }).eq("id", id);
  if (error) return { ok: false, mensagem: error.message };

  revalidarTudo();
  return { ok: true, mensagem: publicada ? "Receita publicada." : "Receita retirada do ar." };
}

export async function marcarNovidade(id: string, dias: number | null): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();
  if (!sessao) return SEM_PERMISSAO;

  const supabase = await criarClienteServidor();
  if (!supabase) return SEM_BANCO;

  let novidadeAte: string | null = null;
  if (dias !== null) {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    novidadeAte = data.toISOString().slice(0, 10);
  }

  const { error } = await supabase.from("receitas").update({ novidade_ate: novidadeAte }).eq("id", id);
  if (error) return { ok: false, mensagem: error.message };

  revalidarTudo();
  return {
    ok: true,
    mensagem: dias === null ? "Selo de novidade removido." : `Marcada como novidade por ${dias} dias.`,
  };
}

export async function excluirReceita(id: string): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();
  if (!sessao) return SEM_PERMISSAO;

  const supabase = await criarClienteServidor();
  if (!supabase) return SEM_BANCO;

  const { error } = await supabase.from("receitas").delete().eq("id", id);
  if (error) return { ok: false, mensagem: error.message };

  revalidarTudo();
  return { ok: true, mensagem: "Receita excluída." };
}

/** Muda a situação de acesso de um cliente (usado em cancelamentos manuais). */
export async function definirAcessoUsuario(
  userId: string,
  acesso: "ativo" | "suspenso" | "cancelado",
): Promise<ResultadoAcao> {
  const sessao = await exigirAdmin();
  if (!sessao) return SEM_PERMISSAO;

  const supabase = await criarClienteServidor();
  if (!supabase) return SEM_BANCO;

  const { error } = await supabase.from("perfis").update({ acesso }).eq("id", userId);
  if (error) return { ok: false, mensagem: error.message };

  revalidatePath("/admin/usuarios");
  return { ok: true, mensagem: `Acesso atualizado para "${acesso}".` };
}

/** Limpa o cache das telas que mostram receitas. */
function revalidarTudo(slug?: string) {
  revalidatePath("/inicio");
  revalidatePath("/receitas");
  revalidatePath("/novidades");
  revalidatePath("/categorias");
  revalidatePath("/admin");
  revalidatePath("/admin/receitas");
  revalidatePath("/");
  if (slug) revalidatePath(`/receitas/${slug}`);
}
