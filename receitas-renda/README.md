# Central de Receitas & Renda

Aplicativo de receitas com calculadora de custo/preço/lucro embutida (`/app`)
e painel administrativo completo (`/admin`), rodando sobre o mesmo banco de
dados Supabase — qualquer alteração feita no painel aparece no app na hora.

## Stack

- **React + Vite + TypeScript + Tailwind CSS**
- **Supabase** (Postgres + Auth + Storage + Row Level Security)
- **Vercel** para deploy (frontend estático + funções serverless em `/api`)
- **Hotmart** para pagamentos/assinaturas, via webhook validado por assinatura

## Estrutura

```
src/
├── App.tsx                    Rotas de /app e /admin
├── lib/
│   ├── supabase.ts            Client Supabase (chaves públicas, protegido por RLS)
│   ├── calc.ts                Motor único de cálculo de custo/preço/lucro
│   ├── settings.ts            Leitura/escrita da tabela settings
│   ├── types.ts                Tipos que espelham o schema do banco
│   └── auth/                  AuthContext (/app) e AdminAuthContext (/admin)
├── components/
│   ├── app/                   Sidebar, Topbar, RecipeCard, layout do /app
│   ├── admin/                 Sidebar, Topbar, gráficos, tabela CRUD genérica
│   └── common/                Ícones, imagem de receita com placeholder
└── pages/
    ├── app/                   Início, Receitas, Categorias, Buscar, ficha da
    │                          receita, Calculadoras, Central de Renda,
    │                          Simulador, Lista de Compras, Favoritos,
    │                          Coleções, Novidades, Meu Plano, Assistente IA
    └── admin/                 Dashboard, Receitas, Ingredientes, Categorias,
                               Usuários, Planos, Assinaturas, Novidades,
                               Banners, Comentários, Notificações, Relatórios,
                               Suporte, Administradores, Permissões, Logs,
                               Configurações
api/
├── webhook/hotmart.ts         Recebe eventos da Hotmart e ativa/cancela assinaturas
└── admin/invite.ts            Convida um novo administrador (service role)
supabase/
├── migrations/0001_init.sql   Schema completo + Row Level Security
├── seed.sql                   Papéis, permissões, planos, categorias,
│                              ingredientes e as 8 receitas de exemplo
└── promote_super_admin.sql    Como criar o primeiro Super Admin
```

## 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. **SQL Editor** → cole e rode `supabase/migrations/0001_init.sql` (cria as
   tabelas, ativa Row Level Security e cria as políticas de acesso).
3. **SQL Editor** → rode `supabase/seed.sql` (cadastra papéis, permissões,
   categorias, planos, os 24 ingredientes e as 8 receitas de exemplo com
   custo, rendimento e modo de preparo reais).
4. **Authentication → Providers**: deixe "Email" habilitado (login por
   e-mail/senha, usado tanto no app quanto no painel).
5. Crie o primeiro administrador:
   - Vá em **Authentication → Users → Add user** e crie uma conta com seu
     e-mail (ou cadastre-se pelo app em `/app/registro`).
   - Copie o UUID desse usuário.
   - Abra `supabase/promote_super_admin.sql`, troque o UUID/nome/e-mail e
     rode no SQL Editor. Isso te torna **Super Admin** do painel.
6. **Project Settings → API** → copie:
   - `Project URL` → `VITE_SUPABASE_URL` e `SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ nunca no frontend)
7. (Opcional) **Storage** → crie um bucket público `recipe-images` se quiser
   fazer upload de fotos de receitas em vez de colar uma URL externa.

## 2. Rodar localmente

```bash
npm install
cp .env.example .env
# preencha .env com as chaves do passo 1
npm run dev
```

- App do assinante: `http://localhost:5173/app`
- Painel administrativo: `http://localhost:5173/admin`

Sem as chaves do Supabase configuradas, as telas de login mostram um aviso
em vez de travar — dá para navegar pela interface, mas nada é salvo.

