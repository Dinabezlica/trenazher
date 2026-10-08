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
  "- inbound_context: обязательно конкретная тема контента, на который человек отреагировал, если источник — Reels/Stories/пост/прогрев. Например: Почему люди спрашивают цену и пропадают; Почему просмотры не превращаются в заявки; Для запуска не нужен блог на 10 000 подписчиков.",
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
  "Поле context — это НЕ описание ниши клиента. Это то, что Дина реально видит перед сообщением: откуда человек пришёл и на какую конкретную тему контента он ответил.",
  "Если человек ответил на контент, context пиши в формате: Ответила на Reels: «конкретная тема/хук ролика» или Ответила на сторис: «конкретная тема сторис».",
  "Если пришёл по кодовому слову, укажи: Написала кодовое слово «... » после Reels/сторис: «конкретная тема».",
  "Если человек сам написал без привязки к контенту, честно укажи: Самостоятельно написала узнать условия. Не выдумывай пост.",
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

  var parsedCandidates = [
    payload.parsed,
    payload.result && payload.result.parsed,
    payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.parsed,
    payload.result && payload.result.choices && payload.result.choices[0] && payload.result.choices[0].message && payload.result.choices[0].message.parsed
  ];

  for (var p = 0; p < parsedCandidates.length; p++) {
    if (parsedCandidates[p] && typeof parsedCandidates[p] === "object") {
      return JSON.stringify(parsedCandidates[p]);
    }
  }

  if (payload.response && typeof payload.response === "object") {
    return JSON.stringify(payload.response);
  }
  if (payload.result && payload.result.response && typeof payload.result.response === "object") {
    return JSON.stringify(payload.result.response);
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

  if (payload.context && payload.message && payload.state) {
    return JSON.stringify(payload);
  }

  var keys = Object.keys(payload).slice(0, 8).join(", ");
  throw new Error("Workers AI ответил, но текст не удалось прочитать. Формат ответа: " + (keys || "неизвестный") + ".");
}

function parseJsonLoose(text) {
  var cleaned = String(text || "").trim()
    .replace(/^\x60\x60\x60json\s*/i, "")
    .replace(/^\x60\x60\x60\s*/, "")
    .replace(/\x60\x60\x60\s*$/, "");

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    var first = cleaned.indexOf("{");
    var last = cleaned.lastIndexOf("}");
    if (first !== -1 && last > first) {
      return JSON.parse(cleaned.slice(first, last + 1));
    }
    throw new Error("Не удалось прочитать карточку нового клиента.");
  }
}

async function openai(env, options) {
  if (!env.AI) {
    throw new Error("Не подключён Workers AI binding.");
  }

  var model = options.cloudflareModel || "@cf/meta/llama-3.1-8b-instruct";
  var request = {
    messages: [
      { role: "system", content: options.instructions },
      { role: "user", content: options.input }
    ],
    max_tokens: Math.min(options.maxOutput || 1200, 3000),
    temperature: options.effort === "medium" ? 0.6 : 0.4
  };

  if (options.jsonMode) {
    request.response_format = { type: "json_object" };
    request.temperature = 0.45;
  }

  var result = await env.AI.run(model, request);
  return workersAiText(result);
}

function compactTranscript(messages) {
  return (messages || []).map(function(m) {
    var who = m.role === "user" ? "Дина" : (m.role === "client" ? "Клиент" : "Система");
    return who + ": " + m.text;
  }).join("\n");
}


