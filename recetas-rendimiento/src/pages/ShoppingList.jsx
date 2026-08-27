import { useState } from 'react';
import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function ShoppingList() {
  const { lista, agregarAListaCompras, alternarItemLista, eliminarItemLista, vaciarLista } = useStore();
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');

  const pendientes = lista.filter((i) => !i.marcado);
  const marcados = lista.filter((i) => i.marcado);

  function agregar(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    agregarAListaCompras([{ nombre: nombre.trim(), cantidad: cantidad.trim() || '1', origen: 'Manual' }]);
    setNombre('');
    setCantidad('');
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Lista de compras</h1>
          <p className="mt-1 text-sm text-ink/50">
            {lista.length === 0 ? 'Tu lista está vacía' : `${pendientes.length} pendientes de ${lista.length}`}
          </p>
        </div>
        {lista.length > 0 && (
          <button onClick={vaciarLista} className="btn-secondary">
            <Icon name="trash" className="w-4 h-4" /> Vaciar lista
          </button>
        )}
      </div>

      <form onSubmit={agregar} className="card flex flex-col gap-2 p-4 sm:flex-row">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ingrediente (ej: Harina)" className="input flex-1" />
        <input value={cantidad} onChange={(e) => setCantidad(e.target.value)} placeholder="Cantidad (ej: 1 kg)" className="input sm:w-40" />
        <button type="submit" className="btn-primary shrink-0">
          <Icon name="plus" className="w-4 h-4" /> Agregar
        </button>
      </form>

      {lista.length === 0 ? (
        <EmptyState
          icon="cart"
          title="Tu lista de compras está vacía"
          description="Agregá ingredientes manualmente o desde la ficha de cualquier receta."
        />
      ) : (
        <div className="space-y-4">
          {pendientes.length > 0 && (
            <div className="card divide-y divide-black/5">
              {pendientes.map((item) => (
                <ItemFila key={item.id} item={item} onToggle={alternarItemLista} onRemove={eliminarItemLista} />
              ))}
            </div>
          )}
          {marcados.length > 0 && (
            <div>
              <p className="label mb-2">Comprado</p>
              <div className="card divide-y divide-black/5 opacity-60">
                {marcados.map((item) => (
                  <ItemFila key={item.id} item={item} onToggle={alternarItemLista} onRemove={eliminarItemLista} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ItemFila({ item, onToggle, onRemove }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <button
        onClick={() => onToggle(item.id)}
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 transition ${
          item.marcado ? 'border-brand-500 bg-brand-500 text-white' : 'border-black/20'
        }`}
        aria-label="Marcar comprado"
      >
        {item.marcado && <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-semibold text-ink ${item.marcado ? 'line-through' : ''}`}>{item.nombre}</p>
        <p className="text-xs text-ink/45">
          {item.cantidad} · {item.origen}
        </p>
      </div>
      <button onClick={() => onRemove(item.id)} className="rounded-lg p-1.5 text-ink/30 hover:bg-red-50 hover:text-red-600">
        <Icon name="x" className="w-4 h-4" />
      </button>
    </div>
  );
}
