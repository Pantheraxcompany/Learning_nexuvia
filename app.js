// DATABASE USERNAME
const USERNAMES = [
  "ERMI",
  "NADIA",
  "REGINA",
  "NUR LAILA",
  "NIZAM",
  "SYIFA",
  "ANISA",
  "NOVI",
  "AULIA",
  "ANDITA",
  "HAIKAL",
  "ALDI",
  "AINI",
  "ARSYA",
  "AURA",
  "AZARIA",
  "ELVIRA",
  "KHODIJAH",
  "TAZKIA",
  "TISNA"
];

const DEFAULT_PASSWORD = "nexuviaacademy";

// DATA MATERI – sekarang cuma 2
const materials = [
  {
    id: 1,
    title: "[FM] Bilangan Bulat & Operasi Dasar",
    category: "MTK",
    code: "FM",
    video: true,
    pdf: true,
    soal: true,
    pembahasan: true,
    done: false,
    videoUrl: "https://youtu.be/hJOx7CGAWaA?si=7-ZoaWInsQ7p1Fwh",
  },
  {
    id: 7,
    title: "[BS] Bahas Soal TKA SMP 2026",
    category: "MTK",
    code: "BS",
    video: true,
    pdf: false,
    soal: true,
    pembahasan: true,
    done: false,
    videoUrl: "https://youtu.be/B-BE27W-WcY?si=y66s_sDEcAnF8ISA",
  },
];

// LOGIN
const loginForm = document.getElementById("login-form");
const loginPage = document.getElementById("login-page");
const app = document.getElementById("app");
const loginError = document.getElementById("login-error");
const greeting = document.getElementById("greeting");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

function normalizeName(str) {
  return str.trim().toUpperCase();
}

function displayNameFromUsername(raw) {
  // Capitalize tiap kata
  return raw
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const usernameRaw = usernameInput.value;
  const password = passwordInput.value.trim();

  if (!usernameRaw.trim() || !password) {
    loginError.textContent = "Isi username dan password terlebih dahulu.";
    return;
  }

  const normalized = normalizeName(usernameRaw);
  const isValidUser = USERNAMES.includes(normalized);
  const isValidPass = password === DEFAULT_PASSWORD;

  if (isValidUser && isValidPass) {
    loginError.textContent = "";
    loginPage.classList.add("hidden");
    app.classList.remove("hidden");

    const displayName = displayNameFromUsername(normalized);
    greeting.textContent = "Halo, " + displayName + " (Nexies) 👋";
  } else {
    loginError.textContent = "Username atau password salah. Cek lagi data dari Nexuvia Academy.";
  }
});

// LOGOUT BUTTON
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  app.classList.add("hidden");
  loginPage.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
  loginError.textContent = "";
  greeting.textContent = "Halo, Nexies 👋";
});

// NAV TABS
const tabs = document.querySelectorAll(".nav-tab");
const sections = {
  dashboard: document.getElementById("dashboard"),
  "materi-section": document.getElementById("materi-section"),
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    const target = tab.getAttribute("data-target");
    Object.keys(sections).forEach((key) => {
      sections[key].classList.toggle("hidden", key !== target);
    });
  });
});

// Quick access → ke materi
document.querySelectorAll(".quick-card[data-jump]").forEach((card) => {
  card.addEventListener("click", () => {
    const targetId = card.getAttribute("data-jump");
    tabs.forEach((t) => {
      if (t.getAttribute("data-target") === targetId) t.click();
    });
  });
});