function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function int(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundTo(value, step) {
  return Math.max(step, Math.round(value / step) * step);
}

function generateClientCard() {
  var names = ["Амина","Марьям","Айша","Фатима","Сафия","Хадиджа","Зарина","Мадина","Самира","Лейла","Алия","Камила"];

  var scenarios = [
    {
      niche:"Нейросети / нейромонтаж", role:"специалист по нейромонтажу и AI-контенту", exp:"2 года",
      offer:"услуги по нейромонтажу и созданию AI-контента", price:25000, clients:3, income:75000,
      request:"получать больше входящих клиентов на услуги из блога",
      surface:"кажется, что для заявок просто мало подписчиков",
      real:"контент иногда набирает просмотры, но предложение и путь до заявки почти не выстроены",
      tried:"снимала Reels, делала разовые продающие сторис и пару раз покупала рекламу",
      result:"просмотры были, но стабильных заявок не появилось",
      extra:"в перспективе можно упаковать опыт в небольшое обучение по нейромонтажу: есть кейсы и клиенты",
      edu:"future_only",
      topic:"Почему Reels могут набирать просмотры, но не приводить клиентов"
    },
    {
      niche:"Графический дизайн", role:"графический дизайнер", exp:"4 года",
      offer:"дизайн упаковки и визуала для экспертов", price:30000, clients:2, income:60000,
      request:"перестать постоянно искать клиентов вручную и получать заявки из Instagram",
      surface:"думает, что нужен более большой блог",
      real:"нет ясного позиционирования и контента, который регулярно ведёт к услуге",
      tried:"писала потенциальным клиентам сама, выкладывала работы и полезные посты",
      result:"по рекомендациям клиенты приходят, из блога — редко",
      extra:"позже можно показать путь в обучение дизайнеров, но сейчас исходный запрос — клиенты на услугу",
      edu:"future_only",
      topic:"Почему сильному специалисту всё равно приходится искать клиентов вручную"
    },
    {
      niche:"Психология", role:"психолог", exp:"5 лет",
      offer:"личные консультации", price:5000, clients:10, income:50000,
      request:"собрать первую небольшую групповую программу и провести запуск",
      surface:"не понимает, хватит ли аудитории для запуска",
      real:"нет собранного предложения и пути от контента к продаже группы",
      tried:"продавала только консультации и проводила бесплатные эфиры",
      result:"на эфиры приходят, но в платную работу переходит немного людей",
      extra:"основной запрос уже связан с созданием группового продукта",
      edu:"suitable",
      topic:"Для первого запуска не нужен блог на 10 000 подписчиков"
    },
    {
      niche:"Таджвид / Коран", role:"преподаватель таджвида", exp:"6 лет",
      offer:"индивидуальные занятия и небольшие группы", price:3500, clients:9, income:65000,
      request:"набирать больше учениц в группы через Instagram и WhatsApp",
      surface:"не знает, что снимать в Reels",
      real:"есть доверие и база, но почти нет системного прогрева и понятного набора в группы",
      tried:"выкладывала напоминания, отзывы и иногда полезные разборы",
      result:"новые ученицы чаще приходят по рекомендациям",
      extra:"позже можно упаковать отдельный курс, но сейчас важнее заполнить действующие группы",
      edu:"future_only",
      topic:"Почему полезный контент сам по себе не всегда приводит учеников"
    },
    {
      niche:"Исламский образовательный проект", role:"автор женских образовательных встреч", exp:"4 года",
      offer:"редкие платные мини-программы после бесплатных лекций", price:6000, clients:18, income:45000,
      request:"понять, что продавать аудитории регулярно и сделать продажи спокойнее",
      surface:"боится, что продажи будут выглядеть навязчиво",
      real:"есть доверие аудитории, но нет постоянной продуктовой линейки и перехода от бесплатного к платному",
      tried:"несколько раз объявляла набор после бесплатных эфиров",
      result:"часть аудитории покупала, но каждый раз всё строится с нуля",
      extra:null, edu:"suitable",
      topic:"Продажи без давления: почему человеку сначала нужно понять ценность"
    },
    {
      niche:"Свечи / рукоделие", role:"мастер по свечам ручной работы", exp:"3 года",
      offer:"свечи и подарочные наборы", price:3500, clients:16, income:55000,
      request:"получать больше заказов из Instagram вне праздников",
      surface:"думает, что нужно просто больше Reels",
      real:"контент красивый, но почти не показывает причины купить сейчас и не собирает повторные продажи",
      tried:"снимала процессы, упаковку заказов и трендовые Reels",
      result:"просмотры иногда хорошие, но заказов после них немного",
      extra:"есть опыт и сильные работы, но обучение сейчас не её запрос",
      edu:"too_early",
      topic:"Почему красивые просмотры не всегда превращаются в заказы"
    },
    {
      niche:"Шитьё / ателье", role:"швея и владелица небольшого ателье", exp:"7 лет",
      offer:"индивидуальный пошив", price:18000, clients:6, income:108000,
      request:"привлекать клиентов через блог и меньше зависеть от знакомых",
      surface:"не знает, что показывать кроме готовых вещей",
      real:"сильные результаты и отзывы есть, но ценность услуги почти не раскрывается в контенте",
      tried:"публиковала готовые работы, процессы пошива и отзывы",
      result:"старые клиенты возвращаются, новые из Instagram приходят редко",
      extra:"достаточно опыта для будущего обучения шитью, но сначала нужно закрыть запрос на клиентов",
      edu:"future_only",
      topic:"Что показывать в блоге специалисту, если одних работ уже недостаточно"
    },
    {
      niche:"Мусульманская одежда", role:"владелица магазина абай и платков", exp:"2,5 года",
      offer:"готовую мусульманскую одежду и аксессуары", price:6500, clients:28, income:180000,
      request:"увеличить продажи из Instagram и WhatsApp без постоянных скидок",
      surface:"просмотры есть, а заказов мало",
      real:"много показов товара, но мало прогрева, сценариев выбора и повторных касаний",
      tried:"делала обзоры, скидки, распаковки и Reels с образами",
      result:"на скидках продажи растут, потом снова проседают",
      extra:null, edu:"not_interested",
      topic:"Почему люди смотрят товар, спрашивают цену и не покупают"
    },
    {
      niche:"Подарочные боксы", role:"владелица проекта подарочных боксов", exp:"3 года",
      offer:"подарочные наборы", price:4500, clients:35, income:140000,
      request:"сделать продажи более ровными, а не только перед праздниками",
      surface:"думает, что проблема только в сезонности",
      real:"сильный WhatsApp и база клиентов почти не используются для повторных продаж",
      tried:"запускала рекламу перед праздниками и активно выкладывала статусы",
      result:"в сезон заказов много, между праздниками резко тише",
      extra:null, edu:"not_interested",
      topic:"Где искать продажи, если новые подписчики приходят медленно"
    },
    {
      niche:"Госуслуги / документы", role:"специалист по оформлению документов", exp:"4 года",
      offer:"помощь с документами и онлайн-услуги", price:7000, clients:14, income:98000,
      request:"получать клиентов через Instagram, а не только по рекомендациям",
      surface:"не понимает, можно ли вообще продвигать такую услугу контентом",
      real:"нет понятной упаковки типовых ситуаций клиента и пути до заявки",
      tried:"выкладывала информационные посты и ответы на частые вопросы",
      result:"посты сохраняют, но пишут редко",
      extra:"при сильном опыте позже можно обучать специалистов, но клиент сейчас этого не рассматривает",
      edu:"not_interested",
      topic:"Почему экспертные посты сохраняют, но после них не пишут в директ"
    },
    {
      niche:"Онлайн-обучение", role:"эксперт с действующим небольшим курсом", exp:"4 года в нише, 2 запуска",
      offer:"онлайн-программу", price:28000, clients:12, income:170000,
      request:"понять, почему второй запуск просел и сделать следующие продажи стабильнее",
      surface:"думает, что аудитория выгорела",
      real:"во втором запуске слабее привлекали новую аудиторию и прогрев не подводил к ценности продукта",
      tried:"провела два запуска",
      result:"первый запуск дал около 320 тыс ₽, второй — около 150 тыс ₽",
      extra:null, edu:"suitable",
      topic:"Почему один запуск проходит хорошо, а следующий внезапно проседает"
    }
  ];

  var assets = pick([
    {
      ig:{followers:850,story_views:95,reactions_per_storytelling:"5–9",reels_performance:"обычно 800–3 000, один ролик около 18 000",consistency:"3–4 раза в неделю"},
      wa:{views:220,uses_for_sales:"иногда"}, group:{exists:false,members:0,views:0,purpose:"нет группы"},
      tg:{exists:true,followers:180,views:90,activity:"пишет редко"},
      other:"есть небольшой список контактов прошлых клиентов",
      warm:"около 35 прошлых клиентов/контактов и 12 старых диалогов с теми, кто спрашивал цену"
    },
    {
      ig:{followers:3200,story_views:420,reactions_per_storytelling:"18–35",reels_performance:"обычно 3 000–12 000, несколько роликов 30–70 тыс.",consistency:"ведёт регулярно"},
      wa:{views:140,uses_for_sales:"редко"}, group:{exists:false,members:0,views:0,purpose:"нет группы"},
      tg:{exists:true,followers:620,views:260,activity:"2–3 публикации в неделю"},
      other:"есть отзывы и хорошие кейсы",
      warm:"около 50 старых заявок и 20 человек, которые интересовались, но не купили"
    },
    {
      ig:{followers:9800,story_views:780,reactions_per_storytelling:"25–50",reels_performance:"обычно 5 000–25 000, отдельные ролики выше 100 тыс.",consistency:"контент выходит регулярно"},
      wa:{views:310,uses_for_sales:"да, но без системы"}, group:{exists:true,members:260,views:120,purpose:"создавалась под бесплатный эфир"},
      tg:{exists:true,followers:1450,views:520,activity:"активный канал"},
      other:"аудитория уже знает эксперта, есть кейсы",
      warm:"около 90 старых заявок, анкеты после бесплатника и база бывших клиентов"
    },
    {
      ig:{followers:640,story_views:70,reactions_per_storytelling:"3–7",reels_performance:"обычно 500–2 000",consistency:"ведёт нерегулярно"},
      wa:{views:480,uses_for_sales:"да, почти каждый день"}, group:{exists:true,members:340,views:180,purpose:"группа клиентов/участников прошлой активности"},
      tg:{exists:false,followers:0,views:0,activity:"нет канала"},
      other:"сильный сарафан и много контактов в WhatsApp",
      warm:"около 120 прошлых клиентов и больше 60 тёплых контактов"
    }
  ]);

  var s = pick(scenarios);
  var name = pick(names);
  var openness = pick(["talkative","normal","normal","reserved"]);
  var style = openness === "talkative" ? "живой и эмоциональный" : openness === "reserved" ? "короткий и спокойный" : pick(["спокойный и дружелюбный","деловой, но не сухой","простой разговорный"]);
  var callAttitude = pick(["согласится, если поймёт конкретную пользу созвона","готова к созвону достаточно легко","предпочитает сначала немного пообщаться в переписке","сначала хочет понять условия и цену"]);
  var capacity = pick(["full","two_payments","two_payments","deposit_then_pay","full"]);
  var attitude = capacity === "full" ? "сумма ощутимая, но может оплатить, если увидит ценность" : capacity === "two_payments" ? "50 000 ₽ целиком тяжело, в 2 платежа реально" : "может начать с брони 5 000 ₽";
  var target = roundTo(s.income * pick([1.5,1.7,2]),10000);
  var inbound = pick(["Reels","сторис","Reels","сторис","прогрев"]);
  var context = "Ответила на " + inbound + ": «" + s.topic + "»";
  var firstMessage = pick(["Можно подробнее?","У меня тоже так 🥲","А с моей нишей вы работаете?","+","Ассаляму алейкум, можно условия?","А сколько стоит?","СТАРТ"]);
  var totalClients = Math.max(s.clients * int(6,14), s.clients + 5);
  var pointB = "хочет выйти примерно на " + target + " ₽ в месяц стабильнее и понимать, откуда будут приходить клиенты/продажи";
  var outcome = capacity === "full" ? "при сильной продаже готова оплатить полностью или внести бронь 5 000 ₽" : capacity === "two_payments" ? "при сильной продаже выберет оплату в 2 платежа или внесёт бронь 5 000 ₽" : "при сильной продаже может внести бронь 5 000 ₽ и затем подготовиться к оплате";

  return {
    context:context,
    message:firstMessage,
    state:{
      name:name,
      niche:s.niche,
      role_and_experience:s.role + ", " + s.exp,
      what_sells_now:{type:(s.niche === "Мусульманская одежда" || s.niche === "Подарочные боксы" || s.niche === "Свечи / рукоделие") ? "товар" : (s.niche === "Онлайн-обучение" ? "обучение" : "услуга/экспертность"),offer:s.offer},
      price:s.price + " ₽",
      current_clients_or_sales:"примерно " + s.clients + " клиентов/заказов в рабочий период",
      current_income_or_turnover:"примерно " + s.income + " ₽ в месяц",
      total_clients:"около " + totalClients,
      can_recontact_old_clients:true,
      launch_experience:s.niche === "Онлайн-обучение" ? s.tried + "; " + s.result : (s.edu === "suitable" ? "полноценного системного запуска не было или были отдельные продажи" : "запуски не являются основным опытом"),
      instagram:assets.ig,
      whatsapp_status:assets.wa,
      whatsapp_group:assets.group,
      telegram:assets.tg,
      other_assets:assets.other,
      warm_databases:assets.warm,
      where_clients_come_from_now:pick(["в основном сарафан и рекомендации","часть из Instagram, часть по рекомендациям","старые клиенты и рекомендации, из блога нерегулярно","Instagram даёт внимание, но в заявки конвертируется слабо"]),
      inbound_source:inbound,
      inbound_context:s.topic,
      first_message:firstMessage,
      surface_problem:s.surface,
      original_request:s.request,
      real_problem:s.real,
      point_a:s.role + ". Сейчас продаёт " + s.offer + ", чек около " + s.price + " ₽, доход/оборот около " + s.income + " ₽. " + s.surface + ".",
      point_b:pointB,
      why_point_b_matters:pick(["хочет меньше зависеть от случайных рекомендаций","хочет понимать, что делать каждый месяц, а не начинать всё заново","хочет больше предсказуемости в доходе","устала от ситуации, когда клиентов то много, то почти нет"]),
      previous_attempts:s.tried,
      previous_results:s.result,
      blockers:s.real,
      fears_and_doubts:pick(["боится снова потратить время и не увидеть продаж","сомневается, хватит ли её аудитории","боится, что придётся постоянно продавать и быть навязчивой","сомневается, что сможет регулярно делать весь объём контента"]),
      openness:openness,
      communication_style:style,
      easy_to_tell:"чем занимается, что продаёт сейчас и что её беспокоит на поверхности",
      only_after_good_question:"конкретные цифры, прошлые попытки, точную точку Б и настоящую причину сомнений",
      unlikely_to_volunteer:"все активы и тёплые базы сразу; о WhatsApp или старых клиентах сама может не вспомнить",
      call_attitude:callAttitude,
      what_makes_call_valuable:"понять, что Дина посмотрит именно её ситуацию, активы и покажет, где сейчас теряются продажи и что делать дальше",
      additional_opportunity:s.extra,
      education_fit:s.edu,
      attitude_to_50000:attitude,
      payment_capacity:capacity,
      possible_purchase_doubts:pick(["получится ли внедрить всё параллельно с работой","не будет ли обучение слишком общим","окупится ли вложение именно в её ситуации","сможет ли она регулярно вести блог и продавать"]),
      what_client_needs_to_understand:"что работа будет применяться к её текущему продукту, аудитории и активам, а не будет абстрактной программой",
      what_repels:"давление, ранняя презентация, игнорирование исходного запроса, длинная универсальная речь про программу",
      strong_sale_possible_outcome:outcome,
      seller_mistakes_that_hurt:"не услышать исходный запрос, пропустить сильные активы, слишком рано начать продавать, увести в обучение без причины",
      what_must_be_shown_to_close_original_request:"связать наставничество с её исходным запросом: " + s.request + ", показать, какие текущие активы можно использовать и какой следующий путь логичен"
    }
  };
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
        var data = generateClientCard();
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
          model: "analysis",
          cloudflareModel: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
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