import type { Metadata } from "next";

import { AtalhosHome } from "@/components/home/AtalhosHome";
import { BannerBiblioteca } from "@/components/home/BannerBiblioteca";
import { FaixaFerramentas } from "@/components/home/FaixaFerramentas";
import { Onboarding } from "@/components/home/Onboarding";
import { CarrosselReceitas } from "@/components/receitas/CarrosselReceitas";
import { contarReceitas, listarReceitas, obterNovidades } from "@/lib/queries";

export const metadata: Metadata = { title: "Início" };

/** Recarrega a cada 5 minutos: novas receitas aparecem sem republicar o app. */
export const revalidate = 300;

export default async function PaginaInicio() {
  const [total, novidades, paraVender] = await Promise.all([
    contarReceitas(),
    obterNovidades(6),
    listarReceitas({ paraVender: true, porPagina: 6 }),
  ]);

  return (
    <div className="flex flex-col gap-7">
      <Onboarding />

      <AtalhosHome />

      <BannerBiblioteca total={total} novasSemana={novidades.semana} />

      <CarrosselReceitas
        titulo="Novas receitas"
        receitas={novidades.recentes}
        selo={novidades.semana > 0 ? "Adicionadas esta semana" : undefined}
        verTodosHref="/novidades"
        verTodosRotulo="Ver todas as novidades"
      />

      <CarrosselReceitas
        titulo="Receitas para vender"
        receitas={paraVender.itens}
        verTodosHref="/receitas?vender=1"
        verTodosRotulo="Ver todas"
      />

      <FaixaFerramentas />
    </div>
  );
}
