"use client";

import { useState } from "react";

export function SettingsForm({
  officialUrl,
  recruiterName,
}: {
  officialUrl: string;
  recruiterName: string;
}) {
  const [url, setUrl] = useState(officialUrl);
  const [name, setName] = useState(recruiterName);
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ official_url: url, recruiter_name: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "No se pudo guardar la configuración");
      setUrl(data.settings.official_url as string);
      setName(data.settings.recruiter_name as string);
      setState("ok");
      setMessage("Guardado ✅ Todas las respuestas nuevas usarán este enlace oficial.");
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-3xl border border-ink-3 bg-ink p-5 text-paper shadow-pop"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
        configuración del bot
      </p>
      <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-paper">
        Enlace oficial que inserta PlanetaBot
      </h2>
      <p className="mt-2 text-[12.5px] leading-relaxed text-paper/60">
        El marcador <span className="font-mono text-aqua">{"{{URL}}"}</span> de cada mensaje de texto
        se reemplaza por esta dirección. Si trabajas con un enlace personalizado de reclutador, cámbialo
        aquí una sola vez.
      </p>

      <label className="mt-4 block">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-paper/50">
          Web oficial
        </span>
        <input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
          inputMode="url"
          className="mt-1.5 w-full rounded-xl border border-ink-3 bg-ink-2 px-3.5 py-2.5 font-mono text-[12.5px] text-aqua outline-none transition-all duration-200 focus:border-aqua focus:ring-4 focus:ring-aqua/15"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-paper/50">
          Nombre del reclutador/a (saludo por defecto)
        </span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={60}
          className="mt-1.5 w-full rounded-xl border border-ink-3 bg-ink-2 px-3.5 py-2.5 text-sm text-paper outline-none transition-all duration-200 focus:border-brand focus:ring-4 focus:ring-brand/20"
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "saving"}
          className="sheen relative overflow-hidden rounded-xl bg-brand px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-white transition-all duration-200 hover:bg-brand-deep active:scale-[0.98] disabled:opacity-50"
        >
          {state === "saving" ? "Guardando…" : "Guardar ajustes"}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-xl border border-ink-3 bg-ink-2 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-paper/70 transition-all duration-200 hover:border-aqua hover:text-aqua"
        >
          Abrir web ↗
        </a>
      </div>

      {message ? (
        <p
          className={`animate-fade-in mt-3 rounded-xl border px-3 py-2 text-[12.5px] font-semibold ${
            state === "ok"
              ? "border-leaf/50 bg-leaf/15 text-leaf"
              : "border-brand/50 bg-brand/15 text-[#ffd0dc]"
          }`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
