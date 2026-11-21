import { db } from "@/db";
import { appSettings, objectionCategories, policyPillars } from "@/db/schema";
import { SEED_CATEGORIES, SEED_PILLARS, SEED_SETTINGS } from "@/lib/knowledge";

let seeded = false;

/**
 * Siembra idempotente: garantiza que la base de conocimiento, los pilares y los
 * ajustes existan antes de atender cualquier petición. El copy se sincroniza con
 * el código (onConflictDoUpdate) pero los ajustes editados por el equipo se respetan.
 */
export async function ensureSeeded() {
  if (seeded) return;
  try {
    for (const category of SEED_CATEGORIES) {
      await db
        .insert(objectionCategories)
        .values({
          slug: category.slug,
          title: category.title,
          emoji: category.emoji,
          objectionLabel: category.objectionLabel,
          keywords: category.keywords,
          priority: category.priority,
          isFallback: category.isFallback ?? false,
          exampleInput: category.exampleInput,
          textMessage: category.textMessage,
          audioScript: category.audioScript,
          tip: category.tip,
        })
        .onConflictDoUpdate({
          target: objectionCategories.slug,
          set: {
            title: category.title,
            emoji: category.emoji,
            objectionLabel: category.objectionLabel,
            keywords: category.keywords,
            priority: category.priority,
            isFallback: category.isFallback ?? false,
            exampleInput: category.exampleInput,
            textMessage: category.textMessage,
            audioScript: category.audioScript,
            tip: category.tip,
            updatedAt: new Date(),
          },
        });
    }

    const pillarCount = await db.select({ id: policyPillars.id }).from(policyPillars).limit(1);
    if (pillarCount.length === 0) {
      await db.insert(policyPillars).values(SEED_PILLARS);
    }

    for (const setting of SEED_SETTINGS) {
      await db
        .insert(appSettings)
        .values(setting)
        .onConflictDoNothing({ target: appSettings.key });
    }

    seeded = true;
  } catch (error) {
    console.error("[ensureSeeded] no se pudo sembrar la base de conocimiento", error);
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  await ensureSeeded();
  const rows = await db.select().from(appSettings);
  return rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}
