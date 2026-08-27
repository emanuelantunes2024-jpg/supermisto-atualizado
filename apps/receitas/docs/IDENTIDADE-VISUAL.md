# 8. Identidade visual

Referência para manter a interface coerente ao adicionar telas.

---

## 8.1 Cores

Definidas em `tailwind.config.ts`. A regra que guia tudo: **fundo creme,
cartões brancos, coral para ação, verde apenas para dinheiro.**

| Uso | Token | Valor |
| --- | --- | --- |
| Fundo da aplicação | `cream-100` | `#FDF7F1` |
| Cartões | `white` | `#FFFFFF` |
| Bordas | `line` | `#EFE3D8` |
| Ação principal | `brand-500` | `#F2643C` |
| Ação principal (hover) | `brand-600` | `#E14E27` |
| Fundo de destaque suave | `brand-50` | `#FFF3EE` |
| Valores financeiros | `money-500` | `#15A34A` |
| Selos e avisos | `amber-500` | `#EFA31D` |
| Texto principal | `ink` | `#22201E` |
| Texto secundário | `ink-muted` | `#857C74` |
| Painel administrativo | `panel-900` | `#141A24` |

**O verde é só para dinheiro.** Se aparecer verde em algo que não é valor
financeiro, a hierarquia se perde.

---

## 8.2 Tipografia

- **Títulos**: Sora (`font-display`), pesos 600–800.
- **Texto**: Inter (`font-sans`).
- Números de dinheiro e quantidades usam `tabular-nums`, para as colunas
  ficarem alinhadas.

---

## 8.3 Componentes reutilizáveis

| Componente | Onde fica |
| --- | --- |
| `Botao`, `LinkBotao` | `components/ui/Botao.tsx` |
| `Selo` | `components/ui/Selo.tsx` |
| `Aviso`, `AvisoSimulacao` | `components/ui/Aviso.tsx` |
| `Icone` (todos os ícones) | `components/ui/Icone.tsx` |
| `Vazio` (estado vazio) | `components/ui/Vazio.tsx` |
| `Paginacao` | `components/ui/Paginacao.tsx` |
| `CartaoReceita`, `CapaReceita` | `components/receitas/` |

Classes utilitárias em `globals.css`: `.cartao`, `.cartao-hover`, `.campo`,
`.rotulo`, `.titulo-seccao`, `.rolagem-limpa`.

---

## 8.4 Regras de layout

- **Celular primeiro.** Todas as telas são pensadas para 375 px de largura e só
  depois ganham a versão maior. O ponto de virada é `app:` (1024 px), quando a
  barra lateral fixa aparece.
- **Barra inferior no celular**, no alcance do polegar, com até cinco itens.
- **Cartões com raio 18 px** (`rounded-card`) e sombra suave.
- **Listas horizontais** (`rolagem-limpa`) no celular viram grade no
  computador.
- **Toque mínimo de 40 px** em qualquer botão.

---

## 8.5 Capas das receitas

Sem foto cadastrada, `CapaReceita` desenha um gradiente com a cor da categoria
e o ícone correspondente. Isso mantém a biblioteca visualmente coerente desde o
primeiro dia e evita capas quebradas. Ao subir fotos reais, elas substituem o
gradiente automaticamente — nenhuma alteração de código é necessária.

---

## 8.6 Linguagem

- Português do Brasil, tratamento por "você".
- Nada de jargão técnico na área do cliente.
- Todo valor financeiro é apresentado como **estimativa** ou **simulação**.
- Erros explicam o que aconteceu e o que fazer em seguida.

---

## 8.7 Trocando a marca

A marca atual é provisória. Para substituir:

1. `src/components/ui/Logo.tsx` — o símbolo e o nome.
2. `NOME_PRODUTO` em `src/lib/config.ts`.
3. As cores em `tailwind.config.ts`, se a marca nova pedir outra paleta.
4. `src/app/layout.tsx` — título e descrição para buscadores.

O logo aparece no cabeçalho, na barra lateral, no login, no rodapé e no painel.
Não é preciso incluí-lo em mais lugares.
