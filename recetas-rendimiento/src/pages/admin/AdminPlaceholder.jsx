import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';

export default function AdminPlaceholder({ titulo, icon = 'settings', descripcion }) {
  return (
    <div className="space-y-5">
      <h1 className="text-[22px] font-extrabold tracking-tight text-ink">{titulo}</h1>
      <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          <Icon name={icon} className="w-6 h-6" />
        </span>
        <p className="text-[15px] font-bold text-ink">Sección en preparación</p>
        <p className="max-w-sm text-[12.5px] leading-relaxed text-ink/50">
          {descripcion ||
            'Esta sección del panel quedará habilitada en la próxima etapa. La gestión de recetas y categorías ya está operativa.'}
        </p>
        <Link to="/admin/recetas" className="btn-primary mt-1 !py-2 !text-[12.5px]">
          Ir a Recetas
        </Link>
      </div>
    </div>
  );
}
