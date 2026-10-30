/* ============================================================
   Водить.РФ — единый скрипт приложения
   Работает без сервера и без внешних библиотек:
   данные хранятся в localStorage (имитация БД для демо-экзамена).
   Структура: утилиты → «БД» → UI-компоненты → страницы.
   ============================================================ */
(function () {
  "use strict";

  /* ---------------- 1. Утилиты ---------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, "0");

  const ICONS = {
    check:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>',
    alert:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v5"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.6h.01"/></svg>',
    close:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    eye:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.2 12S5.6 5.5 12 5.5 21.8 12 21.8 12 18.4 18.5 12 18.5 2.2 12 2.2 12Z"/><circle cx="12" cy="12" r="3.1"/></svg>',
    eyeOff:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c6.4 0 9.8 6 9.8 6a17 17 0 0 1-2.7 3.6"/><path d="M6.3 7.6A16.7 16.7 0 0 0 2.2 12S5.6 18 12 18a9.5 9.5 0 0 0 4-.85"/><path d="m3 3 18 18"/></svg>',
    edit:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    trash:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>',
    card:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/><path d="M6.5 15h3"/></svg>',
    user:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/></svg>',
    phone:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L15 13l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3 5.2 2 2 0 0 1 5 3Z"/></svg>',
    mail:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
    left:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>',
    right:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>',
    down:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v16M6 14l6 6 6-6"/></svg>',
    star:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95L12 2.6Z"/></svg>',
    logout:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
    shield:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3Z"/><path d="m8.6 12 2.4 2.4 4.4-4.4"/></svg>',
    boat:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h18l-2.4 5H5.4L3 14Z"/><path d="M6 14V8.5L12 4l2.5 4.5"/><path d="M13 8.5h4"/><path d="M8 19v2M16 19v2"/></svg>',
    liner:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18h18l-2 3H5l-2-3Z"/><path d="M5 18V8h14v10"/><path d="M9 8V3h6v5"/><path d="M9 12h2M13 12h2"/></svg>',
    yacht:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="M12 5.5 6 15h6"/><path d="M13.5 8 18.5 15h-5"/><path d="M4 19c2 1.6 4 1.6 6 0 2 1.6 4 1.6 6 0 1.4 1.1 2.8 1.4 4 .4"/></svg>',
  };

  const fmtDate = (d) => (d instanceof Date && !isNaN(d) ? `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}` : "—");
  const parseRuDate = (str) => {
    const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(String(str || "").trim());
    if (!m) return null;
    const [d, mo, y] = [+m[1], +m[2], +m[3]];
    const date = new Date(y, mo - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
    return date;
  };
  const isoToRu = (iso) => {
    const p = String(iso || "").split("-");
    return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : "—";
  };
  const ruToIso = (ru) => {
    const d = parseRuDate(ru);
    if (!d) return "";
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const money = (n) => `${Number(n).toLocaleString("ru-RU")} ₽`;
  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  /* ---------------- 2. «База данных» ----------------
     users / requests / reviews — как таблицы реляционной БД,
     связанные по userId и requestId.                              */
  const DB_KEY = "voditrf:db:v1";
  const SESSION_KEY = "voditrf:session:v1";
  const FLASH_KEY = "voditrf:flash:v1";

  const TRANSPORT = {
    boat: {
      key: "boat",
      title: "Катер",
      short: "Катер",
      price: 24000,
      hours: "24 ак. часа",
      tag: "Хит",
      icon: "boat",
      image: "assets/img/transport-boat.jpg",
      desc: "Классика речного вождения: маневрирование, швартовка и уверенность на волне.",
      specs: [
        ["Длительность", "6 недель"],
        ["Практика", "12 часов на воде"],
        ["Документ", "Удостоверение судоводителя"],
      ],
    },
    liner: {
      key: "liner",
      title: "Круизный лайнер",
      short: "Лайнер",
      price: 39000,
      hours: "36 ак. часов",
      tag: "Профи",
      icon: "liner",
      image: "assets/img/transport-liner.jpg",
      desc: "Работа на пассажирских судах: навигация, радиосвязь и управление экипажем.",
      specs: [
        ["Длительность", "9 недель"],
        ["Практика", "18 часов на воде"],
        ["Документ", "Свидетельство капитана"],
      ],
    },
    yacht: {
      key: "yacht",
      title: "Яхта",
      short: "Яхта",
      price: 32000,
      hours: "30 ак. часов",
      tag: "Премиум",
      icon: "yacht",
      image: "assets/img/transport-yacht.jpg",
      desc: "Курс для тех, кто мечтает о собственной яхте: управление, навигация, безопасность.",
      specs: [
        ["Длительность", "7 недель"],
        ["Практика", "15 часов на воде"],
        ["Документ", "Удостоверение яхтсмена"],
      ],
    },
  };

  const STATUS = {
    new: { label: "Новая", badge: "badge--new", order: 0 },
    progress: { label: "Идет обучение", badge: "badge--progress", order: 1 },
    done: { label: "Обучение завершено", badge: "badge--done", order: 2 },
  };

  const PAYMENTS = {
    card: "Банковская карта онлайн",
    invoice: "Счёт для юридического лица",
    cash: "Наличными в офисе",
    installments: "Рассрочка 0% на 6 месяцев",
  };

  const TIMES = {
    morning: "Утро · 09:00–12:00",
    day: "День · 12:00–17:00",
    evening: "Вечер · 18:00–21:00",
    weekend: "Выходные · 10:00–15:00",
  };

  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        /* приватный режим — работаем без сохранения */
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    },
  };

  const isoDays = (offset) => {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + offset);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };
  const isoNow = () => new Date().toISOString();

  function seedDatabase() {
    const users = [
      {
        id: "u-demo",
        login: "demo26",
        password: "Demo2026",
        fullName: "Соколов Артём Игоревич",
        birthDate: "14.03.1994",
        phone: "+7 (916) 240-18-55",
        email: "sokolov.demo@mail.ru",
        createdAt: isoDays(-120),
        role: "user",
      },
      {
        id: "u-ivanov",
        login: "ivanov26",
        password: "Ivanov2026",
        fullName: "Иванов Пётр Сергеевич",
        birthDate: "02.11.1988",
        phone: "+7 (903) 771-42-19",
        email: "ivanov.p@yandex.ru",
        createdAt: isoDays(-96),
        role: "user",
      },
      {
        id: "u-petrova",
        login: "petrova26",
        password: "Petrova2026",
        fullName: "Петрова Анна Дмитриевна",
        birthDate: "27.06.1997",
        phone: "+7 (926) 502-63-08",
        email: "a.petrova@bk.ru",
        createdAt: isoDays(-74),
        role: "user",
      },
      {
        id: "u-kuznetsov",
        login: "kuznetsov26",
        password: "Kuznecov2026",
        fullName: "Кузнецов Илья Андреевич",
        birthDate: "09.01.1991",
        phone: "+7 (985) 118-90-24",
        email: "kuznetsov.ilya@gmail.com",
        createdAt: isoDays(-48),
        role: "user",
      },
    ];

    const req = (id, userId, transport, dateISO, time, payment, status, createdISO, comment) => ({
      id,
      number: Number(id.split("-")[1]),
      userId,
      transport,
      date: dateISO,
      time,
      payment,
      status,
      comment: comment || "",
      createdAt: createdISO,
    });

    const requests = [
      req("req-1041", "u-demo", "boat", isoDays(-18), "morning", "card", "done", isoDays(-58), "Хочу заниматься на катере «Волга»."),
      req("req-1085", "u-demo", "yacht", isoDays(-12), "day", "card", "done", isoDays(-40), ""),
      req("req-1076", "u-demo", "yacht", isoDays(9), "evening", "installments", "progress", isoDays(-24), ""),
      req("req-1102", "u-demo", "liner", isoDays(28), "weekend", "invoice", "new", isoDays(-6), "Интересует группа выходного дня."),
      req("req-1055", "u-ivanov", "liner", isoDays(-40), "day", "invoice", "done", isoDays(-88), ""),
      req("req-1088", "u-ivanov", "boat", isoDays(4), "morning", "card", "progress", isoDays(-19), ""),
      req("req-1119", "u-ivanov", "boat", isoDays(21), "evening", "cash", "new", isoDays(-2), ""),
      req("req-1063", "u-petrova", "yacht", isoDays(-31), "weekend", "card", "done", isoDays(-70), "Спасибо за гибкий график."),
      req("req-1094", "u-petrova", "boat", isoDays(13), "day", "installments", "progress", isoDays(-11), ""),
      req("req-1124", "u-petrova", "yacht", isoDays(35), "morning", "card", "new", isoDays(-1), ""),
      req("req-1069", "u-kuznetsov", "boat", isoDays(-22), "evening", "cash", "done", isoDays(-64), ""),
      req("req-1111", "u-kuznetsov", "liner", isoDays(17), "weekend", "invoice", "new", isoDays(-4), ""),
      req("req-1127", "u-kuznetsov", "yacht", isoDays(44), "day", "card", "new", isoDays(0), "Нужна консультация по документам."),
    ];

    const reviews = [
      {
        id: "rev-301",
        userId: "u-demo",
        requestId: "req-1041",
        rating: 5,
        text: "Прошёл курс на катере — инструктор спокойно объясняет швартовку, практики много. Через месяц уверенно вышел на воду один.",
        createdAt: isoDays(-12),
        published: true,
      },
      {
        id: "rev-302",
        userId: "u-ivanov",
        requestId: "req-1055",
        rating: 5,
        text: "Готовился к работе на пассажирском теплоходе. Очень сильная теоретическая часть и настоящая рубка на тренажёре.",
        createdAt: isoDays(-30),
        published: true,
      },
      {
        id: "rev-303",
        userId: "u-petrova",
        requestId: "req-1063",
        rating: 4,
        text: "Курс на яхте превзошёл ожидания: навигация, погода, поведение на волне. Единственное — хотелось бы больше вечерних слотов.",
        createdAt: isoDays(-21),
        published: true,
      },
    ];

    return { users, requests, reviews, version: 1 };
  }

  function loadDB() {
    const raw = storage.get(DB_KEY);
    if (raw) {
      try {
        const db = JSON.parse(raw);
        if (db && Array.isArray(db.users) && Array.isArray(db.requests)) return db;
      } catch (e) {}
    }
    const fresh = seedDatabase();
    storage.set(DB_KEY, JSON.stringify(fresh));
    return fresh;
  }
  let db = loadDB();
  const saveDB = () => storage.set(DB_KEY, JSON.stringify(db));

  const getUser = (id) => db.users.find((u) => u.id === id);
  const userRequests = (id) =>
    db.requests.filter((r) => r.userId === id).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  /* ---- сессия ---- */
  const getSession = () => {
    try {
      return JSON.parse(storage.get(SESSION_KEY) || "null");
    } catch (e) {
      return null;
    }
  };
  const setSession = (session) => storage.set(SESSION_KEY, JSON.stringify(session));
  const clearSession = () => storage.remove(SESSION_KEY);

  const flash = {
    set(payload) {
      storage.set(FLASH_KEY, JSON.stringify(payload));
    },
    pop() {
      const raw = storage.get(FLASH_KEY);
      if (!raw) return null;
      storage.remove(FLASH_KEY);
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },
  };

  const redirect = (url) => {
    window.location.href = url;
  };
  const goLogin = (target) => {
    flash.set({ type: "info", title: "Нужен вход", text: "Войдите в аккаунт, чтобы продолжить." });
    redirect(`login.html?next=${encodeURIComponent(target)}`);
  };

  /* ---------------- 3. Тосты ---------------- */
  let toastHost = null;
  function ensureToastHost() {
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "toasts";
      toastHost.setAttribute("role", "status");
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }
    return toastHost;
  }
  function toast({ type = "info", title = "", text = "", timeout = 4200 } = {}) {
    const host = ensureToastHost();
    const el = document.createElement("div");
    el.className = `toast toast--${type}`;
    const icon = type === "success" ? ICONS.check : type === "error" ? ICONS.alert : ICONS.info;
    el.innerHTML = `
      <span class="toast__icon">${icon}</span>
      <div class="toast__body">
        ${title ? `<div class="toast__title">${esc(title)}</div>` : ""}
        ${text ? `<div class="toast__text">${esc(text)}</div>` : ""}
      </div>
      <button class="toast__close" type="button" aria-label="Закрыть уведомление">${ICONS.close}</button>`;
    host.appendChild(el);
    const remove = () => {
      el.classList.add("is-out");
      setTimeout(() => el.remove(), 320);
    };
    el.querySelector(".toast__close").addEventListener("click", remove);
    if (timeout) setTimeout(remove, timeout);
  }

  /* ---------------- 4. Модальные окна ---------------- */
  const modalState = new WeakMap();
  function openModal(idOrEl) {
    const el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
    if (!el) return;
    modalState.set(el, document.activeElement);
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    const focusable = el.querySelector("input, textarea, select, button:not(.modal__close)");
    setTimeout(() => (focusable || el.querySelector(".modal__close") || el).focus({ preventScroll: true }), 60);
  }
  function closeModal(el) {
    if (typeof el === "string") el = document.getElementById(el);
    if (!el) return;
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    const prev = modalState.get(el);
    if (prev && typeof prev.focus === "function") prev.focus({ preventScroll: true });
  }
  function initModals() {
    $$(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target.closest("[data-modal-close]") || e.target.classList.contains("modal__overlay")) closeModal(modal);
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const open = $(".modal.is-open");
        if (open) closeModal(open);
      }
    });
  }

  /* ---------------- 5. Маски и валидация ---------------- */
  function maskDate(input) {
    if (!input) return;
    input.addEventListener("input", () => {
      let digits = input.value.replace(/\D/g, "").slice(0, 8);
      let out = digits;
      if (digits.length > 4) out = `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4)}`;
      else if (digits.length > 2) out = `${digits.slice(0, 2)}.${digits.slice(2)}`;
      input.value = out;
    });
    input.addEventListener("blur", () => {
      if (input.value.length === 10) {
        const d = parseRuDate(input.value);
        if (!d) {
          input.value = input.value;
        }
      }
    });
  }

  function formatPhone(digits) {
    let d = digits.replace(/\D/g, "");
    if (!d) return "";
    if (d[0] === "8") d = "7" + d.slice(1);
    if (d[0] !== "7") d = "7" + d;
    d = d.slice(0, 11);
    let out = "+7";
    if (d.length > 1) out += ` (${d.slice(1, 4)}`;
    if (d.length >= 5) out += `) ${d.slice(4, 7)}`;
    if (d.length >= 8) out += `-${d.slice(7, 9)}`;
    if (d.length >= 10) out += `-${d.slice(9, 11)}`;
    return out;
  }
  function maskPhone(input) {
    if (!input) return;
    input.addEventListener("input", () => {
      input.value = formatPhone(input.value);
    });
    input.addEventListener("focus", () => {
      if (!input.value) input.value = "+7 (";
    });
    input.addEventListener("blur", () => {
      if (input.value.replace(/\D/g, "").length <= 1) input.value = "";
    });
  }

  const RULES = {
    login(v) {
      if (!v.trim()) return "Укажите логин";
      if (!/^[A-Za-z0-9]+$/.test(v)) return "Только латинские буквы и цифры, без пробелов";
      if (v.length < 6) return "Минимум 6 символов";
      return "";
    },
    password(v) {
      if (!v) return "Укажите пароль";
      if (v.length < 8) return "Пароль должен содержать минимум 8 символов";
      if (!/[A-Za-zА-Яа-я]/.test(v) || !/\d/.test(v)) return "Пароль должен содержать буквы и цифры";
      return "";
    },
    fullName(v) {
      if (!v.trim()) return "Укажите ФИО";
      const parts = v.trim().split(/\s+/);
      if (parts.length < 3) return "Укажите полностью: Фамилия Имя Отчество";
      if (!parts.every((p) => /^[А-Яа-яЁёA-Za-z-]{2,}$/.test(p))) return "ФИО может содержать только буквы и дефис";
      return "";
    },
    birthDate(v) {
      if (!v.trim()) return "Укажите дату рождения";
      const d = parseRuDate(v);
      if (!d) return "Дата в формате ДД.ММ.ГГГГ и должна существовать";
      const now = new Date();
      let age = now.getFullYear() - d.getFullYear();
      const m = now.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
      if (age < 16) return "Обучение доступно с 16 лет";
      if (age > 85) return "Проверьте год рождения";
      return "";
    },
    phone(v) {
      const d = v.replace(/\D/g, "");
      if (!d) return "Укажите телефон";
      if (d.length !== 11) return "Телефон в формате +7 (999) 123-45-67";
      return "";
    },
    email(v) {
      if (!v.trim()) return "Укажите e-mail";
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-zА-Яа-я]{2,}$/.test(v.trim())) return "Неверный формат, например name@mail.ru";
      return "";
    },
    date(v) {
      if (!v.trim()) return "Выберите дату начала обучения";
      const d = parseRuDate(v);
      if (!d) return "Дата в формате ДД.ММ.ГГГГ";
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d < today) return "Дата не может быть в прошлом";
      const max = new Date();
      max.setMonth(max.getMonth() + 6);
      if (d > max) return "Запись открыта на 6 месяцев вперёд";
      return "";
    },
    transport(v) {
      return v ? "" : "Выберите вид транспорта";
    },
    time(v) {
      return v ? "" : "Выберите удобное время";
    },
    payment(v) {
      return v ? "" : "Выберите способ оплаты";
    },
  };

  const fieldOf = (input) => input.closest(".field");
  function setError(input, message) {
    const field = fieldOf(input);
    if (!field) return;
    const box = field.querySelector(".error-text");
    field.classList.toggle("has-error", Boolean(message));
    field.classList.toggle("is-valid", !message && Boolean(input.value));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (box) box.textContent = message || "";
  }
  function validateField(input, ruleName) {
    const message = RULES[ruleName](input.value);
    setError(input, message);
    return !message;
  }
  function initLiveValidation(form) {
    if (!form) return;
    $$("[data-rule]", form).forEach((input) => {
      const rule = input.dataset.rule;
      input.addEventListener("blur", () => {
        if (input.value) validateField(input, rule);
      });
      input.addEventListener("input", () => {
        const field = fieldOf(input);
        if (field && field.classList.contains("has-error")) validateField(input, rule);
      });
    });
  }

  function setLoading(btn, on) {
    if (!btn) return;
    btn.classList.toggle("is-loading", on);
    btn.disabled = on;
  }

  function attachPasswordToggle() {
    $$("[data-toggle-password]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.togglePassword);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        btn.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
        btn.setAttribute("aria-label", show ? "Скрыть пароль" : "Показать пароль");
        input.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------- 6. Слайдер ---------------- */
  function initSlider(root) {
    if (!root) return;
    const track = $(".slider__track", root);
    const slides = $$(".slider__slide", root);
    const dotsHost = $(".slider__dots", root);
    const bar = $(".slider__progress", root);
    if (!track || slides.length < 2) return;

    let index = 0;
    let timer = null;
    let paused = false;
    const DELAY = Number(root.dataset.interval || 3000);

    if (dotsHost) {
      dotsHost.innerHTML = slides
        .map((_, i) => `<button class="slider__dot" type="button" data-go="${i}" aria-label="Слайд ${i + 1}"></button>`)
        .join("");
    }
    const dots = $$(".slider__dot", root);

    function paintProgress() {
      if (!bar) return;
      bar.style.transition = "none";
      bar.style.transform = "scaleX(0)";
      // reflow, чтобы анимация началась заново
      void bar.offsetWidth;
      bar.style.transition = `transform ${DELAY}ms linear`;
      bar.style.transform = "scaleX(1)";
    }
    function render() {
      track.style.transform = `translateX(${-index * 100}%)`;
      dots.forEach((d, i) => {
        d.classList.toggle("is-active", i === index);
        d.setAttribute("aria-current", i === index ? "true" : "false");
      });
      slides.forEach((s, i) => {
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
        $$("img", s).forEach((img) => (img.loading = i === 0 ? "eager" : "lazy"));
      });
      paintProgress();
    }
    function go(next) {
      index = (next + slides.length) % slides.length;
      render();
      restart();
    }
    function restart() {
      clearTimeout(timer);
      if (paused) return;
      timer = setTimeout(() => go(index + 1), DELAY);
    }
    $(".slider__nav--prev", root)?.addEventListener("click", () => go(index - 1));
    $(".slider__nav--next", root)?.addEventListener("click", () => go(index + 1));
    dots.forEach((d) => d.addEventListener("click", () => go(Number(d.dataset.go))));

    root.addEventListener("mouseenter", () => {
      paused = true;
      clearTimeout(timer);
      root.classList.add("is-paused");
    });
    root.addEventListener("mouseleave", () => {
      paused = false;
      root.classList.remove("is-paused");
      restart();
    });
    root.addEventListener("focusin", () => {
      paused = true;
      clearTimeout(timer);
    });
    root.addEventListener("focusout", () => {
      paused = false;
      restart();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) clearTimeout(timer);
      else restart();
    });

    /* свайп на мобильных */
    let startX = null;
    root.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    root.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        startX = null;
      },
      { passive: true }
    );

    /* клавиатура */
    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    });

    render();
    restart();
  }

  /* ---------------- 7. Общее поведение страниц ---------------- */
  function initials(name) {
    return String(name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();
  }

  function renderHeaderAuth() {
    const session = getSession();
    $$("[data-header-actions]").forEach((slot) => {
      if (!session) return; /* остаётся гостевая разметка из HTML */
      if (session.role === "admin") {
        slot.innerHTML = `
          <a class="btn btn--ghost btn--sm" href="admin.html">
            ${ICONS.shield}<span class="hide-sm">Панель администратора</span>
          </a>
          <button class="btn btn--primary btn--sm" type="button" data-action="logout">Выйти</button>`;
      } else {
        const user = getUser(session.userId);
        slot.innerHTML = `
          <a class="header-user" href="account.html" title="Личный кабинет">
            <span class="avatar">${esc(initials(user ? user.fullName : session.login))}</span>
            <span class="hide-sm">${esc(user ? user.fullName.split(" ")[1] || user.login : session.login)}</span>
          </a>
          <button class="btn btn--ghost btn--sm btn--icon" type="button" data-action="logout" aria-label="Выйти" title="Выйти">
            ${ICONS.logout}
          </button>`;
      }
    });
    $$('[data-action="logout"]').forEach((btn) => {
      btn.addEventListener("click", () => {
        clearSession();
        flash.set({ type: "success", title: "Вы вышли", text: "До новой встречи на воде!" });
        redirect("index.html");
      });
    });
    /* ссылки для гостей в шапке — добавляем «Записаться» */
    $$("[data-guest-cta]").forEach((el) => el.removeAttribute("hidden"));
  }

  function initHeader() {
    const header = $(".site-header");
    const burger = $(".burger");
    const nav = $(".nav");
    if (header) {
      const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    if (burger && nav) {
      burger.addEventListener("click", () => {
        const open = burger.getAttribute("aria-expanded") === "true";
        burger.setAttribute("aria-expanded", String(!open));
        nav.classList.toggle("is-open", !open);
      });
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
          burger.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
        }
      });
      document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target)) {
          burger.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
        }
      });
    }
  }

  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  function initFaq() {
    $$(".faq__item").forEach((item) => {
      const btn = $(".faq__q", item);
      if (!btn) return;
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        $$(".faq__item").forEach((other) => {
          other.classList.remove("is-open");
          $(".faq__q", other)?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function showFlash() {
    const message = flash.pop();
    if (message) toast(message);
  }

  /* ---------------- 8. Страница: главная ---------------- */
  function renderPublicReviews() {
    const host = $("[data-public-reviews]");
    if (!host) return;
    const items = db.reviews
      .filter((r) => r.published)
      .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      .slice(0, 3);
    if (!items.length) {
      host.innerHTML = `<div class="empty"><h3>Пока нет отзывов</h3><p>Станьте первым выпускником, который поделится впечатлениями.</p></div>`;
      return;
    }
    host.innerHTML = items
      .map((review) => {
        const user = getUser(review.userId);
        const request = db.requests.find((r) => r.id === review.requestId);
        const transport = TRANSPORT[request?.transport || review.transport];
        const stars = Array.from({ length: 5 }, (_, i) => ICONS.star.replace("<svg", `<svg class="${i < review.rating ? "" : "is-off"}"`)).join("");
        return `<article class="review-card reveal">
            <div class="review-card__head">
              <span class="avatar">${esc(initials(user ? user.fullName : "Гость"))}</span>
              <div>
                <div class="review-card__name">${esc(user ? user.fullName.split(" ").slice(0, 2).join(" ") : "Выпускник")}</div>
                <div class="review-card__meta">${esc(transport ? transport.title : "Курс")} · ${esc(isoToRu(review.createdAt.slice(0, 10)))}</div>
              </div>
            </div>
            <div class="rating" aria-label="Оценка ${review.rating} из 5">${stars}</div>
            <p class="mt-12">${esc(review.text)}</p>
          </article>`;
      })
      .join("");
    host.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  function initHome() {
    renderPublicReviews();
    $$(".transport-card").forEach((card) => {
      const link = $("[data-request-link]", card);
      if (link) {
        link.addEventListener("click", (e) => {
          const key = card.dataset.transport;
          if (!getSession()) {
            e.preventDefault();
            goLogin(`request.html?transport=${key}`);
          } else {
            link.href = `request.html?transport=${key}`;
          }
        });
      }
    });
    $$("[data-requires-auth]").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (!getSession()) {
          e.preventDefault();
          goLogin(link.getAttribute("href") || "account.html");
        }
      });
    });
  }

  /* ---------------- 9. Страница: вход ---------------- */
  function initLogin() {
    const form = $("#loginForm");
    if (!form) return;
    const loginInput = $("#loginLogin");
    const passInput = $("#loginPassword");
    const next = new URLSearchParams(location.search).get("next");

    initLiveValidation(form);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const okLogin = validateField(loginInput, "login");
      const okPass = passInput.value ? true : (setError(passInput, "Укажите пароль"), false);
      if (!okLogin || !okPass) {
        toast({ type: "error", title: "Проверьте форму", text: "Логин и пароль обязательны." });
        (okLogin ? passInput : loginInput).focus();
        return;
      }

      const btn = $('button[type="submit"]', form);
      setLoading(btn, true);

      setTimeout(() => {
        const login = loginInput.value.trim();

        /* администратор */
        if (login === "Admin26" && passInput.value === "Demo20") {
          setSession({ role: "admin", login: "Admin26", startedAt: isoNow() });
          flash.set({ type: "success", title: "Добро пожаловать, администратор", text: "Открываем панель управления заявками." });
          redirect("admin.html");
          return;
        }

        const user = db.users.find((u) => u.login.toLowerCase() === login.toLowerCase());
        if (!user || user.password !== passInput.value) {
          setLoading(btn, false);
          setError(loginInput, "Неверный логин или пароль");
          setError(passInput, "Неверный логин или пароль");
          toast({ type: "error", title: "Вход не выполнен", text: "Проверьте логин и пароль и попробуйте снова." });
          passInput.select();
          return;
        }

        setSession({ role: "user", userId: user.id, login: user.login, startedAt: isoNow() });
        flash.set({ type: "success", title: `Здравствуйте, ${user.fullName.split(" ")[1] || user.login}!`, text: "Вы вошли в личный кабинет." });
        redirect(next && /^[a-z-]+\.html(\?.*)?$/.test(next) ? next : "account.html");
      }, 420);
    });
  }

  /* ---------------- 10. Страница: регистрация ---------------- */
  function initRegister() {
    const form = $("#registerForm");
    if (!form) return;
    attachPasswordToggle();
    initLiveValidation(form);
    maskDate($("#regBirth"));
    maskPhone($("#regPhone"));

    const pass = $("#regPassword");
    const meter = $("#passwordMeter");
    const updateMeter = () => {
      const v = pass.value;
      let level = 0;
      if (v.length >= 8) level = 1;
      if (v.length >= 8 && /[A-Za-zА-Яа-я]/.test(v) && /\d/.test(v)) level = 2;
      if (v.length >= 10 && /[A-Za-zА-Яа-я]/.test(v) && /\d/.test(v) && /[^A-Za-zА-Яа-я0-9]/.test(v)) level = 3;
      if (meter) meter.dataset.level = String(level);
    };
    pass.addEventListener("input", updateMeter);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const checks = [
        [ $("#regLogin"), "login" ],
        [ $("#regPassword"), "password" ],
        [ $("#regFullName"), "fullName" ],
        [ $("#regBirth"), "birthDate" ],
        [ $("#regPhone"), "phone" ],
        [ $("#regEmail"), "email" ],
      ];
      let firstBad = null;
      checks.forEach(([input, rule]) => {
        const ok = validateField(input, rule);
        if (!ok && !firstBad) firstBad = input;
      });

      /* уникальность логина */
      const loginValue = $("#regLogin").value.trim();
      if (loginValue && db.users.some((u) => u.login.toLowerCase() === loginValue.toLowerCase())) {
        setError($("#regLogin"), "Такой логин уже занят — придумайте другой");
        if (!firstBad) firstBad = $("#regLogin");
      }

      /* подтверждение пароля */
      const confirm = $("#regPassword2");
      const confirmOk = confirm.value === pass.value && confirm.value.length >= 8;
      setError(confirm, confirmOk ? "" : "Пароли не совпадают");

      /* согласие */
      const consent = $("#regConsent");
      const consentField = fieldOf(consent);
      if (!consent.checked) {
        consentField?.classList.add("has-error");
        const box = consentField?.querySelector(".error-text");
        if (box) box.textContent = "Без согласия регистрация невозможна";
      } else {
        consentField?.classList.remove("has-error");
      }

      if (firstBad || !confirmOk || !consent.checked) {
        toast({ type: "error", title: "Форма заполнена с ошибками", text: "Исправьте подсвеченные поля и отправьте снова." });
        (firstBad || (confirmOk ? consent : confirm)).focus();
        return;
      }

      const btn = $('button[type="submit"]', form);
      setLoading(btn, true);

      setTimeout(() => {
        const user = {
          id: uid("u"),
          login: loginValue,
          password: pass.value,
          fullName: $("#regFullName").value.trim().replace(/\s+/g, " "),
          birthDate: $("#regBirth").value,
          phone: $("#regPhone").value,
          email: $("#regEmail").value.trim(),
          createdAt: isoNow(),
          role: "user",
        };
        db.users.push(user);
        saveDB();
        setSession({ role: "user", userId: user.id, login: user.login, startedAt: isoNow() });
        flash.set({ type: "success", title: "Регистрация завершена", text: "Аккаунт создан. Теперь можно подать заявку на обучение." });
        redirect("account.html");
      }, 520);
    });
  }

  /* ---------------- 11. Страница: личный кабинет ---------------- */
  function requestCardHTML(request) {
    const t = TRANSPORT[request.transport] || TRANSPORT.boat;
    const status = STATUS[request.status] || STATUS.new;
    const review = db.reviews.find((r) => r.requestId === request.id);
    let action = "";
    if (request.status === "done") {
      action = review
        ? `<span class="review-done">${ICONS.check} Отзыв опубликован</span>`
        : `<button class="btn btn--primary btn--sm" type="button" data-review="${request.id}">Оставить отзыв</button>`;
    } else {
      action = `<span class="hint-row">${ICONS.info} Отзыв — после завершения обучения</span>`;
    }
    return `<article class="request-card">
        <span class="request-card__icon">${ICONS[t.icon]}</span>
        <div>
          <div class="request-card__title">
            ${esc(t.title)}
            <span class="num">№ ${esc(request.number)}</span>
            <span class="badge ${status.badge}">${status.label}</span>
          </div>
          <div class="request-meta">
            <span>${ICONS.calendar} Старт ${esc(isoToRu(request.date))}</span>
            <span>${ICONS.clock} ${esc(TIMES[request.time] || "—")}</span>
            <span>${ICONS.card} ${esc(PAYMENTS[request.payment] || "—")}</span>
          </div>
        </div>
        <div class="request-card__side">
          <span class="price">${money(t.price)}<small>стоимость курса</small></span>
          <div class="request-card__action">${action}</div>
        </div>
      </article>`;
  }

  function initAccount() {
    const session = getSession();
    if (!session || session.role !== "user") {
      goLogin("account.html");
      return;
    }
    const user = getUser(session.userId);
    if (!user) {
      clearSession();
      goLogin("account.html");
      return;
    }

    /* профиль */
    $$("[data-user-name]").forEach((el) => (el.textContent = user.fullName));
    $$("[data-user-login]").forEach((el) => (el.textContent = "@" + user.login));
    $$("[data-user-email]").forEach((el) => (el.textContent = user.email));
    $$("[data-user-phone]").forEach((el) => (el.textContent = user.phone));
    $$("[data-user-birth]").forEach((el) => (el.textContent = user.birthDate));
    $$("[data-user-initials]").forEach((el) => (el.textContent = initials(user.fullName)));

    const list = userRequests(user.id);
    const counts = {
      all: list.length,
      new: list.filter((r) => r.status === "new").length,
      progress: list.filter((r) => r.status === "progress").length,
      done: list.filter((r) => r.status === "done").length,
    };
    $$("[data-count-total]").forEach((el) => (el.textContent = counts.all));
    $$("[data-count-progress]").forEach((el) => (el.textContent = counts.progress));
    $$("[data-count-done]").forEach((el) => (el.textContent = counts.done));
    $$("[data-count-requests]").forEach((el) => (el.textContent = counts.all));
    $$("[data-count-reviews]").forEach((el) => (el.textContent = db.reviews.filter((r) => r.userId === user.id).length));

    /* вкладки */
    const tabs = $$(".tab[data-tab]");
    const panels = $$("[data-panel]");
    function activateTab(name) {
      tabs.forEach((t) => {
        const on = t.dataset.tab === name;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach((p) => (p.hidden = p.dataset.panel !== name));
    }
    tabs.forEach((t) => t.addEventListener("click", () => activateTab(t.dataset.tab)));
    activateTab("requests");

    /* список заявок */
    const requestsHost = $("[data-requests-list]");
    function renderRequests() {
      const items = userRequests(user.id);
      if (!items.length) {
        requestsHost.innerHTML = `<div class="empty">
            <div class="empty__icon">${ICONS.boat}</div>
            <h3>Заявок пока нет</h3>
            <p>Выберите направление — катер, круизный лайнер или яхта — и запишитесь на ближайший поток.</p>
            <a class="btn btn--primary" href="request.html" style="margin-top:18px">Оформить заявку</a>
          </div>`;
        return;
      }
      requestsHost.innerHTML = items.map(requestCardHTML).join("");
      $$("[data-review]", requestsHost).forEach((btn) => {
        btn.addEventListener("click", () => openReview(btn.dataset.review));
      });
    }
    renderRequests();

    /* отзывы */
    const reviewsHost = $("[data-reviews-list]");
    function renderReviews() {
      const items = db.reviews
        .filter((r) => r.userId === user.id)
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
      if (!items.length) {
        reviewsHost.innerHTML = `<div class="empty">
            <div class="empty__icon">${ICONS.star}</div>
            <h3>Отзывов ещё нет</h3>
            <p>Отзыв можно оставить после того, как администратор завершит обучение по заявке.</p>
          </div>`;
        return;
      }
      reviewsHost.innerHTML = items
        .map((review) => {
          const req = db.requests.find((r) => r.id === review.requestId);
          const t = req ? TRANSPORT[req.transport] : null;
          const stars = Array.from({ length: 5 }, (_, i) => `<span class="${i < review.rating ? "" : "is-off"}">${ICONS.star}</span>`).join("");
          return `<article class="card card--pad">
              <div class="review-card__head" style="justify-content:space-between">
                <div style="display:flex;gap:12px;align-items:center">
                  <span class="avatar">${esc(initials(user.fullName))}</span>
                  <div>
                    <div class="review-card__name">${esc(t ? t.title : "Курс")}</div>
                    <div class="review-card__meta">Заявка № ${esc(req ? req.number : "—")} · ${esc(isoToRu(review.createdAt.slice(0, 10)))}</div>
                  </div>
                </div>
                <span class="rating">${stars}</span>
              </div>
              <p style="margin:0">${esc(review.text)}</p>
            </article>`;
        })
        .join("");
    }
    renderReviews();

    /* модальное окно отзыва */
    const reviewModal = $("#reviewModal");
    let currentRequestId = null;
    let rating = 0;

    function paintStars(value) {
      $$("#ratingStars button").forEach((btn, i) => {
        btn.classList.toggle("is-active", i < value);
        btn.setAttribute("aria-pressed", i < value ? "true" : "false");
      });
    }
    $$("#ratingStars button").forEach((btn) => {
      btn.addEventListener("click", () => {
        rating = Number(btn.dataset.value);
        paintStars(rating);
        const field = fieldOf(btn);
        if (field) field.classList.remove("has-error");
      });
    });

    function openReview(requestId) {
      const request = db.requests.find((r) => r.id === requestId);
      if (!request || request.status !== "done" || request.userId !== user.id) return;
      currentRequestId = requestId;
      rating = 0;
      paintStars(0);
      $("#reviewForm").reset();
      $("#reviewRequestInfo").textContent = `Заявка № ${request.number} · ${TRANSPORT[request.transport].title}`;
      setError($("#reviewText"), "");
      openModal(reviewModal);
    }

    $("#reviewForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = $("#reviewText");
      let ok = true;
      if (!rating) {
        fieldOf($("#ratingStars")).classList.add("has-error");
        $("#ratingError").textContent = "Поставьте оценку от 1 до 5";
        ok = false;
      } else {
        fieldOf($("#ratingStars")).classList.remove("has-error");
      }
      if (text.value.trim().length < 15) {
        setError(text, "Расскажите подробнее — минимум 15 символов");
        ok = false;
      } else {
        setError(text, "");
      }
      if (!ok) {
        toast({ type: "error", title: "Отзыв не отправлен", text: "Поставьте оценку и напишите хотя бы 15 символов." });
        return;
      }
      const request = db.requests.find((r) => r.id === currentRequestId);
      db.reviews.push({
        id: uid("rev"),
        userId: user.id,
        requestId: currentRequestId,
        transport: request.transport,
        rating,
        text: text.value.trim(),
        createdAt: isoNow(),
        published: true,
      });
      saveDB();
      closeModal(reviewModal);
      renderRequests();
      renderReviews();
      $$("[data-count-reviews]").forEach((el) => (el.textContent = db.reviews.filter((r) => r.userId === user.id).length));
      toast({ type: "success", title: "Спасибо за отзыв!", text: "Он уже опубликован в вашем кабинете." });
      activateTab("reviews");
    });

    $$("[data-action='new-request']").forEach((btn) =>
      btn.addEventListener("click", () => redirect("request.html"))
    );
  }

  /* ---------------- 12. Страница: оформление заявки ---------------- */
  function initRequestPage() {
    const session = getSession();
    if (!session || session.role !== "user") {
      goLogin("request.html");
      return;
    }
    const user = getUser(session.userId);
    const form = $("#requestForm");
    if (!form) return;

    const transportSelect = $("#reqTransport");
    const dateInput = $("#reqDate");
    const timeSelect = $("#reqTime");
    const paymentSelect = $("#reqPayment");
    const comment = $("#reqComment");
    const consent = $("#reqConsent");

    maskDate(dateInput);
    initLiveValidation(form);

    /* предзаполнение из query-параметра */
    const preselect = new URLSearchParams(location.search).get("transport");
    if (preselect && TRANSPORT[preselect]) transportSelect.value = preselect;

    const min = new Date();
    min.setDate(min.getDate() + 1);
    dateInput.min = `${min.getFullYear()}-${pad(min.getMonth() + 1)}-${pad(min.getDate())}`;

    function updateSummary() {
      const t = TRANSPORT[transportSelect.value] || TRANSPORT.boat;
      const img = $("[data-summary-image]");
      if (img) {
        img.src = t.image;
        img.alt = t.title;
      }
      const label = $("[data-summary-title]");
      if (label) label.textContent = t.title;
      $("[data-summary-hours]").textContent = t.hours;
      $("[data-summary-date]").textContent = dateInput.value || "не выбрана";
      $("[data-summary-time]").textContent = timeSelect.value ? TIMES[timeSelect.value].split(" · ")[0] : "не выбрано";
      $("[data-summary-payment]").textContent = paymentSelect.value ? PAYMENTS[paymentSelect.value].split(" ").slice(0, 2).join(" ") : "не выбран";
      $("[data-summary-price]").textContent = money(t.price);
    }
    [transportSelect, dateInput, timeSelect, paymentSelect].forEach((el) => {
      el.addEventListener("input", updateSummary);
      el.addEventListener("change", updateSummary);
    });
    updateSummary();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const checks = [
        [transportSelect, "transport"],
        [dateInput, "date"],
        [timeSelect, "time"],
        [paymentSelect, "payment"],
      ];
      let firstBad = null;
      checks.forEach(([input, rule]) => {
        const ok = validateField(input, rule);
        if (!ok && !firstBad) firstBad = input;
      });

      const consentField = fieldOf(consent);
      if (!consent.checked) {
        consentField.classList.add("has-error");
        consentField.querySelector(".error-text").textContent = "Подтвердите согласие на обработку данных";
      } else {
        consentField.classList.remove("has-error");
      }

      if (firstBad || !consent.checked) {
        toast({ type: "error", title: "Заявка не создана", text: "Заполните обязательные поля формы." });
        firstBad?.focus();
        return;
      }

      const btn = $('button[type="submit"]', form);
      setLoading(btn, true);

      setTimeout(() => {
        const nextNumber = db.requests.reduce((max, r) => Math.max(max, Number(r.number) || 0), 1000) + 1;
        const request = {
          id: uid("req"),
          number: nextNumber,
          userId: user.id,
          transport: transportSelect.value,
          date: ruToIso(dateInput.value),
          time: timeSelect.value,
          payment: paymentSelect.value,
          comment: comment.value.trim(),
          status: "new",
          createdAt: isoNow(),
        };
        db.requests.push(request);
        saveDB();
        setLoading(btn, false);

        /* экран успеха */
        form.hidden = true;
        const success = $("#requestSuccess");
        success.hidden = false;
        $("#successNumber").textContent = `№ ${request.number}`;
        $("#successDetails").textContent = `${TRANSPORT[request.transport].title} · старт ${request.date.split("-").reverse().join(".")} · ${TIMES[request.time]}`;
        $(".summary")?.setAttribute("hidden", "");
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast({ type: "success", title: "Заявка отправлена", text: `Заявка № ${request.number} ожидает подтверждения администратора.` });
      }, 480);
    });

    $$("[data-new-request]").forEach((btn) =>
      btn.addEventListener("click", () => {
        window.location.reload();
      })
    );
  }

  /* ---------------- 13. Страница: панель администратора ---------------- */
  function initAdmin() {
    const gate = $("[data-admin-gate]");
    const app = $("[data-admin-app]");
    if (!gate || !app) return;

    const gateForm = $("#adminLoginForm");
    function showApp() {
      gate.hidden = true;
      app.hidden = false;
      $("[data-admin-login]").textContent = "Admin26";
      renderAdmin();
    }

    gateForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      const login = $("#adminLogin").value.trim();
      const pass = $("#adminPassword").value;
      const btn = $('button[type="submit"]', gateForm);
      setLoading(btn, true);
      setTimeout(() => {
        setLoading(btn, false);
        if (login === "Admin26" && pass === "Demo20") {
          setSession({ role: "admin", login: "Admin26", startedAt: isoNow() });
          toast({ type: "success", title: "Доступ разрешён", text: "Добро пожаловать в панель управления." });
          showApp();
        } else {
          setError($("#adminLogin"), "Неверный логин или пароль");
          setError($("#adminPassword"), "Неверный логин или пароль");
          toast({ type: "error", title: "Доступ запрещён", text: "Проверьте логин и пароль администратора." });
        }
      }, 420);
    });

    /* --- состояние таблицы --- */
    const state = { status: "all", transport: "all", sort: "created-desc", query: "", page: 1, perPage: 6 };
    let pendingChange = null;

    const rows = () => {
      let items = db.requests.slice();
      if (state.status !== "all") items = items.filter((r) => r.status === state.status);
      if (state.transport !== "all") items = items.filter((r) => r.transport === state.transport);
      if (state.query) {
        const q = state.query.toLowerCase();
        items = items.filter((r) => {
          const u = getUser(r.userId);
          return (
            String(r.number).includes(q) ||
            (u && (u.fullName.toLowerCase().includes(q) || u.login.toLowerCase().includes(q) || u.phone.includes(q) || u.email.toLowerCase().includes(q)))
          );
        });
      }
      const cmp = {
        "created-desc": (a, b) => String(b.createdAt).localeCompare(String(a.createdAt)),
        "created-asc": (a, b) => String(a.createdAt).localeCompare(String(b.createdAt)),
        "date-asc": (a, b) => String(a.date).localeCompare(String(b.date)),
        "date-desc": (a, b) => String(b.date).localeCompare(String(a.date)),
        "status-asc": (a, b) => STATUS[a.status].order - STATUS[b.status].order || String(b.createdAt).localeCompare(String(a.createdAt)),
        "status-desc": (a, b) => STATUS[b.status].order - STATUS[a.status].order || String(b.createdAt).localeCompare(String(a.createdAt)),
        "name-asc": (a, b) => {
          const ua = getUser(a.userId)?.fullName || "";
          const ub = getUser(b.userId)?.fullName || "";
          return ua.localeCompare(ub, "ru");
        },
        "name-desc": (a, b) => {
          const ua = getUser(a.userId)?.fullName || "";
          const ub = getUser(b.userId)?.fullName || "";
          return ub.localeCompare(ua, "ru");
        },
      };
      return items.sort(cmp[state.sort] || cmp["created-desc"]);
    };

    function statusOptions(selected) {
      return Object.entries(STATUS)
        .map(([key, val]) => `<option value="${key}"${key === selected ? " selected" : ""}>${val.label}</option>`)
        .join("");
    }

    function rowHTML(request) {
      const user = getUser(request.userId);
      const t = TRANSPORT[request.transport] || TRANSPORT.boat;
      return `<tr data-row="${request.id}">
          <td data-label="Заявка"><span class="cell-num">№ ${esc(request.number)}</span><br><span class="cell-user__sub">${esc(isoToRu(request.createdAt.slice(0, 10)))}</span></td>
          <td data-label="Клиент">
            <div class="cell-user">
              <span class="avatar">${esc(initials(user?.fullName || "?"))}</span>
              <div>
                <div class="cell-user__name">${esc(user?.fullName || "Пользователь удалён")}</div>
                <div class="cell-user__sub">@${esc(user?.login || "—")} · ${esc(user?.phone || "")}</div>
              </div>
            </div>
          </td>
          <td data-label="Транспорт">
            <span class="chip">${ICONS[t.icon]} ${esc(t.title)}</span>
          </td>
          <td data-label="Старт">${esc(isoToRu(request.date))}<br><span class="cell-user__sub">${esc(TIMES[request.time] || "")}</span></td>
          <td data-label="Оплата"><span class="cell-user__sub" style="display:block;max-width:170px">${esc(PAYMENTS[request.payment] || "—")}</span></td>
          <td data-label="Статус">
            <select class="select status-select" data-status="${request.status}" data-status-select="${request.id}" aria-label="Статус заявки № ${request.number}">
              ${statusOptions(request.status)}
            </select>
          </td>
          <td data-label="Действия">
            <div class="row-actions">
              <button class="icon-btn" type="button" data-view="${request.id}" title="Подробнее" aria-label="Подробнее о заявке № ${request.number}">${ICONS.eye}</button>
              <button class="icon-btn icon-btn--danger" type="button" data-delete="${request.id}" title="Удалить" aria-label="Удалить заявку № ${request.number}">${ICONS.trash}</button>
            </div>
          </td>
        </tr>`;
    }

    function renderStats() {
      const all = db.requests;
      $("[data-stat-all]").textContent = all.length;
      $$("[data-stat-all-inline]").forEach((el) => (el.textContent = all.length));
      $("[data-stat-new]").textContent = all.filter((r) => r.status === "new").length;
      $("[data-stat-progress]").textContent = all.filter((r) => r.status === "progress").length;
      $("[data-stat-done]").textContent = all.filter((r) => r.status === "done").length;
      $("[data-stat-clients]").textContent = new Set(all.map((r) => r.userId)).size;
      $("[data-stat-reviews]").textContent = db.reviews.length;
      const revenue = all.filter((r) => r.status !== "new").reduce((sum, r) => sum + (TRANSPORT[r.transport]?.price || 0), 0);
      $("[data-stat-revenue]").textContent = money(revenue);
    }

    function renderTable() {
      const items = rows();
      const pages = Math.max(1, Math.ceil(items.length / state.perPage));
      state.page = Math.min(state.page, pages);
      const start = (state.page - 1) * state.perPage;
      const slice = items.slice(start, start + state.perPage);

      const tbody = $("[data-admin-rows]");
      tbody.innerHTML = slice.map(rowHTML).join("");
      $("[data-admin-table]").hidden = items.length === 0;
      $("[data-admin-empty]").hidden = items.length !== 0;

      const from = items.length ? start + 1 : 0;
      const to = Math.min(start + state.perPage, items.length);
      $("[data-page-info]").textContent = `Показано ${from}–${to} из ${items.length} заявок`;

      /* пагинация */
      const list = $("[data-page-list]");
      let buttons = `<button class="page-btn" type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} aria-label="Предыдущая страница">${ICONS.left}</button>`;
      for (let p = 1; p <= pages; p++) {
        buttons += `<button class="page-btn${p === state.page ? " is-active" : ""}" type="button" data-page="${p}" aria-label="Страница ${p}" ${p === state.page ? 'aria-current="page"' : ""}>${p}</button>`;
      }
      buttons += `<button class="page-btn" type="button" data-page="${state.page + 1}" ${state.page === pages ? "disabled" : ""} aria-label="Следующая страница">${ICONS.right}</button>`;
      list.innerHTML = buttons;

      /* сортировка в заголовках */
      $$("[data-admin-table] th[data-sort]").forEach((th) => {
        const [field, dir] = state.sort.split("-");
        const active = th.dataset.sort === field;
        th.setAttribute("aria-sort", active ? (dir === "asc" ? "ascending" : "descending") : "none");
        const ind = $(".sort-ind", th);
        if (ind) ind.textContent = active ? (dir === "asc" ? "▲" : "▼") : "▲▼";
      });

      bindTableEvents();
    }

    function bindTableEvents() {
      $$("[data-status-select]").forEach((select) => {
        select.addEventListener("change", () => {
          const request = db.requests.find((r) => r.id === select.dataset.statusSelect);
          if (!request) return;
          openStatusConfirm(request, select);
        });
      });
      $$("[data-view]").forEach((btn) => btn.addEventListener("click", () => openDetails(btn.dataset.view)));
      $$("[data-delete]").forEach((btn) => btn.addEventListener("click", () => openDelete(btn.dataset.delete)));
    }

    function renderAdmin() {
      renderStats();
      renderTable();
    }

    /* --- модальные окна --- */
    function openStatusConfirm(request, select) {
      const user = getUser(request.userId);
      pendingChange = { request, select, previous: request.status, next: select.value };
      $("#statusModalText").innerHTML = `Изменить статус заявки <b>№ ${esc(request.number)}</b> (${esc(user?.fullName || "клиент")}) на <b>«${esc(STATUS[select.value].label)}»</b>?`;
      openModal("statusModal");
    }
    $("#statusModalConfirm")?.addEventListener("click", () => {
      if (!pendingChange) return;
      const { request, next } = pendingChange;
      request.status = next;
      saveDB();
      closeModal("statusModal");
      pendingChange = null;
      renderAdmin();
      const user = getUser(request.userId);
      toast({
        type: "success",
        title: "Статус обновлён",
        text: `Заявка № ${request.number} · ${STATUS[next].label}`,
      });
      if (next === "done" && user) {
        toast({ type: "info", title: "Клиенту доступен отзыв", text: `${user.fullName.split(" ").slice(0, 2).join(" ")} может оставить отзыв в кабинете.`, timeout: 5200 });
      }
    });
    $("#statusModal")?.addEventListener("click", (e) => {
      if ((e.target.closest("[data-modal-close]") || e.target.classList.contains("modal__overlay")) && pendingChange) {
        pendingChange.select.value = pendingChange.previous;
        pendingChange = null;
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && pendingChange) {
        pendingChange.select.value = pendingChange.previous;
        pendingChange = null;
      }
    });

    function openDetails(id) {
      const request = db.requests.find((r) => r.id === id);
      if (!request) return;
      const user = getUser(request.userId);
      const t = TRANSPORT[request.transport];
      const review = db.reviews.find((r) => r.requestId === id);
      $("#detailNumber").textContent = `Заявка № ${request.number}`;
      $("#detailBody").innerHTML = `
        <div><span>Клиент</span><b>${esc(user?.fullName || "—")}</b></div>
        <div><span>Логин</span><b>@${esc(user?.login || "—")}</b></div>
        <div><span>Телефон</span><b>${esc(user?.phone || "—")}</b></div>
        <div><span>E-mail</span><b>${esc(user?.email || "—")}</b></div>
        <div><span>Дата рождения</span><b>${esc(user?.birthDate || "—")}</b></div>
        <div><span>Транспорт</span><b>${esc(t?.title || "—")}</b></div>
        <div><span>Старт обучения</span><b>${esc(isoToRu(request.date))}</b></div>
        <div><span>Время</span><b>${esc(TIMES[request.time] || "—")}</b></div>
        <div><span>Оплата</span><b>${esc(PAYMENTS[request.payment] || "—")}</b></div>
        <div><span>Стоимость</span><b>${money(t?.price || 0)}</b></div>
        <div><span>Статус</span><b>${esc(STATUS[request.status].label)}</b></div>
        <div><span>Создана</span><b>${esc(isoToRu(request.createdAt.slice(0, 10)))}</b></div>
        <div><span>Комментарий</span><b>${esc(request.comment || "—")}</b></div>
        <div><span>Отзыв</span><b>${review ? "★".repeat(review.rating) + " — " + esc(review.text.slice(0, 60)) + "…" : "нет"}</b></div>`;
      openModal("detailModal");
    }

    function openDelete(id) {
      const request = db.requests.find((r) => r.id === id);
      if (!request) return;
      $("#deleteModalText").innerHTML = `Удалить заявку <b>№ ${request.number}</b>? Действие нельзя отменить.`;
      const confirmBtn = $("#deleteModalConfirm");
      confirmBtn.onclick = () => {
        db.requests = db.requests.filter((r) => r.id !== id);
        db.reviews = db.reviews.filter((r) => r.requestId !== id);
        saveDB();
        closeModal("deleteModal");
        renderAdmin();
        toast({ type: "success", title: "Заявка удалена", text: `Заявка № ${request.number} удалена из базы.` });
      };
      openModal("deleteModal");
    }

    /* --- фильтры и поиск --- */
    $("#adminStatusFilter")?.addEventListener("change", (e) => {
      state.status = e.target.value;
      state.page = 1;
      renderTable();
    });
    $("#adminTransportFilter")?.addEventListener("change", (e) => {
      state.transport = e.target.value;
      state.page = 1;
      renderTable();
    });
    $("#adminSort")?.addEventListener("change", (e) => {
      state.sort = e.target.value;
      state.page = 1;
      renderTable();
    });
    let searchTimer = null;
    $("#adminSearch")?.addEventListener("input", (e) => {
      clearTimeout(searchTimer);
      const value = e.target.value.trim();
      searchTimer = setTimeout(() => {
        state.query = value;
        state.page = 1;
        renderTable();
      }, 220);
    });
    $("[data-admin-reset]")?.addEventListener("click", () => {
      state.status = "all";
      state.transport = "all";
      state.sort = "created-desc";
      state.query = "";
      state.page = 1;
      $("#adminStatusFilter").value = "all";
      $("#adminTransportFilter").value = "all";
      $("#adminSort").value = "created-desc";
      $("#adminSearch").value = "";
      renderTable();
      toast({ type: "info", title: "Фильтры сброшены", text: "Показаны все заявки." });
    });
    $("[data-page-list]")?.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-page]");
      if (!btn || btn.disabled) return;
      state.page = Number(btn.dataset.page);
      renderTable();
      window.scrollTo({ top: $(".admin-panel").offsetTop - 90, behavior: "smooth" });
      setTimeout(() => {
        $("[data-admin-table]")?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 60);
    });
    $$("[data-admin-table] th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const field = th.dataset.sort;
        const [curField, curDir] = state.sort.split("-");
        const nextDir = curField === field && curDir === "asc" ? "desc" : "asc";
        state.sort = `${field}-${nextDir}`;
        if (Array.from($("#adminSort").options).some((o) => o.value === state.sort)) $("#adminSort").value = state.sort;
        state.page = 1;
        renderTable();
      });
    });
    $("[data-admin-logout]")?.addEventListener("click", () => {
      clearSession();
      flash.set({ type: "success", title: "Сеанс завершён", text: "Панель администратора закрыта." });
      redirect("index.html");
    });

    /* --- защита раздела --- */
    const session = getSession();
    if (session && session.role === "admin") showApp();
    else {
      gate.hidden = false;
      app.hidden = true;
    }
  }

  /* ---------------- 14. Инициализация ---------------- */
  function boot() {
    initHeader();
    renderHeaderAuth();
    initModals();
    initReveal();
    initFaq();
    attachPasswordToggle();
    $$("[data-slider]").forEach(initSlider);
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

    const page = document.body.dataset.page;
    if (page === "home") initHome();
    if (page === "login") initLogin();
    if (page === "register") initRegister();
    if (page === "account") initAccount();
    if (page === "request") initRequestPage();
    if (page === "admin") initAdmin();

    showFlash();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
