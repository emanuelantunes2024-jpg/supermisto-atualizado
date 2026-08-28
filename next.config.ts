import type { NextConfig } from "next";

const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  experimental: {
    // Por defecto Next corta las Server Actions en 1 MB: los .zip de las
    // plantillas (con fotos reales) suelen pesar más. La subida grande del
    // .zip completo usa URL firmada directa a Supabase (no pasa por aquí),
    // pero esto protege la subida de la carpeta de demo y otras acciones.
    serverActions: { bodySizeLimit: "20mb" },
  },
  images: {
    remotePatterns: [
      // Storage público de Supabase (miniaturas de plantillas).
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
        : []),
      { protocol: "https" as const, hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
