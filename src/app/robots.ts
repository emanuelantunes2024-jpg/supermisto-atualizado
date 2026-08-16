import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/mi-cuenta", "/checkout", "/entrar", "/registro"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
