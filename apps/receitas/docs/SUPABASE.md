# 1. Configurar o Supabase

O Supabase é o banco de dados, o sistema de login e o armazenamento das fotos.
Sem ele o projeto roda só em modo demonstração.

Tempo estimado: 15 minutos.

---

## 1.1 Criar o projeto

1. Acesse <https://supabase.com> e crie uma conta (o plano gratuito atende bem
   o início).
2. Clique em **New project**.
3. Preencha:
   - **Name**: `central-receitas-renda`
   - **Database Password**: gere uma senha forte e **guarde em lugar seguro**
     (ela é necessária para restaurar backups).
   - **Region**: `South America (São Paulo)` — o mais próximo do seu público.
4. Aguarde a criação (leva cerca de 2 minutos).

---

## 1.2 Copiar as chaves

No painel do projeto, vá em **Project Settings → API** e copie:

| Campo no Supabase | Variável no projeto |
| --- | --- |
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `service_role` `secret` | `SUPABASE_SERVICE_ROLE_KEY` |

> A chave `service_role` ignora todas as regras de segurança do banco. Ela só
> pode ficar no servidor. Nunca a coloque em variável que comece com
> `NEXT_PUBLIC_`, nunca a mande por WhatsApp e nunca a suba para o GitHub.

Cole as três no seu `.env.local` (copiado de `.env.example`).

---

## 1.3 Criar a estrutura do banco

1. No Supabase, abra **SQL Editor → New query**.
2. Abra o arquivo `supabase/migrations/0001_estrutura_inicial.sql` deste
   projeto, copie **todo** o conteúdo e cole no editor.
3. Clique em **Run**.

Deve aparecer `Success. No rows returned`. Esse arquivo cria as tabelas, os
índices, as políticas de segurança, os gatilhos e o bucket de fotos. Ele pode
ser executado mais de uma vez sem quebrar nada.

---

## 1.4 Carregar as receitas

1. Ainda no **SQL Editor**, abra uma nova query.
2. Copie todo o conteúdo de `supabase/seed/seed.sql` e cole.
3. Clique em **Run**.

Para conferir, rode:

```sql
select count(*) as receitas from public.receitas where publicada;
select count(*) as insumos from public.insumos;
```

Deve retornar 43 receitas e 97 insumos.

> Se você alterar as receitas em `src/data`, rode `npm run gerar:seed` para
> regerar o arquivo e aplique-o de novo. Ele usa UPSERT: atualiza o que mudou
> sem duplicar.

---

## 1.5 Configurar o login

Em **Authentication → Providers**:

- **Email** deve estar habilitado (já vem assim por padrão).
- **Confirm email**: recomendado deixar ligado. Assim ninguém cria conta com o
  e-mail de outra pessoa.

Em **Authentication → URL Configuration**:

- **Site URL**: `https://seudominio.com.br` (em teste, `http://localhost:3000`)
- **Redirect URLs**: adicione as duas linhas abaixo:
  - `http://localhost:3000/auth/callback`
  - `https://seudominio.com.br/auth/callback`

Sem isso, os links de confirmação e de recuperação de senha não voltam para o
site.

---

## 1.6 Tornar-se administrador

Há dois caminhos — o primeiro é o mais prático:

**a) Pela variável de ambiente**

```env
ADMIN_EMAILS=seu-email@exemplo.com
```

**b) Direto no banco** (depois de criar sua conta no site):

```sql
update public.perfis set papel = 'admin' where email = 'seu-email@exemplo.com';
```

Feito isso, `/admin` fica disponível para você.

---

## 1.7 Testar

```bash
npm run dev
```

1. Abra <http://localhost:3000> — a página de vendas deve mostrar o número real
   de receitas.
2. Crie uma conta em `/criar-conta` e confirme o e-mail.
3. Entre e navegue: as receitas agora vêm do banco.
4. Abra `/admin` e cadastre uma receita de teste.
5. Publique e confira se ela aparece em `/novidades` e no contador da home.

Se algo falhar, veja **Logs → Postgres Logs** no Supabase: os erros de política
de segurança aparecem lá com o nome da tabela.
