import { useState } from 'react';
import { calcPrecoVenda, formatBRL } from '../../lib/calc';
import { Icon } from '../../components/common/Icon';

type Item = { id: number; nome: string; precoEmbalagem: number; quantidadeEmbalagem: number; quantidadeUsada: number };

let seq = 1;
const novoItem = (): Item => ({ id: seq++, nome: '', precoEmbalagem: 0, quantidadeEmbalagem: 1, quantidadeUsada: 0 });

export default function Calculators() {
  const [tab, setTab] = useState<'custo' | 'preco'>('custo');
  const [itens, setItens] = useState<Item[]>([novoItem(), novoItem()]);
  const [outros, setOutros] = useState(0);

  const custoTotal = itens.reduce((s, it) => {
    const unit = it.quantidadeEmbalagem > 0 ? it.precoEmbalagem / it.quantidadeEmbalagem : 0;
    return s + unit * it.quantidadeUsada;
  }, 0) + outros;

  const [custoBase, setCustoBase] = useState(0);
  const [margem, setMargem] = useState(70);
  const precoSugerido = calcPrecoVenda(custoBase, margem);

  function update(id: number, patch: Partial<Item>) {
    setItens((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-extrabold text-ink-900">Calculadoras</h1>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('custo')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'custo' ? 'bg-brand-500 text-white' : 'card text-ink-700'}`}
        >
          Calculadora de Custos
        </button>
        <button
          onClick={() => setTab('preco')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === 'preco' ? 'bg-brand-500 text-white' : 'card text-ink-700'}`}
        >
          Calculadora de Preços
        </button>
      </div>

      {tab === 'custo' && (
        <div className="card p-5">
          <p className="mb-3 text-sm text-ink-600">Informe o preço e a quantidade da embalagem de cada ingrediente e quanto você usa na receita.</p>
          <div className="space-y-3">
            {itens.map((it) => (
              <div key={it.id} className="grid grid-cols-2 gap-2 rounded-xl border border-black/10 p-3 sm:grid-cols-5 sm:items-end">
                <div className="sm:col-span-2">
                  <label className="label">Ingrediente</label>
                  <input className="input" value={it.nome} onChange={(e) => update(it.id, { nome: e.target.value })} placeholder="Ex: Farinha de trigo" />
                </div>
                <div>
                  <label className="label">Preço da embalagem (R$)</label>
                  <input type="number" className="input" value={it.precoEmbalagem} onChange={(e) => update(it.id, { precoEmbalagem: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label">Qtd. na embalagem</label>
                  <input type="number" className="input" value={it.quantidadeEmbalagem} onChange={(e) => update(it.id, { quantidadeEmbalagem: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="label">Qtd. usada na receita</label>
                  <input type="number" className="input" value={it.quantidadeUsada} onChange={(e) => update(it.id, { quantidadeUsada: Number(e.target.value) })} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setItens((p) => [...p, novoItem()])} className="btn-secondary mt-3">
            <Icon name="plus" className="h-4 w-4" /> Adicionar ingrediente
          </button>

          <div className="mt-4 max-w-xs">
            <label className="label">Outros custos (embalagem final, gás, luz...)</label>
            <input type="number" className="input" value={outros} onChange={(e) => setOutros(Number(e.target.value))} />
          </div>

          <div className="mt-5 rounded-xl bg-brand-50 p-4">
            <p className="text-xs font-semibold text-brand-700">Custo total</p>
            <p className="text-2xl font-extrabold text-brand-700">{formatBRL(custoTotal)}</p>
          </div>
        </div>
      )}

      {tab === 'preco' && (
        <div className="card max-w-md p-5">
          <div className="mb-3">
            <label className="label">Custo total da receita (R$)</label>
            <input type="number" className="input" value={custoBase} onChange={(e) => setCustoBase(Number(e.target.value))} />
          </div>
          <div className="mb-4">
            <label className="label">Margem de lucro desejada: {margem}%</label>
            <input type="range" min={0} max={95} value={margem} onChange={(e) => setMargem(Number(e.target.value))} className="w-full accent-brand-500" />
          </div>
          <div className="rounded-xl bg-brand-50 p-4">
            <p className="text-xs font-semibold text-brand-700">Preço de venda sugerido</p>
            <p className="text-2xl font-extrabold text-brand-700">{formatBRL(precoSugerido)}</p>
            <p className="mt-1 text-xs text-ink-600">Lucro por unidade: {formatBRL(precoSugerido - custoBase)}</p>
          </div>
        </div>
      )}
    </div>
  );
}
