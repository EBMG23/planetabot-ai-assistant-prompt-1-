import { desc } from "drizzle-orm";

import { LibraryClient } from "@/components/library-client";
import { db } from "@/db";
import { objectionCategories, savedResponses } from "@/db/schema";
import { ensureSeeded, getSettings } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Biblioteca de objeciones · PlanetaBot",
};

export default async function BibliotecaPage() {
  await ensureSeeded();
  const [categories, saved, settings] = await Promise.all([
    db.select().from(objectionCategories).orderBy(desc(objectionCategories.priority)),
    db.select().from(savedResponses).orderBy(desc(savedResponses.createdAt)).limit(40),
    getSettings(),
  ]);

  return (
    <LibraryClient
      categories={categories}
      saved={saved.map((item) => ({
        id: item.id,
        title: item.title,
        categorySlug: item.categorySlug,
        textMessage: item.textMessage,
        audioScript: item.audioScript,
        tip: item.tip,
        createdAt: item.createdAt.toISOString(),
      }))}
      officialUrl={settings.official_url ?? ""}
    />
  );
}
