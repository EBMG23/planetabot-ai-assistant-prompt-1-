import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/ensure-db";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PlanetaBot · Asistente de IA para reclutadores | Agencia Planeta",
  description:
    "Convierte objeciones, miedos y dudas de creadores de TikTok Live en registros. Respuestas listas en texto y guion de audio, siempre con el enlace oficial de Agencia Planeta.",
};

export const viewport: Viewport = {
  themeColor: "#10131a",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings().catch(() => ({}) as Record<string, string>);
  const officialUrl =
    settings.official_url ?? "https://planeta-tiktok-agency-website.vercel.app";

  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400..800&family=Manrope:wght@400..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/planeta-logo.png" />
      </head>
      <body className="min-h-screen antialiased">
        <SiteHeader officialUrl={officialUrl} recruiterName={settings.recruiter_name ?? ""} />
        <main className="mx-auto w-full max-w-[1560px] px-4 pb-20 pt-6 sm:px-6 lg:px-10">
          {children}
        </main>
        <footer className="border-t border-line/70 bg-ink text-paper">
          <div className="mx-auto flex w-full max-w-[1560px] flex-col gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
            <p className="text-paper/70">
              <span className="font-display text-base font-extrabold text-paper">PlanetaBot</span>{" "}
              · herramienta interna del equipo de reclutamiento de Agencia Planeta.
            </p>
            <p className="font-mono text-xs text-paper/50">
              0% cobros al creador · cuenta siempre del creador · soporte 24/7
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
