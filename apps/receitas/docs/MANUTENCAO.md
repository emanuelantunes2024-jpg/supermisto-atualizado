# 4. Dia a dia: cadastrar receitas e manter o sistema

O objetivo desta seção é simples: você deve conseguir manter a plataforma
crescendo sem depender de programador.

---

## 4.1 Cadastrar uma receita nova

1. Entre em `https://seudominio.com.br/admin` com sua conta de administrador.
2. **Receitas → Nova receita**.
3. Preencha os campos. Os obrigatórios estão marcados com `*`.

### O campo que mais gera dúvida

Na linha de cada ingrediente há **quatro campos**:

| Campo | Para que serve | Exemplo |
| --- | --- | --- |
| Ingrediente | escolhe do catálogo de insumos | Leite condensado |
| Quantidade | o número que o cliente lê | `2` |
| Unidade | a medida que o cliente lê | `lata` |
| Equivalente | **quanto isso dá em g, ml ou unidades** | `790` |

O **Equivalente** é o que o sistema usa para calcular o custo. Se uma lata tem
395 g e a receita usa 2 latas, o equivalente é `790`.

Tabela de conversão para as medidas caseiras mais comuns:

| Medida | Equivale a |
| --- | --- |
| 1 xícara (chá) de farinha de trigo | 120 g |
| 1 xícara (chá) de açúcar | 180 g |
| 1 xícara (chá) de chocolate em pó | 90 g |
| 1 xícara (chá) de líquido | 240 ml |
| 1 colher (sopa) de manteiga | 15 g |
| 1 colher (sopa) de líquido | 15 ml |
| 1 colher (sopa) de pó (cacau, trigo) | 12 g |
| 1 colher (chá) | 5 g ou 5 ml |
| 1 lata de leite condensado | 395 g |
| 1 caixa de creme de leite | 200 g |
| 1 ovo | 1 unidade |

4. Marque **Publicada** para que ela apareça para os clientes. Deixe
   desmarcado para guardar como rascunho.
5. Clique em **Criar receita**.

Assim que publicada, ela:

- entra na biblioteca e no contador da tela inicial;
- aparece em **Novidades** com o selo "Novo" por 30 dias (ou até a data que
  você definir em "Mostrar como novidade até");
- entra na Central de Renda, se estiver marcada como "Indicada para venda".

Não é preciso publicar o site de novo. As telas atualizam em até 5 minutos.

---

## 4.2 Adicionar um ingrediente que não existe no catálogo

O catálogo de insumos fica em `src/data/insumos.ts`. Para incluir um novo:

1. Abra o arquivo e copie uma linha existente como modelo:

```ts
{ chave: "leite-condensado", nome: "Leite condensado", unidadeBase: "g",
  embalagem: 395, embalagemRotulo: "lata de 395 g", precoRef: 7.5,
  secao: "mercearia" },
```

2. Ajuste os campos:
   - `chave`: identificador sem acento e sem espaço (`creme-de-leite`);
   - `unidadeBase`: `g`, `ml` ou `un`;
   - `embalagem`: quanto vem na embalagem vendida, na unidade base;
   - `precoRef`: preço médio de mercado (é só um ponto de partida — o cliente
     ajusta em "Meus preços");
   - `secao`: `mercearia`, `laticinios`, `hortifruti`, `carnes`, `confeitaria`,
     `embalagens` ou `outros`.
3. Rode `npm run gerar:seed` e aplique o novo `supabase/seed/seed.sql` no
   SQL Editor do Supabase.
4. Faça `git push` para publicar a alteração.

---

## 4.3 Adicionar uma categoria

Categorias são estrutura, não conteúdo do dia a dia — por isso ficam no código,
em `src/data/categorias.ts`. Copie um bloco existente, ajuste `slug`, `nome`,
`descricao`, `icone`, `cor`, `ordem` e a lista de `subcategorias`, rode
`npm run gerar:seed`, aplique o SQL e faça `git push`.

Os ícones disponíveis estão em `src/components/ui/Icone.tsx`.

---

## 4.4 Colocar fotos nas receitas

Sem foto, o sistema desenha uma capa com a cor da categoria — funciona bem e é
consistente. Para usar foto de verdade:

1. No Supabase, abra **Storage → receitas**.
2. **Upload file** e envie a imagem (recomendado: 1200×900 px, JPG, até 300 KB).
3. Clique no arquivo → **Copy URL**.
4. No painel, edite a receita e cole a URL no campo **Endereço da foto**.

> Use apenas fotos suas ou com licença que permita uso comercial. Fotos
> tiradas do Google costumam ter dono, e o problema aparece depois da venda.

---

## 4.5 Retirar, esconder ou excluir uma receita

Na lista de `/admin/receitas`, cada linha tem:

- 👁 abrir no site;
- ✏️ editar;
- ➖ / ✔️ publicar ou retirar do ar (o conteúdo continua salvo);
- ✨ marcar ou desmarcar como novidade;
- 🗑 excluir de vez (pede confirmação; não tem volta).

Na dúvida, **retire do ar** em vez de excluir.

---

## 4.6 Gerenciar acesso de clientes

Em `/admin/usuarios` você vê quem se cadastrou e pode mudar a situação:

- **ativo**: acessa tudo;
- **suspenso**: bloqueio temporário (pagamento em análise);
- **cancelado**: acesso encerrado (reembolso ou cancelamento).

Normalmente o webhook faz isso sozinho. Use o painel para casos manuais.

---

## 4.7 Rotina sugerida

| Frequência | O que fazer |
| --- | --- |
| Semanal | publicar de 3 a 5 receitas novas (alimenta a seção Novidades) |
| Mensal | revisar os preços de referência em `src/data/insumos.ts` |
| Mensal | conferir o backup do banco (veja `docs/BACKUP.md`) |
| Trimestral | revisar textos da página de vendas e o preço da oferta |
