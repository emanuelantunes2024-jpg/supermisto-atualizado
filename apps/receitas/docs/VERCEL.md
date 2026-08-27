# 2. Publicar na Vercel

A Vercel hospeda a aplicação. O plano gratuito ("Hobby") atende ao começo, mas
para **uso comercial** a própria Vercel exige o plano Pro — confira os termos
antes de vender.

Tempo estimado: 10 minutos.

---

## 2.1 Importante: este projeto fica em uma subpasta

O repositório tem dois produtos independentes. A Central de Receitas & Renda
está em `apps/receitas`. **A Vercel precisa saber disso**, senão publica o
projeto errado.

---

## 2.2 Criar o projeto

1. Acesse <https://vercel.com> e entre com sua conta do GitHub.
2. **Add New → Project**.
3. Escolha o repositório `leuname-software`.
4. Na tela de configuração, abra **Root Directory**, clique em **Edit** e
   selecione a pasta **`apps/receitas`**. Este é o passo mais importante.
5. O restante a Vercel detecta sozinha:
   - Framework Preset: `Next.js`
   - Build Command: `npm run build`
   - Output Directory: `.next`

---

## 2.3 Cadastrar as variáveis de ambiente

Ainda na tela de criação (ou depois, em **Settings → Environment Variables**),
cadastre uma a uma:

| Nome | Valor | Ambientes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://seudominio.com.br` | Production |
| `NEXT_PUBLIC_SUPABASE_URL` | do Supabase | todos |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | do Supabase | todos |
| `SUPABASE_SERVICE_ROLE_KEY` | do Supabase | todos |
| `ADMIN_EMAILS` | seu e-mail | todos |
| `HOTMART_HOTTOK` | do painel da Hotmart | todos |
| `NEXT_PUBLIC_LINK_OFERTA` | link da sua página de compra | todos |
| `NEXT_PUBLIC_PRECO_OFERTA` | `29,90` | todos |

> Depois de alterar qualquer variável, é preciso **Redeploy** para valer.

---

## 2.4 Publicar

Clique em **Deploy** e aguarde. Ao final, a Vercel dá um endereço como
`central-receitas-renda.vercel.app`. Abra e confira se tudo carregou.

---

## 2.5 Apontar o domínio próprio

1. Em **Settings → Domains**, clique em **Add** e digite seu domínio.
2. A Vercel mostra os registros de DNS. No painel de onde você comprou o
   domínio (Registro.br, GoDaddy, Hostinger...), cadastre:
   - **Domínio raiz** (`seudominio.com.br`): registro `A` para o IP indicado
     pela Vercel.
   - **`www`**: registro `CNAME` para `cname.vercel-dns.com`.
3. A propagação leva de alguns minutos a algumas horas. O certificado HTTPS é
   emitido automaticamente.

Depois que o domínio estiver ativo, volte e ajuste:

- `NEXT_PUBLIC_SITE_URL` na Vercel;
- **Site URL** e **Redirect URLs** no Supabase (veja `docs/SUPABASE.md`);
- a URL do webhook na plataforma de venda (veja `docs/HOTMART.md`).

---

## 2.6 Atualizações

Cada `git push` para o branch principal gera um novo deploy automático. Não é
preciso publicar de novo para adicionar receitas: elas entram pelo painel
administrativo e aparecem no site em até 5 minutos (tempo de cache das telas).
