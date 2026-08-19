/**
 * Plato de restaurante dibujado en SVG, para la pantalla del portátil de la
 * portada: carne a la parrilla, guarnición y dos copas de vino sobre mantel
 * oscuro con luz cálida.
 *
 * Se dibuja aquí porque viaja con el código y no depende de ningún archivo.
 * Si copias una foto en `public/hero/restaurante.jpg`, esa foto se pinta
 * encima y manda ella (ver DeviceComposition y `heroPhotos` en config).
 */
export function PlatedDish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 232" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        {/* Luz cálida del comedor */}
        <radialGradient id="pd-light" cx="60%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#8a4d16" />
          <stop offset="45%" stopColor="#3a1f0b" />
          <stop offset="100%" stopColor="#0b0705" />
        </radialGradient>

        {/* Loza del plato */}
        <linearGradient id="pd-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6f1e6" />
          <stop offset="55%" stopColor="#e2d9c8" />
          <stop offset="100%" stopColor="#bdb19c" />
        </linearGradient>
        <radialGradient id="pd-plateInner" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#fffdf7" />
          <stop offset="100%" stopColor="#ded3bf" />
        </radialGradient>

        {/* Carne a la parrilla */}
        <linearGradient id="pd-meat" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a4520" />
          <stop offset="50%" stopColor="#5e2a11" />
          <stop offset="100%" stopColor="#3d1a09" />
        </linearGradient>
        <linearGradient id="pd-meatTop" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a8582a" />
          <stop offset="100%" stopColor="#6b3113" />
        </linearGradient>

        {/* Vino */}
        <linearGradient id="pd-wine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8e1d2e" />
          <stop offset="100%" stopColor="#4a0c17" />
        </linearGradient>
        <linearGradient id="pd-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,.34)" />
          <stop offset="45%" stopColor="rgba(255,255,255,.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,.24)" />
        </linearGradient>

        {/* Salsa */}
        <linearGradient id="pd-sauce" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6b2a0e" />
          <stop offset="100%" stopColor="#3a1406" />
        </linearGradient>
      </defs>

      {/* Fondo del comedor */}
      <rect width="420" height="232" fill="url(#pd-light)" />

      {/* Luces del fondo, desenfocadas */}
      <g opacity=".5">
        <circle cx="78" cy="34" r="16" fill="#f0a730" opacity=".22" />
        <circle cx="336" cy="22" r="22" fill="#f0a730" opacity=".16" />
        <circle cx="400" cy="70" r="13" fill="#ffc75f" opacity=".2" />
      </g>

      {/* Mesa */}
      <path d="M0 168h420v64H0z" fill="#20120a" />
      <path d="M0 168h420v9H0z" fill="#3a2313" opacity=".7" />

      {/* Copas de vino */}
      <g transform="translate(238 8)">
        <WineGlass />
      </g>
      <g transform="translate(302 20) scale(.88)">
        <WineGlass />
      </g>

      {/* Sombra del plato */}
      <ellipse cx="196" cy="170" rx="132" ry="30" fill="#000" opacity=".55" />

      {/* Plato */}
      <ellipse cx="196" cy="158" rx="128" ry="52" fill="url(#pd-plate)" />
      <ellipse cx="196" cy="155" rx="112" ry="44" fill="url(#pd-plateInner)" />
      <ellipse cx="196" cy="155" rx="112" ry="44" fill="none" stroke="#b9ac95" strokeWidth=".8" opacity=".7" />

      {/* Salsa en el plato */}
      <ellipse cx="196" cy="158" rx="76" ry="27" fill="url(#pd-sauce)" opacity=".85" />
      <ellipse cx="176" cy="165" rx="30" ry="9" fill="#2a0e04" opacity=".55" />

      {/* Tres medallones de carne */}
      <g>
        <MeatCut x={140} y={144} r={1.5} />
        <MeatCut x={196} y={138} r={-2} />
        <MeatCut x={250} y={146} r={3} />
      </g>

      {/* Guarnición: tomates y hierbas */}
      <g>
        <circle cx="128" cy="166" r="9" fill="#c0341f" />
        <circle cx="125" cy="163" r="3" fill="#e05a3c" opacity=".8" />
        <circle cx="262" cy="168" r="8" fill="#b82e1b" />
        <circle cx="259" cy="165" r="2.6" fill="#e05a3c" opacity=".8" />
        <ellipse cx="220" cy="170" rx="14" ry="5" fill="#d9a11c" />
        <ellipse cx="168" cy="171" rx="12" ry="4.5" fill="#c8901a" />
      </g>
      <g stroke="#3f7d32" strokeWidth="2" strokeLinecap="round" fill="none">
        <path d="M112 154c6-6 14-8 20-6" />
        <path d="M276 156c-6-6-14-8-20-6" />
        <path d="M196 124c4-6 10-9 16-9" />
      </g>
      <g fill="#4f9640">
        <ellipse cx="118" cy="148" rx="5" ry="2.6" transform="rotate(-24 118 148)" />
        <ellipse cx="272" cy="150" rx="5" ry="2.6" transform="rotate(24 272 150)" />
        <ellipse cx="212" cy="118" rx="4.5" ry="2.4" transform="rotate(-18 212 118)" />
      </g>

      {/* Brillo del borde del plato */}
      <path
        d="M68 158a128 52 0 0 1 256 0"
        fill="none"
        stroke="#fff8ea"
        strokeWidth="2.5"
        opacity=".5"
      />

      {/* Velo cálido general */}
      <rect width="420" height="232" fill="#e0873a" opacity=".07" />
    </svg>
  );
}

/** Un medallón de carne con las marcas de la parrilla. */
function MeatCut({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <ellipse cx="0" cy="10" rx="30" ry="13" fill="#1d0a03" opacity=".5" />
      <rect x="-30" y="-2" width="60" height="16" rx="7" fill="url(#pd-meat)" />
      <ellipse cx="0" cy="-2" rx="30" ry="11" fill="url(#pd-meatTop)" />
      <g stroke="#22100a" strokeWidth="2.2" strokeLinecap="round" opacity=".75">
        <path d="M-18-7 -8 3" />
        <path d="M-6-9 4 1" />
        <path d="M6-9 16 1" />
      </g>
      <ellipse cx="-8" cy="-6" rx="9" ry="3.4" fill="#c9743c" opacity=".45" />
    </g>
  );
}

/** Copa de vino tinto. */
function WineGlass() {
  return (
    <g>
      <path d="M0 0h34c0 22-6 36-13 40v22h9v4H4v-4h9V40C6 36 0 22 0 0z" fill="url(#pd-glass)" />
      <path d="M3 8h28c-1 14-6 24-11 27h-6C9 32 4 22 3 8z" fill="url(#pd-wine)" />
      <path d="M4 2h6c0 16 3 27 8 32" stroke="#fff" strokeWidth="1.2" opacity=".28" fill="none" />
      <ellipse cx="17" cy="66" rx="13" ry="2.6" fill="#000" opacity=".45" />
    </g>
  );
}
