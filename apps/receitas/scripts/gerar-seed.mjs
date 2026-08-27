#!/usr/bin/env node
/**
 * Gera `supabase/seed/seed.sql` a partir do catálogo em `src/data`.
 *
 * Uso:  npm run gerar:seed
 *
 * O arquivo resultante é o que carrega insumos, categorias e receitas no
 * Supabase. Rode-o depois da migração `0001_estrutura_inicial.sql`.
 * Ele usa UPSERT: pode ser reaplicado sem duplicar nada.
 */

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..");
const temporario = join(raiz, ".seed-tmp");
const require = createRequire(import.meta.url);

/* -------------------------------------------------------------------------
 * 1. Compila os arquivos de dados (TypeScript) para poder importá-los aqui.
 * ---------------------------------------------------------------------- */

rmSync(temporario, { recursive: true, force: true });

try {
  execFileSync("npx", ["tsc", "-p", join(aqui, "tsconfig.seed.json")], {
    cwd: raiz,
    stdio: "pipe",
  });
} catch (erro) {
  // O tsc emite o JavaScript mesmo quando reclama de tipos; só interrompemos
  // se a saída realmente não tiver sido gerada.
  const saida = erro.stdout?.toString() ?? "";
  if (saida.trim()) console.warn("[seed] avisos do TypeScript:\n" + saida);
}

const { INSUMOS } = require(join(temporario, "data/insumos.js"));
const { CATEGORIAS } = require(join(temporario, "data/categorias.js"));
const { RECEITAS } = require(join(temporario, "data/receitas/index.js"));
const { RECEITAS_DEMONSTRACAO } = require(join(temporario, "lib/demonstracao.js"));

/* -------------------------------------------------------------------------
 * 2. Ajudantes de escrita de SQL
 * ---------------------------------------------------------------------- */

/** Texto seguro para SQL: aspas simples viram duas. */
function txt(valor) {
  if (valor === undefined || valor === null || valor === "") return "null";
  return `'${String(valor).replace(/'/g, "''")}'`;
}

function num(valor) {
  if (valor === undefined || valor === null || Number.isNaN(valor)) return "null";
  return String(valor);
}

function bool(valor) {
  return valor ? "true" : "false";
}

/** Array de texto do Postgres. */
function arr(lista) {
  if (!lista || lista.length === 0) return "'{}'";
  const itens = lista.map((i) => `"${String(i).replace(/"/g, '\\"')}"`).join(",");
  return `'{${itens.replace(/'/g, "''")}}'`;
}

/** JSON para coluna jsonb. */
function json(valor) {
  return `${txt(JSON.stringify(valor ?? []))}::jsonb`;
}

const INDICE_INSUMOS = Object.fromEntries(INSUMOS.map((i) => [i.chave, i]));

/**
 * Custo da receita com os preços de referência.
 * Repete a conta de `src/lib/calculos.ts` de propósito: este script roda fora
 * do Next e não deve arrastar o resto da aplicação junto.
 */
function custoEstimado(receita) {
  const ingredientes = receita.ingredientes
    .filter((ing) => !ing.opcional)
    .reduce((soma, ing) => {
      const insumo = INDICE_INSUMOS[ing.insumo];
      if (!insumo || insumo.embalagem <= 0) return soma;
      return soma + (ing.base / insumo.embalagem) * insumo.precoRef;
    }, 0);

  const embalagem = (receita.embalagemPorUnidade ?? 0) * receita.rendimento;
  return Number((ingredientes + embalagem).toFixed(2));
}

/* -------------------------------------------------------------------------
 * 3. Monta o arquivo
 * ---------------------------------------------------------------------- */

const linhas = [];

linhas.push(`-- ============================================================================
-- CENTRAL DE RECEITAS & RENDA — carga inicial do catálogo
--
-- GERADO AUTOMATICAMENTE por scripts/gerar-seed.mjs. Não edite à mão:
-- altere os arquivos em src/data e rode \`npm run gerar:seed\` de novo.
--
-- Gerado em: ${new Date().toISOString()}
-- Conteúdo:  ${INSUMOS.length} insumos, ${CATEGORIAS.length} categorias, ${RECEITAS.length} receitas.
--
-- Rode este arquivo DEPOIS da migração 0001_estrutura_inicial.sql.
-- Pode ser reaplicado: tudo usa UPSERT.
-- ============================================================================
`);

/* --------------------------------------------------------------- insumos */

linhas.push("\n-- ---------------------------------------------------------------- insumos");
linhas.push("insert into public.insumos (chave, nome, unidade_base, embalagem, embalagem_rotulo, preco_ref, secao) values");
linhas.push(
  INSUMOS.map(
    (i) =>
      `  (${txt(i.chave)}, ${txt(i.nome)}, ${txt(i.unidadeBase)}, ${num(i.embalagem)}, ${txt(i.embalagemRotulo)}, ${num(i.precoRef)}, ${txt(i.secao)})`,
  ).join(",\n"),
);
linhas.push(`on conflict (chave) do update set
  nome = excluded.nome,
  unidade_base = excluded.unidade_base,
  embalagem = excluded.embalagem,
  embalagem_rotulo = excluded.embalagem_rotulo,
  preco_ref = excluded.preco_ref,
  secao = excluded.secao;`);

/* ------------------------------------------------------------ categorias */

linhas.push("\n-- ------------------------------------------------------------- categorias");
linhas.push("insert into public.categorias (slug, nome, descricao, icone, cor, ordem) values");
linhas.push(
  CATEGORIAS.map(
    (c) =>
      `  (${txt(c.slug)}, ${txt(c.nome)}, ${txt(c.descricao)}, ${txt(c.icone)}, ${txt(c.cor)}, ${num(c.ordem)})`,
  ).join(",\n"),
);
linhas.push(`on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  icone = excluded.icone,
  cor = excluded.cor,
  ordem = excluded.ordem;`);

