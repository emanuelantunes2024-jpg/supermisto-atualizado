"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { definirAcessoUsuario } from "@/app/admin/actions";
import { Selo } from "@/components/ui/Selo";
import { formatarDataRelativa } from "@/lib/format";
import type { Perfil } from "@/lib/types";

const SITUACOES: Array<{ valor: Perfil["acesso"]; rotulo: string }> = [
  { valor: "ativo", rotulo: "Ativo" },
  { valor: "suspenso", rotulo: "Suspenso" },
  { valor: "cancelado", rotulo: "Cancelado" },
];

const TONS: Record<Perfil["acesso"], "dinheiro" | "ambar" | "neutro"> = {
  ativo: "dinheiro",
  suspenso: "ambar",
  cancelado: "neutro",
};

/** Lista de clientes com controle manual da situação de acesso. */
export function TabelaUsuarios({ perfis }: { perfis: Perfil[] }) {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();
  const [aviso, setAviso] = useState<string | null>(null);

  function mudar(id: string, acesso: Perfil["acesso"]) {
    iniciarTransicao(async () => {
      const resultado = await definirAcessoUsuario(id, acesso);
      setAviso(resultado.mensagem);
      if (resultado.ok) router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {aviso && (
        <p role="status" className="cartao px-4 py-2.5 text-[13px] font-semibold text-ink-soft">
          {aviso}
        </p>
      )}

      <div className="cartao overflow-hidden">
        <ul className="divide-y divide-line/60">
          {perfis.map((perfil) => (
            <li key={perfil.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-300 to-brand-500 text-[13px] font-bold text-white">
                {(perfil.nome ?? perfil.email ?? "?").charAt(0).toUpperCase()}
              </span>

              <div className="min-w-[160px] flex-1">
                <p className="text-[13.5px] font-semibold text-ink">
                  {perfil.nome ?? "Sem nome"}
                  {perfil.papel === "admin" && (
                    <Selo tom="escuro" className="ml-2">
                      Admin
                    </Selo>
                  )}
                </p>
                <p className="truncate text-[12px] text-ink-muted">{perfil.email}</p>
              </div>

              <div className="text-right">
                <Selo tom={TONS[perfil.acesso]}>{perfil.acesso}</Selo>
                <p className="mt-1 text-[11px] text-ink-muted">
                  entrou {formatarDataRelativa(perfil.criadoEm)}
                </p>
              </div>

              <select
                value={perfil.acesso}
                disabled={pendente}
                onChange={(e) => mudar(perfil.id, e.target.value as Perfil["acesso"])}
                aria-label={`Situação de acesso de ${perfil.email}`}
                className="campo w-auto py-2 text-[12.5px]"
              >
                {SITUACOES.map((situacao) => (
                  <option key={situacao.valor} value={situacao.valor}>
                    {situacao.rotulo}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>

        {perfis.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-ink-muted">
            Nenhum usuário cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}
