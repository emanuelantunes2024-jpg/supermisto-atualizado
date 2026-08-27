"use client";

import { CartaoReceita } from "@/components/receitas/CartaoReceita";
import { LinkBotao } from "@/components/ui/Botao";
import { Vazio } from "@/components/ui/Vazio";
import { useDadosUsuario } from "@/lib/dados-usuario";
import type { Receita } from "@/lib/types";

/**
 * Grade de favoritos.
 *
 * A lista de receitas vem do servidor; quais estão salvas é decidido no
 * cliente, porque os favoritos podem estar no banco ou só neste navegador.
 */
export function GradeFavoritos({ receitas }: { receitas: Receita[] }) {
  const { favoritos, carregando } = useDadosUsuario();

  if (carregando) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
        {[0, 1, 2, 3].map((n) => (
          <div key={n} className="cartao h-56 animate-pulse bg-cream-200" />
        ))}
      </div>
    );
  }

  const salvas = receitas.filter((r) => favoritos.includes(r.slug));

  if (salvas.length === 0) {
    return (
      <Vazio
        icone="coracao"
        titulo="Você ainda não salvou nenhuma receita"
        descricao="Toque no coração de qualquer receita para guardá-la aqui e encontrar rapidinho depois."
        acao={
          <LinkBotao href="/receitas" tamanho="sm">
            Explorar receitas
          </LinkBotao>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 app:grid-cols-4">
      {salvas.map((receita, indice) => (
        <CartaoReceita key={receita.slug} receita={receita} prioridade={indice < 4} />
      ))}
    </div>
  );
}
