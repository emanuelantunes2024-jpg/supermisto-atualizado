import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";

import { NOME_PRODUTO, SITE_URL } from "@/lib/config";
import { ProvedorDadosUsuario } from "@/lib/dados-usuario";

import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const corpo = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${NOME_PRODUTO} — receitas e ferramentas de produção`,
    template: `%s · ${NOME_PRODUTO}`,
  },
  description:
    "Biblioteca de receitas brasileiras com calculadora de custos, preço de venda, lista de compras e planejamento de produção. Um aplicativo web para quem cozinha e para quem quer produzir para vender.",
  applicationName: NOME_PRODUTO,
  // Permite "adicionar à tela de início" e abrir sem a barra do navegador.
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: NOME_PRODUTO },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: NOME_PRODUTO,
    title: `${NOME_PRODUTO} — receitas e ferramentas de produção`,
    description:
      "Encontre receitas, ajuste o rendimento, calcule o custo e simule o preço de venda. Biblioteca em expansão, com novidades toda semana.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F2643C",
  width: "device-width",
  initialScale: 1,
  // Deixa o usuário ampliar: acessibilidade acima de "parecer app".
  maximumScale: 5,
};

export default function LayoutRaiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${corpo.variable}`}>
      <body className="min-h-screen">
        <ProvedorDadosUsuario>{children}</ProvedorDadosUsuario>
      </body>
    </html>
  );
}
