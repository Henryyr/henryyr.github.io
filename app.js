"use strict";

/* =========================================
   TRANSLATIONS
========================================= */

const translations = {
  id: {
    skip: "Langsung ke konten",
    bio: "Saya membangun API, merangkai logika bisnis, dan menguji aplikasi. Fokus pada kode yang jelas dan sistem yang mudah dirawat.",
    education: "Manajemen Informatika",
    projectsTitle: "Proyek pilihan",
    allRepos: "Lihat semua",
    salon:
      "Backend booking salon dengan voucher, stok produk, dan pembayaran Midtrans.",
    villa:
      "API penyewaan properti dengan autentikasi, hak akses, booking, dan favorit.",
    gaet: "Aplikasi katalog dan portofolio untuk driver serta guide wisata.",
    leaderboard:
      "Eksperimen peringkat real-time dengan Redis dan koneksi WebSocket.",
    inventory:
      "Proyek belajar pengelolaan item, stok, dan pengguna dengan NestJS dan Prisma.",
    toolsTitle: "Tools sehari-hari",
    backTop: "Ke atas ↑",
    description:
      "Henry Yusuf Rizaldy — Backend Developer & QA. Profil dan proyek pilihan dari GitHub.",
    experienceTitle: "Pengalaman",
    reportTitle: "Laporan pekerjaan",
    reportHeading: "Di balik setiap baris kode",
    reportDescription:
      "Dokumentasi pekerjaan dan kontribusi pengembangan aplikasi selama Januari–September 2026. Mencakup pengembangan backend, aplikasi mobile, serta dashboard.",
    reportCaption: "Karya pilihan · 2026",
    reportButton: "Lihat laporan",
  },

  en: {
    skip: "Skip to content",
    bio: "I build APIs, connect business logic, and test applications. My focus is on clear code and maintainable systems.",
    education: "Informatics Management",
    projectsTitle: "Selected projects",
    allRepos: "View all",
    salon:
      "A salon booking backend with vouchers, product inventory, and Midtrans payments.",
    villa:
      "A property rental API with authentication, permissions, bookings, and favorites.",
    gaet: "A catalog and portfolio app for drivers and tour guides.",
    leaderboard:
      "A real-time leaderboard experiment using Redis and WebSocket connections.",
    inventory:
      "A study project exploring items, stock, and users with NestJS and Prisma.",
    toolsTitle: "Everyday tools",
    backTop: "Back to top ↑",
    description:
      "Henry Yusuf Rizaldy — Backend Developer & QA. Profile and selected GitHub projects.",
    experienceTitle: "Experience",
    reportTitle: "Work report",
    reportHeading: "A look into the work behind the code",
    reportDescription:
      "A documentation of my work and contributions to application development from January to September 2026, covering backend development, mobile applications, and dashboard development.",
    reportCaption: "Selected work · 2026",
    reportButton: "View report",
  },
};

/* =========================================
   STORAGE
========================================= */

const LANGUAGE_KEY = "henry-language";
const THEME_KEY = "henry-theme";

function getStoredPreference(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function savePreference(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Continue without persistent storage.
  }
}

/* =========================================
   INITIAL STATE
========================================= */

const savedLanguage = getStoredPreference(LANGUAGE_KEY);

let language =
  savedLanguage === "id" || savedLanguage === "en" ? savedLanguage : "id";

const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const savedTheme = getStoredPreference(THEME_KEY);

let theme =
  savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : systemTheme.matches
      ? "dark"
      : "light";

/* =========================================
   DOM ELEMENTS
========================================= */

const languageButton = document.querySelector("#language-button");
const themeButton = document.querySelector("#theme-button");
const themeIcon = themeButton.querySelector(".theme-icon");
const experienceContainer = document.querySelector("#experience-list");

/* =========================================
   EXPERIENCE HELPERS
========================================= */

function formatExperienceDate(value, lang) {
  if (typeof value !== "string") {
    return "";
  }

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) {
    return value;
  }

  const locale = lang === "id" ? "id-ID" : "en-US";
  const date = new Date(`${value}-01T00:00:00Z`);

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function createExperienceDate(value) {
  const time = document.createElement("time");
  time.dateTime = value;
  time.textContent = formatExperienceDate(value, language);
  return time;
}

function createExperienceDateRange(startDate, endDate) {
  const range = document.createElement("span");
  range.className = "experience-date";

  range.append(createExperienceDate(startDate), " – ");

  if (endDate) {
    range.append(createExperienceDate(endDate));
  } else {
    const present = document.createElement("span");
    present.textContent = language === "id" ? "Sekarang" : "Present";

    range.append(present);
  }

  return range;
}

function getCompanyPeriod(positions) {
  const startDates = positions
    .map((position) => position.startDate)
    .filter(Boolean)
    .sort();

  const startDate = startDates[0];

  const hasCurrentPosition = positions.some(
    (position) => position.endDate == null,
  );

  const endDates = positions
    .map((position) => position.endDate)
    .filter(Boolean)
    .sort();

  const endDate = hasCurrentPosition ? null : (endDates.at(-1) ?? null);

  return { startDate, endDate };
}

