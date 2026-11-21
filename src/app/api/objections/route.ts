import { and, desc, like, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { objectionCategories } from "@/db/schema";
import { ensureSeeded } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();
  const lower = q.toLowerCase();

  const rows = q
    ? await db
        .select()
        .from(objectionCategories)
        .where(
          or(
            like(sql`lower(${objectionCategories.title})`, `%${lower}%`),
            like(sql`lower(${objectionCategories.objectionLabel})`, `%${lower}%`),
            like(sql`lower(${objectionCategories.exampleInput})`, `%${lower}%`),
            and(sql`array_to_string(${objectionCategories.keywords}, ' ') ILIKE ${`%${q}%`}`),
          ),
        )
        .orderBy(desc(objectionCategories.priority))
    : await db
        .select()
        .from(objectionCategories)
        .orderBy(desc(objectionCategories.priority));

  return Response.json({ count: rows.length, query: q, categories: rows });
}
