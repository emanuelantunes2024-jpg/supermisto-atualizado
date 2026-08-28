import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../lib/StoreContext.jsx';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Collections() {
  const { colecciones, crearColeccion, eliminarColeccion } = useStore();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState('');

  function crear(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    crearColeccion(nombre.trim());
    setNombre('');
    setAbierto(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Mis colecciones</h1>
          <p className="mt-1 text-sm text-ink/50">Agrupá recetas por evento, cliente o tipo de pedido.</p>
        </div>
        <button onClick={() => setAbierto(true)} className="btn-primary">
          <Icon name="plus" className="w-4 h-4" /> Nueva colección
        </button>
      </div>

      {colecciones.length === 0 ? (
        <EmptyState
          icon="folder"
          title="Aún no creaste ninguna colección"
          description="Las colecciones te ayudan a organizar recetas para eventos, clientes o menús."
          action={
            <button onClick={() => setAbierto(true)} className="btn-primary">
              Crear mi primera colección
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colecciones.map((c) => (
            <div key={c.id} className="card flex items-center justify-between gap-3 p-5">
              <Link to={`/colecciones/${c.id}`} className="flex flex-1 items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                  <Icon name="folder" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-ink">{c.nombre}</p>
                  <p className="text-xs text-ink/45">{c.recetaIds.length} receta{c.recetaIds.length === 1 ? '' : 's'}</p>
                </div>
              </Link>
              <button
                onClick={() => eliminarColeccion(c.id)}
                className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600"
                aria-label="Eliminar colección"
              >
                <Icon name="trash" className="w-[18px] h-[18px]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {abierto && (
        <Modal title="Nueva colección" onClose={() => setAbierto(false)}>
          <form onSubmit={crear} className="space-y-4">
            <div>
              <label className="label">Nombre de la colección</label>
              <input
                autoFocus
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Pedidos de cumpleaños"
                className="input mt-1.5"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setAbierto(false)} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Crear
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
