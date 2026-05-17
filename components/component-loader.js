(function () {
  function getBasePath() {
    return document.body?.dataset.basePath || "./";
  }

  function isPrimaryNavKey(key) {
    return ["home", "skills", "experience", "education", "projects", "tools", "contact"].includes(key);
  }

  function setActiveNav() {
    const activeKey = document.body?.dataset.activeNav;
    if (!activeKey) return;

    document.querySelectorAll("[data-nav-key]").forEach((item) => {
      const isToolPage = !isPrimaryNavKey(activeKey);
      const isActive = item.dataset.navKey === activeKey || (item.dataset.navKey === "tools" && isToolPage);
      item.classList.toggle("active", isActive);
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  async function populateProjectsMenu() {
    const menu = document.getElementById("projects-menu");
    if (!menu) return;

    const response = await fetch(`${getBasePath()}projects/projects.json`);
    if (!response.ok) throw new Error("Could not load projects menu.");

    const projects = await response.json();
    const items = Array.isArray(projects) ? projects : [];

    menu.innerHTML = items
      .filter((project) => project && project.slug && project.path && project.title)
      .map((project) => {
        const href = `${getBasePath()}${project.path}`;
        return `<li><a href="${escapeHtml(href)}" class="nav-link" data-nav-key="${escapeHtml(project.slug)}">${escapeHtml(project.title)}</a></li>`;
      })
      .join("");
  }

  function initNavMenu() {
    const navMenu = document.getElementById("nav-menu");
    const hamburger = document.getElementById("hamburger");
    const closeMenu = document.getElementById("close-menu");
    const navLinks = document.querySelectorAll("a.nav-link");

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", () => navMenu.classList.add("active"));
    }

    if (closeMenu && navMenu) {
      closeMenu.addEventListener("click", () => navMenu.classList.remove("active"));
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu) navMenu.classList.remove("active");
      });
    });
  }

  function getNestedTranslation(obj, path) {
    return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
  }

  function applyComponentI18n(lang) {
    const translations = window.translations || {};

    document.querySelectorAll(".navbar [data-i18n], .site-footer [data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = getNestedTranslation(translations[lang] || {}, key);
      if (typeof translation === "string") {
        el.textContent = translation;
      }
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
  }

  function initComponentLanguage() {
    const translations = window.translations || {};
    if (!Object.keys(translations).length) return;

    const preferredLang = localStorage.getItem("preferredLang");
    const initialLang = preferredLang || (navigator.language && navigator.language.startsWith("es") ? "es" : "en");

    applyComponentI18n(initialLang);

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        localStorage.setItem("preferredLang", lang);
        applyComponentI18n(lang);
      });
    });
  }

  async function loadComponent(host) {
    const src = host.dataset.component;
    if (!src) return;

    const response = await fetch(src);
    if (!response.ok) throw new Error(`Could not load component: ${src}`);

    const html = await response.text();
    host.outerHTML = html.split("{{base}}").join(getBasePath());
  }

  window.componentsReady = new Promise((resolve) => {
    document.addEventListener("DOMContentLoaded", async () => {
      const hosts = Array.from(document.querySelectorAll("[data-component]"));

      try {
        await Promise.all(hosts.map(loadComponent));
        await populateProjectsMenu();
        setActiveNav();
        initNavMenu();
        initComponentLanguage();
        if (window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
        }
      } catch (error) {
        console.error(error);
      } finally {
        resolve();
      }
    });
  });
})();
