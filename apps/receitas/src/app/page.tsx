import Link from "next/link";

import { CabecalhoPublico } from "@/components/publico/CabecalhoPublico";
import { RodapePublico } from "@/components/publico/RodapePublico";
import { CapaReceita } from "@/components/receitas/CapaReceita";
import { Icone, ICONE_CATEGORIA } from "@/components/ui/Icone";
import { LINK_OFERTA, PRECO_OFERTA } from "@/lib/config";
import { formatarNumero, formatarTempo } from "@/lib/format";
import { contarReceitas, listarCategorias, obterNovidades } from "@/lib/queries";

export const revalidate = 600;

const FERRAMENTAS = [
  {
    icone: "receitas",
    titulo: "Biblioteca de receitas",
    texto:
      "Receitas brasileiras completas: ingredientes na medida, passo a passo, dicas de quem já errou antes e como conservar.",
  },
  {
    icone: "balanca",
    titulo: "Ajuste de rendimento",
    texto:
      "A receita rende 20 e você precisa de 100? Mude o número e todos os ingredientes se recalculam sozinhos.",
  },
  {
    icone: "calculadora",
    titulo: "Calculadora de custos",
    texto:
      "Coloque o preço que você paga em cada ingrediente e veja o custo real da produção e o custo por unidade.",
  },
  {
    icone: "etiqueta",
    titulo: "Calculadora de preços",
    texto:
      "A partir do custo, simule o preço de venda com a margem que quiser e veja o faturamento estimado.",
  },
  {
    icone: "carrinho",
    titulo: "Lista de compras",
    texto:
      "Junte várias receitas e a lista soma os ingredientes repetidos, organizados por seção do mercado.",
  },
  {
    icone: "renda",
    titulo: "Central de Renda",
    texto:
      "Diga quanto tem para investir e onde pretende vender: o sistema mostra o que cabe no seu orçamento.",
  },
];

const PASSOS = [
  {
    numero: "1",
    titulo: "Você entra com sua conta",
    texto: "Acesso individual por e-mail e senha, no celular, tablet ou computador.",
  },
  {
    numero: "2",
    titulo: "Escolhe o que quer fazer",
    texto: "Buscar uma receita, calcular um custo, montar uma lista ou planejar uma produção.",
  },
  {
    numero: "3",
    titulo: "O sistema faz as contas",
    texto: "Rendimento, custo, preço sugerido e faturamento estimado, tudo recalculado na hora.",
  },
  {
    numero: "4",
    titulo: "A biblioteca continua crescendo",
    texto: "Novas receitas entram no sistema e aparecem para você, sem pagar de novo.",
  },
];

const PERGUNTAS = [
  {
    pergunta: "Isso é um e-book ou um PDF?",
    resposta:
      "Não. É um aplicativo web: você entra com sua conta, busca receitas, ajusta quantidades, calcula custos e monta listas. Nada é baixado como arquivo e o conteúdo continua sendo atualizado depois da compra.",
  },
  {
    pergunta: "Preciso instalar alguma coisa?",
    resposta:
      "Não. Funciona pelo navegador do celular, tablet ou computador. Dá para adicionar o atalho na tela inicial do celular e usar como um aplicativo.",
  },
  {
    pergunta: "As receitas novas custam mais?",
    resposta:
      "Não. As receitas adicionadas à biblioteca entram automaticamente no acesso que você já tem, nas condições da oferta em que você comprou.",
  },
  {
    pergunta: "O sistema garante que vou ganhar dinheiro?",
    resposta:
      "Não, e desconfie de quem promete isso. As calculadoras mostram simulações a partir dos preços que você informa: custo, preço sugerido e faturamento estimado. O resultado real depende do seu custo local, do preço que praticar, da procura na sua região e do seu trabalho.",
  },
  {
    pergunta: "Serve para quem só quer cozinhar em casa?",
    resposta:
      "Serve. As ferramentas de venda ficam sempre à mão, mas nada obriga você a usá-las. Muita gente usa só a biblioteca, o ajuste de rendimento e a lista de compras.",
  },
  {
    pergunta: "Meus dados ficam salvos?",
    resposta:
      "Sim. Favoritos, coleções, listas de compras e os preços que você ajustou ficam guardados na sua conta e acompanham você em qualquer aparelho onde fizer login.",
  },
];

