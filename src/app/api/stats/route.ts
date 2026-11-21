import { desc, eq, gte, sql } from "drizzle-orm";

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

const num = (rows: Array<{ n: number | string }>) => Number(rows[0]?.n ?? 0);

export async function GET() {
  await ensureSeeded();

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    respuestasRows,
    sesionesRows,
    copiasRows,
    guardadasRows,
    objecionesRows,
    copias7dRows,
  ] = await Promise.all([
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(chatMessages)
      .where(eq(chatMessages.role, "bot")),
    db.select({ n: sql<number>`count(*)::int` }).from(chatSessions),
    db.select({ n: sql<number>`count(*)::int` }).from(copyEvents),
    db.select({ n: sql<number>`count(*)::int` }).from(savedResponses),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(objectionCategories)
      .where(eq(objectionCategories.isFallback, false)),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(copyEvents)
      .where(gte(copyEvents.createdAt, since)),
  ]);

  const top = await db
    .select({
      slug: objectionCategories.slug,
      title: objectionCategories.title,
      emoji: objectionCategories.emoji,
      usageCount: objectionCategories.usageCount,
    })
    .from(objectionCategories)
    .orderBy(desc(objectionCategories.usageCount), desc(objectionCategories.priority))
    .limit(6);

  const copiasPorTipo = await db
    .select({ kind: copyEvents.kind, n: sql<number>`count(*)::int` })
    .from(copyEvents)
    .groupBy(copyEvents.kind)
    .orderBy(desc(sql<number>`count(*)::int`));

  const actividad = await db
    .select({
      day: sql<string>`to_char(${chatMessages.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`,
      n: sql<number>`count(*)::int`,
    })
    .from(chatMessages)
    .where(sql`${chatMessages.role} = 'bot' AND ${chatMessages.createdAt} >= ${since}`)
    .groupBy(sql`to_char(${chatMessages.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${chatMessages.createdAt} AT TIME ZONE 'UTC', 'YYYY-MM-DD')`);

  return Response.json({
    respuestas: num(respuestasRows),
    sesiones: num(sesionesRows),
    copias: num(copiasRows),
    copias7d: num(copias7dRows),
    guardadas: num(guardadasRows),
    objeciones: num(objecionesRows),
    top,
    copiasPorTipo,
    actividad,
  });
}
