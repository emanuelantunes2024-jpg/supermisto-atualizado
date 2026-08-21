#!/usr/bin/env node
/**
 * Teste de ponta a ponta em navegador real.
 *
 * O Playwright não entra nas dependências do projeto de propósito: ele baixa
 * navegadores no pós-instalação e deixaria o deploy pesado. Instale só quando
 * for testar:
 *
 *   npm install --no-save playwright
 *   npm run build && npm run start -- -p 3200   (num terminal)
 *   npm run testar                              (noutro terminal)
 *
 * Ou aponte para outro endereço:
 *   BASE_URL=https://seudominio.com.br npm run testar
 *
 * Verifica o que o cliente realmente faz: abrir receita, mudar rendimento,
 * favoritar, montar lista de compras, editar preços e simular produção.
 * Também confere se alguma tela ganha rolagem horizontal no celular.
 */

import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? "http://localhost:3200";
const EXECUTAVEL = process.env.CHROMIUM_PATH ?? undefined;

const resultados = [];
function conferir(nome, condicao, detalhe = "") {
  resultados.push({ nome, ok: Boolean(condicao) });
  const marca = condicao ? "  ok  " : " FALHA";
  console.log(`${marca} ${nome}${detalhe ? `  → ${detalhe}` : ""}`);
}

/** Fecha o onboarding do primeiro acesso, quando ele estiver aberto. */
async function pularOnboarding(page) {
  const botao = page.getByRole("button", { name: /Pular por enquanto/ });
  if (await botao.count()) {
    await botao.click();
    await page.waitForTimeout(300);
  }
}

const ROTAS = [
  "/", "/demonstracao", "/demonstracao/brigadeiro-gourmet-tradicional", "/entrar",
  "/inicio", "/receitas", "/receitas/brigadeiro-gourmet-tradicional", "/categorias",
  "/categorias/doces", "/buscar?q=morango", "/calculadoras", "/calculadoras/custos",
  "/calculadoras/precos", "/lista-de-compras", "/favoritos", "/colecoes",
  "/central-de-renda", "/central-de-renda/objetivo", "/novidades", "/meu-plano",
  "/assistente", "/configuracoes", "/admin", "/admin/receitas", "/admin/receitas/nova",
  "/admin/categorias", "/admin/usuarios",
];

const navegador = await chromium.launch({ executablePath: EXECUTAVEL });

/* ------------------------------------------------------------------ parte 1
 * Todas as telas respondem e nenhuma transborda na horizontal.
 * -------------------------------------------------------------------- */

console.log("\n── Telas e responsividade ──────────────────────────────────");

for (const largura of [390, 768, 1440]) {
  const ctx = await navegador.newContext({ viewport: { width: largura, height: 900 } });
  const page = await ctx.newPage();
  const problemas = [];

  for (const rota of ROTAS) {
    const resposta = await page.goto(BASE + rota, { waitUntil: "domcontentloaded" });
    if (!resposta || resposta.status() >= 400) {
      problemas.push(`${rota} respondeu ${resposta?.status()}`);
      continue;
    }
    await page.waitForTimeout(100);
    const excesso = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (excesso > 2) problemas.push(`${rota} transborda ${excesso}px`);
  }

  conferir(`${ROTAS.length} telas em ${largura}px`, problemas.length === 0, problemas.join("; "));
  await ctx.close();
}

/* ------------------------------------------------------------------ parte 2
 * O que o cliente faz de verdade.
 * -------------------------------------------------------------------- */

console.log("\n── Uso real (celular) ──────────────────────────────────────");

const ctx = await navegador.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

const errosJs = [];
page.on("pageerror", (erro) => errosJs.push(String(erro)));
page.on("console", (msg) => {
  if (msg.type() === "error") errosJs.push(msg.text());
});

