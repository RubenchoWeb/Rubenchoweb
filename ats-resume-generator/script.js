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

function parseExperience(raw) {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const parts = block.split("|");
      return {
        company: (parts[0] || "").trim(),
        title: (parts[1] || "").trim(),
        location: (parts[2] || "").trim(),
        date: (parts[3] || "").trim(),
        bullets: (parts[4] || "")
          .split(";")
          .map((item) => item.trim())
          .filter(Boolean)
      };
    });
}

function parseEducation(raw) {
  return raw
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const parts = block.split("|");
      return {
        school: (parts[0] || "").trim(),
        degree: (parts[1] || "").trim(),
        location: (parts[2] || "").trim(),
        date: (parts[3] || "").trim()
      };
    });
}

function parseParagraphBlocks(raw) {
  return raw
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
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
  if (!items.length) {
    return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  }

  return items
    .map((item) => {
      const bulletsHtml = item.bullets.length
        ? `<ul class="job-bullets">${item.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";

      return `
        <div class="experience-item">
          <div class="experience-head">
            <div>
              <div class="job-company">${escapeHtml(item.company)}</div>
              <div class="job-title">${escapeHtml(item.title)}</div>
            </div>
            <div>
              <div class="job-location">${escapeHtml(item.location)}</div>
              <div class="job-date">${escapeHtml(item.date)}</div>
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
  if (!items.length) {
    return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  }

  return items
    .map(
      (item) => `
        <div class="education-item">
          <div class="education-head">
            <div>
              <div class="education-school">${escapeHtml(item.school)}</div>
              <div class="education-degree">${escapeHtml(item.degree)}</div>
            </div>
            <div>
              <div class="education-location">${escapeHtml(item.location)}</div>
              <div class="education-date">${escapeHtml(item.date)}</div>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}

function renderCertifications(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.certifications || "Agrega certificaciones.";
  if (!items.length) {
    return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  }

  return items.map((item) => `<div class="cert-item">${escapeHtml(item)}</div>`).join("");
}

function renderPassions(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.passions || "Agrega intereses o pasiones.";
  if (!items.length) {
    return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  }

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

document.addEventListener("DOMContentLoaded", () => {
  const translations = window.translations || {};
  const langBtns = document.querySelectorAll(".lang-btn");
  const inputIds = [
    "fullName",
    "headline",
    "email",
    "linkedin",
    "location",
    "profile",
    "experience",
    "education",
    "skills",
    "certifications",
    "passions"
  ];

  let currentLang = localStorage.getItem("preferredLang") || "en";
  if (!localStorage.getItem("preferredLang")) {
    currentLang = navigator.language && navigator.language.startsWith("es") ? "es" : "en";
  }

  function getDefaults(lang) {
    return translations?.[lang]?.ats?.defaults || {};
  }

  function setFormValuesFromDefaults(lang) {
    const defaults = getDefaults(lang);
    inputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input || typeof defaults[id] === "undefined") return;
      input.value = defaults[id];
    });
  }

  function syncFormValuesBetweenLanguages(fromLang, toLang) {
    const fromDefaults = getDefaults(fromLang);
    const toDefaults = getDefaults(toLang);

    inputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;

      const currentValue = input.value.trim();
      const previousDefault = String(fromDefaults[id] || "").trim();

      if (currentValue === "" || currentValue === previousDefault) {
        input.value = toDefaults[id] || input.value;
      }
    });
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

  function generateCV() {
    const t = translations?.[currentLang]?.ats?.empty || {};
    const fullName = document.getElementById("fullName").value.trim();
    const headline = document.getElementById("headline").value.trim();
    const email = document.getElementById("email").value.trim();
    const linkedin = document.getElementById("linkedin").value.trim();
    const location = document.getElementById("location").value.trim();
    const profile = document.getElementById("profile").value.trim();
    const experience = document.getElementById("experience").value.trim();
    const education = document.getElementById("education").value.trim();
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

    document.getElementById("previewExperience").innerHTML = renderExperience(parseExperience(experience), currentLang);
    document.getElementById("previewEducation").innerHTML = renderEducation(parseEducation(education), currentLang);
    document.getElementById("previewSkills").textContent = skills || t.skills || "Agrega habilidades.";
    document.getElementById("previewCertifications").innerHTML = renderCertifications(parseParagraphBlocks(certifications), currentLang);
    document.getElementById("previewPassions").innerHTML = renderPassions(parsePassions(passions), currentLang);
  }

  function setLanguage(lang) {
    const previousLang = currentLang;
    currentLang = lang;
    localStorage.setItem("preferredLang", lang);

    langBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });

    if (!previousLang) {
      setFormValuesFromDefaults(lang);
    } else {
      syncFormValuesBetweenLanguages(previousLang, lang);
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

  inputIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", generateCV);
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
  setLanguage(localStorage.getItem("preferredLang") || (navigator.language && navigator.language.startsWith("es") ? "es" : "en"));
});
