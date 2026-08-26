import { useState } from 'react';
import Modal from './Modal.jsx';
import Icon from './Icon.jsx';
import { useStore } from '../lib/StoreContext.jsx';

export default function AddToCollectionModal({ recetaId, onClose }) {
  const { colecciones, crearColeccion, alternarRecetaEnColeccion } = useStore();
  const [nombre, setNombre] = useState('');

  function crearYAgregar(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    const nueva = crearColeccion(nombre.trim());
    alternarRecetaEnColeccion(nueva.id, recetaId);
    setNombre('');
  }

  return (
    <Modal title="Agregar a colección" onClose={onClose}>
      <div className="space-y-2">
        {colecciones.length === 0 && (
          <p className="text-sm text-ink/50">Todavía no tenés colecciones. Creá una abajo.</p>
        )}
        {colecciones.map((c) => {
          const incluida = c.recetaIds.includes(recetaId);
          return (
            <button
              key={c.id}
              onClick={() => alternarRecetaEnColeccion(c.id, recetaId)}
              className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-medium transition ${
                incluida ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-black/10 hover:bg-black/5'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon name="folder" className="w-4 h-4" /> {c.nombre}
              </span>
              {incluida && <Icon name="check" className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      <form onSubmit={crearYAgregar} className="mt-4 flex gap-2 border-t border-black/5 pt-4">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nueva colección…"
          className="input"
        />
        <button type="submit" className="btn-secondary shrink-0">
          <Icon name="plus" className="w-4 h-4" /> Crear
        </button>
      </form>
    </Modal>
  );
}