export default async function PaginaInicial() {
  const [total, categorias, novidades] = await Promise.all([
    contarReceitas(),
    listarCategorias(),
    obterNovidades(4),
  ]);

  return (
    <div className="min-h-screen bg-cream-100">
      <CabecalhoPublico />

      {/* ------------------------------------------------------------- hero */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 app:px-6 app:pb-16 app:pt-16">
        <div className="grid items-center gap-10 app:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-pill border border-brand-200 bg-brand-50 px-3 py-1.5 text-[12px] font-bold text-brand-700">
              <Icone nome="chama" tamanho={14} />
              Aplicativo web · não é e-book
            </span>

            <h1 className="mt-4 font-display text-[34px] font-extrabold leading-[1.1] text-ink app:text-[46px]">
              Receitas que você faz.
              <br />
              <span className="text-brand-500">Contas que fecham.</span>
            </h1>

            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft app:text-[16px]">
              Uma plataforma com receitas brasileiras completas e as ferramentas de quem produz:
              ajuste de rendimento, cálculo de custo, preço de venda, lista de compras e
              planejamento de produção — tudo na mesma tela, no seu celular.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <a
                href={LINK_OFERTA || "#oferta"}
                {...(LINK_OFERTA ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3.5 text-[15px] font-bold text-white shadow-card transition hover:bg-brand-600"
              >
                Quero ter acesso completo
                <Icone nome="seta-direita" tamanho={18} />
              </a>

              <Link
                href="/demonstracao"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-3.5 text-[15px] font-semibold text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
              >
                <Icone nome="olho" tamanho={17} />
                Ver a demonstração
              </Link>
            </div>

            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              {[
                { valor: `${formatarNumero(total)}+`, rotulo: "receitas na biblioteca" },
                { valor: `${categorias.length}`, rotulo: "categorias de produção" },
                { valor: "6", rotulo: "ferramentas de cálculo" },
              ].map((item) => (
                <div key={item.rotulo}>
                  <dt className="font-display text-2xl font-extrabold text-ink">{item.valor}</dt>
                  <dd className="text-[12.5px] text-ink-muted">{item.rotulo}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Amostra visual do produto */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-200/50 to-amber-100/50 blur-2xl"
            />
            <div className="relative grid grid-cols-2 gap-3">
              {novidades.recentes.slice(0, 4).map((receita, indice) => (
                <div
                  key={receita.slug}
                  className={`cartao overflow-hidden ${indice % 2 === 1 ? "mt-6" : ""}`}
                >
                  <div className="relative aspect-[4/3] bg-cream-200">
                    <CapaReceita
                      nome={receita.nome}
                      categoria={receita.categoria}
                      imagem={receita.imagem}
                      prioridade={indice < 2}
                      tamanhos="(max-width: 1024px) 45vw, 220px"
                    />
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-pill bg-black/55 px-2 py-1 text-[10px] font-semibold text-white">
                      <Icone nome="relogio" tamanho={11} />
                      {formatarTempo(receita.tempoMinutos)}
                    </span>
                  </div>
                  <p className="line-clamp-2 p-2.5 text-[12.5px] font-bold leading-snug text-ink">
                    {receita.nome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- o que é */}
      <section id="o-que-e" className="border-y border-line bg-white py-14 app:py-20">
        <div className="mx-auto max-w-6xl px-4 app:px-6">
          <h2 className="max-w-2xl font-display text-[26px] font-extrabold leading-tight text-ink app:text-[32px]">
            O que é a Central de Receitas &amp; Renda
          </h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
            É um sistema, não um arquivo. Você entra com a sua conta e usa uma biblioteca de
            receitas brasileiras junto com ferramentas que fazem o cálculo por você. Quem cozinha
            para a família usa as receitas e a lista de compras. Quem produz para vender usa também
            o custo, o preço sugerido e as simulações de produção.
          </p>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 app:grid-cols-4">
            {[
              {
                icone: "receitas",
                titulo: "Para cozinhar",
                texto: "Receita completa, medida certa e passo a passo claro.",
              },
              {
                icone: "carrinho",
                titulo: "Para economizar",
                texto: "Lista de compras somada e valor estimado antes de sair de casa.",
              },
              {
                icone: "calculadora",
                titulo: "Para calcular",
                texto: "Custo real da produção com os preços do seu mercado.",
              },
              {
                icone: "renda",
                titulo: "Para vender",
                texto: "Preço sugerido, margem e simulação de produção.",
              },
            ].map((item) => (
              <div key={item.titulo} className="cartao p-4">
                <span className="mb-2.5 grid h-10 w-10 place-items-center rounded-2xl bg-brand-50 text-brand-500">
                  <Icone nome={item.icone} tamanho={20} />
                </span>
                <p className="font-display text-[15px] font-bold text-ink">{item.titulo}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- ferramentas */}
      <section id="ferramentas" className="py-14 app:py-20">
        <div className="mx-auto max-w-6xl px-4 app:px-6">
          <h2 className="font-display text-[26px] font-extrabold text-ink app:text-[32px]">
            As ferramentas que vêm junto
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">
            Cada uma resolve uma dor concreta de quem cozinha e de quem produz.
          </p>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 app:grid-cols-3">
            {FERRAMENTAS.map((f) => (
              <div key={f.titulo} className="cartao p-5">
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-2xl bg-cream-200 text-brand-600">
                  <Icone nome={f.icone} tamanho={21} />
                </span>
                <h3 className="font-display text-[16px] font-bold text-ink">{f.titulo}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-muted">{f.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- biblioteca */}
      <section id="biblioteca" className="border-y border-line bg-white py-14 app:py-20">
        <div className="mx-auto max-w-6xl px-4 app:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-[26px] font-extrabold text-ink app:text-[32px]">
                A biblioteca
              </h2>
              <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">
                Organizada por tipo de produção, do bolo caseiro ao salgado de festa.
              </p>
            </div>

            <div className="rounded-card border border-line bg-cream-50 px-5 py-3">
              <p className="font-display text-3xl font-extrabold text-brand-500">
                {formatarNumero(total)}+
              </p>
              <p className="text-[12.5px] text-ink-muted">receitas publicadas hoje</p>
            </div>
          </div>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 app:grid-cols-3">
            {categorias.map((categoria) => (
              <div key={categoria.slug} className="cartao flex items-start gap-3.5 p-4">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${categoria.cor}`}
                >
                  <Icone nome={ICONE_CATEGORIA[categoria.slug] ?? "receitas"} tamanho={21} />
                </span>
                <div>
                  <p className="font-display text-[15px] font-bold text-ink">{categoria.nome}</p>
                  <p className="mt-0.5 text-[12.5px] leading-snug text-ink-muted">
                    {categoria.descricao}
                  </p>
                  <p className="mt-1 text-[12px] font-semibold text-brand-600">
                    {categoria.total} {categoria.total === 1 ? "receita" : "receitas"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-card border border-brand-200 bg-brand-50 p-5">
            <p className="flex items-center gap-2 font-display text-[16px] font-bold text-ink">
              <Icone nome="novidades" tamanho={18} className="text-brand-500" />
              Produto vivo, não arquivo parado
            </p>
            <p className="mt-1.5 max-w-3xl text-[13.5px] leading-relaxed text-ink-soft">
              Novas receitas entram pela área administrativa e aparecem na hora para quem já tem
              acesso — com selo de novidade e contagem por período. Você compra uma ferramenta que
              continua crescendo, não um arquivo que envelhece na sua pasta de downloads.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- como funciona */}
      <section className="py-14 app:py-20">
        <div className="mx-auto max-w-6xl px-4 app:px-6">
          <h2 className="font-display text-[26px] font-extrabold text-ink app:text-[32px]">
            Como funciona
          </h2>

          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 app:grid-cols-4">
            {PASSOS.map((passo) => (
              <div key={passo.numero} className="cartao p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-500 font-display text-[15px] font-extrabold text-white">
                  {passo.numero}
                </span>
                <h3 className="mt-3 font-display text-[15px] font-bold text-ink">{passo.titulo}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{passo.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- dúvidas */}
      <section id="perguntas" className="border-y border-line bg-white py-14 app:py-20">
        <div className="mx-auto max-w-3xl px-4 app:px-6">
          <h2 className="font-display text-[26px] font-extrabold text-ink app:text-[32px]">
            Perguntas frequentes
          </h2>

          <div className="mt-7 flex flex-col gap-2.5">
            {PERGUNTAS.map((item) => (
              <details key={item.pergunta} className="cartao group px-4 py-3.5">
                <summary className="flex cursor-pointer items-center gap-3 text-[14.5px] font-bold text-ink marker:content-['']">
                  {item.pergunta}
                  <Icone
                    nome="chevron-baixo"
                    tamanho={18}
                    className="ml-auto shrink-0 text-ink-muted transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">
                  {item.resposta}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- oferta */}
      <section id="oferta" className="py-14 app:py-20">
        <div className="mx-auto max-w-3xl px-4 app:px-6">
          <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-panel-900 via-panel-800 to-brand-800 px-6 py-10 text-center text-white app:px-12">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl"
            />

            <div className="relative">
              <p className="text-[13px] font-bold uppercase tracking-wide text-brand-300">
                Acesso à plataforma
              </p>

              <h2 className="mt-2 font-display text-[28px] font-extrabold leading-tight app:text-[36px]">
                Pague uma vez.
                <br />
                Use o sistema e receba as atualizações.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-relaxed text-white/75">
                Acesso individual à biblioteca completa e a todas as ferramentas. As receitas
                adicionadas depois entram no seu acesso, nas condições desta oferta.
              </p>

              <p className="mt-7 font-display text-[44px] font-extrabold leading-none text-brand-300">
                R$ {PRECO_OFERTA}
              </p>
              <p className="mt-1.5 text-[13px] text-white/60">
                Preço de lançamento — sujeito a reajuste para novos compradores.
              </p>

              <a
                href={LINK_OFERTA || "/demonstracao"}
                {...(LINK_OFERTA ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-500 px-8 py-4 text-[16px] font-bold text-white transition hover:bg-brand-600"
              >
                {LINK_OFERTA ? "Quero meu acesso" : "Conhecer a demonstração"}
                <Icone nome="seta-direita" tamanho={19} />
              </a>

              <p className="mx-auto mt-6 max-w-lg text-[12px] leading-relaxed text-white/50">
                Este produto não promete renda nem garante resultados financeiros. As calculadoras
                mostram estimativas a partir dos preços que você informar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RodapePublico />
    </div>
  );
}
