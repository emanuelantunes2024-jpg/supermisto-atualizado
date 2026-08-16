import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-24">
      <div className="container-shell max-w-[560px] text-center">
        <div className="font-display text-[72px] font-extrabold leading-none text-gold-400">404</div>
        <h1 className="mb-3 mt-4 text-[26px]">Esta página no existe</h1>
        <p className="mb-8 text-[15px] text-ink-muted">
          Puede que el enlace esté mal escrito o que la plantilla que buscas ya no esté disponible.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/plantillas" className="btn btn-gold btn-lg">
            Ver plantillas
          </Link>
          <Link href="/" className="btn btn-ghost btn-lg">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
