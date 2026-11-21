import { desc, eq, sql } from "drizzle-orm";
import Link from "next/link";

import { db } from "@/db";
import {
  chatMessages,
  chatSessions,
  copyEvents,
  objectionCategories,
  savedResponses,
} from "@/db/schema";
import { ensureSeeded } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Panel de uso · PlanetaBot",
};

const KIND_LABEL: Record<string, string> = {
  text: "📱 Mensaje de texto",
  audio: "🎙️ Guion de audio",
  tip: "📌 Consejo rápido",
  link: "🔗 Enlace oficial",
  full: "🧾 Formato completo",
};

function dayKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dayLabel(key: string) {
  const date = new Date(`${key}T00:00:00Z`);
  return date.toLocaleDateString("es", { weekday: "short", timeZone: "UTC" }).replace(".", "");
}

export default async function PanelPage() {
  await ensureSeeded();

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const keys = Array.from({ length: 7 }, (_, i) => dayKey(new Date(Date.now() - (6 - i) * 86400000)));

  const [
    respuestasRows,
    sesionesRows,
    copiasRows,
    guardadasRows,
    objecionesRows,
    topRows,
    kindRows,
    activityRows,
    recentSessions,
  ] = await Promise.all([
    db.select({ n: sql<number>`count(*)::int` }).from(chatMessages).where(eq(chatMessages.role, "bot")),
    db.select({ n: sql<number>`count(*)::int` }).from(chatSessions),
    db.select({ n: sql<number>`count(*)::int` }).from(copyEvents),
    db.select({ n: sql<number>`count(*)::int` }).from(savedResponses),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(objectionCategories)
      .where(eq(objectionCategories.isFallback, false)),
    db
      .select({
        slug: objectionCategories.slug,
        title: objectionCategories.title,
        emoji: objectionCategories.emoji,
        objectionLabel: objectionCategories.objectionLabel,
        usageCount: objectionCategories.usageCount,
      })
      .from(objectionCategories)
      .orderBy(desc(objectionCategories.usageCount), desc(objectionCategories.priority))
      .limit(8),
    db
      .select({ kind: copyEvents.kind, n: sql<number>`count(*)::int` })
      .from(copyEvents)
      .groupBy(copyEvents.kind)
      .orderBy(desc(sql<number>`count(*)::int`)),
    db
      .select({
        day: sql<string>`to_char(${chatMessages.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
        n: sql<number>`count(*)::int`,
      })
      .from(chatMessages)
      .where(sql`${chatMessages.role} = 'bot' AND ${chatMessages.createdAt} >= ${since}`)
      .groupBy(sql`to_char(${chatMessages.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`),
    db.select().from(chatSessions).orderBy(desc(chatSessions.lastActivityAt)).limit(8),
  ]);

  const num = (rows: Array<{ n: number | string }>) => Number(rows[0]?.n ?? 0);
  const respuestas = num(respuestasRows);
  const sesiones = num(sesionesRows);
  const copias = num(copiasRows);
  const guardadas = num(guardadasRows);
  const objeciones = num(objecionesRows);

  const activityMap = new Map(activityRows.map((r) => [r.day, Number(r.n)]));
  const series = keys.map((key) => ({ key, value: activityMap.get(key) ?? 0 }));
  const maxDay = Math.max(1, ...series.map((s) => s.value));
  const maxUsage = Math.max(1, ...topRows.map((r) => r.usageCount));
  const maxKind = Math.max(1, ...kindRows.map((r) => Number(r.n)));
  const copiasSemana = series.reduce((acc, s) => acc + s.value, 0);

  const kpis = [
    { label: "consultas guardadas", value: sesiones, note: "historiales recuperables" },
    { label: "copias al portapapeles", value: copias, note: "respuestas enviadas a creadores" },
    { label: "objeciones cubiertas", value: objeciones, note: "categorías en la base" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-4">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
            telemetría del equipo
          </p>
          <h1 className="mt-1 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
            Qué objeciones frenan más registros
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Cada consulta y cada copia quedan registradas en PostgreSQL. Úsalo para detectar el miedo
            dominante de la semana y reforzarlo en el guion del equipo.
          </p>
        </div>
        <Link
          href="/"
          className="sheen relative overflow-hidden rounded-2xl bg-ink px-5 py-3 text-xs font-extrabold uppercase tracking-[0.1em] text-paper transition-all duration-200 hover:bg-ink-3 active:scale-[0.98]"
        >
          ← Volver a la consola
        </Link>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-ink-3 bg-ink p-5 text-paper shadow-pop">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">
                respuestas generadas
              </p>
              <p className="mt-1 font-display text-6xl font-extrabold leading-none text-paper">
                {respuestas}
              </p>
            </div>
            <p className="rounded-full border border-ink-3 bg-ink-2 px-3 py-1.5 text-[11px] font-bold text-aqua">
              {copiasSemana} en los últimos 7 días
            </p>
          </div>
          <div className="mt-6 flex h-32 items-end gap-2">
            {series.map((point) => (
              <div key={point.key} className="group flex flex-1 flex-col items-center gap-2">
                <span className="font-mono text-[10px] text-paper/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {point.value}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand/70 to-aqua transition-all duration-500 group-hover:from-brand group-hover:to-solar"
                  style={{ height: `${Math.max(4, (point.value / maxDay) * 100)}%` }}
                />
                <span className="text-[10.5px] font-bold text-paper/45 uppercase">
                  {dayLabel(point.key)}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          {kpis.map((kpi, index) => (
            <section
              key={kpi.label}
              className={`flex items-center justify-between gap-4 rounded-3xl border p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 ${
                index === 0
                  ? "border-brand/40 bg-brand/8"
                  : index === 1
                    ? "border-aqua/40 bg-aqua/8"
                    : "border-solar/45 bg-solar/10"
              }`}
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {kpi.label}
                </p>
                <p className="mt-1 font-display text-3xl font-extrabold leading-none text-ink">
                  {kpi.value}
                </p>
                <p className="mt-1 text-[11.5px] text-muted">{kpi.note}</p>
              </div>
              <span className="text-2xl">{index === 0 ? "🗂️" : index === 1 ? "📋" : "🎯"}</span>
            </section>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <section className="rounded-3xl border border-line bg-card p-5 shadow-card">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
            Objeciones más frecuentes
          </h2>
          <p className="mt-1 text-[12.5px] text-muted">
            Ranking por respuestas generadas con cada categoría de la base de conocimiento.
          </p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {topRows.map((row) => (
              <li key={row.slug} className="group">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-2 text-[13px] font-bold text-ink">
                    <span>{row.emoji}</span>
                    <span className="truncate">{row.objectionLabel}</span>
                  </span>
                  <span className="font-mono text-[11px] text-muted">{row.usageCount}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand to-solar transition-all duration-700 group-hover:from-aqua group-hover:to-brand"
                    style={{ width: `${Math.max(3, (row.usageCount / maxUsage) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-4">
          <section className="rounded-3xl border border-line bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              Qué copia el equipo
            </h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Texto para pegar vs. guion para audio de WhatsApp.
            </p>
            {kindRows.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-line bg-paper px-4 py-6 text-center text-[13px] text-muted">
                Todavía no hay copias registradas. Genera una respuesta y cópiala.
              </p>
            ) : (
              <ul className="mt-4 flex flex-col gap-2.5">
                {kindRows.map((row) => (
                  <li key={row.kind}>
                    <div className="flex items-center justify-between gap-3 text-[12.5px] font-bold text-ink">
                      <span>{KIND_LABEL[row.kind] ?? row.kind}</span>
                      <span className="font-mono text-[11px] text-muted">{Number(row.n)}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper">
                      <div
                        className="h-full rounded-full bg-aqua transition-all duration-700"
                        style={{ width: `${Math.max(4, (Number(row.n) / maxKind) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl border border-line bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              ✂️ Respuestas guardadas
            </h2>
            <p className="mt-2 font-display text-4xl font-extrabold leading-none text-brand">
              {guardadas}
            </p>
            <p className="mt-2 text-[12.5px] text-muted">
              Mensajes personalizados del equipo listos para reutilizar.
            </p>
            <Link
              href="/biblioteca"
              className="mt-3 inline-flex text-[12px] font-bold text-aqua transition-colors duration-200 hover:text-ink"
            >
              Abrir biblioteca →
            </Link>
          </section>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-line bg-card shadow-card">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-paper px-5 py-3">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
            Consultas recientes del equipo
          </h2>
          <span className="font-mono text-[11px] text-muted">{recentSessions.length} últimas</span>
        </div>
        {recentSessions.length === 0 ? (
          <p className="px-5 py-8 text-center text-[13px] text-muted">
            Sin consultas todavía. La consola del asistente crea un historial por cada conversación.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-line-soft text-[10.5px] uppercase tracking-[0.12em] text-muted">
                  <th className="px-5 py-2.5 font-extrabold">Consulta</th>
                  <th className="px-5 py-2.5 font-extrabold">Reclutador/a</th>
                  <th className="px-5 py-2.5 font-extrabold">Mensajes</th>
                  <th className="px-5 py-2.5 font-extrabold">Actividad</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="border-b border-line-soft/70 transition-colors duration-200 last:border-0 hover:bg-paper"
                  >
                    <td className="max-w-[420px] px-5 py-3 font-semibold text-ink">
                      <span className="line-clamp-1">{session.title}</span>
                    </td>
                    <td className="px-5 py-3 text-muted">{session.recruiterName}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-muted">
                      {session.messageCount}
                    </td>
                    <td className="px-5 py-3 font-mono text-[12px] text-muted">
                      {session.lastActivityAt.toLocaleString("es", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
