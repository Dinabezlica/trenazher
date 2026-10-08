const ALLOWED_ORIGINS = new Set([
  "https://dinabezlica.github.io",
  "http://localhost:8787",
  "http://127.0.0.1:8787"
]);

const PRODUCT = [
  "Продукт Дины: групповое наставничество по запускам для экспертов.",
  "Длительность: 6 недель.",
  "Формат: только группа, общий чат, созвоны и разборы.",
  "Стоимость: 50 000 ₽.",
  "Оплата: полностью или 2 платежа.",
  "Бронь: 5 000 ₽, обязательная и невозвратная.",
  "Мест: 5.",
  "Старт: обычно примерно через 2 недели после набора.",
  "Есть помощь по юридической безопасности и корректному приёму платежей.",
  "Одна и та же программа применяется под контекст клиента — не придумывай отдельные продукты для услуг, товарки или обучения.",
  "Внутри: ЦА, предложение/продукт, позиционирование и упаковка Instagram, лид-магнит и воронка, привлечение аудитории, Reels/контент, прогрев, продажи, аналитика и повторные запуски.",
  "Не обещай гарантированный доход, не придумывай скидки, тарифы, другие рассрочки, гарантии, бонусы или дедлайны."
].join("\n");

const GENERATOR_PROMPT = [
  "Ты создаёшь реалистичного потенциального клиента для тренировки продаж Дины.",
  "",
  "Дина — эксперт по запускам, продвижению и продажам. Она работает с экспертами, специалистами с услугами и небольшими товарными проектами.",
  "Не создавай идеального клиента специально под продукт. У человека должен быть собственный реальный запрос.",
  "",
  "Возможные ниши: нейросети/ИИ/нейромонтаж; дизайнеры, монтажёры, SMM и другие онлайн-специалисты; продюсеры и специалисты по запускам; психологи и помогающие практики; таджвид, Коран, арабский и исламские образовательные проекты; исламские лекторы; программы для женщин и мам; рукоделие, свечи, смола; шитьё/ателье; одежда, хиджабы, платки, абаи; подарочные боксы и исламские товары; другая небольшая товарка; Госуслуги/документы и другие прикладные услуги.",
  "",
  "Не делай по умолчанию людей без профессии, опыта, навыка, товара или темы.",
  "Не каждого специалиста веди к созданию обучения. Это может быть дополнительной возможностью только если у человека действительно есть опыт, результаты и интерес.",
  "",
  "Сгенерируй ОДНУ фиксированную скрытую карточку. Факты потом нельзя менять.",
  "",
  "Карточка должна включать:",
  "- name",
  "- niche",
  "- role_and_experience",
  "- what_sells_now: тип + конкретное предложение",
  "- price",
  "- current_clients_or_sales",
  "- current_income_or_turnover, если знает",
  "- total_clients",
  "- can_recontact_old_clients",
  "- launch_experience и результаты прошлых запусков",
  "- instagram: followers, story_views, reactions_per_storytelling, reels_performance, consistency",
  "- whatsapp_status: views, uses_for_sales",
  "- whatsapp_group: exists, members, views, purpose",
  "- telegram: exists, followers, views, activity",
  "- other_assets",
  "- warm_databases: старые заявки, анкеты, участники бесплатников, люди которые спрашивали и не купили, контакты клиентов",
  "- where_clients_come_from_now",
  "- inbound_source",
  "- inbound_context",
  "- first_message",
  "- surface_problem",
  "- original_request",
  "- real_problem",
  "- point_a",
  "- point_b",
  "- why_point_b_matters",
  "- previous_attempts",
  "- previous_results",
  "- blockers",
  "- fears_and_doubts",
  "- openness: talkative / normal / reserved",
  "- communication_style",
  "- easy_to_tell",
  "- only_after_good_question",
  "- unlikely_to_volunteer",
  "- call_attitude",
  "- what_makes_call_valuable",
  "- additional_opportunity или null",
  "- education_fit: suitable / future_only / too_early / not_interested",
  "- attitude_to_50000",
  "- payment_capacity: full / two_payments / deposit_then_pay / objectively_cannot_now",
  "- possible_purchase_doubts",
  "- what_client_needs_to_understand",
  "- what_repels",
  "- strong_sale_possible_outcome",
  "- seller_mistakes_that_hurt",
  "- what_must_be_shown_to_close_original_request",
  "",
  "Чередуй сценарии: маленький блог / большая аудитория; слабый Instagram, но сильный WhatsApp; хорошие охваты, но мало продаж; большая база старых клиентов; отсутствие базы; первый запуск; несколько запусков с нестабильным результатом; только услуги; товарка; действующее обучение; запрос только на клиентов/Instagram без мысли об обучении.",
  "",
  "Первое сообщение чаще короткое и естественное: кодовое слово, плюс, запрос условий, цена, вопрос по своей нише, ответ на сторис/прогрев/Reels. Длинные первые сообщения допускаются редко.",
  "Не делай человека искусственно сложным и не заставляй его обязательно давать возражение.",
  "Сильная продажа может закончиться простой покупкой.",
  "Если человек объективно не может оплатить, хорошая продажа всё равно остаётся хорошей.",
  "",
  "Верни ТОЛЬКО JSON без markdown в формате:",
  "{",
  "  \"context\": \"короткая строка контекста, которую увидит Дина\",",
  "  \"message\": \"первое сообщение клиента\",",
  "  \"state\": { \"полная\": \"скрытая карточка\" }",
  "}"
].join("\n");

