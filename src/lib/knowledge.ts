/**
 * Base de conocimiento absoluta de PlanetaBot (Agencia Planeta).
 *
 * Reglas que cumple TODO el copy de este archivo:
 *  - 0% cobros al creador (la agencia cobra de la plataforma).
 *  - Libertad total: sin horarios, sin jefes, sin exclusividad draconiana.
 *  - La cuenta y las claves son y siguen siendo del creador.
 *  - Nunca se prometen cifras de dinero garantizadas.
 *  - Toda respuesta incluye la llamada a la acción hacia la web oficial ({{URL}}).
 */

export type SeedCategory = {
  slug: string;
  title: string;
  emoji: string;
  objectionLabel: string;
  keywords: string[];
  priority: number;
  isFallback?: boolean;
  exampleInput: string;
  textMessage: string;
  audioScript: string;
  tip: string;
};

export const OFFICIAL_URL_DEFAULT = "https://planeta-tiktok-agency-website.vercel.app";

export const SEED_CATEGORIES: SeedCategory[] = [
  {
    slug: "robo-cuenta",
    title: "Miedo a que le roben la cuenta",
    emoji: "🔐",
    objectionLabel: "Miedo a robo / Cobros ocultos",
    priority: 10,
    keywords: [
      "robar", "robo", "roben", "roban", "cuenta", "clave", "contraseña", "password",
      "hackear", "hackeo", "acceso", "accesos privados", "cobren", "cobrar", "cobro",
      "despues me cobran", "me cobren algo", "seguridad", "privada", "datos bancarios",
      "tarjeta", "quiten mi cuenta", "se queden con mi cuenta",
    ],
    exampleInput:
      "El creador me dijo: 'Es que me da miedo que me roben mi cuenta o que me cobren algo después'",
    textMessage: `¡Te entiendo perfectamente! 😅 Es súper normal cuidar tu cuenta y dudar, sobre todo con todo lo que se lee en internet.

Quiero que estés 100% tranquilo/a: en **Agencia Planeta** NUNCA te pedimos claves, contraseñas ni accesos privados. Tu cuenta es tuya y siempre lo será. Y unirte es 100% GRATIS: no te descontamos ni un solo diamante, regalo o batalla. A nosotros nos paga directamente la plataforma por acompañarte y ayudarte a crecer. 🙌

Te dejo por aquí nuestra página web oficial para que veas los beneficios, conozcas a otros creadores de la agencia y completes tu registro de forma segura:
👉 {{URL}}

Míralo con calma y me avisas si te queda alguna duda para ayudarte con tu registro, ¿vale? ✨`,
    audioScript: `¡Hola! Oye, te entiendo muchísimo… la verdad haces muy bien en ser precavido con tu cuenta. Mira, para tu tranquilidad total: en Agencia Planeta jamás pedimos claves ni nos quedamos con un porcentaje de tus ingresos. Todo tu dinero es tuyo y nuestro acompañamiento es totalmente gratis, porque a nosotros nos paga la plataforma. Te voy a dejar aquí abajito el link de nuestra página web oficial para que veas todo transparente, conozcas los beneficios y te registres cuando quieras. Échale un ojo al enlace que te dejo debajo del audio y me cuentas qué tal, ¿va?`,
    tip: "Envía el audio y pega el enlace inmediatamente debajo: el creador que ve la web oficial baja su defensa en menos de 1 minuto.",
  },
  {
    slug: "comision-diamantes",
    title: "¿Cuánto me van a quitar de mis diamantes?",
    emoji: "💎",
    objectionLabel: "Comisión sobre mis diamantes",
    priority: 9,
    keywords: [
      "comision", "comisión", "porcentaje", "cuanto se quedan", "diamantes", "regalos",
      "quitarme", "descuento", "descuentan", "repartir", "reparto", "ganancias", "sueldo",
      "pagan", "cobran", "gratis", "costo", "precio", "pagar", "mensualidad", "cuota",
      "se quedan con", "te quitan", "me quitan", "cuanto me quitan", "quitan",
      "se queda con", "descuenta", "cobran algo",
    ],
    exampleInput: "Me pregunta: '¿Y cuánto porcentaje se quedan de mis diamantes?'",
    textMessage: `Buena pregunta y me encanta que la hagas directo 😄 Porque es justo ahí donde mucha gente se lleva sorpresas… y contigo no va a pasar.

**Agencia Planeta se queda con el 0%.** Cero. No te descontamos nada de tus regalos, diamantes ni batallas: el 100% de lo que generas es tuyo. Nosotros recibimos bonos de rendimiento institucional directamente de la plataforma por asesorar talento, así que nuestro ingreso depende de que TÚ crezcas, no de quitarte una parte. 🤝

Todo eso está explicado con detalle (junto a los beneficios: soporte 24/7, academia y retos con bonos) en nuestra web oficial:
👉 {{URL}}

¿Quieres que te ayude a completar el registro ahora mismo y te cuento cómo se activan los bonos de retos? 🚀`,
    audioScript: `¡Hey! Me encanta que preguntes eso, de verdad. Te lo digo clarito: Agencia Planeta se queda con el cero por ciento. Nada de tus diamantes, nada de tus regalos, nada de tus batallas… todo es tuyo. Nosotros ganamos bonos que nos paga la propia plataforma por acompañarte, o sea que nos conviene que tú crezcas. Te dejo aquí abajo el enlace de la página web oficial, ahí está todo explicado y puedes registrarte seguro. Míralo y me dices si quieres que lo hagamos juntos, ¿te va?`,
    tip: "Di siempre la cifra exacta (0%) antes que el argumento: el número desarma la objeción y la web lo confirma por ti.",
  },
  {
    slug: "estafa-legitimidad",
    title: "¿Esto es una estafa? / ¿Son reales?",
    emoji: "🕵️",
    objectionLabel: "Desconfianza / ¿Es estafa?",
    priority: 8,
    keywords: [
      "estafa", "estafar", "fraude", "ilegal", "legal", "confiable", "confianza", "serio",
      "real", "verdad", "verificar", "verificable", "quienes son", "quiénes", "empresa",
      "agencia oficial", "timo", "engañar", "engaño", "sospechoso", "raro", "no confío",
      "desconfío", "desconfianza", "miedo", "temor", "falsa", "falsas", "agencias falsas",
      "piramide", "multinivel", "no confio", "confiar", "es real", "estafadores",
      "estafan", "estafador", "es legitimo", "es legítimo",
    ],
    exampleInput: "'¿Y cómo sé que no es una estafa? He visto muchas agencias falsas'",
    textMessage: `Totalmente válido 🙏 Hoy en día aparecen "agencias" por todos lados y lo inteligente es dudar antes de dar cualquier paso. Yo haría lo mismo.

Por eso nosotros no te pedimos que nos creas: te pedimos que nos **verifiques**. Agencia Planeta es una agencia oficial de crecimiento y monetización, con creadores activos, testimonios reales y pruebas sociales publicadas. No manejamos tu dinero, no pedimos claves y no hay pagos de ningún tipo para entrar. Si algo no te cuadra, te vas libre y sin penalizaciones. ✅

En la web oficial puedes revisar todo eso y registrar tu usuario de TikTok con seguridad:
👉 {{URL}}

¿Qué parte te genera más duda: los pagos, el contrato o el manejo de la cuenta? Así te mando la info exacta de esa parte 🔍`,
    audioScript: `¡Hola! Mira, te entiendo completamente… hay muchísimas agencias falsas y haces muy bien en verificar. Nosotros no te pedimos que nos creas, te pedimos que nos revises: en la página web oficial están los testimonios, los creadores activos y todas las pruebas. Jamás tocamos tu dinero ni pedimos claves, y si un día te quieres ir, te vas libre. Te dejo el enlace aquí debajo del audio para que lo revises tú mismo y, si te late, te registras. ¿Le damos una miradita juntos?`,
    tip: "Nunca discutas la desconfianza: inviértela. Pídele que verifique en la web; la validación propia convierte más que cualquier argumento.",
  },
  {
    slug: "exclusividad-contrato",
    title: "Contratos, exclusividad y penalizaciones",
    emoji: "📄",
    objectionLabel: "Miedo al contrato / Exclusividad",
    priority: 8,
    keywords: [
      "contrato", "exclusividad", "exclusivo", "firmar", "firma", "clausula", "cláusula",
      "penalización", "penalizacion", "multa", "atado", "salirme", "irme", "renunciar",
      "cancelar", "compromiso", "obligación", "obligacion", "letra pequeña", "letra chica",
      "me puedo salir", "si me salgo", "letra chiquita", "atarme", "salir de la agencia",
      "me quiero salir", "quiero salirme", "multa por salir", "penalización por salir",
      "penalizacion por salir", "si me retiro",
    ],
    exampleInput: "'¿Y si firmo y después quiero salirme? ¿Me cobran penalización?'",
    textMessage: `Esa es la pregunta más inteligente que puedes hacer antes de unirte a cualquier agencia 👏 Te respondo sin rodeos.

En **Agencia Planeta** no hay contratos draconianos ni letra pequeña: tu cuenta sigue siendo 100% tuya, no hay exclusividad que te ate y si un día decides irte, te retiras libre y **sin penalizaciones**. Nuestro compromiso es de resultados, no de candados. 🔓

Lo que sí te pedimos es constancia (con 10–15 horas al mes ya se ven movimientos reales), pero el ritmo lo marcas tú, sin jefes ni horarios impuestos. Todo el proceso de vinculación está explicado paso a paso en la web oficial:
👉 {{URL}}

¿Te gustaría que revisemos juntos cómo queda tu cuenta vinculada y qué beneficios se activan el primer mes? 🌱`,
    audioScript: `¡Hola! Oye, qué buena pregunta… me encanta que preguntes por el contrato antes de decidir. Te lo resumo: no hay exclusividad que te ate, no hay penalizaciones y tu cuenta es tuya siempre. Si mañana quieres salirte, te sales libre, sin dramas. Lo único que te pedimos es constancia, unas diez o quince horitas al mes, y tú decides tu ritmo. Te dejo el enlace de la web oficial aquí abajo para que veas el proceso completo y te registres tranquilo. ¿Lo revisamos juntos?`,
    tip: "Usa la palabra 'libre' y evita 'contrato': cambia el marco mental de compromiso a acompañamiento antes de mandar el enlace.",
  },
  {
    slug: "horarios-tiempo",
    title: "No tengo tiempo / estudio o trabajo",
    emoji: "⏰",
    objectionLabel: "Falta de tiempo disponible",
    priority: 7,
    keywords: [
      "tiempo", "horario", "horarios", "ocupado", "ocupada", "trabajo", "estudio",
      "universidad", "colegio", "escuela", "no puedo", "complicado", "jefe", "jefes",
      "disponibilidad", "horas", "agenda", "estresado", "cansado", "vida ocupada",
      "no me alcanza el tiempo", "cero tiempo", "no tengo tiempo", "trabaja", "trabajando",
      "estudia", "estudiando", "no tiene tiempo", "sin tiempo", "poco tiempo",
    ],
    exampleInput: "'Es que trabajo y estudio, no tengo tiempo para hacer lives'",
    textMessage: `¡Te entiendo! Con trabajo, estudios y vida… el tiempo parece que no alcanza para nada 😮‍💨 Y justo por eso esta opción puede encajar contigo.

Aquí **no hay horarios obligatorios ni jefes**: tú decides qué días y a qué hora transmites. Con 10–15 horas al mes repartidas a tu manera (por ejemplo, 3 lives cortos por semana) ya se construye algo serio, y la academia de la agencia te enseña a que cada minuto en live rinda más: retención, guiones, iluminación y lectura del algoritmo. ⏳✨

En la web oficial puedes registrar tu usuario y ver el plan de arranque para creadores con poco tiempo:
👉 {{URL}}

¿Qué franja te queda más libre: noches entre semana o fines de semana? Con eso te armo una sugerencia realista 🗓️`,
    audioScript: `¡Hola! Te entiendo muchísimo, cuando uno trabaja y estudia el tiempo vuela. Lo bueno de Agencia Planeta es que no hay horarios ni jefes: tú eliges cuándo transmitir. Con diez o quince horas al mes, repartidas como te quede cómodo, ya se pueden ver resultados, y en la academia te enseñamos a aprovechar cada minuto de live. Te dejo aquí abajito el enlace de la página web oficial para que te registres y veas el plan de arranque. ¿Qué horario te queda más libre, noches o finde?`,
    tip: "Pregunta por su franja libre y propón un mini plan (3 lives cortos): la objeción de tiempo se vence con un calendario concreto, no con motivación.",
  },
  {
    slug: "ganancias-reales",
    title: "¿Cuánto dinero voy a ganar realmente?",
    emoji: "📈",
    objectionLabel: "Expectativa de ganancias",
    priority: 7,
    keywords: [
      "cuanto gano", "cuánto gano", "ganar", "dinero", "plata", "ingresos", "sueldo",
      "mensual", "semanal", "rentable", "vale la pena", "cifras", "mil", "dólares",
      "dolares", "promedio", "cuanto pagan", "garantizado", "cuanto se puede ganar",
      "se puede ganar", "ganar al mes", "realistas", "realista", "cuanto dinero",
      "cuanto voy a ganar", "ganare", "ganaré", "es rentable", "vivir de esto",
      "cuanto se gana", "cuanto puedo ganar", "ganaria", "ganaría", "ganaras", "ganarás",
      "se gana", "generar ingresos",
    ],
    exampleInput: "'¿Y cuánto se puede ganar al mes siendo realistas?'",
    textMessage: `Me alegra que lo preguntes así, sin humo 🙌 Y te voy a responder con la misma honestidad con la que trabajamos.

Nadie serio puede prometerte una cifra fija: tus ingresos dependen de tus horas en live, tu constancia y cómo conectes con tu audiencia. Lo que sí podemos garantizar es el **método**: academia de creadores (retención, guiones, iluminación, algoritmo), soporte 24/7, acceso a batallas oficiales y retos internos con bonos y tráfico. Y lo más importante: el 100% de lo que generes se queda contigo, porque nosotros cobramos de la plataforma, no de ti. 💎

Casos reales y el detalle de los beneficios están en la web oficial:
👉 {{URL}}

¿Quieres que te cuente cómo se activan los bonos por retos en tu primer mes? Ahí es donde muchos empiezan a ver movimiento 🔥`,
    audioScript: `¡Hola! Mira, te voy a hablar clarísimo porque así trabajamos nosotros. Nadie serio te puede prometer una cifra fija al mes… eso depende de tus horas, tu constancia y de cómo conectes con tu gente. Lo que sí te aseguro es el método: academia, soporte veinticuatro siete, retos con bonos y tráfico, y que todo lo que generes es tuyo, el cien por ciento. Te dejo aquí abajo el enlace de la web oficial para que veas casos reales y te registres. ¿Te cuento cómo funcionan los bonos?`,
    tip: "Nunca des cifras cerradas: cambia 'cuánto voy a ganar' por 'qué hago para ganar más' y muestra el método + la web.",
  },
  {
    slug: "pocos-seguidores",
    title: "Tengo pocos seguidores / acabo de empezar",
    emoji: "🌱",
    objectionLabel: "Pocos seguidores / Iniciar",
    priority: 6,
    keywords: [
      "seguidores", "followers", "pocos", "pocos seguidores", "mil seguidores", "empezar",
      "inicio", "nuevo", "nueva", "pequeño", "pequeña", "creciendo", "audiencia chica",
      "no tengo publico", "público", "requisitos", "requisito", "aplicar", "postular",
      "seguidor", "cuento con pocos", "me aceptan", "aceptan", "voy empezando", "recien empiezo",
      "recién empiezo", "desde cero", "cuantos seguidores", "800", "1000 seguidores",
    ],
    exampleInput: "'Solo tengo 800 seguidores, ¿igual me aceptan?'",
    textMessage: `¡Justo a tiempo entonces! 🌱 La mayoría de creadores que hoy viven de sus lives empezaron exactamente donde estás tú.

No necesitas ser grande para empezar: necesitas dirección. En **Agencia Planeta** te acompañamos desde el día uno con la academia de creadores (cómo retener audiencia, qué decir en los primeros 10 segundos, iluminación básica y cómo leer el algoritmo), y sumamos retos internos con bonos y tráfico para empujar tu crecimiento. Y como no te cobramos nada, el riesgo de intentarlo es cero. ✨

Los requisitos de ingreso y el formulario de registro están en la web oficial:
👉 {{URL}}

¿Qué tipo de contenido haces hoy en tus lives? Así te digo qué formato te puede crecer más rápido 🎥`,
    audioScript: `¡Hola! Oye, tener pocos seguidores no es un problema, es literalmente el punto de partida de casi todos. Lo que necesitas no es ser grande, es dirección: nosotros te enseñamos a retener audiencia, a arrancar bien tus lives y a entender el algoritmo, y hay retos con bonos y tráfico que te empujan. Todo gratis, sin cobrarte nada. Te dejo aquí abajo el enlace de la página web oficial para que revises los requisitos y te registres. ¿Qué contenido haces tú en tus lives?`,
    tip: "Convierte la debilidad en timing: 'estás justo a tiempo'. Luego pregunta por su nicho para que la conversación siga viva hasta el registro.",
  },
  {
    slug: "shadowban-baneo",
    title: "Shadowban, baneos y problemas técnicos",
    emoji: "🚨",
    objectionLabel: "Shadowban / Cuenta baneada",
    priority: 6,
    keywords: [
      "shadowban", "baneo", "banear", "baneado", "baneada", "suspendido", "desbaneo",
      "restringido", "restricción", "alcance", "vistas bajas", "no me llega", "directo",
      "live cerrado", "reporte", "denuncia", "problema tecnico", "cobro fallido",
      "retiro fallido", "me banearon", "baneo injusto", "perdi alcance", "perdí alcance",
      "shadow ban", "bajaron mis vistas", "me cerraron el live",
    ],
    exampleInput: "'Me banearon el live injustamente y no sé qué hacer'",
    textMessage: `Uf, qué rabia cuando eso pasa 😤 Y más cuando sabes que no hiciste nada malo. Tranquilo/a, esto tiene camino y no lo recorres solo/a.

Uno de los beneficios más valorados de **Agencia Planeta** es el **soporte 24/7**: te acompañamos con apelaciones por desbaneos injustos, diagnóstico de shadowban (qué hacer en los próximos 7 días para recuperar alcance) y gestión de problemas de cobro o retiros. Tener una agencia oficial detrás cambia por completo la forma en que la plataforma mira tu caso. 🛠️

Puedes registrar tu cuenta en la web oficial y abrir tu caso con soporte desde hoy mismo:
👉 {{URL}}

¿Cuándo te pasó y qué mensaje exacto te mostró la app? Con eso te digo por dónde empezamos 🔎`,
    audioScript: `¡Hola! Uy, te entiendo perfecto… que te baneen injustamente es de lo más frustrante. Pero mira, para eso existe el soporte veinticuatro siete de la agencia: te acompañamos con la apelación del desbaneo, revisamos si es shadowban y te damos el plan para recuperar alcance, y también con los líos de cobro. Tener una agencia oficial detrás cambia cómo te mira la plataforma. Te dejo aquí abajo el enlace de la web oficial para que registres tu cuenta y abramos tu caso. ¿Cuándo te pasó exactamente?`,
    tip: "Un creador con un problema técnico caliente es el que más rápido se registra: resuelve primero el dolor y manda el enlace en el mismo mensaje.",
  },
  {
    slug: "cobro-retiro",
    title: "¿Cómo cobro y retiro mi dinero?",
    emoji: "🏦",
    objectionLabel: "Dudas sobre cobros / Retiros",
    priority: 6,
    keywords: [
      "cobrar", "retirar", "retiro", "cobro", "transferencia", "banco", "paypal",
      "cuenta bancaria", "canjear", "cambiar diamantes", "monetizar", "pagos", "pago",
      "comision tiktok", "método", "metodo de pago", "recibir dinero", "sacar mi dinero",
      "como cobro", "cómo cobro", "retirar dinero", "canjear diamantes", "dinero retenido",
      "me pagan",
    ],
    exampleInput: "'¿Cómo hago para sacar mi dinero? ¿Pasa por la agencia?'",
    textMessage: `Excelente duda, porque el dinero es lo que debe quedar más claro de todo 💰 Y la respuesta corta es: nunca pasa por nuestras manos.

Tus diamantes se quedan en tu propia cuenta de TikTok y tú los canjeas y retiras con tus propios métodos de pago (los que configuras en la app). **Agencia Planeta no intermedia, no retiene ni descuenta nada:** el 100% de lo generado es tuyo. Nosotros solo te asesoramos para que generes más y te ayudamos si un retiro se traba, con soporte 24/7. 🙌

En la web oficial tienes la guía completa de monetización y el registro para activar tu acompañamiento:
👉 {{URL}}

¿Ya tienes configurado tu método de retiro en TikTok? Si quieres, lo revisamos paso a paso 🔍`,
    audioScript: `¡Hola! Qué buena pregunta y te la aclaro rapidito. Tu dinero nunca pasa por nosotros: los diamantes se quedan en tu cuenta de TikTok y tú los retiras con tus propios métodos de pago, el cien por ciento para ti. Nosotros no retenemos ni descontamos nada, solo te ayudamos a generar más y, si un retiro se traba, el soporte te acompaña. Te dejo aquí debajo el enlace de la web oficial con la guía de monetización y el registro. ¿Ya tienes tu método de retiro configurado?`,
    tip: "Aclara el flujo del dinero en una sola frase ('nunca pasa por nuestras manos') y luego ofrece revisar su método de retiro: genera una segunda conversación.",
  },
  {
    slug: "menor-edad",
    title: "Es menor de edad",
    emoji: "🔞",
    objectionLabel: "Menor de edad / Tutor legal",
    priority: 5,
    keywords: [
      "menor", "edad", "años", "anos", "catorce", "quince", "dieciséis", "diecisiete",
      "17", "16", "15", "papás", "papas", "padres", "tutor", "adulto", "mayor de edad",
      "cumplir", "identificación", "identidad", "soy menor", "menor de edad", "tengo 15",
      "tengo 16", "tengo 17", "cumplir 18", "tutor legal", "con 16",
    ],
    exampleInput: "'Tengo 16 años, ¿puedo entrar a la agencia?'",
    textMessage: `¡Gracias por ser honesto/a con eso! 🙌 Es importante y lo vamos a hacer todo bien y con transparencia.

Para la vinculación y los retiros se requiere ser mayor de edad, así que el camino correcto es hacerlo **con tu papá, mamá o tutor legal**: ellos hacen el registro a su nombre y tú creas el contenido con su acompañamiento. Muchísimos creadores empezaron así y hoy monetizan sin problema. Y sí, sigue siendo 100% gratis para ti y para tu familia. 👨‍👩‍👧✨

En la web oficial está el formulario de registro y los requisitos, para que lo revisen juntos:
👉 {{URL}}

¿Te parece si te mando la info para que la veas con tu tutor y me cuentas qué te dijo? 📩`,
    audioScript: `¡Hola! Primero, gracias por decirme tu edad con honestidad, eso habla muy bien de ti. Mira, para el registro y los retiros hay que ser mayor de edad, así que lo hacemos de la forma correcta: tu papá, tu mamá o tu tutor legal hace el registro a su nombre y tú creas el contenido con su acompañamiento. Muchísimos creadores empezaron así. Todo sigue siendo gratis. Te dejo aquí abajo el enlace de la web oficial para que lo revisen juntos y me cuentas qué te dicen, ¿vale?`,
    tip: "Nunca prometas atajos a un menor: involucra al tutor y gana también a la familia, que suele ser quien frena el registro.",
  },
  {
    slug: "ya-tiene-agencia",
    title: "Ya está en otra agencia",
    emoji: "🔁",
    objectionLabel: "Ya tiene otra agencia",
    priority: 5,
    keywords: [
      "otra agencia", "ya estoy", "ya tengo agencia", "agencia actual", "cambiarme",
      "cambio de agencia", "representante", "manager", "ya firmé", "ya firme", "competencia",
      "me escribieron", "otra persona",
    ],
    exampleInput: "'Ya estoy con otra agencia desde hace dos meses'",
    textMessage: `¡Qué bueno que ya diste ese paso! 🙌 Eso significa que ya entendiste que crecer acompañado va más rápido que crecer solo.

No te pido que dejes nada hoy. Te propongo **comparar**: en Agencia Planeta el cobro al creador es 0% (nunca tocamos tus diamantes), no hay exclusividad ni penalizaciones por salir, tienes soporte 24/7 para desbaneos y shadowban, academia de creadores y retos internos con bonos y tráfico. Si tu agencia actual te da todo eso, quédate tranquilo/a; si no, aquí tienes una puerta abierta y sin costo. ⚖️

Puedes ver los beneficios y el proceso de cambio en la web oficial:
👉 {{URL}}

¿Qué es lo que menos te está funcionando de tu agencia actual? Con eso te digo si nosotros lo resolvemos 🎯`,
    audioScript: `¡Hola! Oye, qué bueno que ya estés en una agencia, de verdad, eso dice mucho de ti. No te pido que cambies nada hoy, solo que compares: con nosotros el cobro al creador es cero por ciento, no hay exclusividad ni penalización por salir, tienes soporte veinticuatro siete, academia y retos con bonos y tráfico. Si tu agencia actual te da todo eso, perfecto. Si no, aquí tienes la puerta abierta y gratis. Te dejo el enlace de la web oficial aquí abajo para que compares tranquilo. ¿Qué es lo que menos te funciona hoy?`,
    tip: "Con creadores ya representados, no ataques su agencia: pide que compare. La comparación la hace la web oficial por ti.",
  },
  {
    slug: "no-muestra-cara",
    title: "No quiere mostrar su cara o exponerse",
    emoji: "🎭",
    objectionLabel: "Exposición / Mostrar la cara",
    priority: 4,
    keywords: [
      "cara", "mostrar", "exponer", "exposición", "exposicion", "timido", "tímido",
      "tímida", "verguenza", "camara", "cámara", "anonimo", "anónimo", "privacidad",
      "no quiero salir", "rostro", "familia me ve", "conocidos", "sin mostrar la cara",
      "no quiero salir en camara", "pena salir",
    ],
    exampleInput: "'Me da pena salir en cámara, ¿puedo hacer lives sin mostrar la cara?'",
    textMessage: `Te entiendo y es mucho más común de lo que crees 🎭 La pena a la cámara se trabaja, y mientras tanto no te frena.

Hay formatos que funcionan muy bien sin exposición total: lives de manos (arte, comida, manualidades), gaming, ASMR, charlas con voz y fondo cuidado, o contenidos donde la cámara apunta a lo que haces y no a tu cara. En la **academia de creadores** te ayudamos a elegir tu formato, armar guiones y trabajar iluminación y retención para que el live sostenga la atención aunque no estés en pantalla. 🎧✨

Todo eso lo puedes arrancar registrándote en la web oficial:
👉 {{URL}}

¿Qué te gusta hacer cuando nadie te ve? Ahí suele estar el formato perfecto para ti 💡`,
    audioScript: `¡Hola! Te entiendo totalmente, la pena a la cámara es súper común y no te tiene que frenar. Hay formatos que funcionan sin mostrar la cara: lives de manos, gaming, ASMR, charlas con voz… y en la academia te ayudamos a elegir el tuyo, a armar guiones y a manejar la retención. Además nadie te obliga a exponerte más de lo que tú quieras. Te dejo aquí abajo el enlace de la web oficial para que te registres y empecemos. ¿Qué te gusta hacer cuando nadie te está viendo?`,
    tip: "Pregunta por su hobby privado: de ahí sale un formato sin exposición y el creador siente que lo escuchaste, no que le vendiste.",
  },
  {
    slug: "familia-pareja",
    title: "Su familia o pareja no lo apoya",
    emoji: "👨‍👩‍👧",
    objectionLabel: "Familia / Pareja duda",
    priority: 4,
    keywords: [
      "familia", "mamá", "mama", "papá", "papa", "pareja", "novio", "novia", "esposo",
      "esposa", "apoyo", "apoyar", "no les gusta", "critican", "creen", "piensan",
      "prohibido", "regaño", "discusión", "discusion", "apoya", "no me apoya", "cree que",
      "piensa que", "perder el tiempo", "no quieren que", "me prohíbe", "no le gusta",
      "no me deja",
    ],
    exampleInput: "'Mi mamá cree que esto es perder el tiempo y mi novio no quiere'",
    textMessage: `Qué situación más incómoda… y a la vez muy común 💛 Cuando las personas que quieres dudan, uno mismo empieza a dudar.

Te comparto algo para llevar calma a casa: esto no requiere inversión de dinero (unirse es 100% gratis, la agencia cobra de la plataforma, no de ti), no te pide claves ni horarios, y no interfiere con tus estudios o trabajo si tú no quieres. Es decir: no hay nada que perder y sí una habilidad real que estás construyendo —hablar en público, retener audiencias, crear contenido—. 🌱

La web oficial es la mejor forma de que tu familia vea que es algo serio y transparente, con testimonios de otros creadores:
👉 {{URL}}

¿Te sirvo si te preparo un resumen corto para mostrárselo a tu mamá o a tu pareja? 📄`,
    audioScript: `¡Hola! Te entiendo mucho, cuando la familia duda uno también empieza a dudar. Mira, diles esto con calma: no hay que poner dinero, es totalmente gratis, no piden claves ni horarios y no afecta tus estudios ni tu trabajo. Lo que ganas es una habilidad real, crear contenido y hablar en público. Y para que vean que es algo serio, te dejo aquí abajo el enlace de la web oficial con testimonios y todo transparente. ¿Quieres que te arme un resumen cortico para mostrárselo a ellos?`,
    tip: "Convierte al opositor familiar en audiencia: ofrécele un resumen o el enlace para que lo revise él mismo y baje la resistencia.",
  },
  {
    slug: "datos-privacidad",
    title: "¿Qué hacen con mis datos personales?",
    emoji: "🧾",
    objectionLabel: "Uso de datos personales",
    priority: 4,
    keywords: [
      "datos", "información personal", "informacion", "documento", "cedula", "cédula",
      "identificacion", "identificación", "dni", "selfie", "registro", "formulario",
      "que piden", "qué piden", "correo", "telefono", "teléfono", "whatsapp", "registrarme",
      "registrar", "registrarse", "que datos piden", "verificacion", "verificación",
      "pedir documentos", "que informacion piden",
    ],
    exampleInput: "'¿Qué datos piden para registrarme? ¿Piden mi documento?'",
    textMessage: `Muy bien que preguntes esto antes de registrarte 👏 La privacidad no se negocia.

Para entrar a **Agencia Planeta** solo necesitas lo básico: tu usuario de TikTok, un nombre y un medio de contacto (WhatsApp o correo) para poder asesorarte. **Nunca** pedimos contraseñas, claves privadas, códigos de verificación ni accesos bancarios. Y la vinculación con la agencia se hace desde tu propia app, por el flujo oficial de TikTok, no entregándonos tu cuenta. 🔒

El registro y los requisitos están en la web oficial:
👉 {{URL}}

¿Quieres que te acompañe mientras llenas el registro para que veas que son solo esos campos? 📝`,
    audioScript: `¡Hola! Qué bueno que preguntes eso antes de registrarte. Mira, solo necesitamos lo básico: tu usuario de TikTok, tu nombre y un contacto, WhatsApp o correo, para asesorarte. Nunca pedimos contraseñas, códigos ni datos bancarios, y la vinculación se hace desde tu propia aplicación por el flujo oficial. Todo eso está explicado en la página web oficial, te dejo el enlace aquí debajo del audio. ¿Quieres que te acompañe mientras llenas el registro?`,
    tip: "Ofrece acompañarlo 'en vivo' mientras llena el formulario: reduce el abandono en el paso más crítico del registro.",
  },
  {
    slug: "lo-pienso-despues",
    title: "'Déjame lo pienso' / Lo deja para después",
    emoji: "⏳",
    objectionLabel: "Procrastinación / Lo pensaré",
    priority: 3,
    keywords: [
      "lo pienso", "pienso", "pensar", "pensarlo", "lo voy a pensar", "despues", "después",
      "luego", "otro día", "otro dia", "mas tarde", "más tarde", "no estoy seguro",
      "tiempo para pensarlo", "avisame", "avísame", "te aviso", "lo consulto", "con calma",
      "pensare", "pensaré", "lo pensare", "lo pensaré", "otro dia te digo",
    ],
    exampleInput: "'Déjame lo pienso y te aviso'",
    textMessage: `¡Claro que sí! Pensarlo es de personas inteligentes 🙂 Solo te pido una cosa: que lo pienses con información completa y no con suposiciones.

Para eso te dejo el resumen rápido: unirte es 100% gratis (0% de tus diamantes), tu cuenta y tus claves siguen siendo tuyas, no hay horarios ni jefes, y tienes soporte 24/7, academia de creadores y retos con bonos. O sea, el único costo real es el tiempo que decidas invertir… y puedes retirarte cuando quieras sin penalizaciones. ⚖️

Todo está en la web oficial para que lo revises a tu ritmo:
👉 {{URL}}

¿Te parece si lo miras hoy y mañana te escribo para resolver la duda que te quede, sin compromiso? 📅`,
    audioScript: `¡Hola! Claro que sí, piénsalo tranquilo, me parece perfecto. Solo te pido que lo pienses con la información completa y no con suposiciones: es gratis, no tocamos tus diamantes, tu cuenta sigue siendo tuya, no hay horarios ni jefes y puedes salirte cuando quieras. Te dejo aquí abajo el enlace de la web oficial para que lo revises a tu ritmo. ¿Te parece si mañana te escribo y resolvemos la duda que te quede, sin ningún compromiso?`,
    tip: "Agenda el seguimiento en el momento ('mañana te escribo'): un 'lo pienso' sin fecha de retorno se pierde para siempre.",
  },
  {
    slug: "duda-general",
    title: "Duda general / sin clasificar",
    emoji: "💬",
    objectionLabel: "Duda general del creador",
    priority: 1,
    isFallback: true,
    keywords: [],
    exampleInput: "Cualquier mensaje, duda u objeción que no encaje en las categorías anteriores.",
    textMessage: `¡Hola! 😄 Qué bueno que me escribas y que preguntes: las dudas se resuelven mejor antes que después.

Te dejo lo esencial de **Agencia Planeta** para que tengas el panorama claro: unirte es 100% GRATIS (no tocamos ni un diamante de tus regalos o batallas, cobramos directamente de la plataforma por asesorarte), tu cuenta y tus claves siguen siendo siempre tuyas, no hay horarios ni jefes, y sumas soporte 24/7, academia de creadores y retos con bonos y tráfico. 🌎✨

Puedes validar todo esto, ver testimonios reales y completar tu registro en la web oficial:
👉 {{URL}}

Cuéntame con tus palabras qué es lo que más te inquieta y te respondo puntual a eso, ¿te parece? 💬`,
    audioScript: `¡Hola! Qué bueno que me escribes… mira, te resumo lo esencial para que tengas todo claro: unirte a Agencia Planeta es totalmente gratis, no tocamos ni un diamante de lo que generas, tu cuenta y tus claves siguen siendo tuyas siempre, no hay horarios ni jefes, y tienes soporte veinticuatro siete, academia y retos con bonos. Te dejo aquí debajo del audio el enlace de nuestra página web oficial para que lo revises y te registres. Cuéntame qué es lo que más te inquieta y te respondo puntual, ¿va?`,
    tip: "Si no identificas la objeción, no improvises: manda el resumen esencial + la web y pregunta qué le inquieta para clasificarla en el siguiente mensaje.",
  },
];