## 3. GitHub

```bash
git add -A
git commit -m "Central de Receitas & Renda"
git push
```

## 4. Deploy na Vercel

1. Importe o repositório do GitHub em [vercel.com/new](https://vercel.com/new).
2. **Root Directory**: `receitas-renda` (se o projeto estiver dentro de um
   repositório com outras pastas).
3. Framework detectado automaticamente: **Vite**. Build command
   `npm run build`, output `dist` (já configurado em `vercel.json`).
4. Em **Environment Variables**, adicione as mesmas chaves do `.env.example`:
   `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `HOTMART_HOTTOK`.
5. Deploy. As funções em `/api/webhook/hotmart` e `/api/admin/invite` sobem
   automaticamente como Serverless Functions.

## 5. Configurar a Hotmart

1. Dentro do produto na Hotmart: **Ferramentas → Webhook** → cadastre a URL
   `https://SEU-DOMINIO.vercel.app/api/webhook/hotmart`.
2. Copie o **Hottok** exibido na tela e cole em `HOTMART_HOTTOK` (Vercel).
3. Em **Planos**, cada plano tem um campo "Código da oferta"
   (`hotmart_offer_code`) e "ID do produto" (`hotmart_product_id") — no painel
   `/admin/planos`, preencha esses campos com os códigos da sua oferta na
   Hotmart, para o webhook saber qual plano liberar.
4. Eventos tratados automaticamente:
   - **Ativam a assinatura**: compra aprovada/completa, reativação.
   - **Cancelam a assinatura**: cancelamento, reembolso, chargeback,
     expiração, contestação.
   - Se o comprador ainda não tem conta no app, ela é criada automaticamente
     (convite por e-mail) e a assinatura é vinculada a ela.
5. A assinatura de todo webhook é validada pelo header `X-Hotmart-Hottok`
   (ou pelo campo `hottok` do corpo) antes de qualquer processamento —
   requisições sem o token correto são rejeitadas com `401`.

## Papéis administrativos

| Papel | Acesso |
|---|---|
| **Super Admin** | Tudo, incluindo gerenciar outros administradores e permissões |
| **Admin** | Tudo, exceto criar administradores ou alterar permissões |
| **Editor** | Receitas, ingredientes, categorias, novidades e banners |
| **Suporte** | Usuários, comentários, notificações e chamados de suporte |

As permissões de cada papel podem ser ajustadas em `/admin/permissoes` e são
aplicadas de verdade — tanto na interface (botões somem) quanto no banco
(Row Level Security bloqueia a escrita mesmo que alguém chame a API direto).

## Como o cálculo de custo/preço funciona

Todo o cálculo mora em `src/lib/calc.ts` e é usado igual no app e no painel:

1. **Custo dos ingredientes** = soma de `preço por unidade do ingrediente ×
   quantidade usada`, escalado pelo rendimento ajustado na tela.
2. **Custo total** = custo dos ingredientes + embalagem + outros custos.
3. **Preço sugerido** = custo por unidade ÷ (1 − margem de lucro desejada).
4. **Faturamento** = preço sugerido × rendimento. **Lucro** = faturamento −
   custo total.

Como o preço do ingrediente (`ingredients.price_per_unit`) é uma coluna
calculada no banco (`package_price / package_quantity`), alterar o preço de
um ingrediente no painel recalcula instantaneamente o custo de toda receita
que o usa — no admin e no app, sem nenhum passo manual.

## Segurança

- Toda tabela tem **Row Level Security** ativado (`supabase/migrations/0001_init.sql`).
- A `service_role key` da Supabase e o `HOTMART_HOTTOK` só existem como
  variáveis de ambiente do servidor (`/api`) — nunca chegam ao navegador.
- O painel `/admin` não aparece no menu do app e exige login separado; cada
  ação é registrada em `system_logs` com o administrador responsável.