// COUNTDOWN (TKA) – 25 Maret 2026
function updateCountdown(targetDate, labelElement, dateElement) {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const prefix = days <= 0 ? "H-0" : "H-" + days;
  labelElement.textContent = prefix;
  dateElement.textContent = targetDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const tkaTarget = new Date("2026-03-25T00:00:00");
updateCountdown(
  tkaTarget,
  document.getElementById("tka-count"),
  document.getElementById("tka-date")
);

// MATERI RENDER
const PAGE_SIZE = 5;
let currentPage = 1;

const categoryFilter = document.getElementById("category-filter");
const codeFilter = document.getElementById("code-filter");
const searchInput = document.getElementById("search-input");
const hideFinished = document.getElementById("hide-finished");
const materialList = document.getElementById("material-list");
const pagination = document.getElementById("pagination");

function getFilteredMaterials() {
  const cat = categoryFilter.value;
  const code = codeFilter.value;
  const search = searchInput.value.trim().toLowerCase();
  return materials.filter((m) => {
    if (m.category !== cat) return false;
    if (code !== "all" && m.code !== code) return false;
    if (hideFinished.checked && m.done) return false;
    if (search && !m.title.toLowerCase().includes(search)) return false;
    return true;
  });
}

function renderMaterials() {
  const filtered = getFilteredMaterials();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  materialList.innerHTML = "";
  pageItems.forEach((m) => {
    const item = document.createElement("div");
    item.className = "material-item";

    const top = document.createElement("div");
    top.className = "material-top";

    const title = document.createElement("div");
    title.className = "material-title";
    title.textContent = m.title;

    const badges = document.createElement("div");
    badges.className = "material-badges";

    const codeBadge = document.createElement("div");
    codeBadge.className = "badge-code";
    codeBadge.textContent = `[${m.code}]`;
    badges.appendChild(codeBadge);

    if (m.done) {
      const doneBadge = document.createElement("div");
      doneBadge.className = "badge-code";
      doneBadge.textContent = "Selesai";
      badges.appendChild(doneBadge);
    }

    top.appendChild(title);
    top.appendChild(badges);

    const actions = document.createElement("div");
    actions.className = "material-actions";

    const buttons = [
      { key: "video", label: "Video" },
      { key: "pdf", label: "PDF" },
      { key: "soal", label: "Soal" },
      { key: "pembahasan", label: "Pembahasan" },
    ];

    buttons.forEach((btn) => {
      const pill = document.createElement("div");
      pill.className = "mat-pill" + (!m[btn.key] ? " disabled" : "");
      pill.textContent = btn.label;
      if (m[btn.key]) {
        pill.addEventListener("click", () => {
          if (btn.key === "video" && m.videoUrl) {
            window.open(m.videoUrl, "_blank");
          } else {
            alert(
              `Di versi asli, tombol ini akan membuka ${btn.label} untuk:\n\n${m.title}`
            );
          }
        });
      }
      actions.appendChild(pill);
    });

    item.appendChild(top);
    item.appendChild(actions);
    materialList.appendChild(item);
  });

  pagination.innerHTML = "";
  if (totalPages > 1) {
    const prev = document.createElement("button");
    prev.className = "page-btn";
    prev.textContent = "‹ Prev";
    prev.disabled = currentPage === 1;
    prev.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderMaterials();
      }
    });

    const next = document.createElement("button");
    next.className = "page-btn";
    next.textContent = "Next ›";
    next.disabled = currentPage === totalPages;
    next.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderMaterials();
      }
    });

    const pageIndicator = document.createElement("button");
    pageIndicator.className = "page-btn active";
    pageIndicator.textContent = currentPage;

    pagination.appendChild(prev);
    pagination.appendChild(pageIndicator);
    pagination.appendChild(next);
  }

  const completed = materials.filter((m) => m.done).length;
  const total = materials.length;
  document.getElementById("completed-count").textContent = completed;
  document.getElementById("total-count").textContent = total;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  document.getElementById("percent-label").textContent = percent + "%";
  document.getElementById("progress-bar").style.width = percent + "%";
}

categoryFilter.addEventListener("change", () => { currentPage = 1; renderMaterials(); });
codeFilter.addEventListener("change", () => { currentPage = 1; renderMaterials(); });
searchInput.addEventListener("input", () => { currentPage = 1; renderMaterials(); });
hideFinished.addEventListener("change", () => { currentPage = 1; renderMaterials(); });

// BUKA PLAYLIST YOUTUBE
document.getElementById("open-playlist-btn").addEventListener("click", () => {
  window.open(
    "https://youtube.com/playlist?list=PLZCsUrBsaheJe8-iql6MiD8WG9Nw1-z6b&si=YwCsjgbFz_YzDmem",
    "_blank"
  );
});

renderMaterials();