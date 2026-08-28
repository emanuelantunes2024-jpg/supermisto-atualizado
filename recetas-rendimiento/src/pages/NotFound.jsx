import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
      <p className="text-6xl">🍽️</p>
      <h1 className="text-2xl font-extrabold text-ink">Página no encontrada</h1>
      <p className="text-sm text-ink/50">La página que buscás no existe o fue movida.</p>
      <Link to="/" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  );
}
