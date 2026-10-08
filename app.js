const API_URL = "https://trenazher-api.diana-grigoreva73.workers.dev";

const els = {
  newClientBtn: document.getElementById("newClientBtn"),
  emptyNewClientBtn: document.getElementById("emptyNewClientBtn"),
  messages: document.getElementById("messages"),
  messageInput: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),
  hintBtn: document.getElementById("hintBtn"),
  exampleBtn: document.getElementById("exampleBtn"),
  analysisBtn: document.getElementById("analysisBtn"),
  retryBtn: document.getElementById("retryBtn"),
  diagnosticBtn: document.getElementById("diagnosticBtn"),
  contextBox: document.getElementById("contextBox"),
  stageLabel: document.getElementById("stageLabel"),
  coachCard: document.querySelector(".coach-card"),
  coachTitle: document.getElementById("coachTitle"),
  coachContent: document.getElementById("coachContent"),
  closeCoachBtn: document.getElementById("closeCoachBtn"),
  loader: document.getElementById("loader"),
  loaderText: document.getElementById("loaderText"),
  accessModal: document.getElementById("accessModal"),
  accessInput: document.getElementById("accessInput"),
  accessBtn: document.getElementById("accessBtn"),
  accessError: document.getElementById("accessError"),
};

let clientState = null;
let messages = [];
let phase = "chat";
let initialSnapshot = null;
let busy = false;
let accessCode = sessionStorage.getItem("trainer_access") || "";

function apiConfigured() {
  return !API_URL.includes("PASTE-WORKER-URL-HERE");
}

function showLoader(text = "ИИ думает…") {
  els.loaderText.textContent = text;
  els.loader.classList.remove("hidden");
}

function hideLoader() {
  els.loader.classList.add("hidden");
}

function setBusy(value) {
  busy = value;
  const hasClient = Boolean(clientState);
  els.newClientBtn.disabled = value;
  els.emptyNewClientBtn.disabled = value;
  els.sendBtn.disabled = value || !hasClient;
  els.messageInput.disabled = value || !hasClient;
  els.hintBtn.disabled = value || !hasClient;
  els.exampleBtn.disabled = value || !hasClient;
  els.analysisBtn.disabled = value || !hasClient;
  els.diagnosticBtn.disabled = value || !hasClient || phase === "diagnostic";
  if (!value && hasClient) {
    els.messageInput.focus();
  }
}

function openCoach(title, text) {
  els.coachTitle.textContent = title;
  els.coachContent.textContent = text;
  if (window.innerWidth <= 860) {
    els.coachCard.classList.add("open");
  }
}

function closeCoach() {
  els.coachCard.classList.remove("open");
}

function addMessage(role, text) {
  messages.push({ role, text });
  renderMessages();
}

function addSystemMessage(text) {
  messages.push({ role: "system", text });
  renderMessages();
}

