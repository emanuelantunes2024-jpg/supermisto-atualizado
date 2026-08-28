import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function ComingSoon({ titulo, asistente = false }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
        <Icon name={asistente ? 'sparkles' : 'crown'} className="w-8 h-8" />
      </div>
      <h1 className="text-xl font-extrabold text-ink">{titulo}</h1>
      <p className="text-sm text-ink/50">
        {asistente
          ? 'El Asistente Inteligente está en camino: te ayudará a elegir recetas, calcular precios y resolver dudas al instante. La estructura ya está lista para conectarlo próximamente.'
          : 'Esta sección estará disponible próximamente, incluyendo planes y suscripción. Por ahora, todas las funciones de la V1 son de acceso libre.'}
      </p>
      <Link to="/" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
