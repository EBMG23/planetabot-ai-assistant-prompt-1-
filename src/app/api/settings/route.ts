import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { ensureSeeded, getSettings } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getSettings();
  return Response.json({ settings });
}

export async function PUT(request: Request) {
  await ensureSeeded();

  let body: { official_url?: string; recruiter_name?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (typeof body.official_url === "string") {
    const url = body.official_url.trim().replace(/\.+$/, "");
    if (!/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(url)) {
      return Response.json(
        { error: "El enlace oficial debe ser una URL válida que empiece por http(s)://" },
        { status: 400 },
      );
    }
    await db
      .insert(appSettings)
      .values({ key: "official_url", value: url })
      .onConflictDoUpdate({ target: appSettings.key, set: { value: url, updatedAt: new Date() } });
  }

  if (typeof body.recruiter_name === "string") {
    const name = body.recruiter_name.trim().slice(0, 60) || "Reclutador/a Planeta";
    await db
      .insert(appSettings)
      .values({ key: "recruiter_name", value: name })
      .onConflictDoUpdate({ target: appSettings.key, set: { value: name, updatedAt: new Date() } });
  }

  const settings = await getSettings();
  return Response.json({ ok: true, settings });
}
