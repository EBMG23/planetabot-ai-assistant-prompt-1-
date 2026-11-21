import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { chatSessions } from "@/db/schema";
import { ensureSeeded } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(chatSessions)
    .orderBy(desc(chatSessions.lastActivityAt))
    .limit(14);
  return Response.json({ count: rows.length, sessions: rows });
}

export async function DELETE(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id es obligatorio" }, { status: 400 });

  await db.delete(chatSessions).where(eq(chatSessions.id, id));
  return Response.json({ ok: true, id });
}
