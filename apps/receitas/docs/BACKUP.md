# 5. Backup e recuperação

O que precisa de cópia de segurança e como voltar atrás quando algo dá errado.

---

## 5.1 O que existe e onde

| O quê | Onde vive | Como recuperar |
| --- | --- | --- |
| Código | GitHub | `git clone` do repositório |
| Banco (receitas, contas, favoritos) | Supabase | backup automático ou dump manual |
| Fotos das receitas | Supabase Storage | download do bucket |
| Variáveis de ambiente | Vercel + seu gerenciador de senhas | **não têm backup automático** |
| Catálogo curado inicial | `src/data` no repositório | já versionado |

O item mais frágil é o último da lista: **as variáveis de ambiente**. Guarde
uma cópia em um gerenciador de senhas (Bitwarden, 1Password) hoje mesmo. Se
você perder a `service_role`, ela pode ser gerada de novo no Supabase; se
perder a senha do banco, a restauração de backup fica muito mais difícil.

---

## 5.2 Backup do banco

**Automático (Supabase):** o plano gratuito mantém backup diário com retenção
curta; os planos pagos aumentam a retenção e permitem restauração
ponto-a-ponto. Veja em **Database → Backups**.

**Manual (recomendado uma vez por mês):**

1. No Supabase, vá em **Project Settings → Database** e copie a
   *Connection string* (modo `URI`).
2. Com o `pg_dump` instalado, rode:

```bash
pg_dump "postgresql://postgres:SENHA@db.SEUPROJETO.supabase.co:5432/postgres" \
  --clean --if-exists --no-owner --no-privileges \
  -f backup-receitas-$(date +%Y-%m-%d).sql
```

3. Guarde o arquivo fora do computador (Google Drive, HD externo).

**Backup só do conteúdo** (mais leve, sem dados de clientes):

```sql
-- Rode no SQL Editor e exporte o resultado como CSV
select * from public.receitas;
select * from public.receita_ingredientes;
select * from public.insumos;
```

---

## 5.3 Restaurar o banco

```bash
psql "postgresql://postgres:SENHA@db.SEUPROJETO.supabase.co:5432/postgres" \
  -f backup-receitas-2026-08-21.sql
```

Se o projeto do Supabase for outro (recriado do zero):

1. Rode `supabase/migrations/0001_estrutura_inicial.sql`.
2. Rode `supabase/seed/seed.sql` para recuperar o catálogo inicial.
3. Restaure o dump por cima, se tiver.
4. Atualize as chaves na Vercel e faça **Redeploy**.

---

## 5.4 Backup das fotos

No Supabase, **Storage → receitas** permite baixar os arquivos. Com muitos
arquivos, use a CLI:

```bash
npx supabase login
npx supabase storage download --recursive receitas ./backup-fotos
```

Mais simples ainda: mantenha as fotos originais na sua máquina, organizadas por
receita. O Storage passa a ser cópia, não o original.

---

## 5.5 Desfazer uma publicação ruim

**Código:** a Vercel guarda todos os deploys. Em **Deployments**, abra um
anterior que funcionava e clique em **Promote to Production**. Volta em segundos.

**Receita:** editou e ficou pior? O painel não guarda versões anteriores de uma
receita. Antes de uma edição grande, copie o texto atual para um arquivo, ou
duplique a receita como rascunho.

---

## 5.6 Checklist mensal

- [ ] Dump do banco gerado e guardado fora do computador
- [ ] Variáveis de ambiente conferidas no gerenciador de senhas
- [ ] Fotos novas copiadas para o backup local
- [ ] Um teste de compra completo (comprar → receber acesso → entrar)
