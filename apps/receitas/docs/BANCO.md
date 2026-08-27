# 6. Estrutura do banco de dados

Referência das tabelas criadas por
`supabase/migrations/0001_estrutura_inicial.sql`.

---

## 6.1 Contas e acesso

| Tabela | Para que serve |
| --- | --- |
| `perfis` | espelha `auth.users` e guarda nome, papel (`cliente`/`admin`), situação de acesso, plano e as respostas do primeiro acesso |
| `acessos_liberados` | e-mails liberados pela plataforma de venda; permite que a compra chegue antes de a pessoa criar a conta |
| `eventos_compra` | histórico bruto do que a plataforma enviou; serve de auditoria e permite reprocessar |

O gatilho `on_auth_user_created` cria o perfil no cadastro e já aplica o acesso
que estiver liberado para aquele e-mail.

---

## 6.2 Catálogo

| Tabela | Para que serve |
| --- | --- |
| `categorias` | as 9 categorias da biblioteca |
| `subcategorias` | subdivisões de cada categoria |
| `insumos` | ingredientes com embalagem e preço de referência |
| `receitas` | a receita em si |
| `receita_ingredientes` | ligação entre receita e insumo, com quantidade |

### Por que as tags ficam como coluna e não como tabela

As tags são um `text[]` dentro de `receitas`, com índice GIN, em vez de duas
tabelas (`tags` + `receita_tags`). O motivo é prático: a tag aqui é rótulo de
busca, não entidade com dados próprios. Manter duas tabelas exigiria sincronizar
os dois lados a cada edição — e é exatamente aí que aparecem tags órfãs e listas
que não batem. Com o índice GIN, filtrar por tag continua rápido mesmo com
milhares de receitas.

### A coluna `busca_texto`

Guarda nome, descrição, categoria, tags e o nome dos ingredientes num único
texto em minúsculas. É preenchida por gatilho sempre que a receita ou seus
ingredientes mudam, e tem índice trigram (`pg_trgm`). É o que faz a busca por
ingrediente ("morango", "polvilho") funcionar rápido.

### A coluna `custo_estimado`

Custo da receita com os preços de referência, gravado quando a receita é salva.
Existe para o filtro "investimento até R$ 50" funcionar direto no banco, sem
recalcular todas as receitas a cada consulta.

### A coluna `demonstracao`

Marca quais receitas a amostra pública pode mostrar. Só elas são visíveis para
quem não tem conta — o restante do catálogo fica protegido pelas políticas de
segurança.

---

## 6.3 Dados de cada usuário

| Tabela | Para que serve |
| --- | --- |
| `favoritos` | receitas salvas |
| `colecoes` / `colecao_receitas` | coleções e o que há dentro delas |
| `lista_itens` | lista de compras consolidada |
| `precos_usuario` | preços que o usuário ajustou ("Meus preços") |
| `calculos` | histórico de cálculos salvos |
| `planos_producao` | planos de produção montados |
| `metas` | objetivos definidos no simulador |
| `notificacoes` | avisos internos (`user_id` nulo = aviso geral) |
| `visualizacoes` | receitas vistas recentemente |

Todas seguem a mesma regra de segurança: cada pessoa só enxerga e altera o que
é dela.

---

## 6.4 Segurança por linha (RLS)

Está ligada em **todas** as tabelas. Em resumo:

- **Receitas**: administrador vê tudo; cliente com acesso `ativo` vê o que está
  publicado; visitante sem conta vê apenas as marcadas como `demonstracao`.
- **Dados do usuário**: só o dono.
- **Acessos e eventos de compra**: só administrador (o webhook usa a chave
  `service_role`, que passa por cima do RLS por natureza).
- **Categorias, subcategorias e insumos**: leitura livre — são estrutura, não
  conteúdo pago.

A função `public.eh_admin()` centraliza a checagem de administrador.

### Funções públicas

`total_receitas_publicadas()` e `contagem_por_categoria()` devolvem apenas
números. É assim que a página de vendas mostra a contagem real de receitas sem
expor o catálogo a quem não comprou.

---

## 6.5 Consultas úteis

```sql
-- Quantas receitas por categoria
select categoria_slug, count(*) from public.receitas
where publicada group by categoria_slug order by 2 desc;

-- Receitas mais favoritadas
select receita_slug, count(*) as favoritos from public.favoritos
group by receita_slug order by favoritos desc limit 20;

-- Clientes que entraram nos últimos 7 dias
select email, criado_em, acesso from public.perfis
where criado_em > now() - interval '7 days' order by criado_em desc;

-- Eventos de compra recentes
select evento, email, produto, recebido_em from public.eventos_compra
order by recebido_em desc limit 20;

-- Receitas sem foto (candidatas a receber imagem)
select slug, nome from public.receitas where imagem is null order by nome;
```
