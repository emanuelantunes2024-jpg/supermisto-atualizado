import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DetalheReceita } from "@/components/receitas/DetalheReceita";
import { CarrosselReceitas } from "@/components/receitas/CarrosselReceitas";
import { obterReceita, receitasRelacionadas } from "@/lib/queries";

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const receita = await obterReceita(slug);

  if (!receita) return { title: "Receita não encontrada" };

  return {
    title: receita.nome,
    description: receita.descricao,
    openGraph: { title: receita.nome, description: receita.descricao },
  };
}

export default async function PaginaReceita({ params }: Props) {
  const { slug } = await params;
  const receita = await obterReceita(slug);

  if (!receita) notFound();

  const relacionadas = await receitasRelacionadas(receita);

  return (
    <div className="flex flex-col gap-8">
      <DetalheReceita receita={receita} />

      <CarrosselReceitas titulo="Receitas relacionadas" receitas={relacionadas} />
    </div>
  );
}
