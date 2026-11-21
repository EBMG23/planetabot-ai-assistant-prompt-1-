import { db } from "@/db";
import { copyEvents } from "@/db/schema";
import { ensureSeeded } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

const KINDS = new Set(["text", "audio", "tip", "link", "full"]);

export async function POST(request: Request) {
  await ensureSeeded();

  let body: { categorySlug?: string; kind?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  const kind = body.kind ?? "text";
  if (!KINDS.has(kind)) {
    return Response.json({ error: "kind inválido" }, { status: 400 });
  }

  await db.insert(copyEvents).values({
    categorySlug: (body.categorySlug ?? "manual").slice(0, 64),
    kind,
  });

  return Response.json({ ok: true, kind });
}
