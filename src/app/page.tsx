import { desc, eq, sql } from "drizzle-orm";

import { ChatWorkspace } from "@/components/chat-workspace";
import { db } from "@/db";
import { chatMessages, chatSessions, objectionCategories } from "@/db/schema";
import { ensureSeeded, getSettings } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ auto?: string }>;
}) {
  await ensureSeeded();
  const params = await searchParams;

  const [categories, sessions, settings, countRows] = await Promise.all([
    db.select().from(objectionCategories).orderBy(desc(objectionCategories.priority)),
    db
      .select({
        id: chatSessions.id,
        title: chatSessions.title,
        messageCount: chatSessions.messageCount,
        lastActivityAt: chatSessions.lastActivityAt,
      })
      .from(chatSessions)
      .orderBy(desc(chatSessions.lastActivityAt))
      .limit(10),
    getSettings(),
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(chatMessages)
      .where(eq(chatMessages.role, "bot")),
  ]);

  const autoCategory = params.auto
    ? categories.find((c) => c.slug === params.auto)
    : undefined;

  return (
    <ChatWorkspace
      categories={categories}
      sessions={sessions.map((s) => ({
        id: s.id,
        title: s.title,
        messageCount: s.messageCount,
        lastActivityAt: s.lastActivityAt.toISOString(),
      }))}
      officialUrl={settings.official_url ?? ""}
      recruiterName={settings.recruiter_name ?? "Reclutador/a"}
      totalRespuestas={Number(countRows[0]?.n ?? 0)}
      autoRun={
        autoCategory
          ? { slug: autoCategory.slug, text: autoCategory.exampleInput }
          : null
      }
    />
  );
}
