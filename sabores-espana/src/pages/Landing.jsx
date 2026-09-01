import { Link } from 'react-router-dom';
import { siteConfig } from '../lib/config.js';
import { CATEGORIES } from '../lib/categories.js';
import { RECETAS_SEED } from '../data/recipes.js';

const DESTACADOS = [
  { icon: '📱', texto: 'App real, no PDF: abrís en el celular o la compu y ves las recetas al instante.' },
  { icon: '⏱', texto: 'Temporizador de cocina en cada receta, para no perderte ni un minuto.' },
  { icon: '❤️', texto: 'Guardá tus favoritas con un toque y encontralas cuando quieras.' },
  { icon: '🔎', texto: 'Buscador y categorías: encontrá la receta perfecta en segundos.' },
];

export default function Landing() {
  const total = RECETAS_SEED.length;

  return (
    <div className="min-h-screen bg-wine-gradient text-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇪🇸</span>
          <span className="font-display text-lg font-bold">{siteConfig.nombre}</span>
        </div>
        <Link
          to="/entrar"
          className="rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Ya compré, entrar
        </Link>
      </header>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 pb-16 pt-6 md:grid-cols-2 md:items-center md:pt-12">
        <div>
          <span className="mb-4 inline-block rounded-full bg-gold-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold-200">
            Sabores del Mundo · España
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {total} recetas españolas, tradicionales y deliciosas
          </h1>
          <p className="mt-4 text-lg text-white/80">{siteConfig.eslogan}</p>

          <ul className="mt-6 space-y-3">
            {DESTACADOS.map((d) => (
              <li key={d.texto} className="flex items-start gap-3 text-sm text-white/90">
                <span className="text-xl leading-none">{d.icon}</span>
                <span>{d.texto}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={siteConfig.hotmartCheckoutUrl}
              className="rounded-xl bg-gold-300 px-6 py-3.5 text-center font-display text-base font-bold text-ink shadow-lift transition hover:bg-gold-200"
            >
              Quiero acceder ahora →
            </a>
            <Link
              to="/entrar"
              className="rounded-xl border border-white/30 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Ya soy miembro
            </Link>
          </div>
          <p className="mt-3 text-xs text-white/60">Pago 100% seguro procesado por Hotmart. Acceso inmediato tras la compra.</p>
        </div>

        <div className="flex justify-center">
          <img
            src="/images/portada-libro.png"
            alt={`Portada de ${siteConfig.nombre}`}
            className="w-full max-w-sm rounded-2xl shadow-lift"
          />
        </div>
      </section>

      <section className="bg-cream py-14 text-ink">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-display text-2xl font-bold sm:text-3xl">Todo lo que vas a encontrar</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {CATEGORIES.map((c) => (
              <div key={c.slug} className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-shell p-4 text-center shadow-card">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-semibold leading-tight">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            {total} recetas te esperan, a un clic de distancia
          </h2>
          <p className="mt-3 text-white/80">
            Accedé desde cualquier dispositivo, cuantas veces quieras, para siempre.
          </p>
          <a
            href={siteConfig.hotmartCheckoutUrl}
            className="mt-6 inline-block rounded-xl bg-gold-300 px-8 py-4 font-display text-base font-bold text-ink shadow-lift transition hover:bg-gold-200"
          >
            Quiero mis {total} recetas →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {siteConfig.nombre} · Leuname Software · {siteConfig.soporteEmail}
      </footer>
    </div>
  );
}
