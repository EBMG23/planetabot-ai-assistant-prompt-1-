import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Base de conocimiento de PlanetaBot.
 * Cada fila es una objeción/miedo típico de un creador con su respuesta lista.
 */
export const objectionCategories = pgTable(
  "objection_categories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    emoji: text("emoji").notNull().default("💬"),
    objectionLabel: text("objection_label").notNull(),
    keywords: text("keywords").array().notNull().default([]),
    priority: integer("priority").notNull().default(100),
    isFallback: boolean("is_fallback").notNull().default(false),
    exampleInput: text("example_input").notNull().default(""),
    textMessage: text("text_message").notNull(),
    audioScript: text("audio_script").notNull(),
    tip: text("tip").notNull(),
    usageCount: integer("usage_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("objection_categories_slug_idx").on(table.slug)],
);

/** Conversaciones del equipo de reclutadores con PlanetaBot. */
export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  recruiterName: text("recruiter_name").notNull().default("Reclutador/a"),
  title: text("title").notNull().default("Nueva consulta"),
  messageCount: integer("message_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastActivityAt: timestamp("last_activity_at", { withTimezone: true }).notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // "recruiter" | "bot"
  content: text("content").notNull(),
  categorySlug: text("category_slug"),
  payload: jsonb("payload"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Eventos de copiado: miden qué respuesta usa realmente el equipo. */
export const copyEvents = pgTable("copy_events", {
  id: serial("id").primaryKey(),
  categorySlug: text("category_slug").notNull().default("manual"),
  kind: text("kind").notNull().default("text"), // "text" | "audio" | "tip" | "link"
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Respuestas personalizadas guardadas por el equipo. */
export const savedResponses = pgTable("saved_responses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  categorySlug: text("category_slug").notNull().default("manual"),
  textMessage: text("text_message").notNull(),
  audioScript: text("audio_script").notNull().default(""),
  tip: text("tip").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Los 5 pilares innegociables + ajustes globales del bot. */
export const policyPillars = pgTable("policy_pillars", {
  id: serial("id").primaryKey(),
  order: integer("order").notNull().default(1),
  emoji: text("emoji").notNull().default("🌎"),
  title: text("title").notNull(),
  body: text("body").notNull(),
});

export const appSettings = pgTable(
  "app_settings",
  {
    key: text("key").primaryKey(),
    value: text("value").notNull().default(""),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("app_settings_key_idx").on(table.key)],
);

export type ObjectionCategory = typeof objectionCategories.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type SavedResponse = typeof savedResponses.$inferSelect;
export type PolicyPillar = typeof policyPillars.$inferSelect;
