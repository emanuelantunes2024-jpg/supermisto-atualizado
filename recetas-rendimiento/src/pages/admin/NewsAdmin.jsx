import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../lib/StoreContext.jsx';
import Icon from '../../components/Icon.jsx';
import EmptyState from '../../components/EmptyState.jsx';

// Qué se ve en "Novedades" del sitio público: las recetas marcadas acá
// (banner chico de la home + la página /novedades). Esta pantalla junta,
// en un solo lugar, marcar/desmarcar recetas como novedad y el acceso
// directo a cambiar las imágenes de los banners — las dos cosas que antes
// vivían separadas y eran difíciles de encontrar.
export default function NewsAdmin() {
  const { recetas, guardarReceta } = useStore();
  const [error, setError] = useState(null);

  const novedades = recetas.filter((r) => r.novedad);
  const resto = recetas.filter((r) => !r.novedad);

  function alternar(r) {
    guardarReceta({ ...r, novedad: !r.novedad }).catch(() => setError('No se pudo actualizar la receta.'));
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">Novedades</h1>
        <p className="mt-1 text-sm text-ink/50">
          Acá controlás qué recetas aparecen como "novedad" en la home y en /novedades del sitio.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <p className="text-[12.5px] font-semibold text-amber-800">{error}</p>
        </div>
      )}

      <div className="card flex flex-wrap items-center gap-3 border-brand-200 bg-brand-50 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-500">
          <Icon name="image" className="w-5 h-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-ink">¿Buscás cambiar la imagen del banner?</p>
          <p className="text-[12.5px] text-ink/60">
            La foto grande de "Biblioteca en expansión" y la del banner de novedades se cambian en
            Configuración.
          </p>
        </div>
        <Link to="/admin/configuracion" className="btn-primary shrink-0 !py-2 !text-[12.5px]">
          Ir a Configuración
        </Link>
      </div>

      <div className="space-y-2.5">
        <p className="text-[13px] font-bold text-ink">Marcadas como novedad ({novedades.length})</p>
        {novedades.length === 0 ? (
          <EmptyState icon="bell" title="Todavía no marcaste ninguna receta" description="Elegí recetas de la lista de abajo para que aparezcan como novedad." />
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {novedades.map((r) => (
              <FilaReceta key={r.id} r={r} onClick={() => alternar(r)} accion="Quitar de novedades" activo />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <p className="text-[13px] font-bold text-ink">Resto de las recetas ({resto.length})</p>
        {resto.length === 0 ? (
          <p className="text-[12.5px] text-ink/50">No hay más recetas para marcar.</p>
        ) : (
          <div className="grid gap-2.5 sm:grid-cols-2">
            {resto.map((r) => (
              <FilaReceta key={r.id} r={r} onClick={() => alternar(r)} accion="Marcar como novedad" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilaReceta({ r, onClick, accion, activo = false }) {
  return (
    <div className="card flex items-center gap-3 p-3">
      <img src={r.imagen} alt={r.nombre} className="h-11 w-11 shrink-0 rounded-lg object-cover" />
      <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{r.nombre}</p>
      <button
        onClick={onClick}
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${
          activo ? 'bg-brand-100 text-brand-700 hover:bg-red-100 hover:text-red-700' : 'bg-black/5 text-ink/60 hover:bg-brand-100 hover:text-brand-700'
        }`}
      >
        {accion}
      </button>
    </div>
  );
}