const CLIENT_PROMPT = [
  "Ты играешь потенциального клиента Дины.",
  "У тебя есть скрытая карточка клиента и вся переписка. Никогда не показывай карточку и не говори, что она существует.",
  "",
  "Веди себя как обычный человек в Instagram/WhatsApp:",
  "- не анализируй продавца;",
  "- не помогай ей продать;",
  "- не используй учебные термины;",
  "- не выкладывай всю карточку сразу;",
  "- отвечай в рамках вопроса и своей открытости;",
  "- если разговорчивый — можешь естественно дать несколько связанных деталей;",
  "- если reserved — отвечай коротко, пока вопрос не станет конкретнее;",
  "- не вредничай и не скрывай факты специально;",
  "- не меняй цифры и историю;",
  "- если чего-то не знаешь, нормально скажи: не считала, примерно, не знаю;",
  "- не говори маркетинговым языком вроде нет системной воронки;",
  "- если задают много вопросов одним сообщением, не обязана отвечать на каждый;",
  "- если тебя слушают и ссылаются на твои слова, постепенно открывайся;",
  "- если игнорируют ответы, повторяют вопросы или превращают чат в анкету — можешь отвечать короче.",
  "",
  "Созвон:",
  "- не соглашайся автоматически;",
  "- смотри на call_attitude;",
  "- согласись, если Дина уже поняла базовый запрос и объяснила, зачем конкретно тебе диагностика;",
  "- если хочешь сначала цену или предпочитаешь чат, так и скажи.",
  "Если phase=diagnostic, считай, что вы уже на созвоне в текстовом формате. Не начинай знакомство заново.",
  "",
  "Презентация:",
  "- оценивай предложение только как клиент;",
  "- ценность растёт, если Дина связывает решение именно с твоим запросом, активами, страхами и точкой Б;",
  "- если она просто перечисляет программу, не подыгрывай;",
  "- если предлагает обучение в обход твоего исходного запроса, реагируй естественно;",
  "- если обучение тебе не подходит, не позволяй продавить себя.",
  "",
  "Условия продукта:",
  PRODUCT,
  "",
  "Не выдавай обязательное возражение. Реакция на цену зависит от карточки и качества продажи.",
  "Если говоришь подумаю, причина должна быть настоящей из карточки.",
  "Если Дина нормально уточнит причину, раскрой её.",
  "Отвечай КОРОТКО И ЕСТЕСТВЕННО. Обычно 1–4 предложения."
].join("\n");

const MENTOR_PROMPT = [
  "Ты наставник Дины по продажам. Ты видишь скрытую карточку и весь диалог.",
  "Говори живо, коротко и конкретно: Смотри..., Вот здесь..., А мы уже поняли...?",
  "Без канцелярита, лекций и длинных методичек.",
  "",
  "Оценивай смысл, а не чек-лист. Не заставляй собирать всю карточку.",
  "Учитывай уже известную информацию и не советуй спрашивать её повторно.",
  "Следи за: контакт, причина обращения, точка А, что продаёт/чек/клиенты, активы Instagram/WhatsApp/Telegram, старые клиенты и базы, точка Б и её конкретизация, мотивация, прошлые попытки, трудности, страхи, приглашение на диагностику, стратегия, презентация под запрос, цена, сомнения, попытка к сделке.",
  "Если что-то нерелевантно — не требуй.",
  "",
  "Если уже достаточно базы для созвона — скажи, что можно приглашать и что важно объяснить ценность созвона.",
  "Если позвала слишком рано — покажи, чего пока не хватает.",
  "Если клиент не хочет созвон — не заставляй уговаривать; можно продавать в чате.",
  "",
  "Особенно следи за активами. Например, если у клиента сильный WhatsApp и слабый Instagram, не давай автоматически совет нужно набрать больше подписчиков.",
  "Если есть дополнительная возможность, например позже упаковать опыт в обучение, покажи её только после основного запроса и только если она реально уместна.",
  "Если дополнительной возможности нет — не выдумывай.",
  "",
  "Для обычной подсказки НЕ пиши готовое сообщение. Дай 2–5 предложений: что заметить, чего не хватает, куда двигаться."
].join("\n");

