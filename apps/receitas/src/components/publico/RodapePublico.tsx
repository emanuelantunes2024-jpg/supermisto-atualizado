import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { NOME_PRODUTO } from "@/lib/config";

export function RodapePublico() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 app:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] app:px-6">
        <div>
          <Logo href="/" />
          <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-ink-muted">
            Uma plataforma de receitas brasileiras com as ferramentas de quem produz: custo,
            preço, lista de compras e planejamento de produção.
          </p>
        </div>

        <div>
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
            Produto
          </p>
          <ul className="flex flex-col gap-2 text-[13.5px] text-ink-soft">
            <li>
              <Link href="/demonstracao" className="hover:text-brand-600">
                Demonstração
              </Link>
            </li>
            <li>
              <a href="/#ferramentas" className="hover:text-brand-600">
                Ferramentas
              </a>
            </li>
            <li>
              <a href="/#perguntas" className="hover:text-brand-600">
                Perguntas frequentes
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-2.5 text-[12px] font-bold uppercase tracking-wide text-ink-muted">
            Conta
          </p>
          <ul className="flex flex-col gap-2 text-[13.5px] text-ink-soft">
            <li>
              <Link href="/entrar" className="hover:text-brand-600">
                Entrar
              </Link>
            </li>
            <li>
              <Link href="/criar-conta" className="hover:text-brand-600">
                Criar conta
              </Link>
            </li>
            <li>
              <Link href="/recuperar-senha" className="hover:text-brand-600">
                Recuperar senha
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line px-4 py-5 app:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-[12px] leading-relaxed text-ink-muted">
          <p>
            © {new Date().getFullYear()} {NOME_PRODUTO}. Todos os direitos reservados.
          </p>
          <p>
            Este produto ensina receitas e oferece ferramentas de cálculo e planejamento. Os
            valores exibidos nas calculadoras e simuladores são estimativas baseadas nos preços
            informados por você e <strong className="text-ink-soft">não são promessa de renda</strong>
            . Resultados dependem de custos locais, preço praticado, procura e do seu trabalho.
          </p>
        </div>
      </div>
    </footer>
  );
}
