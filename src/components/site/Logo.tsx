import Image from "next/image";
import Link from "next/link";

import { brandLogo, brandLogoFull, siteConfig } from "@/lib/config";

interface LogoProps {
  href?: string;
  /**
   * "mark" (por defecto): símbolo + nombre en texto — para la cabecera.
   * "full": logotipo completo en imagen — para el pie y espacios amplios.
   */
  variant?: "mark" | "full";
}

/**
 * Marca del sitio.
 *
 * Usa el logotipo real si está configurado en `brandLogo` (src/lib/config.ts);
 * si no, dibuja el distintivo "LE" + el nombre como respaldo.
 */
export function Logo({ href = "/", variant = "mark" }: LogoProps) {
  const label = `${siteConfig.name} — inicio`;

  if (variant === "full" && brandLogo) {
    return (
      <Link href={href} aria-label={label} className="inline-block">
        <Image
          src={brandLogoFull.src}
          alt={siteConfig.name}
          width={brandLogoFull.width}
          height={brandLogoFull.height}
          className="h-auto w-[210px] max-w-full"
        />
      </Link>
    );
  }

  return (
    <Link href={href} aria-label={label} className="flex items-center gap-2.5 font-display">
      {brandLogo ? (
        <>
          <Image
            src={brandLogo.src}
            alt={siteConfig.name}
            width={brandLogo.width}
            height={brandLogo.height}
            priority
            className="h-10 w-auto"
          />
          {!brandLogo.includesName && <Wordmark />}
        </>
      ) : (
        <>
          <span
            className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] text-[15px] font-extrabold text-navy-950"
            style={{
              background: "conic-gradient(from 220deg,var(--gold-400),var(--gold-600),var(--gold-400))",
            }}
          >
            LE
          </span>
          <Wordmark />
        </>
      )}
    </Link>
  );
}

function Wordmark() {
  return (
    <span className="flex flex-col leading-[1.1]">
      <strong className="text-[15px] tracking-[0.03em]">LEUNAME</strong>
      <span className="text-[9px] uppercase tracking-[0.18em] text-ink-muted">Software</span>
    </span>
  );
}
