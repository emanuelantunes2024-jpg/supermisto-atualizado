import Link from "next/link";

import { DeviceComposition } from "@/components/home/DeviceComposition";

interface HeroProps {
  categoryCount: number;
}

export function Hero({ categoryCount }: HeroProps) {
  const highlights = [
    {
      icon: (
        <>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </>
      ),
      title: `${categoryCount}+`,
      lines: ["Categorías", "Premium"],
    },
    {
      icon: (
        <>
          <rect x="2" y="4" width="20" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </>
      ),
      title: "PDVs",
      lines: ["para cada", "tipo de negocio"],
    },
    {
      icon: (
        <>
          <rect x="3" y="9" width="18" height="12" rx="1.5" />
          <path d="M3 13h18M12 9v12" />
          <path d="M12 9S9.5 4 7.5 5.2 8.6 9 12 9zM12 9s2.5-5 4.5-3.8S15.4 9 12 9z" />
        </>
      ),
      title: "Combos",
      lines: ["Ahorra", "comprando juntos"],
    },
  ];

  return (
    <section className="relative overflow-hidden pb-12 pt-14">
      <div
        className="pointer-events-none absolute inset-x-[-15%] top-[-30%] h-[700px]"
        style={{ background: "radial-gradient(circle at 28% 30%,rgba(240,167,48,0.16),transparent 60%)" }}
      />

      <div className="container-shell relative z-10 grid items-center gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="anim-in">
          <h1 className="mb-5 text-[clamp(22px,2.25vw,33px)] uppercase leading-[1.16] lg:whitespace-nowrap">
            Todo lo que tu negocio
            <br />
            necesita, <span className="text-gold-400">en un solo lugar</span>
          </h1>
          <p className="mb-8 max-w-[440px] text-[14.5px] leading-relaxed text-ink-muted">
            Sitios web premium, sistemas PDV y soluciones completas para llevar tu negocio al siguiente nivel.
          </p>

          <div className="mb-8 flex flex-wrap gap-x-8 gap-y-6">
            {highlights.map((item) => (
              <div key={item.title} className="flex items-start gap-2.5">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="mt-0.5 shrink-0 text-gold-400"
                >
                  {item.icon}
                </svg>
                <div>
                  <span className="font-display text-[18px] font-extrabold leading-tight text-gold-400">
                    {item.title}
                  </span>
                  <div className="text-[12px] leading-tight text-ink-muted">
                    {item.lines[0]}
                    <br />
                    {item.lines[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/plantillas" className="btn btn-gold btn-lg uppercase tracking-[0.04em]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
              Ver categorías
            </Link>
            <Link href="/combos" className="btn btn-ghost btn-lg uppercase tracking-[0.04em]">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.6 13.4L11 3.8V3H4v7h.8l9.6 9.6a1.5 1.5 0 0 0 2.1 0l4.1-4.1a1.5 1.5 0 0 0 0-2.1z" />
                <circle cx="7.5" cy="6.5" r="1" />
              </svg>
              Ver combos
            </Link>
          </div>
        </div>

        <DeviceComposition />
      </div>
    </section>
  );
}
