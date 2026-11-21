"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { CopyButton } from "@/components/copy-button";

export type LibraryCategory = {
  slug: string;
  title: string;
  emoji: string;
  objectionLabel: string;
  keywords: string[];
  priority: number;
  isFallback: boolean;
  exampleInput: string;
  textMessage: string;
  audioScript: string;
  tip: string;
  usageCount: number;
};

export type SavedItem = {
  id: number;
  title: string;
  categorySlug: string;
  textMessage: string;
  audioScript: string;
  tip: string;
  createdAt: string;
};

export function LibraryClient({
  categories,
  saved: initialSaved,
  officialUrl,
}: {
  categories: LibraryCategory[];
  saved: SavedItem[];
  officialUrl: string;
}) {
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [saved, setSaved] = useState<SavedItem[]>(initialSaved);
  const [form, setForm] = useState({ title: "", textMessage: "", audioScript: "", tip: "" });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      [c.title, c.objectionLabel, c.exampleInput, c.textMessage, ...c.keywords]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [categories, query]);

  async function saveCustom(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "No se pudo guardar");
      setSaved((prev) => [
        { ...data.item, createdAt: data.item.createdAt ?? new Date().toISOString() } as SavedItem,
        ...prev,
      ]);
      setForm({ title: "", textMessage: "", audioScript: "", tip: "" });
      setNotice("Respuesta guardada en tu biblioteca personal ✅");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  }

  async function removeSaved(id: number) {
    setSaved((prev) => prev.filter((item) => item.id !== id));
    await fetch(`/api/saved?id=${id}`, { method: "DELETE" }).catch(() => undefined);
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
            base de conocimiento
          </p>
          <h1 className="mt-1 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
            Biblioteca de objeciones
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {categories.length} respuestas listas construidas sobre los 5 pilares innegociables de
            Agencia Planeta. Copia, pega y envía: todas llevan el enlace oficial.
          </p>
        </div>
        <label className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted">
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6" />
              <path d="M13.5 13.5L18 18" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar objeción, palabra clave…"
            className="w-full rounded-2xl border border-line bg-card py-3 pr-4 pl-10 text-sm font-semibold text-ink outline-none transition-all duration-200 placeholder:font-normal placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/12"
          />
        </label>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((cat) => {
          const open = openSlug === cat.slug;
          return (
            <article
              key={cat.slug}
              className={`group overflow-hidden rounded-3xl border bg-card shadow-card transition-all duration-300 ${
                open ? "border-brand/60 shadow-pop" : "border-line hover:-translate-y-0.5 hover:border-ink-4/40"
              }`}
            >
              <div className="flex items-start gap-3 p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-line bg-paper text-xl transition-transform duration-300 group-hover:scale-105">
                  {cat.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-[1.05rem] font-extrabold tracking-tight text-ink">
                      {cat.objectionLabel}
                    </h2>
                    {cat.isFallback ? (
                      <span className="rounded-full bg-line px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                        comodín
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-muted">{cat.title}</p>
                  <p className="mt-2 rounded-xl border border-line-soft bg-paper px-3 py-2 text-[12.5px] italic leading-relaxed text-ink-4">
                    “{cat.exampleInput}”
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-line-soft px-4 py-3">
                <CopyButton
                  value={cat.textMessage.replace(/\{\{URL\}\}/g, officialUrl)}
                  kind="text"
                  slug={cat.slug}
                  size="sm"
                  label="📱 Texto"
                />
                <CopyButton
                  value={cat.audioScript}
                  kind="audio"
                  slug={cat.slug}
                  size="sm"
                  tone="ghost"
                  label="🎙️ Audio"
                />
                <Link
                  href={`/?auto=${cat.slug}`}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-bold text-ink transition-all duration-200 hover:border-aqua hover:text-aqua"
                >
                  Probar en el asistente →
                </Link>
                <button
                  type="button"
                  onClick={() => setOpenSlug(open ? null : cat.slug)}
                  className="ml-auto rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-bold text-ink transition-all duration-200 hover:border-brand hover:text-brand"
                >
                  {open ? "Ocultar ↑" : "Ver respuesta ↓"}
                </button>
              </div>

              {open ? (
                <div className="animate-fade-in flex flex-col gap-3 border-t border-line bg-paper px-4 py-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      📱 opción 1 · mensaje de texto
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap text-ink-4">
                      {cat.textMessage.replace(/\{\{URL\}\}/g, officialUrl)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                      🎙️ opción 2 · guion de audio (20-30 s)
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap text-ink-4">
                      {cat.audioScript}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-solar/40 bg-solar/12 px-3 py-2 text-[12.5px] leading-relaxed font-semibold text-[#7a5200]">
                    📌 {cat.tip}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.keywords.slice(0, 14).map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-line bg-card px-2 py-0.5 font-mono text-[10px] text-muted"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                  <p className="font-mono text-[10.5px] text-muted">
                    usada {cat.usageCount} {cat.usageCount === 1 ? "vez" : "veces"} · prioridad{" "}
                    {cat.priority}
                  </p>
                </div>
              ) : null}
            </article>
          );
        })}

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-card p-8 text-center lg:col-span-2">
            <p className="font-display text-lg font-extrabold text-ink">Sin resultados para “{query}”</p>
            <p className="mt-1 text-sm text-muted">
              Prueba con palabras como <em>diamantes</em>, <em>estafa</em>, <em>tiempo</em>,{" "}
              <em>banear</em> o <em>seguidores</em>.
            </p>
          </div>
        ) : null}
      </div>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-3xl border border-line bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
            ✂️ Mis respuestas personalizadas
          </h2>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            Guarda mensajes que ya te funcionaron con tu propio estilo (recuerda dejar siempre el
            enlace oficial visible).
          </p>
          <form onSubmit={saveCustom} className="mt-4 flex flex-col gap-2.5">
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
              maxLength={120}
              placeholder="Título (ej. Cierre para creadores gaming)"
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-brand focus:ring-4 focus:ring-brand/12"
            />
            <textarea
              value={form.textMessage}
              onChange={(event) => setForm({ ...form, textMessage: event.target.value })}
              required
              rows={4}
              placeholder={`📱 Mensaje de texto… incluye el enlace:\n👉 ${officialUrl}`}
              className="resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-all duration-200 focus:border-brand focus:ring-4 focus:ring-brand/12"
            />
            <textarea
              value={form.audioScript}
              onChange={(event) => setForm({ ...form, audioScript: event.target.value })}
              rows={2}
              placeholder="🎙️ Guion de audio (opcional)"
              className="resize-none rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm leading-relaxed outline-none transition-all duration-200 focus:border-aqua focus:ring-4 focus:ring-aqua/12"
            />
            <input
              value={form.tip}
              onChange={(event) => setForm({ ...form, tip: event.target.value })}
              placeholder="📌 Consejo para el equipo (opcional)"
              className="rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:border-solar focus:ring-4 focus:ring-solar/15"
            />
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="sheen relative overflow-hidden rounded-xl bg-ink px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-paper transition-all duration-200 hover:bg-ink-3 active:scale-[0.98] disabled:opacity-50"
              >
                {saving ? "Guardando…" : "Guardar respuesta"}
              </button>
              {notice ? <span className="text-[12px] font-semibold text-leaf">{notice}</span> : null}
            </div>
          </form>
        </div>

        <div className="rounded-3xl border border-line bg-card p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              🗂️ Guardadas ({saved.length})
            </h2>
            <Link href="/panel" className="text-[12px] font-bold text-brand hover:text-brand-deep">
              Ver uso del equipo →
            </Link>
          </div>
          {saved.length === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-line bg-paper px-4 py-6 text-center text-[13px] text-muted">
              Todavía no guardas respuestas personalizadas.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {saved.map((item) => (
                <li
                  key={item.id}
                  className="animate-rise rounded-2xl border border-line-soft bg-paper px-3.5 py-3 transition-colors duration-200 hover:border-brand/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-extrabold text-ink">{item.title}</p>
                      <p className="mt-1 line-clamp-3 text-[12.5px] leading-relaxed whitespace-pre-wrap text-muted">
                        {item.textMessage}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1.5">
                      <CopyButton value={item.textMessage} kind="text" slug={item.categorySlug} size="sm" tone="ghost" label="Copiar" />
                      <button
                        type="button"
                        onClick={() => void removeSaved(item.id)}
                        className="rounded-full border border-line bg-card px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-muted transition-colors duration-200 hover:border-brand hover:text-brand"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