// Primeiro acesso
await page.goto(`${BASE}/inicio`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
conferir("Onboarding aparece no primeiro acesso", await page.getByText("O que você procura aqui?").count());
await pularOnboarding(page);
conferir("Onboarding pode ser pulado", (await page.getByText("O que você procura aqui?").count()) === 0);

// Receita: custo e rendimento
await page.goto(`${BASE}/receitas/brigadeiro-gourmet-tradicional`, { waitUntil: "networkidle" });
await pularOnboarding(page);

let texto = await page.locator("body").innerText();
conferir("Custo da receita calculado (R$ 34,03)", texto.includes("34,03"));
conferir("Custo por unidade (R$ 0,68)", texto.includes("0,68"));

await page.getByRole("button", { name: "100", exact: true }).click();
await page.waitForTimeout(400);
texto = await page.locator("body").innerText();
conferir("Dobrar o rendimento dobra o custo (R$ 68,06)", texto.includes("68,06"));
conferir("Ingredientes reescalados (1,6 kg)", /1,6 kg/.test(texto));

await page.getByRole("button", { name: "50", exact: true }).click();
await page.waitForTimeout(300);
texto = await page.locator("body").innerText();
conferir("Voltar ao rendimento original restaura o custo", texto.includes("34,03"));

// Favoritar e listar
await page.getByRole("button", { name: /^Favoritar$/ }).click();
await page.waitForTimeout(300);
conferir("Favoritar marca a receita", await page.getByRole("button", { name: /Favoritada/ }).count());

await page.getByRole("button", { name: /Adicionar à lista/ }).click();
await page.waitForTimeout(400);
conferir("Confirma os ingredientes somados à lista", await page.getByText(/ingredientes somados/).count());

// Abas
await page.getByRole("tab", { name: "Modo de preparo" }).click();
await page.waitForTimeout(200);
conferir("Aba de preparo traz o passo a passo", await page.getByText(/panela de fundo grosso/i).count());

await page.goto(`${BASE}/favoritos`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
conferir("Favorito aparece em Favoritos", await page.getByText("Brigadeiro Gourmet Tradicional").count());

// Lista de compras
await page.goto(`${BASE}/lista-de-compras`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const lista = await page.locator("body").innerText();
conferir("Lista traz os ingredientes da receita", lista.includes("Leite condensado"));
conferir("Lista agrupa por seção do mercado", /mercearia/i.test(lista));
conferir("Lista converte para embalagens inteiras", /embalagem|embalagens/i.test(lista));
conferir("Lista mostra o valor estimado", /R\$\s*[\d.,]+/.test(lista));

await page.locator('button[aria-label^="Marcar"]').first().click();
await page.waitForTimeout(300);
conferir("Marcar como comprado atualiza o progresso", await page.getByText(/1\/\d+/).count());

// Meus preços mudam o cálculo em todo o sistema
await page.goto(`${BASE}/configuracoes`, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.locator('input[aria-label="Preço de Leite condensado"]').fill("15");
await page.waitForTimeout(400);
await page.goto(`${BASE}/receitas/brigadeiro-gourmet-tradicional`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
texto = await page.locator("body").innerText();
conferir("Preço editado altera o custo da receita (R$ 49,03)", texto.includes("49,03"));

// Central de Renda
await page.goto(`${BASE}/central-de-renda`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "R$ 100", exact: true }).click();
await page.getByRole("button", { name: "Doces", exact: true }).click();
await page.getByRole("button", { name: /Ver sugestões de receitas/ }).click();
await page.waitForTimeout(600);
const renda = await page.locator("body").innerText();
conferir("Central de Renda gera sugestões", renda.includes("Lucro estimado"));
conferir("Sugestões trazem faturamento estimado", renda.includes("Faturamento"));
conferir("Aviso de simulação presente", /simulação/i.test(renda));

// Simulador de objetivos
await page.goto(`${BASE}/central-de-renda/objetivo`, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
conferir("Simulador calcula unidades necessárias", await page.getByText("Unidades a vender").count());

// Calculadora de preços
await page.goto(`${BASE}/calculadoras/precos`, { waitUntil: "networkidle" });
await page.locator('input[type="number"]').first().fill("100");
await page.waitForTimeout(400);
conferir(
  "Calculadora de preços responde à entrada (100 + 70% = 170)",
  (await page.locator("body").innerText()).includes("170,00"),
);

// Busca por ingrediente
await page.goto(`${BASE}/buscar?q=polvilho`, { waitUntil: "networkidle" });
conferir("Busca por ingrediente encontra receitas", await page.getByText("Pão de Queijo Mineiro").count());

// Coleções
await page.goto(`${BASE}/colecoes`, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.locator('input[placeholder*="Encomendas"]').fill("Natal 2026");
await page.getByRole("button", { name: /Criar coleção/ }).click();
await page.waitForTimeout(400);
conferir("Criar coleção funciona", await page.getByText("Natal 2026").count());

// Navegação de celular
await page.goto(`${BASE}/inicio`, { waitUntil: "networkidle" });
await pularOnboarding(page);
conferir("Barra inferior visível no celular", await page.locator("nav.fixed").first().isVisible());

await page.getByRole("button", { name: "Abrir menu" }).click();
await page.waitForTimeout(400);
conferir(
  "Menu lateral abre no celular",
  await page.locator("div.animate-slideIn").getByText("Minhas Coleções").first().isVisible(),
);

conferir("Avisa que está em modo demonstração", await page.getByText(/Modo demonstração/).count());
conferir("Nenhum erro de JavaScript", errosJs.length === 0, errosJs.slice(0, 2).join(" | "));

await navegador.close();

/* ------------------------------------------------------------------ resumo */

const falhas = resultados.filter((r) => !r.ok);
console.log(`\n${resultados.length - falhas.length}/${resultados.length} verificações passaram.`);

if (falhas.length) {
  console.log("\nFalharam:");
  for (const f of falhas) console.log(`  - ${f.nome}`);
  process.exit(1);
}
