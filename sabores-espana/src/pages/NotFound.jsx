import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream text-center">
      <span className="text-4xl">🍽️</span>
      <h1 className="font-display text-xl font-bold text-ink">Página no encontrada</h1>
      <Link to="/" className="text-sm font-semibold text-wine-500">
        Volver al inicio
      </Link>
    </div>
  );
}
