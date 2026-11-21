"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import type { BotReply } from "@/lib/engine";

type LiteCategory = {
  slug: string;
  title: string;
  emoji: string;
  objectionLabel: string;
  exampleInput: string;
  isFallback: boolean;
  usageCount: number;
};

type LiteSession = {
  id: string;
  title: string;
  messageCount: number;
  lastActivityAt: string;
};

type ThreadMessage = {
  id: string;
  role: "recruiter" | "bot";
  content: string;
  reply?: BotReply;
};

const QUICK_PROMPTS = [
  "¿Y cuánto porcentaje se quedan de mis diamantes?",
  "¿Cómo sé que no es una estafa?",
  "Es que no tengo tiempo, trabajo y estudio.",
  "Me banearon el live y perdí alcance.",
  "Solo tengo 800 seguidores, ¿me aceptan?",
  "Déjame lo pienso y te aviso.",
];

function timeLabel(value?: string) {
  const date = value ? new Date(value) : new Date();
  return date.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
}

function relative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  return `hace ${Math.round(hours / 24)} d`;
}

export function ChatWorkspace({
  categories,
  sessions: initialSessions,
  officialUrl,
  recruiterName,
  totalRespuestas,
  autoRun = null,
}: {
  categories: LiteCategory[];
  sessions: LiteSession[];
  officialUrl: string;
  recruiterName: string;
  totalRespuestas: number;
  autoRun?: { slug: string; text: string } | null;
}) {
  const shortcuts = useMemo(() => categories.filter((c) => !c.isFallback), [categories]);
  const [messages, setMessages] = useState<ThreadMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<LiteSession[]>(initialSessions);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<BotReply | null>(null);
  const [tab, setTab] = useState<"text" | "audio" | "tip" | "full">("text");
  const [waPreview, setWaPreview] = useState(false);
  const [lastInput, setLastInput] = useState("");
  const [generated, setGenerated] = useState(totalRespuestas);

  // Con el nombre por defecto del equipo no se personaliza el saludo.
  const greetingName = /reclutador/i.test(recruiterName) ? "" : recruiterName;

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const autoRan = useRef(false);

  const sendRef = useRef<(rawText?: string, forcedSlug?: string) => Promise<void>>(async () => {});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 190)}px`;
  }, [input]);

  useEffect(() => {
    if (!busy) return;
    setStage(0);
    const t = setTimeout(() => setStage(1), 650);
    const t2 = setTimeout(() => setStage(2), 1400);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [busy]);

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { sessions: LiteSession[] };
      setSessions(data.sessions);
    } catch {
      /* sin historial */
    }
  }, []);

  async function send(rawText?: string, forcedSlug?: string) {
    const text = (rawText ?? input).trim();
    if (!text || busy) return;
    if (rawText === undefined) setInput("");
    setBusy(true);
    setError(null);
    setLastInput(text);
    setMessages((prev) => [...prev, { id: `rec-${Date.now()}`, role: "recruiter", content: text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId ?? undefined,
          recruiterName,
          categorySlug: forcedSlug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "No se pudo generar la respuesta");
      setSessionId(data.sessionId as string);
      const reply = data.reply as BotReply;
      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, role: "bot", content: reply.fullFormat, reply },
      ]);
      setActive(reply);
      setTab("text");
      setGenerated((g) => g + 1);
      void refreshSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBusy(false);
    }
  }

  sendRef.current = send;

  useEffect(() => {
    if (!autoRun || autoRan.current) return;
    autoRan.current = true;
    const t = setTimeout(() => void sendRef.current(autoRun.text, autoRun.slug), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun]);

  async function loadSession(id: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/chat?sessionId=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "No se pudo cargar la consulta");
      const loaded = (data.messages ?? []) as Array<{
        id: number;
        role: "recruiter" | "bot";
        content: string;
        payload: BotReply | null;
      }>;
      setSessionId(id);
      setMessages(
        loaded.map((m) => ({
          id: `db-${m.id}`,
          role: m.role,
          content: m.content,
          reply: m.role === "bot" && m.payload ? m.payload : undefined,
        })),
      );
      const lastBot = [...loaded].reverse().find((m) => m.role === "bot" && m.payload);
      setActive((lastBot?.payload as BotReply) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setBusy(false);
    }
  }

  function newChat() {
    setMessages([]);
    setActive(null);
    setSessionId(null);
    setError(null);
    setInput("");
    textareaRef.current?.focus();
  }

  const activeCopy =
    tab === "text"
      ? (active?.textMessage ?? "")
      : tab === "audio"
        ? (active?.audioScript ?? "")
        : tab === "tip"
          ? (active?.tip ?? "")
          : (active?.fullFormat ?? "");

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(230px,285px)_minmax(0,1fr)_minmax(320px,380px)]">
      {/* Rail izquierdo */}
      <aside className="order-2 flex flex-col gap-4 xl:order-1">
        <section className="rounded-3xl border border-line bg-card p-4 shadow-card">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-display text-base font-extrabold tracking-tight text-ink">
              Atajos de objeción
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
              {shortcuts.length}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {shortcuts.slice(0, 9).map((cat) => (
              <div
                key={cat.slug}
                className="group flex items-center gap-2 rounded-xl border border-transparent px-2 py-1.5 transition-all duration-200 hover:border-line hover:bg-paper"
              >
                <button
                  type="button"
                  onClick={() => {
                    setInput(cat.exampleInput);
                    textareaRef.current?.focus();
                  }}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  title={`Cargar ejemplo: ${cat.exampleInput}`}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-bold text-ink">
                      {cat.objectionLabel}
                    </span>
                    <span className="block truncate text-[11px] text-muted">{cat.title}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void send(cat.exampleInput, cat.slug)}
                  aria-label={`Generar respuesta para ${cat.title}`}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-line bg-paper text-muted opacity-0 transition-all duration-200 group-hover:opacity-100 hover:border-brand hover:bg-brand hover:text-white"
                >
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                    <path d="M5 3.5l11 6.5-11 6.5z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={newChat}
            className="sheen relative mt-3 w-full overflow-hidden rounded-xl border border-ink bg-ink px-3 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-paper transition-all duration-200 hover:bg-ink-3 active:scale-[0.98]"
          >
            + Nueva consulta
          </button>
        </section>

        <section className="rounded-3xl border border-line bg-card p-4 shadow-card">
          <h2 className="mb-3 font-display text-base font-extrabold tracking-tight text-ink">
            Consultas recientes
          </h2>
          {sessions.length === 0 ? (
            <p className="text-xs leading-relaxed text-muted">
              Aún no hay consultas guardadas. Cada respuesta que generas queda registrada aquí con su
              historial completo.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {sessions.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => void loadSession(s.id)}
                    className={`w-full rounded-xl border px-2.5 py-2 text-left transition-all duration-200 ${
                      s.id === sessionId
                        ? "border-brand/50 bg-brand/8"
                        : "border-transparent hover:border-line hover:bg-paper"
                    }`}
                  >
                    <span className="block truncate text-[12.5px] font-bold text-ink">{s.title}</span>
                    <span className="mt-0.5 flex items-center gap-2 text-[10.5px] text-muted">
                      <span>{relative(s.lastActivityAt)}</span>
                      <span className="h-1 w-1 rounded-full bg-line" />
                      <span>{s.messageCount} mensajes</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-ink-3 bg-ink p-4 text-paper shadow-card">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
            uso acumulado del equipo
          </p>
          <p className="mt-1 font-display text-4xl font-extrabold leading-none text-paper">
            {generated}
          </p>
          <p className="mt-1 text-xs text-paper/60">
            respuestas generadas y persistidas en PostgreSQL
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand via-solar to-aqua transition-[width] duration-700"
              style={{ width: `${Math.min(100, 18 + (generated % 40) * 2)}%` }}
            />
          </div>
        </section>
      </aside>

      {/* Consola central */}
      <section className="order-1 flex min-w-0 flex-col xl:order-2">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
              consola de objeciones
            </p>
            <h1 className="mt-1 font-display text-[clamp(1.7rem,3.2vw,2.5rem)] font-extrabold leading-[0.98] tracking-tight text-ink">
              Pega lo que dijo el creador.
              <br />
              <span className="text-brand">Recibe la respuesta lista.</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted">
            <span className="rounded-full border border-line bg-card px-2.5 py-1">💡 Objeción</span>
            <span className="rounded-full border border-line bg-card px-2.5 py-1">📱 Texto</span>
            <span className="rounded-full border border-line bg-card px-2.5 py-1">🎙️ Audio</span>
            <span className="rounded-full border border-line bg-card px-2.5 py-1">📌 Consejo</span>
          </div>
        </div>

        <div className="mt-4 flex min-h-[42vh] flex-col gap-4 xl:min-h-[52vh]">
          {messages.length === 0 ? (
            <div className="animate-rise rounded-3xl border border-line bg-card p-6 shadow-card">
              <div className="flex items-start gap-4">
                <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/planeta-logo.png" alt="" className="spin-slow h-full w-full object-cover" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-ink">
                    ¡Listo para responder{greetingName ? `, ${greetingName}` : ""}! 🌎
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                    Soy <strong className="text-ink">PlanetaBot</strong>. Escríbeme la objeción, el
                    miedo o la duda exacta que te lanzó el creador y te devuelvo la estructura fija:
                    objeción detectada, mensaje de texto para copiar y pegar, guion para audio de
                    WhatsApp y un consejo rápido para cerrar el registro.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {[
                      ["0% cobros", "Ni un diamante del creador"],
                      ["Cuenta protegida", "Jamás pedimos claves"],
                      ["Sin horarios", "Libertad total, sin jefes"],
                      ["Soporte 24/7", "Desbaneos y shadowban"],
                    ].map(([title, desc]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-line-soft bg-paper px-3 py-2.5 transition-colors duration-200 hover:border-brand/40"
                      >
                        <p className="text-[13px] font-extrabold text-ink">{title}</p>
                        <p className="text-[11.5px] text-muted">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {messages.map((message) => (
            <ThreadBubble
              key={message.id}
              message={message}
              onOpenInPanel={(reply) => {
                setActive(reply);
                setTab("text");
              }}
            />
          ))}

          {busy ? (
            <div className="animate-fade-in flex items-center gap-3 rounded-3xl border border-line bg-card p-4 shadow-card">
              <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-line bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/planeta-logo.png" alt="" className="h-full w-full object-cover" />
              </span>
              <div>
                <p className="text-[13px] font-extrabold text-ink">
                  {
                    [
                      "Analizando la objeción…",
                      "Consultando la base de conocimiento…",
                      "Redactando texto y guion de audio…",
                    ][stage]
                  }
                </p>
                <div className="dot-typing mt-1.5 flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  <span className="h-1.5 w-1.5 rounded-full bg-solar" />
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua" />
                </div>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="animate-rise rounded-2xl border border-brand/40 bg-brand/8 px-4 py-3 text-sm font-semibold text-brand-deep">
              {error}
            </div>
          ) : null}

          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-3 z-20 mt-4">
          <div className="rounded-3xl border border-line bg-card p-3 shadow-pop">
            <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void send(prompt)}
                  className="shrink-0 rounded-full border border-line bg-paper px-3 py-1.5 text-[11.5px] font-bold text-ink-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                    event.preventDefault();
                    void send();
                  }
                }}
                rows={2}
                placeholder='Ej: "El creador me dijo: me da miedo que me roben la cuenta o que me cobren algo después"'
                className="max-h-[190px] min-h-[58px] flex-1 resize-none rounded-2xl border border-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink outline-none transition-all duration-200 placeholder:text-muted/70 focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/12"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={busy || input.trim().length < 3}
                aria-label="Generar respuesta"
                className="sheen relative grid h-[58px] w-[58px] shrink-0 place-items-center overflow-hidden rounded-2xl bg-brand text-white transition-all duration-200 hover:bg-brand-deep active:scale-95 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12l16-8-6 8 6 8-16-8z" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-muted">
              <kbd className="rounded border border-line bg-paper px-1 font-mono text-[10px]">Ctrl</kbd>
              {" + "}
              <kbd className="rounded border border-line bg-paper px-1 font-mono text-[10px]">Enter</kbd>
              {" para generar · toda respuesta incluye el enlace oficial "}
              <span className="font-mono text-[10.5px] text-brand-deep">{officialUrl}</span>
            </p>
          </div>
        </div>
      </section>

      {/* Panel de envío */}
      <aside className="order-3 flex flex-col gap-4 xl:sticky xl:top-24 xl:self-start">
        <section className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
          <div className="flex items-center justify-between gap-2 border-b border-line bg-paper px-4 py-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                panel de envío
              </p>
              <h2 className="truncate font-display text-base font-extrabold tracking-tight text-ink">
                {active ? `${active.emoji} ${active.objectionLabel}` : "Esperando objeción"}
              </h2>
            </div>
            {active ? (
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.1em] ${
                  active.confidence === "alta"
                    ? "bg-leaf/15 text-leaf"
                    : active.confidence === "media"
                      ? "bg-solar/25 text-[#8a5a00]"
                      : "bg-line text-muted"
                }`}
              >
                match {active.confidence}
              </span>
            ) : null}
          </div>

          <div className="flex gap-1 border-b border-line px-3 pt-3">
            {(
              [
                ["text", "📱 Texto"],
                ["audio", "🎙️ Audio"],
                ["tip", "📌 Consejo"],
                ["full", "🧾 Completo"],
              ] as Array<[typeof tab, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`relative rounded-t-xl px-3 py-2 text-[11.5px] font-extrabold transition-colors duration-200 ${
                  tab === key ? "bg-card text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {label}
                <span
                  className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-brand transition-all duration-300 ${
                    tab === key ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="max-h-[46vh] overflow-y-auto px-4 py-4">
            {!active ? (
              <p className="text-sm leading-relaxed text-muted">
                Genera una respuesta en la consola y aquí tendrás el texto listo para copiar, el guion
                de audio y el consejo estratégico, con vista previa estilo WhatsApp.
              </p>
            ) : waPreview && tab === "text" ? (
              <div className="wa-shell rounded-2xl p-3">
                <div className="wa-bubble rounded-xl rounded-tr-none px-3 py-2 text-[13px] leading-relaxed whitespace-pre-wrap">
                  {active.textMessage}
                  <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-[#667781]">
                    {timeLabel()}
                    <svg viewBox="0 0 16 16" className="h-3 w-3 text-aqua" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 8.5l3 3 6-7M6 11.5l1 1 6-7" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
              </div>
            ) : (
              <p
                className={`text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                  tab === "tip" ? "font-semibold text-ink" : "text-ink-4"
                } ${tab === "full" ? "font-mono text-[12px]" : ""}`}
              >
                {activeCopy}
              </p>
            )}
          </div>

          {active ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-line bg-paper px-4 py-3">
              <CopyButton
                value={activeCopy}
                kind={tab === "full" ? "full" : tab === "audio" ? "audio" : tab === "tip" ? "tip" : "text"}
                slug={active.categorySlug}
                label={tab === "full" ? "Copiar formato completo" : "Copiar"}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setWaPreview((v) => !v)}
                disabled={tab !== "text"}
                className={`rounded-full border px-3 py-2 text-xs font-bold transition-all duration-200 disabled:opacity-40 ${
                  waPreview && tab === "text"
                    ? "border-leaf bg-leaf/12 text-leaf"
                    : "border-line bg-card text-ink hover:border-leaf hover:text-leaf"
                }`}
              >
                {waPreview ? "✓ Vista WhatsApp" : "Vista WhatsApp"}
              </button>
            </div>
          ) : null}

          {active && active.alternatives.length > 0 ? (
            <div className="border-t border-line px-4 py-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                ¿otra objeción posible?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {active.alternatives.map((alt) => (
                  <button
                    key={alt.slug}
                    type="button"
                    onClick={() => void send(lastInput, alt.slug)}
                    className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-bold text-ink-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-aqua hover:bg-aqua/10 hover:text-aqua"
                  >
                    {alt.emoji} {alt.objectionLabel}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl border border-ink-3 bg-ink p-4 text-paper shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                marcador obligatorio
              </p>
              <p className="mt-1.5 font-mono text-[12.5px] leading-relaxed break-all text-aqua">
                {active?.officialUrl ?? officialUrl}
              </p>
            </div>
            <CopyButton
              value={active?.officialUrl ?? officialUrl}
              kind="link"
              tone="ghost"
              size="sm"
              className="border-ink-3 bg-ink-3 text-paper/80 hover:border-aqua hover:text-aqua"
            />
          </div>
          <p className="mt-3 text-[11.5px] leading-relaxed text-paper/55">
            📌 Pega el enlace justo debajo del audio o dentro del mensaje de texto. La web oficial es
            tu prueba social: testimonios, beneficios y registro seguro.
          </p>
          <Link
            href="/politicas"
            className="mt-3 inline-flex items-center gap-1.5 text-[11.5px] font-bold text-solar transition-colors duration-200 hover:text-paper"
          >
            Cambiar el enlace oficial en Políticas →
          </Link>
        </section>
      </aside>
    </div>
  );
}

function ThreadBubble({
  message,
  onOpenInPanel,
}: {
  message: ThreadMessage;
  onOpenInPanel: (reply: BotReply) => void;
}) {
  if (message.role === "recruiter") {
    return (
      <div className="animate-rise flex justify-end">
        <div className="max-w-[86%] rounded-3xl rounded-br-md border border-ink-3 bg-ink px-4 py-3 text-[13.5px] leading-relaxed text-paper shadow-card">
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper/40">
            mensaje del creador · vía reclutador
          </p>
          {message.content}
        </div>
      </div>
    );
  }

  const reply = message.reply;
  return (
    <div className="animate-rise flex gap-3">
      <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/planeta-logo.png" alt="" className="h-full w-full object-cover" />
      </span>
      <div className="min-w-0 flex-1 overflow-hidden rounded-3xl rounded-tl-md border border-line bg-card shadow-card">
        <div className="flex flex-wrap items-center gap-2 border-b border-line-soft bg-paper px-4 py-2.5">
          <span className="font-display text-sm font-extrabold tracking-tight text-ink">
            PlanetaBot
          </span>
          <span className="rounded-full bg-brand/12 px-2.5 py-0.5 text-[11px] font-extrabold text-brand-deep">
            💡 {reply?.objectionLabel ?? "Respuesta"}
          </span>
          {reply ? (
            <span className="ml-auto font-mono text-[10px] text-muted">
              match {reply.confidence} · {timeLabel()}
            </span>
          ) : null}
        </div>

        <div className="px-4 py-3">
          {reply ? (
            <>
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                📱 opción 1 · mensaje de texto
              </p>
              <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-ink-4">
                {reply.textMessage}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CopyButton value={reply.textMessage} kind="text" slug={reply.categorySlug} size="sm" />
                <CopyButton
                  value={reply.audioScript}
                  kind="audio"
                  slug={reply.categorySlug}
                  size="sm"
                  tone="ghost"
                  label="🎙️ Guion de audio"
                />
                <CopyButton
                  value={reply.fullFormat}
                  kind="full"
                  slug={reply.categorySlug}
                  size="sm"
                  tone="ghost"
                  label="🧾 Todo"
                />
                <button
                  type="button"
                  onClick={() => onOpenInPanel(reply)}
                  className="ml-auto rounded-full border border-line bg-paper px-3 py-1 text-[11px] font-bold text-ink transition-all duration-200 hover:border-aqua hover:text-aqua"
                >
                  Abrir en panel →
                </button>
              </div>
              <details className="mt-3 rounded-2xl border border-line-soft bg-paper">
                <summary className="cursor-pointer px-3 py-2 text-[12px] font-extrabold text-ink transition-colors duration-200 hover:text-brand">
                  🎙️ Opción 2 · Guion para audio de WhatsApp
                </summary>
                <p className="px-3 pb-3 text-[13px] leading-relaxed whitespace-pre-wrap text-ink-4">
                  {reply.audioScript}
                </p>
              </details>
              <div className="mt-3 rounded-2xl border border-solar/40 bg-solar/12 px-3 py-2 text-[12.5px] leading-relaxed font-semibold text-[#7a5200]">
                📌 Consejo rápido: {reply.tip}
              </div>
              {reply.matchedKeywords.length > 0 ? (
                <p className="mt-2.5 font-mono text-[10.5px] text-muted">
                  señales detectadas: {reply.matchedKeywords.slice(0, 6).join(" · ")}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap text-ink-4">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
