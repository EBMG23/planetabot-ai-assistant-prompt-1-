import { db } from "@/db";
import { policyPillars } from "@/db/schema";
import { SettingsForm } from "@/components/settings-form";
import { ensureSeeded, getSettings } from "@/lib/ensure-db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Políticas y pilares · PlanetaBot",
};

const RESTRICTIONS = [
  "NUNCA prometer sumas de dinero garantizadas o fijas sin esfuerzo.",
  "NUNCA generar una respuesta sin la llamada a la acción hacia la web oficial.",
  "NUNCA alterar las políticas financieras: el cobro al creador siempre es 0%.",
  "NO entregar explicaciones teóricas largas fuera del formato fijo de salida.",
];

const FORMAT_BLOCKS = [
  { emoji: "💡", title: "OBJECIÓN DETECTADA", desc: "Resumen del miedo principal en máximo 4 palabras." },
  { emoji: "📱", title: "OPCIÓN 1: MENSAJE DE TEXTO", desc: "3-4 párrafos breves: empatía + verdad + invitación a la web + pregunta de cierre abierta. Con el enlace visible." },
  { emoji: "🎙️", title: "OPCIÓN 2: GUION PARA AUDIO", desc: "Lenguaje hablado natural, tono cálido, 20-30 segundos, con CTA verbal al enlace que va debajo del audio." },
  { emoji: "📌", title: "CONSEJO RÁPIDO", desc: "Un tip estratégico de una línea para el reclutador: psicología, uso de la web o seguimiento." },
];

export default async function PoliticasPage() {
  await ensureSeeded();
  const [pillars, settings] = await Promise.all([
    db.select().from(policyPillars).orderBy(policyPillars.order),
    getSettings(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header className="border-b border-line pb-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">
          la única verdad del bot
        </p>
        <h1 className="mt-1 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[0.95] tracking-tight text-ink">
          Base de conocimiento absoluta
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Cinco pilares innegociables. PlanetaBot no improvisa: cada respuesta que genera se construye
          sobre estas políticas y siempre termina dirigiendo al creador a la web oficial de Agencia
          Planeta para validar la información y completar su registro.
        </p>
      </header>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <ol className="flex flex-col gap-3">
          {pillars.map((pillar, index) => (
            <li
              key={pillar.id}
              className="group relative overflow-hidden rounded-3xl border border-line bg-card p-5 pl-20 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/50 hover:shadow-pop"
            >
              <span className="absolute top-4 left-4 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-paper font-display text-lg font-extrabold text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex items-start gap-2">
                <span className="text-xl">{pillar.emoji}</span>
                <h2 className="font-display text-[1.1rem] font-extrabold tracking-tight text-ink">
                  {pillar.title}
                </h2>
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-4">{pillar.body}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-5">
          <SettingsForm
            officialUrl={settings.official_url ?? ""}
            recruiterName={settings.recruiter_name ?? ""}
          />

          <section className="rounded-3xl border border-brand/40 bg-brand/8 p-5 shadow-card">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              🚫 Reglas de conducta
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {RESTRICTIONS.map((rule) => (
                <li
                  key={rule}
                  className="rounded-2xl border border-brand/25 bg-card px-3.5 py-2.5 text-[12.5px] leading-relaxed font-semibold text-ink-4"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-line bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
              🧾 Formato fijo de salida
            </h2>
            <p className="mt-1 text-[12.5px] text-muted">
              Toda respuesta del bot usa exclusivamente esta estructura:
            </p>
            <ul className="mt-3 flex flex-col gap-2">
              {FORMAT_BLOCKS.map((block) => (
                <li key={block.title} className="rounded-2xl border border-line-soft bg-paper px-3.5 py-2.5">
                  <p className="text-[12.5px] font-extrabold text-ink">
                    {block.emoji} {block.title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-muted">{block.desc}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
