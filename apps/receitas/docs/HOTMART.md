# 3. Ligar a venda (Hotmart e compatíveis)

Este documento liga a compra ao acesso: quando alguém compra, a conta é
liberada sozinha; quando pede reembolso, o acesso é retirado.

---

## 3.1 Como funciona

```
Cliente compra na Hotmart
        ↓
Hotmart confirma o pagamento
        ↓
Hotmart chama  POST https://seudominio.com.br/api/webhooks/hotmart
        ↓
O sistema confere o "hottok" (senha do webhook)
        ↓
O e-mail do comprador entra na tabela `acessos_liberados`
        ↓
   ┌────────────────────────┬───────────────────────────────┐
   │ Já tem conta no site   │ Ainda não tem conta           │
   │ → acesso ativado já    │ → ao se cadastrar com o mesmo │
   │                        │   e-mail, já entra liberado   │
   └────────────────────────┴───────────────────────────────┘

Reembolso, chargeback ou cancelamento → acesso revogado pelo mesmo caminho.
```

O cliente **nunca recebe o código-fonte**. Ele recebe acesso à aplicação.

---

## 3.2 O que configurar na Hotmart

1. Cadastre seu produto como **produto digital / assinatura de acesso**,
   conforme a modalidade da sua oferta.
2. Vá em **Ferramentas → Webhook (Postback)**.
3. Clique em **Cadastrar webhook** e preencha:
   - **URL**: `https://seudominio.com.br/api/webhooks/hotmart`
   - **Versão**: 2.0.0 (recomendada)
   - **Eventos**: marque, no mínimo:
     - `Compra aprovada` (PURCHASE_APPROVED)
     - `Compra completa` (PURCHASE_COMPLETE)
     - `Compra reembolsada` (PURCHASE_REFUNDED)
     - `Chargeback` (PURCHASE_CHARGEBACK)
     - `Compra cancelada` (PURCHASE_CANCELED)
     - `Cancelamento de assinatura` (SUBSCRIPTION_CANCELLATION), se for assinatura
4. A Hotmart mostra o **hottok** desse webhook. Copie.

---

## 3.3 O que configurar no projeto

Na Vercel (**Settings → Environment Variables**):

```env
HOTMART_HOTTOK=<o hottok copiado>
SUPABASE_SERVICE_ROLE_KEY=<chave service_role do Supabase>
NEXT_PUBLIC_LINK_OFERTA=<link da sua página de compra>
```

Faça **Redeploy** depois de salvar.

> Sem `HOTMART_HOTTOK`, a rota responde **503** e não libera ninguém. Isso é
> proposital: é melhor falhar visivelmente do que fingir que funciona.

---

## 3.4 Testar

**a) Verificar se a rota está no ar**

Abra no navegador:

```
https://seudominio.com.br/api/webhooks/hotmart
```

Deve responder algo como:

```json
{ "servico": "webhook da plataforma de venda", "configurado": true }
```

Se vier `"configurado": false`, falta o hottok ou a chave service_role.

**b) Simular uma compra**

A Hotmart tem um botão de teste no próprio cadastro do webhook. Se preferir
testar por conta própria:

```bash
curl -X POST https://seudominio.com.br/api/webhooks/hotmart \
  -H "Content-Type: application/json" \
  -H "x-hotmart-hottok: SEU_HOTTOK" \
  -d '{
    "event": "PURCHASE_APPROVED",
    "data": {
      "buyer": { "email": "teste@exemplo.com", "name": "Cliente Teste" },
      "purchase": { "transaction": "TESTE-001" },
      "product": { "name": "Central de Receitas & Renda" }
    }
  }'
```

Resposta esperada: `{"ok":true,"acao":"acesso_liberado","email":"teste@exemplo.com"}`

Confira no Supabase:

```sql
select * from public.acessos_liberados where email = 'teste@exemplo.com';
select * from public.eventos_compra order by recebido_em desc limit 5;
```

**c) Testar a revogação**

Repita o comando trocando o evento por `PURCHASE_REFUNDED`. A situação deve
virar `cancelado`, e o cliente passa a ver a tela "Seu acesso não está ativo".

---

## 3.5 Outras plataformas

A rota também aceita o formato antigo, com os campos `email`, `name`, `status`
e `transaction` no corpo e o `hottok` dentro do JSON. Isso cobre várias
plataformas compatíveis. Para Kiwify, Braip ou outra que use formato próprio,
o ajuste fica nas funções `extrairEmail`, `extrairEvento` e `extrairNome` em
`src/app/api/webhooks/hotmart/route.ts` — são poucas linhas, bem no começo do
arquivo.

---

## 3.6 Liberação manual

Nem tudo passa pelo webhook (uma venda direta pelo Pix, por exemplo). Para
liberar alguém à mão:

- pelo painel: **/admin/usuarios**, mudando a situação para `ativo`; ou
- pelo banco:

```sql
insert into public.acessos_liberados (email, situacao)
values ('cliente@exemplo.com', 'ativo')
on conflict (email) do update set situacao = 'ativo';

update public.perfis set acesso = 'ativo' where email = 'cliente@exemplo.com';
```

---

## 3.7 Sobre a evolução de preço

A oferta pode começar em R$ 29,90 e subir depois. Quem já comprou mantém o
acesso nas condições da oferta original — o sistema não retira acesso de
ninguém por causa de mudança de preço. Só altere `NEXT_PUBLIC_PRECO_OFERTA` e
o link da oferta quando quiser mudar o preço para **novos** compradores.