/* =========================================
   EXPERIENCE RENDERER
========================================= */

function renderExperiences() {
  if (!experienceContainer) return;

  const fragment = document.createDocumentFragment();

  if (typeof experiences === "undefined" || !Array.isArray(experiences)) {
    console.error("experiences.js is missing or invalid.");
    experienceContainer.replaceChildren();
    return;
  }

  let companyNumber = 0;

  experiences.forEach((experience) => {
    const { company, linkedin, positions } = experience;

    if (!Array.isArray(positions) || positions.length === 0) {
      return;
    }

    const { startDate, endDate } = getCompanyPeriod(positions);

    if (!startDate) return;

    companyNumber += 1;

    // Company container
    const article = document.createElement("article");
    article.className = "experience-row";

    // Company number
    const number = document.createElement("span");
    number.className = "project-number";
    number.setAttribute("aria-hidden", "true");
    number.textContent = String(companyNumber).padStart(2, "0");

    // Company information
    const info = document.createElement("div");
    info.className = "experience-info";

    // Company header
    const header = document.createElement("div");
    header.className = "experience-company-header";

    const companyName = document.createElement("h3");

    // LinkedIn link is optional
    if (typeof linkedin === "string" && /^https?:\/\//i.test(linkedin)) {
      const link = document.createElement("a");

      link.href = linkedin;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "experience-company-link";
      link.textContent = company;

      const arrow = document.createElement("span");
      arrow.textContent = " ↗";
      arrow.setAttribute("aria-hidden", "true");

      link.append(arrow);
      companyName.append(link);
    } else {
      companyName.textContent = company;
    }

    const companyPeriod = createExperienceDateRange(startDate, endDate);

    header.append(companyName, companyPeriod);

    // Timeline
    const timeline = document.createElement("div");
    timeline.className = "experience-timeline";

    // Sort most recent positions first without changing source data
    const sortedPositions = [...positions].sort((a, b) =>
      b.startDate.localeCompare(a.startDate),
    );

    sortedPositions.forEach((position) => {
      const item = document.createElement("div");
      item.className = "experience-position";

      const role = document.createElement("h4");
      role.textContent = position.role;

      const period = createExperienceDateRange(
        position.startDate,
        position.endDate,
      );

      item.append(role, period);
      timeline.append(item);
    });

    info.append(header, timeline);
    article.append(number, info);
    fragment.append(article);
  });

  experienceContainer.replaceChildren(fragment);
}

/* =========================================
   THEME ICONS
========================================= */

const icons = {
  sun: `
        <circle cx="12" cy="12" r="4"></circle>
        <path
            d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        ></path>
    `,

  moon: `
        <path
            d="M20.985 12.486A9 9 0 0 1 11.514 3.015a9 9 0 1 0 9.47 9.47Z"
        ></path>
    `,
};

/* =========================================
   UPDATE THEME BUTTON
========================================= */

function updateThemeButton() {
  const isDark = theme === "dark";

  themeIcon.innerHTML = isDark ? icons.moon : icons.sun;

  const label =
    language === "id"
      ? isDark
        ? "Aktifkan mode terang"
        : "Aktifkan mode gelap"
      : isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

  themeButton.setAttribute("aria-label", label);
  themeButton.setAttribute("title", label);
  themeButton.setAttribute("aria-pressed", String(isDark));
}

/* =========================================
   APPLY THEME
========================================= */

function applyTheme() {
  document.documentElement.dataset.theme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');

  if (themeColor) {
    themeColor.content = theme === "dark" ? "#141a17" : "#ffffff";
  }

  updateThemeButton();
}

/* =========================================
   APPLY LANGUAGE
========================================= */

function applyLanguage() {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const translated = translations[language][key];

    if (translated !== undefined) {
      element.textContent = translated;
    }
  });

  document
    .querySelector("#language-id")
    .classList.toggle("active", language === "id");

  document
    .querySelector("#language-en")
    .classList.toggle("active", language === "en");

  languageButton.setAttribute(
    "aria-label",
    language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia",
  );

  const metaDescription = document.querySelector('meta[name="description"]');

  const ogDescription = document.querySelector(
    'meta[property="og:description"]',
  );

  if (metaDescription) {
    metaDescription.content = translations[language].description;
  }

  if (ogDescription) {
    ogDescription.content = translations[language].description;
  }

  updateThemeButton();
}

/* =========================================
   EVENT LISTENERS
========================================= */

languageButton.addEventListener("click", () => {
  language = language === "id" ? "en" : "id";

  savePreference(LANGUAGE_KEY, language);
  applyLanguage();
});

themeButton.addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";

  savePreference(THEME_KEY, theme);
  applyTheme();
});

systemTheme.addEventListener("change", (event) => {
  const preference = getStoredPreference(THEME_KEY);

  if (preference === "light" || preference === "dark") {
    return;
  }

  theme = event.matches ? "dark" : "light";
  applyTheme();
});

/* =========================================
   FOOTER YEAR
========================================= */

const yearElement = document.querySelector("#year");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

/* =========================================
   INITIALIZE
========================================= */

applyTheme();
applyLanguage();
renderExperiences();
