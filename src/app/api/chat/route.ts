import { desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { chatMessages, chatSessions, objectionCategories } from "@/db/schema";
import { composeReply, type CategoryRow } from "@/lib/engine";
import { ensureSeeded, getSettings } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

async function loadCategories(): Promise<CategoryRow[]> {
  const rows = await db
    .select()
    .from(objectionCategories)
    .orderBy(desc(objectionCategories.priority));

  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    emoji: row.emoji,
    objectionLabel: row.objectionLabel,
    keywords: row.keywords ?? [],
    priority: row.priority,
    isFallback: row.isFallback,
    textMessage: row.textMessage,
    audioScript: row.audioScript,
    tip: row.tip,
  }));
}

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return Response.json({ error: "sessionId es obligatorio" }, { status: 400 });
  }

  const messages = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.id);

  return Response.json({ sessionId, messages });
}

export async function POST(request: Request) {
  await ensureSeeded();

  let body: {
    message?: string;
    sessionId?: string;
    recruiterName?: string;
    categorySlug?: string;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (message.length < 3) {
    return Response.json(
      { error: "Escribe la objeción del creador (mínimo 3 caracteres)." },
      { status: 400 },
    );
  }
  if (message.length > 2000) {
    return Response.json({ error: "Mensaje demasiado largo (máx. 2000 caracteres)." }, {
      status: 400,
    });
  }

  const settings = await getSettings();
  const categories = await loadCategories();
  const reply = composeReply(message, categories, settings.official_url, body.categorySlug ?? null);

  const recruiterName = (body.recruiterName ?? "").trim() || settings.recruiter_name || "Reclutador/a";

  let sessionId = (body.sessionId ?? "").trim();
  let session;

  if (sessionId) {
    const existing = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.id, sessionId))
      .limit(1);
    session = existing[0];
  }

  if (!session) {
    sessionId = crypto.randomUUID();
    const title = message.length > 56 ? `${message.slice(0, 56)}…` : message;
    const [created] = await db
      .insert(chatSessions)
      .values({ id: sessionId, recruiterName, title, messageCount: 0 })
      .returning();
    session = created;
  }

  await db.insert(chatMessages).values({
    sessionId,
    role: "recruiter",
    content: message,
    categorySlug: reply.categorySlug,
  });

  await db.insert(chatMessages).values({
    sessionId,
    role: "bot",
    content: reply.fullFormat,
    categorySlug: reply.categorySlug,
    payload: reply as unknown as Record<string, unknown>,
  });

  await db
    .update(chatSessions)
    .set({ messageCount: session.messageCount + 2, lastActivityAt: new Date() })
    .where(eq(chatSessions.id, sessionId));

  await db
    .update(objectionCategories)
    .set({ usageCount: sql`${objectionCategories.usageCount} + 1` })
    .where(eq(objectionCategories.slug, reply.categorySlug));

  return Response.json({
    sessionId,
    recruiterName,
    reply,
  });
}