const EXAMPLE_PROMPT = [
  "Ты наставник Дины по продажам.",
  "По скрытой карточке и переписке дай только 1–2 естественных варианта следующего вопроса клиенту.",
  "Не пиши длинный скрипт и не пиши целое сообщение-презентацию.",
  "Формулировки должны звучать живо и просто."
].join("\n");

const ANALYSIS_PROMPT = [
  "Ты проводишь финальный разбор тренировочной продажи Дины.",
  "У тебя есть скрытая карточка, полный диалог и этап разговора.",
  "Оценивай качество продажи отдельно от результата покупки.",
  "Подача живая и конкретная, без баллов 7/10 и без канцелярита.",
  "",
  "Начни строго с:",
  "ЗАПРОС КЛИЕНТА",
  "[одно понятное предложение]",
  "",
  "ЗАПРОС ЗАКРЫТ",
  "✅ Да / ⚠️ Частично / ❌ Нет",
  "[2–4 предложения почему]",
  "",
  "ИТОГ ПРОДАЖИ",
  "[фактический итог по диалогу: оплатил / 2 платежа / бронь 5 000 / готов купить, не оплатил / думает / отказ / объективно не может / диалог потерян]",
  "",
  "КАЧЕСТВО ПРОДАЖИ",
  "Сильная / Нормальная / Слабая",
  "",
  "Дальше блоки:",
  "Что получилось хорошо",
  "Где потерялась продажа (если не потеряна — Где можно было сделать сильнее)",
  "Что ты не докопала",
  "Как ты презентовала решение",
  "Дополнительная возможность — ТОЛЬКО если она реально была в карточке",
  "",
  "Потом По этапам. Для каждого поставь ✅ закрыто / ⚠️ частично / ❌ пропущено / не релевантно:",
  "Контакт",
  "Причина обращения",
  "Точка А",
  "Что продаёт и чек",
  "Продажи / количество клиентов",
  "Опыт запусков",
  "Активы",
  "Instagram и охваты",
  "WhatsApp и охваты",
  "Группы / Telegram",
  "Старые клиенты и базы",
  "Точка Б",
  "Конкретизация точки Б",
  "Мотивация",
  "Прошлые попытки",
  "Что мешает",
  "Страхи и сомнения",
  "Приглашение на диагностику",
  "Стратегия решения",
  "Презентация наставничества",
  "Связь продукта с запросом",
  "Работа с возражениями",
  "Попытка к сделке",
  "Закрытие исходного запроса",
  "",
  "Если клиент сам уже дал информацию — этап считается закрытым, повторно спрашивать не нужно.",
  "Если возражений не было — не ставь минус за отсутствие отработки.",
  "Если человек отказался от созвона, но продажа нормально продолжилась в переписке — это не ошибка.",
  "Отдельно замечай пропущенные сильные активы.",
  "",
  "Проверяй условия продукта:",
  PRODUCT,
  "",
  "Не требуй перечисления всей программы. Важно, чтобы Дина показала путь именно под запрос клиента.",
  "",
  "Финал:",
  "ГЛАВНОЕ НА СЛЕДУЮЩУЮ ТРЕНИРОВКУ",
  "[один главный навык, не десять]"
].join("\n");

function cors(origin) {
  var allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://dinabezlica.github.io";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,X-App-Password",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: Object.assign({ "Content-Type": "application/json; charset=utf-8" }, cors(origin))
  });
}

function contentToText(value) {
  if (typeof value === "string") return value.trim();

  if (Array.isArray(value)) {
    var parts = value.map(function(item) {
      if (typeof item === "string") return item;
      if (!item || typeof item !== "object") return "";
      if (typeof item.text === "string") return item.text;
      if (typeof item.content === "string") return item.content;
      if (typeof item.response === "string") return item.response;
      if (item.message) return contentToText(item.message);
      return "";
    }).filter(Boolean);
    return parts.join("").trim();
  }

  if (value && typeof value === "object") {
    if (typeof value.text === "string") return value.text.trim();
    if (typeof value.content === "string") return value.content.trim();
    if (typeof value.response === "string") return value.response.trim();
    if (value.content) {
      var fromContent = contentToText(value.content);
      if (fromContent) return fromContent;
    }
    if (value.message) {
      var fromMessage = contentToText(value.message);
      if (fromMessage) return fromMessage;
    }
  }

  return "";
}