/* --------------------------------------------------------- subcategorias */

linhas.push("\n-- ---------------------------------------------------------- subcategorias");
const subcategorias = CATEGORIAS.flatMap((c) =>
  c.subcategorias.map((nome, ordem) => ({ categoria: c.slug, nome, ordem })),
);
linhas.push("insert into public.subcategorias (categoria_slug, nome, ordem) values");
linhas.push(
  subcategorias
    .map((s) => `  (${txt(s.categoria)}, ${txt(s.nome)}, ${num(s.ordem)})`)
    .join(",\n"),
);
linhas.push("on conflict (categoria_slug, nome) do update set ordem = excluded.ordem;");

/* ---------------------------------------------------------------- receitas */

linhas.push("\n-- --------------------------------------------------------------- receitas");

for (const receita of RECEITAS) {
  const demonstracao = RECEITAS_DEMONSTRACAO.includes(receita.slug);

  linhas.push(`
-- ${receita.nome}
insert into public.receitas (
  slug, nome, descricao, categoria_slug, subcategoria, imagem, tempo_minutos,
  dificuldade, rendimento, rendimento_unidade, preparo, dicas, conservacao,
  equipamentos, tags, objetivos, linha, para_vender, embalagem_por_unidade,
  margem_sugerida, custo_estimado, publicada_em, novidade_ate, publicada,
  destaque, demonstracao
) values (
  ${txt(receita.slug)}, ${txt(receita.nome)}, ${txt(receita.descricao)},
  ${txt(receita.categoria)}, ${txt(receita.subcategoria)}, ${txt(receita.imagem)},
  ${num(receita.tempoMinutos)}, ${txt(receita.dificuldade)}, ${num(receita.rendimento)},
  ${txt(receita.rendimentoUnidade)}, ${json(receita.preparo)}, ${json(receita.dicas)},
  ${txt(receita.conservacao)}, ${json(receita.equipamentos)}, ${arr(receita.tags)},
  ${arr(receita.objetivos)}, ${txt(receita.linha)}, ${bool(receita.paraVender)},
  ${num(receita.embalagemPorUnidade)}, ${num(receita.margemSugerida)},
  ${num(custoEstimado(receita))}, ${txt(receita.publicadaEm)}, ${txt(receita.novidadeAte)},
  ${bool(receita.publicada)}, ${bool(receita.destaque)}, ${bool(demonstracao)}
)
on conflict (slug) do update set
  nome = excluded.nome,
  descricao = excluded.descricao,
  categoria_slug = excluded.categoria_slug,
  subcategoria = excluded.subcategoria,
  tempo_minutos = excluded.tempo_minutos,
  dificuldade = excluded.dificuldade,
  rendimento = excluded.rendimento,
  rendimento_unidade = excluded.rendimento_unidade,
  preparo = excluded.preparo,
  dicas = excluded.dicas,
  conservacao = excluded.conservacao,
  equipamentos = excluded.equipamentos,
  tags = excluded.tags,
  objetivos = excluded.objetivos,
  linha = excluded.linha,
  para_vender = excluded.para_vender,
  embalagem_por_unidade = excluded.embalagem_por_unidade,
  margem_sugerida = excluded.margem_sugerida,
  custo_estimado = excluded.custo_estimado,
  publicada_em = excluded.publicada_em,
  novidade_ate = excluded.novidade_ate,
  publicada = excluded.publicada,
  destaque = excluded.destaque,
  demonstracao = excluded.demonstracao,
  atualizada_em = now();

-- ingredientes de ${receita.slug}
delete from public.receita_ingredientes
where receita_id = (select id from public.receitas where slug = ${txt(receita.slug)});

insert into public.receita_ingredientes
  (receita_id, insumo_chave, qtd, unidade, base, grupo, observacao, opcional, ordem)
values`);

  linhas.push(
    receita.ingredientes
      .map(
        (ing, ordem) =>
          `  ((select id from public.receitas where slug = ${txt(receita.slug)}), ${txt(ing.insumo)}, ${num(ing.qtd)}, ${txt(ing.unidade)}, ${num(ing.base)}, ${txt(ing.grupo)}, ${txt(ing.observacao)}, ${bool(ing.opcional)}, ${ordem})`,
      )
      .join(",\n") + ";",
  );
}

linhas.push(`
-- ============================================================================
-- Conferência rápida (o resultado deve bater com os números do cabeçalho)
-- ============================================================================
-- select count(*) as insumos from public.insumos;
-- select count(*) as receitas from public.receitas where publicada;
-- select count(*) as ingredientes from public.receita_ingredientes;
`);

/* -------------------------------------------------------------------------
 * 4. Grava e limpa
 * ---------------------------------------------------------------------- */

const destino = join(raiz, "supabase", "seed");
mkdirSync(destino, { recursive: true });

const arquivo = join(destino, "seed.sql");
writeFileSync(arquivo, linhas.join("\n") + "\n", "utf8");

rmSync(temporario, { recursive: true, force: true });

const ingredientes = RECEITAS.reduce((soma, r) => soma + r.ingredientes.length, 0);

console.log(`[seed] supabase/seed/seed.sql gerado.`);
console.log(
  `[seed] ${INSUMOS.length} insumos · ${CATEGORIAS.length} categorias · ${RECEITAS.length} receitas · ${ingredientes} ingredientes.`,
);
