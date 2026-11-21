import { OFFICIAL_URL_DEFAULT } from "@/lib/knowledge";

export type CategoryRow = {
  slug: string;
  title: string;
  emoji: string;
  objectionLabel: string;
  keywords: string[];
  priority: number;
  isFallback: boolean;
  textMessage: string;
  audioScript: string;
  tip: string;
};

export type Alternative = {
  slug: string;
  title: string;
  emoji: string;
  objectionLabel: string;
  score: number;
};

export type Confidence = "alta" | "media" | "baja";

export type BotReply = {
  categorySlug: string;
  categoryTitle: string;
  emoji: string;
  objectionLabel: string;
  textMessage: string;
  audioScript: string;
  tip: string;
  officialUrl: string;
  matchedKeywords: string[];
  confidence: Confidence;
  alternatives: Alternative[];
  fullFormat: string;
};

/** Normaliza texto: minúsculas, sin tildes, sin puntuación repetida. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreCategory(message: string, category: CategoryRow) {
  let score = 0;
  const hits: string[] = [];
  const seen = new Set<string>();
  for (const raw of category.keywords) {
    const keyword = normalize(raw);
    // Se deduplica por forma normalizada: "años"/"anos" no deben puntuar doble.
    if (!keyword || seen.has(keyword)) continue;
    seen.add(keyword);
    if (message.includes(keyword)) {
      const weight = keyword.includes(" ") ? 3 : Math.min(2, 1 + keyword.length / 9);
      score += weight;
      hits.push(raw);
    }
  }
  return { score, hits };
}

/**
 * Clasifica la objeción del creador contra la base de conocimiento.
 * Devuelve la mejor categoría, las alternativas y las keywords detectadas.
 */
export function classify(input: string, categories: CategoryRow[]) {
  const message = normalize(input);
  const fallback = categories.find((c) => c.isFallback);
  const ranked = categories
    .filter((c) => !c.isFallback)
    .map((c) => ({ category: c, ...scoreCategory(message, c) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || b.category.priority - a.category.priority);

  if (ranked.length === 0) {
    return {
      best: fallback ?? categories[0],
      hits: [] as string[],
      score: 0,
      second: 0,
      alternatives: [] as Alternative[],
    };
  }

  const best = ranked[0];
  const second = ranked[1]?.score ?? 0;
  const alternatives: Alternative[] = ranked.slice(1, 4).map((r) => ({
    slug: r.category.slug,
    title: r.category.title,
    emoji: r.category.emoji,
    objectionLabel: r.category.objectionLabel,
    score: r.score,
  }));

  return { best: best.category, hits: best.hits, score: best.score, second, alternatives };
}

const LEVELS: Confidence[] = ["baja", "media", "alta"];

function confidenceFor(score: number, second: number, isFallback: boolean): Confidence {
  if (isFallback) return "baja";
  let level: Confidence = score >= 5 ? "alta" : score >= 2.4 ? "media" : "baja";
  // Ganador claro frente al segundo candidato: sube un nivel de confianza.
  if (level !== "alta" && score >= 1.6 && (second === 0 || score >= second * 1.8)) {
    level = LEVELS[Math.min(LEVELS.length - 1, LEVELS.indexOf(level) + 1)];
  }
  return level;
}

function withUrl(copy: string, url: string) {
  return copy.replace(/\{\{URL\}\}/g, url).trim();
}

/** Construye la salida fija exigida por el system prompt de PlanetaBot. */
export function buildFullFormat(reply: Omit<BotReply, "fullFormat">) {
  return [
    `💡 OBJECIÓN DETECTADA: ${reply.objectionLabel}`,
    "",
    "📱 OPCIÓN 1: MENSAJE DE TEXTO (Copiar y pegar)",
    reply.textMessage,
    "",
    "🎙️ OPCIÓN 2: GUION PARA AUDIO DE WHATSAPP",
    reply.audioScript,
    "",
    `📌 CONSEJO RÁPIDO PARA EL RECLUTADOR: ${reply.tip}`,
  ].join("\n");
}

export function composeReply(
  input: string,
  categories: CategoryRow[],
  officialUrlSetting?: string | null,
  forcedSlug?: string | null,
): BotReply {
  const officialUrl = (officialUrlSetting || OFFICIAL_URL_DEFAULT).trim();
  const forced = forcedSlug ? categories.find((c) => c.slug === forcedSlug) : undefined;
  const result = classify(input, categories);
  const category = forced ?? result.best;
  const hits = forced ? forcedSlugMatch(input, forced) : result.hits;

  const base = {
    categorySlug: category.slug,
    categoryTitle: category.title,
    emoji: category.emoji,
    objectionLabel: category.objectionLabel,
    textMessage: withUrl(category.textMessage, officialUrl),
    audioScript: category.audioScript.trim(),
    tip: category.tip.trim(),
    officialUrl,
    matchedKeywords: hits,
    confidence: confidenceFor(result.score, result.second, category.isFallback),
    alternatives: forced ? [] : result.alternatives,
  };

  return { ...base, fullFormat: buildFullFormat(base) };
}

function forcedSlugMatch(input: string, category: CategoryRow) {
  return scoreCategory(normalize(input), category).hits;
}

export type { CategoryRow as EngineCategory };