function renderMessages() {
  els.messages.innerHTML = "";

  if (!messages.length) {
    els.messages.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✦</div>
        <h2>Начни новую тренировку</h2>
        <p>ИИ создаст нового клиента и пришлёт первое сообщение.</p>
        <button id="emptyNewClientBtnRuntime" class="btn btn-primary">Новый клиент</button>
      </div>
    `;
    document.getElementById("emptyNewClientBtnRuntime")?.addEventListener("click", startNewClient);
    return;
  }

  for (const item of messages) {
    if (item.role === "system") {
      const sys = document.createElement("div");
      sys.className = "system-message";
      sys.textContent = item.text;
      els.messages.appendChild(sys);
      continue;
    }

    const row = document.createElement("div");
    row.className = `message-row ${item.role === "user" ? "user" : "client"}`;

    const bubble = document.createElement("div");
    bubble.className = `message ${item.role === "user" ? "user" : "client"}`;
    bubble.textContent = item.text;

    row.appendChild(bubble);
    els.messages.appendChild(row);
  }

  requestAnimationFrame(() => {
    els.messages.scrollTop = els.messages.scrollHeight;
  });
}

function updateStage() {
  const diagnostic = phase === "diagnostic";
  els.stageLabel.textContent = diagnostic ? "Диагностическая консультация" : "Переписка";
  els.diagnosticBtn.textContent = diagnostic ? "Диагностика идёт" : "Перейти к диагностике";
  els.diagnosticBtn.disabled = busy || !clientState || diagnostic;
}

async function callApi(action, payload = {}) {
  if (!apiConfigured()) {
    throw new Error("Сначала нужно подключить Cloudflare Worker. Я ещё не вставила его адрес в страницу.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-App-Password": accessCode,
    },
    body: JSON.stringify({ action, ...payload }),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_) {}

  if (response.status === 401) {
    sessionStorage.removeItem("trainer_access");
    accessCode = "";
    showAccessModal("Неверный код доступа.");
    throw new Error("Неверный код доступа.");
  }

  if (!response.ok) {
    throw new Error(data.error || `Ошибка сервера: ${response.status}`);
  }

  return data;
}

function showAccessModal(error = "") {
  els.accessError.textContent = error;
  els.accessError.classList.toggle("hidden", !error);
  els.accessModal.classList.remove("hidden");
  setTimeout(() => els.accessInput.focus(), 50);
}

function hideAccessModal() {
  els.accessModal.classList.add("hidden");
  els.accessError.classList.add("hidden");
}

async function verifyAccess() {
  const code = els.accessInput.value.trim();
  if (!code) {
    showAccessModal("Введи код доступа.");
    return;
  }

  accessCode = code;
  els.accessBtn.disabled = true;
  showLoader("Проверяю доступ…");

  try {
    await callApi("ping");
    sessionStorage.setItem("trainer_access", accessCode);
    hideAccessModal();
  } catch (err) {
    if (apiConfigured()) {
      showAccessModal(err.message || "Не получилось проверить доступ.");
    } else {
      showAccessModal("Сначала подключим Cloudflare Worker — после этого код начнёт работать.");
    }
  } finally {
    els.accessBtn.disabled = false;
    hideLoader();
  }
}

async function startNewClient() {
  if (busy) return;

  setBusy(true);
  showLoader("Создаю нового клиента…");
  openCoach("Новый клиент", "Сейчас ИИ создаёт скрытую карточку. Ты увидишь только то, что увидела бы в реальной переписке.");

  try {
    const data = await callApi("new_client");
    clientState = data.state;
    phase = "chat";
    messages = [{ role: "client", text: data.message }];
    initialSnapshot = {
      state: JSON.parse(JSON.stringify(data.state)),
      context: data.context,
      message: data.message,
    };

    els.contextBox.textContent = data.context ? "Контекст обращения: " + data.context : "";
    els.contextBox.classList.toggle("hidden", !data.context);
    els.retryBtn.classList.remove("hidden");
    updateStage();
    renderMessages();
    openCoach("Клиент написал", "Веди диалог сама. Не пытайся сразу собрать всю анкету — сначала пойми, почему человек написал и что ему сейчас нужно.");
  } catch (err) {
    openCoach("Не получилось запустить клиента", err.message);
  } finally {
    setBusy(false);
    hideLoader();
  }
}

async function sendMessage() {
  if (busy || !clientState) return;
  const text = els.messageInput.value.trim();
  if (!text) return;

  els.messageInput.value = "";
  resizeTextarea();
  addMessage("user", text);

  setBusy(true);
  showLoader("Клиент отвечает…");

  try {
    const data = await callApi("client_reply", {
      state: clientState,
      messages,
      phase,
    });
    if (data.state) clientState = data.state;
    addMessage("client", data.message);
  } catch (err) {
    openCoach("Ошибка", err.message);
  } finally {
    setBusy(false);
    hideLoader();
  }
}

async function getHint(kind = "hint") {
  if (busy || !clientState) return;
  setBusy(true);
  showLoader(kind === "example" ? "Подбираю пример вопроса…" : "Смотрю диалог…");

  try {
    const data = await callApi(kind, {
      state: clientState,
      messages,
      phase,
    });
    openCoach(kind === "example" ? "Пример вопроса" : "Подсказка", data.text);
  } catch (err) {
    openCoach("Ошибка", err.message);
  } finally {
    setBusy(false);
    hideLoader();
  }
}

async function analyzeSale() {
  if (busy || !clientState) return;
  setBusy(true);
  showLoader("Разбираю продажу…");
  openCoach("Разбор продажи", "Смотрю весь диалог, исходный запрос клиента и то, что ты успела раскрыть.");

  try {
    const data = await callApi("analysis", {
      state: clientState,
      messages,
      phase,
    });
    openCoach("Разбор продажи", data.text);
  } catch (err) {
    openCoach("Ошибка", err.message);
  } finally {
    setBusy(false);
    hideLoader();
  }
}

function switchToDiagnostic() {
  if (!clientState || phase === "diagnostic") return;
  phase = "diagnostic";
  addSystemMessage("Вы перешли к диагностической консультации. Диалог продолжается с учётом всей переписки.");
  updateStage();
  openCoach("Диагностика", "Считай, что вы уже на созвоне. Не начинай знакомство заново и не спрашивай повторно то, что клиент уже рассказал.");
}

function retrySameClient() {
  if (!initialSnapshot || busy) return;
  const ok = confirm("Пройти этого же клиента сначала? Скрытая ситуация останется той же.");
  if (!ok) return;

  clientState = JSON.parse(JSON.stringify(initialSnapshot.state));
  phase = "chat";
  messages = [{ role: "client", text: initialSnapshot.message }];
  els.contextBox.textContent = initialSnapshot.context ? "Контекст обращения: " + initialSnapshot.context : "";
  els.contextBox.classList.toggle("hidden", !initialSnapshot.context);
  updateStage();
  renderMessages();
  openCoach("Повторная попытка", "Клиент тот же, факты и его реальный запрос не изменились. Попробуй провести продажу по-другому.");
}

function resizeTextarea() {
  els.messageInput.style.height = "auto";
  els.messageInput.style.height = Math.min(els.messageInput.scrollHeight, 150) + "px";
}

els.newClientBtn.addEventListener("click", startNewClient);
els.emptyNewClientBtn.addEventListener("click", startNewClient);
els.sendBtn.addEventListener("click", sendMessage);
els.hintBtn.addEventListener("click", () => getHint("hint"));
els.exampleBtn.addEventListener("click", () => getHint("example"));
els.analysisBtn.addEventListener("click", analyzeSale);
els.diagnosticBtn.addEventListener("click", switchToDiagnostic);
els.retryBtn.addEventListener("click", retrySameClient);
els.closeCoachBtn.addEventListener("click", closeCoach);
els.accessBtn.addEventListener("click", verifyAccess);

els.accessInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") verifyAccess();
});

els.messageInput.addEventListener("input", resizeTextarea);
els.messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    els.coachCard.classList.remove("open");
  }
});

renderMessages();
updateStage();

if (!accessCode) {
  showAccessModal();
} else if (!apiConfigured()) {
  openCoach("Остался один технический шаг", "Страница уже готова. Теперь подключим Cloudflare Worker и я вставлю его адрес сюда сама.");
}