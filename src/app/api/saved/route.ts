import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { savedResponses } from "@/db/schema";
import { ensureSeeded } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const rows = await db.select().from(savedResponses).orderBy(desc(savedResponses.createdAt));
  return Response.json({ count: rows.length, items: rows });
}

export async function POST(request: Request) {
  await ensureSeeded();

  let body: { title?: string; textMessage?: string; audioScript?: string; tip?: string; categorySlug?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const textMessage = (body.textMessage ?? "").trim();

  if (!title || !textMessage) {
    return Response.json(
      { error: "El título y el mensaje de texto son obligatorios." },
      { status: 400 },
    );
  }

  const [created] = await db
    .insert(savedResponses)
    .values({
      title: title.slice(0, 120),
      textMessage,
      audioScript: (body.audioScript ?? "").trim(),
      tip: (body.tip ?? "").trim(),
      categorySlug: (body.categorySlug ?? "manual").slice(0, 64),
    })
    .returning();

  return Response.json({ ok: true, item: created });
}

export async function DELETE(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!Number.isFinite(id) || id <= 0) {
    return Response.json({ error: "id inválido" }, { status: 400 });
  }

  await db.delete(savedResponses).where(eq(savedResponses.id, id));
  return Response.json({ ok: true, id });
}
