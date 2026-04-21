function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getNestedTranslation(obj, path) {
  return path.split(".").reduce((prev, curr) => (prev ? prev[curr] : null), obj);
}

function getInitials(name, lang) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) {
    return (window.translations?.[lang]?.ats?.empty?.initials || "CV").toUpperCase();
  }

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function parseParagraphBlocks(raw) {
  return raw
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatMonthYear(value, lang) {
  if (!/^\d{4}-\d{2}$/.test(String(value || ""))) return value || "";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return value;
  const locale = lang === "es" ? "es-ES" : "en-US";
  const label = date.toLocaleDateString(locale, { month: "short", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function parsePassions(raw) {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const parts = block.split("|");
      return {
        title: (parts[0] || "").trim(),
        text: (parts[1] || "").trim()
      };
    });
}

function getIconForPassion(title) {
  const t = String(title || "").toLowerCase();

  if (t.includes("desarrollo") || t.includes("web") || t.includes("development")) return "✔";
  if (t.includes("diseño") || t.includes("ui") || t.includes("design")) return "☆";
  if (t.includes("tecnología") || t.includes("aprendizaje") || t.includes("technology") || t.includes("learning")) return "✚";

  return "•";
}

function renderExperience(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.experience || "Agrega experiencia laboral.";
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  const presentLabel = window.translations?.[lang]?.ats?.experience?.present || (lang === "es" ? "Actualidad" : "Present");

  return items
    .map((item) => {
      const formattedStart = formatMonthYear(item.startDate, lang);
      const formattedEnd = item.isCurrent ? presentLabel : formatMonthYear(item.endDate, lang);
      const dateLabel = [formattedStart, formattedEnd].filter(Boolean).join(" - ");
      const bulletsHtml = item.bullets.length
        ? `<ul class="job-bullets">${item.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";

      return `
        <div class="experience-item">
          <div class="experience-top">
            <div class="experience-main">
              <div class="job-company">${escapeHtml(item.company)}</div>
              <div class="job-title">${escapeHtml(item.title)}</div>
            </div>
            <div class="experience-meta">
              <div class="experience-meta-line">
                <span class="experience-meta-icon" aria-hidden="true">📍</span>
                <span class="job-location">${escapeHtml(item.location)}</span>
              </div>
              <div class="experience-meta-line">
                <span class="experience-meta-icon" aria-hidden="true">🗓</span>
                <span class="job-date">${escapeHtml(dateLabel)}</span>
              </div>
            </div>
          </div>
          ${bulletsHtml}
        </div>
      `;
    })
    .join("");
}

function renderEducation(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.education || "Agrega educación.";
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;

  return items
    .map(
      (item) => `
        <div class="education-item">
          <div class="education-head">
            <div>
              <div class="education-school">${escapeHtml(item.degree)}</div>
              <div class="education-degree">${escapeHtml(item.institution)}</div>
            </div>
            <div>
              <div class="education-location">${escapeHtml(item.location)}</div>
              <div class="education-date">${escapeHtml(item.duration)}</div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderCertifications(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.certifications || "Agrega certificaciones.";
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  return items.map((item) => `<div class="cert-item">${escapeHtml(item)}</div>`).join("");
}

function renderPassions(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.passions || "Agrega intereses o pasiones.";
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;

  return items
    .map(
      (item) => `
        <div class="passion-item">
          <div class="passion-title">
            <span class="icon">${getIconForPassion(item.title)}</span>
            <span>${escapeHtml(item.title)}</span>
          </div>
          <div class="passion-text">${escapeHtml(item.text)}</div>
        </div>
      `
    )
    .join("");
}

function syncCurrentJobState(item) {
  const currentCheckbox = item.querySelector(".exp-current-input");
  const endInput = item.querySelector(".exp-end-input");
  if (!currentCheckbox || !endInput) return;

  if (currentCheckbox.checked) {
    endInput.value = "";
    endInput.disabled = true;
  } else {
    endInput.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const translations = window.translations || {};
  const langBtns = document.querySelectorAll(".lang-btn");
  const experienceList = document.getElementById("experienceList");
  const educationList = document.getElementById("educationList");

  const staticInputIds = ["fullName", "headline", "email", "linkedin", "location", "profile", "skills", "certifications", "passions"];

  let currentLang = localStorage.getItem("preferredLang") || "en";
  let experienceManuallyEdited = false;
  let educationManuallyEdited = false;

  if (!localStorage.getItem("preferredLang")) {
    currentLang = navigator.language && navigator.language.startsWith("es") ? "es" : "en";
  }

  function getDefaults(lang) {
    return translations?.[lang]?.ats?.defaults || {};
  }

  function applyI18n(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const translation = getNestedTranslation(translations[lang] || {}, key);
      if (typeof translation !== "string") return;
      if (key.endsWith("_html")) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    });
    document.title = translations?.[lang]?.meta?.title || document.title;
  }

  function buildExperienceItem(data = {}) {
    const item = document.createElement("div");
    item.className = "dynamic-item";
    item.innerHTML = `
      <div class="dynamic-head">
        <strong data-i18n="ats.experience.item_title">Experiencia</strong>
        <button type="button" class="item-remove-btn" data-remove="experience" data-i18n="ats.actions.remove">Eliminar</button>
      </div>
      <div class="field"><label data-i18n="ats.experience.company">Nombre empresa</label><input type="text" class="exp-company-input" value="${escapeHtml(data.company || "")}"></div>
      <div class="field"><label data-i18n="ats.experience.role">Cargo</label><input type="text" class="exp-role-input" value="${escapeHtml(data.title || "")}"></div>
      <div class="field"><label data-i18n="ats.experience.location">Lugar</label><input type="text" class="exp-location-input" value="${escapeHtml(data.location || "")}"></div>
      <div class="grid-2">
        <div class="field"><label data-i18n="ats.experience.start_date">Fecha de ingreso</label><input type="month" class="exp-start-input" value="${escapeHtml(data.startDate || "")}"></div>
        <div class="field"><label data-i18n="ats.experience.end_date">Fecha de retiro</label><input type="month" class="exp-end-input" value="${escapeHtml(data.endDate || "")}"></div>
      </div>
      <div class="checkbox-row">
        <label class="check-label">
          <input type="checkbox" class="exp-current-input" ${data.isCurrent ? "checked" : ""}>
          <span data-i18n="ats.experience.current_job">Actualmente trabajo aquí</span>
        </label>
      </div>
      <div class="field"><label data-i18n="ats.experience.bullets">Funciones (una por línea)</label><textarea class="exp-bullets-input">${escapeHtml((data.bullets || []).join("\n"))}</textarea></div>
    `;
    experienceList.appendChild(item);
    syncCurrentJobState(item);
  }

  function buildEducationItem(data = {}) {
    const item = document.createElement("div");
    item.className = "dynamic-item";
    item.innerHTML = `
      <div class="dynamic-head">
        <strong data-i18n="ats.education.item_title">Educación</strong>
        <button type="button" class="item-remove-btn" data-remove="education" data-i18n="ats.actions.remove">Eliminar</button>
      </div>
      <div class="field"><label data-i18n="ats.education.degree">Título</label><input type="text" class="edu-degree-input" value="${escapeHtml(data.degree || "")}"></div>
      <div class="field"><label data-i18n="ats.education.institution">Institución</label><input type="text" class="edu-institution-input" value="${escapeHtml(data.institution || "")}"></div>
      <div class="field"><label data-i18n="ats.education.duration">Duración</label><input type="text" class="edu-duration-input" value="${escapeHtml(data.duration || "")}"></div>
      <div class="field"><label data-i18n="ats.education.location">Lugar</label><input type="text" class="edu-location-input" value="${escapeHtml(data.location || "")}"></div>
    `;
    educationList.appendChild(item);
  }

  function getExperienceItems() {
    return Array.from(experienceList.querySelectorAll(".dynamic-item"))
      .map((item) => {
        const bullets = item.querySelector(".exp-bullets-input").value
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean);

        return {
          company: item.querySelector(".exp-company-input").value.trim(),
          title: item.querySelector(".exp-role-input").value.trim(),
          location: item.querySelector(".exp-location-input").value.trim(),
          startDate: item.querySelector(".exp-start-input").value.trim(),
          endDate: item.querySelector(".exp-current-input").checked ? "" : item.querySelector(".exp-end-input").value.trim(),
          isCurrent: item.querySelector(".exp-current-input").checked,
          bullets
        };
      })
      .filter((item) => item.company || item.title || item.location || item.startDate || item.endDate || item.bullets.length);
  }

  function getEducationItems() {
    return Array.from(educationList.querySelectorAll(".dynamic-item"))
      .map((item) => ({
        degree: item.querySelector(".edu-degree-input").value.trim(),
        institution: item.querySelector(".edu-institution-input").value.trim(),
        duration: item.querySelector(".edu-duration-input").value.trim(),
        location: item.querySelector(".edu-location-input").value.trim()
      }))
      .filter((item) => item.degree || item.institution || item.duration || item.location);
  }

  function loadDefaultRepeaters(lang) {
    const defaults = getDefaults(lang);
    if (!experienceManuallyEdited) {
      experienceList.innerHTML = "";
      (defaults.experienceItems || []).forEach((item) => buildExperienceItem(item));
      if (!experienceList.children.length) buildExperienceItem();
    }
    if (!educationManuallyEdited) {
      educationList.innerHTML = "";
      (defaults.educationItems || []).forEach((item) => buildEducationItem(item));
      if (!educationList.children.length) buildEducationItem();
    }
  }

  function setStaticDefaults(lang) {
    const defaults = getDefaults(lang);
    staticInputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (input && typeof defaults[id] === "string") input.value = defaults[id];
    });
  }

  function syncStaticDefaults(fromLang, toLang) {
    const fromDefaults = getDefaults(fromLang);
    const toDefaults = getDefaults(toLang);

    staticInputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      const value = input.value.trim();
      const previousDefault = String(fromDefaults[id] || "").trim();
      if (value === "" || value === previousDefault) {
        input.value = toDefaults[id] || input.value;
      }
    });
  }

  function generateCV() {
    const t = translations?.[currentLang]?.ats?.empty || {};
    const fullName = document.getElementById("fullName").value.trim();
    const headline = document.getElementById("headline").value.trim();
    const email = document.getElementById("email").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const location = document.getElementById("location").value.trim();
    const profile = document.getElementById("profile").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const certifications = document.getElementById("certifications").value.trim();
    const passions = document.getElementById("passions").value.trim();

    document.getElementById("previewInitials").textContent = getInitials(fullName, currentLang);
    document.getElementById("previewName").textContent = fullName || t.name || "TU NOMBRE";
    document.getElementById("previewHeadline").textContent = headline || t.headline || "Tu cargo profesional";
    document.getElementById("previewEmail").textContent = email || t.email || "tu@email.com";
    document.getElementById("previewLinkedin").textContent = linkedin || t.linkedin || "linkedin.com/in/usuario";
    document.getElementById("previewLocation").textContent = location || t.location || "Ciudad, País";
    document.getElementById("previewProfile").textContent = profile || t.profile || "Agrega un perfil profesional.";

    document.getElementById("previewExperience").innerHTML = renderExperience(getExperienceItems(), currentLang);
    document.getElementById("previewEducation").innerHTML = renderEducation(getEducationItems(), currentLang);
    document.getElementById("previewSkills").textContent = skills || t.skills || "Agrega habilidades.";
    document.getElementById("previewCertifications").innerHTML = renderCertifications(parseParagraphBlocks(certifications), currentLang);
    document.getElementById("previewPassions").innerHTML = renderPassions(parsePassions(passions), currentLang);
  }

  function setLanguage(lang) {
    const previousLang = currentLang;
    currentLang = lang;
    localStorage.setItem("preferredLang", lang);

    langBtns.forEach((btn) => btn.classList.toggle("active", btn.getAttribute("data-lang") === lang));

    if (!previousLang) {
      setStaticDefaults(lang);
      loadDefaultRepeaters(lang);
    } else {
      syncStaticDefaults(previousLang, lang);
      loadDefaultRepeaters(lang);
    }

    applyI18n(lang);
    generateCV();
  }

  function handlePhotoUpload(event) {
    const file = event.target.files[0];
    const previewPhoto = document.getElementById("previewPhoto");
    const avatarCircle = document.getElementById("avatarCircle");

    if (!file) {
      previewPhoto.src = "";
      avatarCircle.classList.remove("has-photo");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      previewPhoto.src = e.target.result;
      avatarCircle.classList.add("has-photo");
    };
    reader.readAsDataURL(file);
  }

  document.getElementById("generateBtn").addEventListener("click", generateCV);
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("photo").addEventListener("change", handlePhotoUpload);

  staticInputIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", generateCV);
  });

  experienceList.addEventListener("input", () => {
    experienceManuallyEdited = true;
    generateCV();
  });
  educationList.addEventListener("input", () => {
    educationManuallyEdited = true;
    generateCV();
  });

  experienceList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches(".exp-current-input")) return;
    const item = target.closest(".dynamic-item");
    if (!item) return;
    experienceManuallyEdited = true;
    syncCurrentJobState(item);
    generateCV();
  });

  document.getElementById("addExperienceBtn").addEventListener("click", () => {
    experienceManuallyEdited = true;
    buildExperienceItem();
    applyI18n(currentLang);
  });

  document.getElementById("addEducationBtn").addEventListener("click", () => {
    educationManuallyEdited = true;
    buildEducationItem();
    applyI18n(currentLang);
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches(".item-remove-btn")) return;

    const type = target.getAttribute("data-remove");
    const item = target.closest(".dynamic-item");
    if (!item) return;
    item.remove();

    if (type === "experience") {
      experienceManuallyEdited = true;
      if (!experienceList.children.length) buildExperienceItem();
    } else if (type === "education") {
      educationManuallyEdited = true;
      if (!educationList.children.length) buildEducationItem();
    }
    applyI18n(currentLang);
    generateCV();
  });

  langBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  const navMenu = document.getElementById("nav-menu");
  const hamburgerBtn = document.getElementById("hamburger");
  const closeMenuBtn = document.getElementById("close-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburgerBtn && closeMenuBtn && navMenu) {
    hamburgerBtn.addEventListener("click", () => navMenu.classList.add("active"));
    closeMenuBtn.addEventListener("click", () => navMenu.classList.remove("active"));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("active");
    });
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  currentLang = null;
  const initialLang = localStorage.getItem("preferredLang") || (navigator.language && navigator.language.startsWith("es") ? "es" : "en");
  setLanguage(initialLang);
});