export const SEED_PILLARS = [
  {
    order: 1,
    emoji: "🌎",
    title: "Página web oficial y transparencia",
    body: "La web oficial es el centro de verdad, registros, testimonios y pruebas sociales. Todo mensaje de texto que envíe el equipo debe incluir el enlace oficial de forma visible.",
  },
  {
    order: 2,
    emoji: "💎",
    title: "Ganancias y comisiones (0% cobros)",
    body: "Agencia Planeta NUNCA cobra dinero al creador ni descuenta porcentaje de diamantes, regalos o batallas. El 100% de lo generado es del creador. La agencia cobra directamente de la plataforma mediante bonos de rendimiento institucional. Unirse es 100% gratis.",
  },
  {
    order: 3,
    emoji: "🕊️",
    title: "Libertad total (sin horarios ni jefes)",
    body: "No hay contratos de exclusividad draconianos, horarios obligatorios ni jefes. El creador maneja su tiempo. Se recomienda constancia (10-15 horas al mes) para ver resultados reales, pero la decisión es 100% del creador.",
  },
  {
    order: 4,
    emoji: "🔐",
    title: "Seguridad y propiedad de la cuenta",
    body: "La cuenta es y seguirá siendo 100% del creador. NUNCA se solicitan contraseñas, claves privadas ni accesos bancarios. Si el creador decide irse, se retira libremente sin penalizaciones.",
  },
  {
    order: 5,
    emoji: "🚀",
    title: "Beneficios de Agencia Planeta",
    body: "Soporte 24/7 (desbaneos injustos, shadowban y problemas de cobro), Academia de Creadores (retención, iluminación, guiones y algoritmo) y Eventos y Retos (batallas oficiales, eventos globales y bonos económicos o de tráfico por cumplimiento).",
  },
];

export const SEED_SETTINGS: Array<{ key: string; value: string }> = [
  { key: "official_url", value: OFFICIAL_URL_DEFAULT },
  { key: "recruiter_name", value: "Reclutador/a Planeta" },
  { key: "bot_name", value: "PlanetaBot" },
];
