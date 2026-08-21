# Central de Receitas & Renda

Aplicação web de receitas brasileiras com as ferramentas de quem produz:
ajuste de rendimento, cálculo de custo, preço de venda, lista de compras e
simulações de produção.

Não é um e-book nem um PDF: é um sistema com conta individual, banco de dados
e painel administrativo, preparado para ser vendido por acesso em plataformas
como Hotmart, Kiwify ou Braip.

> Este projeto vive na pasta `apps/receitas` do repositório e **não tem
> ligação com o site do Leuname Software**. São dois produtos separados, com
> deploy, domínio e banco próprios.

---

## O que já está pronto e funcionando

| Área | Situação |
| --- | --- |
| Catálogo com 43 receitas completas e 97 insumos com preço de referência | pronto |
| Ajuste de rendimento recalculando ingredientes e custos | pronto |
| Calculadora de custos e de preço de venda | pronto |
| Lista de compras consolidada por seção do mercado | pronto |
| Favoritos, coleções e "Meus preços" | pronto |
| Central de Renda e Simulador de Objetivos | pronto |
| Busca por nome, ingrediente, categoria e objetivo, com filtros | pronto |
| Novidades com contagem por período e selo automático | pronto |
| Página pública de vendas e demonstração gratuita | pronto |
| Login, cadastro e recuperação de senha (Supabase Auth) | pronto — **precisa configurar o Supabase** |
| Painel administrativo com cadastro e publicação de receitas | pronto — **precisa configurar o Supabase** |
| Webhook da plataforma de venda (liberar/revogar acesso) | pronto — **precisa do hottok e da service role** |
| Assistente com IA | **não implementado** — só a estrutura e o aviso honesto na tela |

O que depende de configuração externa está descrito, passo a passo, em `docs/`.

---

## Como rodar na sua máquina

```bash
cd apps/receitas
npm install
cp .env.example .env.local   # pode deixar vazio para conhecer o sistema
npm run dev
```

Abra <http://localhost:3000>.

Sem as variáveis do Supabase, o projeto roda em **modo demonstração**: o
catálogo vem do arquivo local e seus favoritos, listas e preços ficam salvos
apenas naquele navegador. A interface avisa isso — nada é escondido.

---

## Colocando no ar

A ordem recomendada:

1. **`docs/SUPABASE.md`** — criar o banco, rodar a migração e carregar as receitas.
2. **`docs/VERCEL.md`** — publicar o site e apontar o domínio.
3. **`docs/HOTMART.md`** — ligar a venda e a liberação automática de acesso.
4. **`docs/MANUTENCAO.md`** — cadastrar receitas novas no dia a dia.
5. **`docs/BACKUP.md`** — cópia de segurança e recuperação.

Documentos de apoio: `docs/BANCO.md` (estrutura das tabelas),
`docs/IDENTIDADE-VISUAL.md` (cores, tipografia e componentes) e
`docs/ASSISTENTE-IA.md` (o que falta para ligar a IA).

---

## Comandos

```bash
npm run dev          # ambiente de desenvolvimento
npm run build        # build de produção
npm run start        # roda o build
npm run typecheck    # confere os tipos
npm run gerar:seed   # regera supabase/seed/seed.sql a partir de src/data
npm run testar       # testes em navegador real (veja abaixo)
```

### Testes automatizados

O projeto acompanha uma bateria de testes que abre um navegador de verdade e
confere o que o cliente realmente faz: abrir receita, mudar rendimento,
favoritar, montar a lista de compras, editar preços e simular produção. Também
verifica se alguma tela ganha rolagem horizontal no celular.

```bash
npm install --no-save playwright     # só na primeira vez
npm run build
npm run start -- -p 3200             # num terminal
npm run testar                       # noutro terminal
```

O Playwright fica fora das dependências de propósito: ele baixa navegadores na
instalação e deixaria o deploy bem mais pesado.

---

## Estrutura

```
apps/receitas/
├── src/
│   ├── app/
│   │   ├── (app)/           telas da área do cliente (barra lateral + inferior)
│   │   ├── admin/           painel administrativo
│   │   ├── api/webhooks/    webhook da plataforma de venda
│   │   ├── auth/            retorno de e-mail e logout
│   │   ├── demonstracao/    amostra pública
│   │   └── page.tsx         página de vendas
│   ├── components/          interface, por área
│   ├── data/                catálogo curado (receitas, insumos, categorias)
│   └── lib/                 cálculos, consultas, tipos e dados do usuário
├── scripts/gerar-seed.mjs   gera o SQL de carga a partir de src/data
├── supabase/
│   ├── migrations/          estrutura do banco (rodar primeiro)
│   └── seed/                carga do catálogo (rodar depois)
└── docs/                    documentação de operação
```

---

## Sobre os números financeiros

Todas as telas com dinheiro mostram **simulação**, nunca promessa. Os valores
partem dos preços de referência de mercado ou dos preços que o próprio usuário
cadastra, e a interface diz isso de forma explícita em cada tela. O produto não
promete renda, e não deve ser anunciado como se prometesse.
