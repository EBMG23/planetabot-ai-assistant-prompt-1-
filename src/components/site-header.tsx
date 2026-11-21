"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CopyButton } from "@/components/copy-button";

const NAV = [
  { href: "/", label: "Asistente", hint: "generador de respuestas" },
  { href: "/biblioteca", label: "Biblioteca", hint: "objeciones y guardados" },
  { href: "/panel", label: "Panel", hint: "uso del equipo" },
  { href: "/politicas", label: "Políticas", hint: "pilares y ajustes" },
];

export function SiteHeader({
  officialUrl,
  recruiterName,
}: {
  officialUrl: string;
  recruiterName?: string;
}) {
  const pathname = usePathname();
  const [url, setUrl] = useState(officialUrl);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setUrl(officialUrl), [officialUrl]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-ink-3/70 bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1560px] flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-ink-3 bg-ink-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/planeta-logo.png"
              alt="Logo PlanetaBot - Agencia Planeta"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            />
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.15rem] font-extrabold tracking-tight text-paper">
              PlanetaBot
            </span>
            <span className="mt-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-aqua">
              Agencia Planeta
            </span>
          </span>
        </Link>

        <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto lg:order-none lg:w-auto lg:flex-1 lg:justify-center">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative shrink-0 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-ink-3 text-paper"
                    : "text-paper/55 hover:bg-ink-2 hover:text-paper"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full bg-brand transition-all duration-300 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-ink-3 bg-ink-2 px-3 py-1.5 xl:flex">
            <span className="pulse-live h-2 w-2 rounded-full bg-leaf" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/60">
              motor activo
            </span>
          </div>

          <div className="hidden max-w-[330px] items-center gap-2 rounded-full border border-ink-3 bg-ink-2 py-1 pl-3 pr-1 md:flex">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-paper/40">
              web oficial
            </span>
            <span className="truncate font-mono text-[11px] text-aqua">{url}</span>
            <CopyButton
              value={url}
              kind="link"
              label=""
              copiedLabel=""
              size="sm"
              tone="ghost"
              className="border-ink-3 bg-ink-3 text-paper/80 hover:border-aqua hover:text-aqua"
            />
          </div>

          {recruiterName ? (
            <div className="hidden h-9 items-center rounded-full border border-ink-3 bg-ink-2 px-3 text-xs font-bold text-paper/70 lg:flex">
              {recruiterName}
            </div>
          ) : null}

          <button
            type="button"
            aria-label="Abrir navegación"
            onClick={() => setMenuOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-ink-3 bg-ink-2 text-paper lg:hidden"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="animate-fade-in border-t border-ink-3 bg-ink-2 px-4 pb-4 pt-2 md:hidden">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-paper/40">
            enlace oficial
          </p>
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-ink-3 bg-ink px-3 py-2">
            <span className="flex-1 truncate font-mono text-[11px] text-aqua">{url}</span>
            <CopyButton value={url} kind="link" size="sm" tone="ghost" className="border-ink-3 bg-ink-3 text-paper/80" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                  isActive(item.href)
                    ? "border-brand bg-brand/15 text-paper"
                    : "border-ink-3 bg-ink text-paper/65"
                }`}
              >
                {item.label}
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-paper/35">
                  {item.hint}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