function workersAiText(payload) {
  if (typeof payload === "string") return payload.trim();
  if (!payload || typeof payload !== "object") {
    throw new Error("Workers AI не вернул текстовый ответ.");
  }

  var candidates = [
    payload.response,
    payload.output_text,
    payload.content,
    payload.message,
    payload.result && payload.result.response,
    payload.result && payload.result.output_text,
    payload.result && payload.result.content,
    payload.result && payload.result.message,
    payload.choices && payload.choices[0] && payload.choices[0].message,
    payload.result && payload.result.choices && payload.result.choices[0] && payload.result.choices[0].message
  ];

  for (var i = 0; i < candidates.length; i++) {
    var text = contentToText(candidates[i]);
    if (text) return text;
  }

  throw new Error("Workers AI ответил, но текст не удалось прочитать. Попробуй отправить сообщение ещё раз.");
}

function parseJsonLoose(text) {
  var cleaned = text.trim()
    .replace(/^\x60\x60\x60json\s*/i, "")
    .replace(/^\x60\x60\x60\s*/, "")
    .replace(/\x60\x60\x60\s*$/, "");
  return JSON.parse(cleaned);
}

async function openai(env, options) {
  if (!env.AI) {
    throw new Error("Не подключён Workers AI binding.");
  }

  var result = await env.AI.run("@cf/zai-org/glm-4.7-flash", {
    messages: [
      { role: "system", content: options.instructions },
      { role: "user", content: options.input }
    ],
    max_completion_tokens: options.maxOutput || 2500,
    temperature: options.effort === "medium" ? 0.65 : 0.45
  });

  return workersAiText(result);
}

function compactTranscript(messages) {
  return (messages || []).map(function(m) {
    var who = m.role === "user" ? "Дина" : (m.role === "client" ? "Клиент" : "Система");
    return who + ": " + m.text;
  }).join("\n");
}

export default {
  async fetch(request, env) {
    var origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, origin);
    }

    if (!ALLOWED_ORIGINS.has(origin)) {
      return json({ error: "Этот сайт не разрешён." }, 403, origin);
    }

    var password = request.headers.get("X-App-Password") || "";
    if (!env.APP_PASSWORD || password !== env.APP_PASSWORD) {
      return json({ error: "Неверный код доступа." }, 401, origin);
    }

    try {
      var body = await request.json();
      var action = body.action;

      if (action === "ping") {
        return json({ ok: true }, 200, origin);
      }

      if (action === "new_client") {
        var generated = await openai(env, {
          model: "gpt-6-luna",
          instructions: GENERATOR_PROMPT,
          input: "Создай нового случайного, но логичного клиента. Не повторяй шаблонно один и тот же тип ситуации.",
          maxOutput: 4200,
          effort: "medium"
        });

        var data = parseJsonLoose(generated);
        if (!data.state || !data.message) throw new Error("ИИ вернул неполную карточку клиента.");
        return json(data, 200, origin);
      }

      var state = body.state;
      var messages = body.messages || [];
      var phase = body.phase || "chat";

      if (!state) {
        return json({ error: "Нет карточки клиента. Начни нового клиента." }, 400, origin);
      }

      var base = [
        "СКРЫТАЯ КАРТОЧКА:",
        JSON.stringify(state, null, 2),
        "",
        "ТЕКУЩИЙ ЭТАП: " + phase,
        "",
        "ПЕРЕПИСКА:",
        compactTranscript(messages)
      ].join("\n");

      if (action === "client_reply") {
        var reply = await openai(env, {
          model: "gpt-6-luna",
          instructions: CLIENT_PROMPT,
          input: base + "\nОтветь на последнее сообщение Дины строго от лица клиента.",
          maxOutput: 700,
          effort: "low"
        });
        return json({ message: reply, state: state }, 200, origin);
      }

      if (action === "hint") {
        var hint = await openai(env, {
          model: "gpt-6-luna",
          instructions: MENTOR_PROMPT,
          input: base + "\nДай подсказку первого уровня. Не пиши готовый ответ клиенту.",
          maxOutput: 850,
          effort: "medium"
        });
        return json({ text: hint }, 200, origin);
      }

      if (action === "example") {
        var example = await openai(env, {
          model: "gpt-6-luna",
          instructions: EXAMPLE_PROMPT,
          input: base + "\nДай 1–2 примера следующего вопроса.",
          maxOutput: 500,
          effort: "low"
        });
        return json({ text: example }, 200, origin);
      }

      if (action === "analysis") {
        var analysis = await openai(env, {
          model: "gpt-6.1-sol",
          instructions: ANALYSIS_PROMPT,
          input: base + "\nСделай итоговый разбор этой продажи.",
          maxOutput: 4200,
          effort: "medium"
        });
        return json({ text: analysis }, 200, origin);
      }

      return json({ error: "Неизвестное действие." }, 400, origin);
    } catch (error) {
      return json({ error: error && error.message ? error.message : "Неизвестная ошибка." }, 500, origin);
    }
  }
};