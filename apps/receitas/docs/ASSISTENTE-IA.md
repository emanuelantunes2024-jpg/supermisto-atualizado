# 7. Assistente Inteligente — o que falta

A tela `/assistente` existe, está no menu e explica ao cliente o que ela vai
fazer. Mas **o assistente não está funcionando**, e a própria tela diz isso.

Isso é proposital: um chat que devolve respostas prontas, fingindo ser IA,
seria enganar quem comprou.

---

## 7.1 O que já existe

- a rota, o item de menu e o texto explicativo;
- os exemplos de perguntas que ele vai responder;
- alternativas que funcionam hoje sem IA (busca por ingrediente, Central de
  Renda por orçamento, filtro por tempo).

## 7.2 O que falta

1. **Uma chave de API de um provedor de IA** (Anthropic, OpenAI ou outro),
   guardada como variável de ambiente só de servidor.
2. **Uma rota de servidor** (`src/app/api/assistente/route.ts`) que receba a
   pergunta, monte o contexto com as receitas do banco e chame o modelo.
3. **Uma interface de conversa** na página, substituindo o aviso atual.
4. **Um limite de uso por cliente**, senão o custo por chamada vira prejuízo em
   um produto de pagamento único.

## 7.3 Como fica o custo

Cada pergunta respondida por IA custa dinheiro, e o produto é pago uma vez só.
Antes de ligar, decida:

- um limite de perguntas por mês por cliente (ex.: 30), ou
- o assistente como parte de um plano superior, ou
- respostas guardadas em cache para as perguntas mais repetidas.

Sem essa decisão, o custo cresce junto com o número de clientes e não para.

## 7.4 Enquanto isso

As três alternativas que já resolvem boa parte das perguntas:

| Pergunta do cliente | O que já responde hoje |
| --- | --- |
| "Tenho farinha, ovos e leite, o que faço?" | busca por ingrediente em `/buscar` |
| "Tenho R$ 50 para começar" | Central de Renda |
| "Quero algo rápido" | filtro de tempo em `/receitas` |

Se você não pretende ligar a IA tão cedo, o mais honesto é **remover o item do
menu** — basta apagar a linha do assistente em
`src/components/layout/navegacao.ts`.
