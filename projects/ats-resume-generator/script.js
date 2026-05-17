function escapeHtml(text) {
  return String(text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeLinkedinUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
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

function parseLineItems(raw) {
  return String(raw || "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCsvText(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      value = "";
      if (row.some((cell) => String(cell).trim() !== "")) rows.push(row);
      row = [];
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    if (row.some((cell) => String(cell).trim() !== "")) rows.push(row);
  }

  if (!rows.length) return [];
  const headers = rows[0].map((h) => String(h || "").trim());

  return rows.slice(1).map((cells) => {
    const out = {};
    headers.forEach((header, idx) => {
      out[header] = String(cells[idx] || "").trim();
    });
    return out;
  });
}

function normalizeKey(key) {
  return String(key || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function rowToNormalizedMap(row) {
  const map = {};
  Object.keys(row || {}).forEach((rawKey) => {
    map[normalizeKey(rawKey)] = row[rawKey];
  });
  return map;
}

function parseBooleanValue(value) {
  const v = String(value || "").trim().toLowerCase();
  return ["1", "true", "yes", "si", "sí"].includes(v);
}

function splitListValue(raw) {
  const text = String(raw || "").trim();
  if (!text) return [];
  if (text.includes("\n")) return text.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  if (text.includes("|")) return text.split("|").map((x) => x.trim()).filter(Boolean);
  if (text.includes("•")) return text.split("•").map((x) => x.trim()).filter(Boolean);
  if (text.includes(";")) return text.split(";").map((x) => x.trim()).filter(Boolean);
  return [text];
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

function monthValueToNumber(value) {
  if (!/^\d{4}-\d{2}$/.test(String(value || ""))) return null;
  const [year, month] = value.split("-").map(Number);
  return year * 100 + month;
}

function getCompanyRangeFromRoles(roles) {
  const validRoles = (roles || []).filter((role) => role.startDate || role.endDate || role.isCurrent);
  if (!validRoles.length) return null;

  const starts = validRoles
    .map((role) => role.startDate)
    .map(monthValueToNumber)
    .filter((n) => n !== null);

  const ends = validRoles
    .map((role) => role.endDate)
    .map(monthValueToNumber)
    .filter((n) => n !== null);

  let startDate = "";
  let endDate = "";
  let isCurrent = validRoles.some((role) => role.isCurrent);

  if (starts.length) {
    const min = Math.min(...starts);
    startDate = `${String(Math.floor(min / 100)).padStart(4, "0")}-${String(min % 100).padStart(2, "0")}`;
  }

  if (!isCurrent && ends.length) {
    const max = Math.max(...ends);
    endDate = `${String(Math.floor(max / 100)).padStart(4, "0")}-${String(max % 100).padStart(2, "0")}`;
  }

  return { startDate, endDate, isCurrent };
}

function normalizeSimpleList(raw) {
  const text = String(raw || "").trim();
  if (!text) return [];

  const hasLegacyFormat = text.includes("|");
  if (hasLegacyFormat) {
    return text
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block) => block.replace(/\s*\|\s*/g, " - "));
  }

  return parseLineItems(text);
}

function renderExperience(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.experience || "Agrega experiencia laboral.";
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  const presentLabel = window.translations?.[lang]?.ats?.experience?.present || (lang === "es" ? "Actualidad" : "Present");

  return items
    .map((item) => {
      const roleRange = item.hasMultipleRoles ? getCompanyRangeFromRoles(item.roles || []) : null;
      const hasManualCompanyRange = Boolean(item.startDate || item.endDate || item.isCurrent);
      const startValue = hasManualCompanyRange
        ? item.startDate
        : roleRange
          ? roleRange.startDate
          : item.startDate;
      const endValue = hasManualCompanyRange
        ? item.endDate
        : roleRange
          ? roleRange.endDate
          : item.endDate;
      const currentValue = hasManualCompanyRange
        ? item.isCurrent
        : roleRange
          ? roleRange.isCurrent
          : item.isCurrent;

      const formattedStart = formatMonthYear(startValue, lang);
      const formattedEnd = currentValue ? presentLabel : formatMonthYear(endValue, lang);
      const dateLabel = [formattedStart, formattedEnd].filter(Boolean).join(" - ");
      const safeCompanyUrl = (() => {
        const raw = String(item.companyUrl || "").trim();
        if (!raw) return "";
        return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      })();
      const companyNameHtml = safeCompanyUrl
        ? `<a href="${escapeHtml(safeCompanyUrl)}" class="job-company-link" target="_blank" rel="noopener noreferrer">${escapeHtml(item.company)}</a>`
        : escapeHtml(item.company);
      const rolesTimelineHtml = item.hasMultipleRoles && Array.isArray(item.roles) && item.roles.length
        ? `
            <div class="job-role-timeline">
              ${item.roles
                .map((role) => {
                  const roleStart = formatMonthYear(role.startDate, lang);
                  const roleEnd = role.isCurrent ? presentLabel : formatMonthYear(role.endDate, lang);
                  const roleDate = [roleStart, roleEnd].filter(Boolean).join(" - ");
                  const roleBullets = Array.isArray(role.bullets) ? role.bullets : [];
                  return `
                    <div class="job-role-item">
                      <div class="job-role-row">
                        <span class="job-title">${escapeHtml(role.title)}</span>
                        <span class="job-role-date">${escapeHtml(roleDate)}</span>
                      </div>
                      ${
                        roleBullets.length
                          ? `<ul class="job-bullets role-bullets">${roleBullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
                          : ""
                      }
                    </div>
                  `;
                })
                .join("")}
            </div>
          `
        : "";
      const singleRoleTitleHtml = !item.hasMultipleRoles ? `<div class="job-title">${escapeHtml(item.title)}</div>` : "";
      const bulletsHtml = !item.hasMultipleRoles && item.bullets.length
        ? `<ul class="job-bullets">${item.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`
        : "";

      return `
        <div class="experience-item">
          <div class="experience-top">
            <div class="experience-main">
              <div class="job-company">${companyNameHtml}</div>
              ${singleRoleTitleHtml}
            </div>
            <div class="experience-meta">
              <div class="experience-meta-inline">
                <span class="experience-meta-icon" aria-hidden="true">📍</span>
                <span>${escapeHtml(item.location || "")}</span>
                <span class="experience-meta-sep">-</span>
                <span class="job-general-date"><span aria-hidden="true">🗓</span> ${escapeHtml(dateLabel || "")}</span>
              </div>
            </div>
          </div>
          ${rolesTimelineHtml}
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
          <div class="education-top">
            <div class="education-main">
              <div class="education-institution">${escapeHtml(item.institution)}</div>
            </div>
            <div class="education-meta">
              <div class="experience-meta-inline">
                <span class="experience-meta-icon" aria-hidden="true">📍</span>
                <span>${escapeHtml(item.location || "")}</span>
                ${item.location && item.duration ? '<span class="experience-meta-sep">-</span>' : ""}
                <span class="job-general-date"><span aria-hidden="true">🗓</span> ${escapeHtml(item.duration || "")}</span>
              </div>
            </div>
          </div>
          <div class="education-degree">${escapeHtml(item.degree)}</div>
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

function renderSimpleList(items, emptyText) {
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  return items.map((item) => `<div class="cert-item">${escapeHtml(item)}</div>`).join("");
}

function renderPassions(items, lang) {
  const emptyText = window.translations?.[lang]?.ats?.empty?.passions || "Agrega intereses o pasiones.";
  if (!items.length) return `<div class="muted">${escapeHtml(emptyText)}</div>`;
  return `<ul class="simple-bullets">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
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

function syncRoleCurrentState(roleItem) {
  const currentCheckbox = roleItem.querySelector(".role-current-input");
  const endInput = roleItem.querySelector(".role-end-input");
  if (!currentCheckbox || !endInput) return;

  if (currentCheckbox.checked) {
    endInput.value = "";
    endInput.disabled = true;
  } else {
    endInput.disabled = false;
  }
}

function syncExperienceMode(item) {
  const multiCheckbox = item.querySelector(".exp-multi-role-input");
  const singleWrap = item.querySelector(".exp-single-role-wrap");
  const rolesWrap = item.querySelector(".exp-roles-wrap");
  const roleInput = item.querySelector(".exp-role-input");
  const startInput = item.querySelector(".exp-start-input");
  const endInput = item.querySelector(".exp-end-input");
  const companyCurrentInput = item.querySelector(".exp-current-input");

  if (!multiCheckbox || !singleWrap || !rolesWrap || !roleInput || !startInput || !endInput || !companyCurrentInput) return;

  const isMulti = multiCheckbox.checked;
  singleWrap.classList.toggle("is-hidden", isMulti);
  rolesWrap.classList.toggle("is-hidden", !isMulti);

  roleInput.disabled = isMulti;
  startInput.disabled = false;
  companyCurrentInput.disabled = false;
  endInput.disabled = false;
  syncCurrentJobState(item);
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".dynamic-item.exp-item:not(.is-dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}

document.addEventListener("DOMContentLoaded", async () => {
  await (window.componentsReady || Promise.resolve());

  const translations = window.translations || {};
  const langBtns = document.querySelectorAll(".lang-btn");
  const experienceList = document.getElementById("experienceList");
  const educationList = document.getElementById("educationList");
  const projectsList = document.getElementById("projectsList");
  const languagesList = document.getElementById("languagesList");
  const interestsList = document.getElementById("interestsList");
  const loadCsvBtn = document.getElementById("loadCsvBtn");
  const sampleCsvBtn = document.getElementById("sampleCsvBtn");
  const csvFileInput = document.getElementById("csvFileInput");

  const staticInputIds = [
    "fullName",
    "headline",
    "email",
    "linkedin",
    "location",
    "profile",
    "skills",
    "certifications",
    "titleAdditional",
    "titleProjects",
    "titleLanguages",
    "titleInterests"
  ];

  let currentLang = localStorage.getItem("preferredLang") || "en";
  let experienceManuallyEdited = false;
  let educationManuallyEdited = false;
  let additionalManuallyEdited = false;

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
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      const translation = getNestedTranslation(translations[lang] || {}, key);
      if (typeof translation === "string") {
        el.setAttribute("title", translation);
      }
    });
    document.title = translations?.[lang]?.meta?.title || document.title;
  }

  function updateFormSectionCollapseButton(section) {
    const btn = section.querySelector(".section-collapse-btn");
    if (!btn) return;
    const isCollapsed = section.classList.contains("is-collapsed");
    const label = isCollapsed
      ? translations?.[currentLang]?.ats?.actions?.expand_section || "Expand"
      : translations?.[currentLang]?.ats?.actions?.collapse_section || "Collapse";
    btn.textContent = label;
    btn.setAttribute("aria-expanded", String(!isCollapsed));
  }

  function initializeFormSectionCollapse() {
    document.querySelectorAll(".form-section").forEach((section) => {
      const btn = section.querySelector(".section-collapse-btn");
      if (!btn) return;
      if (btn.dataset.bound === "1") return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        section.classList.toggle("is-collapsed");
        updateFormSectionCollapseButton(section);
      });
      updateFormSectionCollapseButton(section);
    });
  }

  function updateExperienceCollapseButton(item) {
    const btn = item.querySelector(".exp-collapse-btn");
    if (!btn) return;
    const isCollapsed = item.classList.contains("is-collapsed");
    const label = isCollapsed
      ? translations?.[currentLang]?.ats?.actions?.expand_section || "Expand"
      : translations?.[currentLang]?.ats?.actions?.collapse_section || "Collapse";
    btn.textContent = label;
    btn.setAttribute("aria-expanded", String(!isCollapsed));
  }

  function shortenExperienceLabel(text, maxLen = 22) {
    const clean = String(text || "").trim();
    if (!clean) return "";
    if (clean.length <= maxLen) return clean;
    return `${clean.slice(0, maxLen)}...`;
  }

  function updateExperienceHeaderLabel(item) {
    const label = item.querySelector(".exp-item-label");
    const companyInput = item.querySelector(".exp-company-input");
    if (!label || !companyInput) return;

    const baseLabel = translations?.[currentLang]?.ats?.experience?.item_title || "Experience";
    const company = companyInput.value.trim();
    const display = company ? shortenExperienceLabel(company) : baseLabel;

    label.textContent = display;
    label.setAttribute("title", company || baseLabel);
  }

  function buildExperienceItem(data = {}) {
    const item = document.createElement("div");
    item.className = "dynamic-item exp-item";
    item.setAttribute("draggable", "true");
    const roles = Array.isArray(data.roles) ? data.roles : [];
    const hasMultipleRoles = Boolean(data.hasMultipleRoles && roles.length);
    item.innerHTML = `
      <div class="dynamic-head">
        <strong class="exp-item-label"></strong>
        <div class="dynamic-head-actions">
          <button type="button" class="exp-collapse-btn"></button>
          <button type="button" class="item-remove-btn" data-remove="experience" data-i18n="ats.actions.remove">Eliminar</button>
          <button type="button" class="exp-drag-handle" title="Drag to reorder">↕</button>
        </div>
      </div>
      <div class="exp-item-body">
      <div class="field"><label data-i18n="ats.experience.company">Nombre empresa</label><input type="text" class="exp-company-input" value="${escapeHtml(data.company || "")}"></div>
      <div class="field"><label data-i18n="ats.experience.company_url">Sitio web de la empresa (URL)</label><input type="url" class="exp-company-url-input" value="${escapeHtml(data.companyUrl || "")}" placeholder="https://example.com"></div>
      <div class="field"><label data-i18n="ats.experience.location">Lugar</label><input type="text" class="exp-location-input" value="${escapeHtml(data.location || "")}"></div>
      <div class="grid-2 exp-company-dates-wrap">
        <div class="field"><label data-i18n="ats.experience.start_date">Fecha de ingreso</label><input type="month" class="exp-start-input" value="${escapeHtml(data.startDate || "")}"></div>
        <div class="field"><label data-i18n="ats.experience.end_date">Fecha de retiro</label><input type="month" class="exp-end-input" value="${escapeHtml(data.endDate || "")}"></div>
      </div>
      <div class="checkbox-row exp-company-current-wrap">
        <label class="check-label">
          <input type="checkbox" class="exp-current-input" ${data.isCurrent ? "checked" : ""}>
          <span data-i18n="ats.experience.current_job">Actualmente trabajo aquí</span>
        </label>
      </div>
      <div class="field exp-single-role-wrap"><label data-i18n="ats.experience.role">Cargo</label><input type="text" class="exp-role-input" value="${escapeHtml(data.title || "")}"></div>
      <div class="checkbox-row">
        <label class="check-label">
          <input type="checkbox" class="exp-multi-role-input" ${hasMultipleRoles ? "checked" : ""}>
          <span data-i18n="ats.experience.multi_role">Tuve más de un cargo aquí</span>
        </label>
      </div>
      <div class="exp-roles-wrap is-hidden">
        <div class="dynamic-subtitle" data-i18n="ats.experience.roles_title">Cargos en esta empresa</div>
        <div class="exp-roles-list"></div>
        <div class="btn-row">
          <button type="button" class="btn-secondary btn-add exp-add-role-btn" data-i18n="ats.experience.add_role_btn">+ Agregar cargo</button>
        </div>
      </div>
      <div class="field"><label data-i18n="ats.experience.bullets">Funciones (una por línea)</label><textarea class="exp-bullets-input">${escapeHtml((data.bullets || []).join("\n"))}</textarea></div>
      </div>
    `;
    experienceList.appendChild(item);
    if (hasMultipleRoles) {
      roles.forEach((role) => buildRoleItem(item, role));
      if (!roles.length) buildRoleItem(item);
    }
    syncCurrentJobState(item);
    syncExperienceMode(item);
    updateExperienceCollapseButton(item);
    updateExperienceHeaderLabel(item);
  }

  function buildRoleItem(experienceItem, data = {}) {
    const list = experienceItem.querySelector(".exp-roles-list");
    if (!list) return;
    const roleItem = document.createElement("div");
    roleItem.className = "role-item";
    roleItem.innerHTML = `
      <div class="dynamic-head">
        <strong data-i18n="ats.experience.role_item_title">Cargo</strong>
        <button type="button" class="item-remove-btn" data-remove="role" data-i18n="ats.actions.remove">Eliminar</button>
      </div>
      <div class="field"><label data-i18n="ats.experience.role">Cargo</label><input type="text" class="role-title-input" value="${escapeHtml(data.title || "")}"></div>
      <div class="grid-2">
        <div class="field"><label data-i18n="ats.experience.start_date">Fecha de ingreso</label><input type="month" class="role-start-input" value="${escapeHtml(data.startDate || "")}"></div>
        <div class="field"><label data-i18n="ats.experience.end_date">Fecha de retiro</label><input type="month" class="role-end-input" value="${escapeHtml(data.endDate || "")}"></div>
      </div>
      <div class="checkbox-row">
        <label class="check-label">
          <input type="checkbox" class="role-current-input" ${data.isCurrent ? "checked" : ""}>
          <span data-i18n="ats.experience.current_job">Actualmente trabajo aquí</span>
        </label>
      </div>
      <div class="field">
        <label data-i18n="ats.experience.role_bullets">Responsibilities (una por línea)</label>
        <textarea class="role-bullets-input">${escapeHtml((data.bullets || []).join("\n"))}</textarea>
      </div>
    `;
    list.appendChild(roleItem);
    syncRoleCurrentState(roleItem);
  }

  function getRoleItems(experienceItem) {
    return Array.from(experienceItem.querySelectorAll(".role-item"))
      .map((roleItem) => {
        const bullets = roleItem.querySelector(".role-bullets-input").value
          .split("\n")
          .map((b) => b.trim())
          .filter(Boolean);
        return {
          title: roleItem.querySelector(".role-title-input").value.trim(),
          startDate: roleItem.querySelector(".role-start-input").value.trim(),
          endDate: roleItem.querySelector(".role-current-input").checked ? "" : roleItem.querySelector(".role-end-input").value.trim(),
          isCurrent: roleItem.querySelector(".role-current-input").checked,
          bullets
        };
      })
      .filter((role) => role.title || role.startDate || role.endDate || role.isCurrent || role.bullets.length);
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

  function buildSimpleAdditionalItem(container, data = {}) {
    const item = document.createElement("div");
    item.className = "dynamic-item additional-item";
    item.innerHTML = `
      <div class="dynamic-head">
        <strong data-i18n="ats.additional.item_title">Item</strong>
        <button type="button" class="item-remove-btn" data-remove="additional" data-i18n="ats.actions.remove">Eliminar</button>
      </div>
      <div class="field">
        <input type="text" class="additional-input" value="${escapeHtml(data.value || "")}">
      </div>
    `;
    container.appendChild(item);
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
          companyUrl: item.querySelector(".exp-company-url-input").value.trim(),
          title: item.querySelector(".exp-role-input").value.trim(),
          location: item.querySelector(".exp-location-input").value.trim(),
          startDate: item.querySelector(".exp-start-input").value.trim(),
          endDate: item.querySelector(".exp-current-input").checked ? "" : item.querySelector(".exp-end-input").value.trim(),
          isCurrent: item.querySelector(".exp-current-input").checked,
          hasMultipleRoles: item.querySelector(".exp-multi-role-input").checked,
          roles: getRoleItems(item),
          bullets
        };
      })
      .filter((item) => item.company || item.title || item.location || item.startDate || item.endDate || item.bullets.length || item.roles.length);
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

  function getSimpleAdditionalItems(container) {
    return Array.from(container.querySelectorAll(".additional-item .additional-input"))
      .map((input) => input.value.trim())
      .filter(Boolean);
  }

  function setInputIfPresent(id, value) {
    if (value === undefined || value === null || value === "") return;
    const input = document.getElementById(id);
    if (!input) return;
    input.value = String(value).trim();
  }

  function setCheckboxIfPresent(id, value) {
    if (value === undefined || value === null || value === "") return;
    const input = document.getElementById(id);
    if (!input) return;
    input.checked = parseBooleanValue(value);
  }

  function parseExperienceFromMap(map) {
    const grouped = {};
    Object.keys(map).forEach((key) => {
      const match = key.match(/^experience_(\d+)_(.+)$/);
      if (!match) return;
      const expIndex = Number(match[1]);
      const rest = match[2];
      if (!grouped[expIndex]) grouped[expIndex] = { roles: {} };

      const roleMatch = rest.match(/^role_(\d+)_(.+)$/);
      if (roleMatch) {
        const roleIndex = Number(roleMatch[1]);
        if (!grouped[expIndex].roles[roleIndex]) grouped[expIndex].roles[roleIndex] = {};
        grouped[expIndex].roles[roleIndex][roleMatch[2]] = map[key];
      } else {
        grouped[expIndex][rest] = map[key];
      }
    });

    const indexes = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    return indexes.map((idx) => {
      const raw = grouped[idx];
      const roleIndexes = Object.keys(raw.roles || {}).map(Number).sort((a, b) => a - b);
      const roles = roleIndexes.map((rIdx) => {
        const roleRaw = raw.roles[rIdx];
        return {
          title: roleRaw.title || "",
          startDate: roleRaw.startdate || roleRaw.start_date || "",
          endDate: roleRaw.enddate || roleRaw.end_date || "",
          isCurrent: parseBooleanValue(roleRaw.iscurrent || roleRaw.is_current),
          bullets: splitListValue(roleRaw.bullets || roleRaw.responsibilities || "")
        };
      }).filter((role) => role.title || role.startDate || role.endDate || role.isCurrent || role.bullets.length);

      const isCurrent = parseBooleanValue(raw.iscurrent || raw.is_current);
      return {
        company: raw.company || "",
        companyUrl: raw.companyurl || raw.company_url || "",
        title: raw.title || raw.role || "",
        location: raw.location || "",
        startDate: raw.startdate || raw.start_date || "",
        endDate: isCurrent ? "" : (raw.enddate || raw.end_date || ""),
        isCurrent,
        hasMultipleRoles: roles.length > 0 || parseBooleanValue(raw.hasmultipleroles || raw.has_multiple_roles),
        roles,
        bullets: splitListValue(raw.bullets || raw.responsibilities || "")
      };
    }).filter((item) => item.company || item.title || item.location || item.roles.length || item.bullets.length);
  }

  function parseEducationFromMap(map) {
    const grouped = {};
    Object.keys(map).forEach((key) => {
      const match = key.match(/^education_(\d+)_(.+)$/);
      if (!match) return;
      const idx = Number(match[1]);
      const rest = match[2];
      if (!grouped[idx]) grouped[idx] = {};
      grouped[idx][rest] = map[key];
    });

    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((idx) => {
        const raw = grouped[idx];
        return {
          degree: raw.degree || raw.title || "",
          institution: raw.institution || raw.school || "",
          duration: raw.duration || "",
          location: raw.location || ""
        };
      })
      .filter((item) => item.degree || item.institution || item.duration || item.location);
  }

  function parseIndexedListFromMap(map, baseName) {
    const result = [];
    Object.keys(map).forEach((key) => {
      const match = key.match(new RegExp(`^${baseName}_(\\d+)$`));
      if (!match) return;
      result.push({ index: Number(match[1]), value: map[key] });
    });
    return result
      .sort((a, b) => a.index - b.index)
      .map((item) => String(item.value || "").trim())
      .filter(Boolean);
  }

  function buildAdditionalList(container, values) {
    container.innerHTML = "";
    values.forEach((value) => buildSimpleAdditionalItem(container, { value }));
    if (!container.children.length) buildSimpleAdditionalItem(container);
  }

  function applyCsvRecord(map) {
    const aliases = {
      fullName: ["fullname", "full_name", "name"],
      headline: ["headline", "professional_title", "title"],
      email: ["email"],
      linkedin: ["linkedin", "linkedin_url"],
      location: ["location", "city"],
      profile: ["profile", "summary", "professional_summary"],
      skills: ["skills"],
      certifications: ["certifications"]
    };

    Object.keys(aliases).forEach((fieldId) => {
      const key = aliases[fieldId].find((k) => map[k] !== undefined && map[k] !== "");
      if (key) setInputIfPresent(fieldId, map[key]);
    });

    setCheckboxIfPresent("showEducation", map.showeducation || map.show_education);
    setCheckboxIfPresent("showCertifications", map.showcertifications || map.show_certifications);
    setCheckboxIfPresent("showAdditional", map.showadditional || map.show_additional);

    setInputIfPresent("titleAdditional", map.titleadditional || map.title_additional);
    setInputIfPresent("titleProjects", map.titleprojects || map.title_projects);
    setInputIfPresent("titleLanguages", map.titlelanguages || map.title_languages);
    setInputIfPresent("titleInterests", map.titleinterests || map.title_interests);

    const experiences = parseExperienceFromMap(map);
    if (experiences.length) {
      experienceList.innerHTML = "";
      experiences.forEach((item) => buildExperienceItem(item));
      experienceManuallyEdited = true;
    }

    const educationItems = parseEducationFromMap(map);
    if (educationItems.length) {
      educationList.innerHTML = "";
      educationItems.forEach((item) => buildEducationItem(item));
      educationManuallyEdited = true;
    }

    const projects = splitListValue(map.projects || map.project_list || "").concat(parseIndexedListFromMap(map, "project"));
    const languages = splitListValue(map.languages || map.language_list || "").concat(parseIndexedListFromMap(map, "language"));
    const interests = splitListValue(map.interests || map.passions || map.interest_list || "").concat(parseIndexedListFromMap(map, "interest"));

    if (projects.length || languages.length || interests.length) {
      buildAdditionalList(projectsList, projects);
      buildAdditionalList(languagesList, languages);
      buildAdditionalList(interestsList, interests);
      additionalManuallyEdited = true;
    }
  }

  function applyCsvData(text) {
    const rows = parseCsvText(text);
    if (!rows.length) return false;

    const firstMap = rowToNormalizedMap(rows[0]);
    const keyValueMode = Object.keys(firstMap).includes("field") && Object.keys(firstMap).includes("value");
    if (keyValueMode) {
      const merged = {};
      rows.forEach((row) => {
        const map = rowToNormalizedMap(row);
        const key = normalizeKey(map.field);
        if (!key) return;
        merged[key] = map.value;
      });
      applyCsvRecord(merged);
    } else {
      applyCsvRecord(firstMap);
    }
    return true;
  }

  function buildCsvFromCurrentForm() {
    const rows = [];
    const pushKV = (field, value) => rows.push({ field, value: value ?? "" });

    pushKV("fullName", document.getElementById("fullName").value.trim());
    pushKV("headline", document.getElementById("headline").value.trim());
    pushKV("email", document.getElementById("email").value.trim());
    pushKV("linkedin", document.getElementById("linkedin").value.trim());
    pushKV("location", document.getElementById("location").value.trim());
    pushKV("profile", document.getElementById("profile").value.trim());
    pushKV("skills", document.getElementById("skills").value.trim());
    pushKV("certifications", document.getElementById("certifications").value.trim());

    pushKV("showEducation", document.getElementById("showEducation").checked ? "true" : "false");
    pushKV("showCertifications", document.getElementById("showCertifications").checked ? "true" : "false");
    pushKV("showAdditional", document.getElementById("showAdditional").checked ? "true" : "false");

    pushKV("titleAdditional", document.getElementById("titleAdditional").value.trim());
    pushKV("titleProjects", document.getElementById("titleProjects").value.trim());
    pushKV("titleLanguages", document.getElementById("titleLanguages").value.trim());
    pushKV("titleInterests", document.getElementById("titleInterests").value.trim());

    const experienceItems = getExperienceItems();
    experienceItems.forEach((exp, index) => {
      const i = index + 1;
      pushKV(`experience_${i}_company`, exp.company || "");
      pushKV(`experience_${i}_companyUrl`, exp.companyUrl || "");
      pushKV(`experience_${i}_title`, exp.title || "");
      pushKV(`experience_${i}_location`, exp.location || "");
      pushKV(`experience_${i}_startDate`, exp.startDate || "");
      pushKV(`experience_${i}_endDate`, exp.endDate || "");
      pushKV(`experience_${i}_isCurrent`, exp.isCurrent ? "true" : "false");
      pushKV(`experience_${i}_hasMultipleRoles`, exp.hasMultipleRoles ? "true" : "false");
      pushKV(`experience_${i}_bullets`, (exp.bullets || []).join(" | "));

      (exp.roles || []).forEach((role, roleIndex) => {
        const r = roleIndex + 1;
        pushKV(`experience_${i}_role_${r}_title`, role.title || "");
        pushKV(`experience_${i}_role_${r}_startDate`, role.startDate || "");
        pushKV(`experience_${i}_role_${r}_endDate`, role.endDate || "");
        pushKV(`experience_${i}_role_${r}_isCurrent`, role.isCurrent ? "true" : "false");
        pushKV(`experience_${i}_role_${r}_bullets`, (role.bullets || []).join(" | "));
      });
    });

    const educationItems = getEducationItems();
    educationItems.forEach((edu, index) => {
      const i = index + 1;
      pushKV(`education_${i}_degree`, edu.degree || "");
      pushKV(`education_${i}_institution`, edu.institution || "");
      pushKV(`education_${i}_duration`, edu.duration || "");
      pushKV(`education_${i}_location`, edu.location || "");
    });

    getSimpleAdditionalItems(projectsList).forEach((item, index) => pushKV(`project_${index + 1}`, item));
    getSimpleAdditionalItems(languagesList).forEach((item, index) => pushKV(`language_${index + 1}`, item));
    getSimpleAdditionalItems(interestsList).forEach((item, index) => pushKV(`interest_${index + 1}`, item));

    const header = "field,value";
    const body = rows.map((row) => `${csvEscape(row.field)},${csvEscape(row.value)}`).join("\n");
    return `${header}\n${body}`;
  }

  function downloadCsvFromForm() {
    const csv = buildCsvFromCurrentForm();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-data-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function downloadSampleCsv() {
    const sampleRows = [
      { field: "fullName", value: "Ruben Rodriguez" },
      { field: "headline", value: "Web Developer | Wordpress Shopify | E-commerce" },
      { field: "email", value: "rubenchoweb@outlook.com" },
      { field: "linkedin", value: "linkedin.com/in/rubenrodriguez" },
      { field: "location", value: "Medellin, Colombia" },
      { field: "profile", value: "Web Developer with 8+ years of experience in WordPress, Shopify, and eCommerce." },
      { field: "skills", value: "WordPress, Shopify, HTML, CSS, JavaScript" },
      { field: "certifications", value: "Google Analytics Certification | HubSpot Inbound Marketing" },
      { field: "showEducation", value: "true" },
      { field: "showCertifications", value: "true" },
      { field: "showAdditional", value: "true" },
      { field: "titleAdditional", value: "Additional" },
      { field: "titleProjects", value: "Projects" },
      { field: "titleLanguages", value: "Languages" },
      { field: "titleInterests", value: "Interests" },
      { field: "experience_1_company", value: "Holafly" },
      { field: "experience_1_location", value: "Remote" },
      { field: "experience_1_startDate", value: "2022-03" },
      { field: "experience_1_endDate", value: "2025-12" },
      { field: "experience_1_isCurrent", value: "false" },
      { field: "experience_1_hasMultipleRoles", value: "true" },
      { field: "experience_1_role_1_title", value: "Web Developer" },
      { field: "experience_1_role_1_startDate", value: "2022-03" },
      { field: "experience_1_role_1_endDate", value: "2023-07" },
      { field: "experience_1_role_1_bullets", value: "Built landing pages | Implemented tracking | Developed editable components" },
      { field: "experience_1_role_2_title", value: "WordPress Tech Lead - eCommerce" },
      { field: "experience_1_role_2_startDate", value: "2024-10" },
      { field: "experience_1_role_2_endDate", value: "2025-12" },
      { field: "experience_1_role_2_bullets", value: "Led WordPress eCommerce | Built custom plugins | Improved SEO and Core Web Vitals" },
      { field: "education_1_degree", value: "Professional Training" },
      { field: "education_1_institution", value: "Web Development and Frontend" },
      { field: "education_1_duration", value: "2018 - 2020" },
      { field: "education_1_location", value: "Colombia" },
      { field: "project_1", value: "https://esim.holafly.com" },
      { field: "project_2", value: "https://lafam.com.co" },
      { field: "language_1", value: "Spanish - Native" },
      { field: "language_2", value: "English - Professional" },
      { field: "interest_1", value: "Web development" },
      { field: "interest_2", value: "UI design" }
    ];

    const header = "field,value";
    const body = sampleRows.map((row) => `${csvEscape(row.field)},${csvEscape(row.value)}`).join("\n");
    const csv = `${header}\n${body}`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume-sample-template.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function loadDefaultRepeaters(lang) {
    const defaults = getDefaults(lang);
    if (!experienceManuallyEdited) {
      experienceList.innerHTML = "";
      (defaults.experienceItems || []).forEach((item) => buildExperienceItem(item));
      if (!experienceList.children.length) buildExperienceItem();
      Array.from(experienceList.querySelectorAll(".dynamic-item.exp-item")).forEach((item) => {
        updateExperienceCollapseButton(item);
        updateExperienceHeaderLabel(item);
      });
    }
    if (!educationManuallyEdited) {
      educationList.innerHTML = "";
      (defaults.educationItems || []).forEach((item) => buildEducationItem(item));
      if (!educationList.children.length) buildEducationItem();
    }
    if (!additionalManuallyEdited) {
      projectsList.innerHTML = "";
      languagesList.innerHTML = "";
      interestsList.innerHTML = "";

      normalizeSimpleList(defaults.projects).forEach((value) => buildSimpleAdditionalItem(projectsList, { value }));
      normalizeSimpleList(defaults.languages).forEach((value) => buildSimpleAdditionalItem(languagesList, { value }));
      normalizeSimpleList(defaults.passions).forEach((value) => buildSimpleAdditionalItem(interestsList, { value }));

      if (!projectsList.children.length) buildSimpleAdditionalItem(projectsList);
      if (!languagesList.children.length) buildSimpleAdditionalItem(languagesList);
      if (!interestsList.children.length) buildSimpleAdditionalItem(interestsList);
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
    const showEducation = document.getElementById("showEducation").checked;
    const showCertifications = document.getElementById("showCertifications").checked;
    const showAdditional = document.getElementById("showAdditional").checked;
    const titleAdditional = document.getElementById("titleAdditional").value.trim();
    const titleProjects = document.getElementById("titleProjects").value.trim();
    const titleLanguages = document.getElementById("titleLanguages").value.trim();
    const titleInterests = document.getElementById("titleInterests").value.trim();
    const projects = getSimpleAdditionalItems(projectsList);
    const languages = getSimpleAdditionalItems(languagesList);
    const passions = getSimpleAdditionalItems(interestsList);

    document.getElementById("previewInitials").textContent = getInitials(fullName, currentLang);
    document.getElementById("previewName").textContent = fullName || t.name || "TU NOMBRE";
    document.getElementById("previewHeadline").textContent = headline || t.headline || "Tu cargo profesional";
    const safeEmailText = email || t.email || "tu@email.com";
    const safeLinkedinText = linkedin || t.linkedin || "linkedin.com/in/usuario";
    const emailHref = safeEmailText ? `mailto:${safeEmailText}` : "";
    const linkedinHref = normalizeLinkedinUrl(safeLinkedinText);

    document.getElementById("previewEmail").innerHTML = emailHref
      ? `<a href="${escapeHtml(emailHref)}" class="plain-link">${escapeHtml(safeEmailText)}</a>`
      : escapeHtml(safeEmailText);
    document.getElementById("previewLinkedin").innerHTML = linkedinHref
      ? `<a href="${escapeHtml(linkedinHref)}" class="plain-link" target="_blank" rel="noopener noreferrer">${escapeHtml(safeLinkedinText)}</a>`
      : escapeHtml(safeLinkedinText);
    document.getElementById("previewLocation").textContent = location || t.location || "Ciudad, País";
    document.getElementById("previewProfile").textContent = profile || t.profile || "Agrega un perfil profesional.";

    document.getElementById("previewExperience").innerHTML = renderExperience(getExperienceItems(), currentLang);
    document.getElementById("previewEducation").innerHTML = renderEducation(getEducationItems(), currentLang);
    document.getElementById("previewSkills").textContent = skills || t.skills || "Agrega habilidades.";
    document.getElementById("previewCertifications").innerHTML = renderCertifications(parseParagraphBlocks(certifications), currentLang);
    document.getElementById("previewProjects").innerHTML = renderSimpleList(projects, t.projects || "Add projects.");
    document.getElementById("previewLanguages").innerHTML = renderSimpleList(languages, t.languages || "Add languages.");
    document.getElementById("previewPassions").innerHTML = renderPassions(passions, currentLang);

    document.getElementById("previewEducationSection").classList.toggle("is-hidden", !showEducation);
    document.getElementById("previewCertificationsSection").classList.toggle("is-hidden", !showCertifications);
    document.getElementById("previewAdditionalSection").classList.toggle("is-hidden", !showAdditional);
    document.getElementById("previewTitleAdditional").textContent = titleAdditional || translations?.[currentLang]?.ats?.preview?.additional || "Additional";
    document.getElementById("previewTitleProjects").textContent = titleProjects || translations?.[currentLang]?.ats?.preview?.projects || "Projects";
    document.getElementById("previewTitleLanguages").textContent = titleLanguages || translations?.[currentLang]?.ats?.preview?.languages || "Languages";
    document.getElementById("previewTitleInterests").textContent = titleInterests || translations?.[currentLang]?.ats?.preview?.passions || "Interests";
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
    initializeFormSectionCollapse();
    Array.from(experienceList.querySelectorAll(".dynamic-item.exp-item")).forEach((item) => {
      updateExperienceCollapseButton(item);
      updateExperienceHeaderLabel(item);
    });
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

  document.getElementById("generateBtn").addEventListener("click", downloadCsvFromForm);
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("clearBtn").addEventListener("click", () => {
    const confirmMsg = translations?.[currentLang]?.ats?.actions?.clear_confirm || "Are you sure you want to clear the form?";
    if (!window.confirm(confirmMsg)) return;
    clearFormCompletely();
  });
  document.getElementById("photo").addEventListener("change", handlePhotoUpload);

  staticInputIds.forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", generateCV);
  });
  ["showEducation", "showCertifications", "showAdditional"].forEach((id) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("change", generateCV);
  });

  experienceList.addEventListener("input", () => {
    experienceManuallyEdited = true;
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement.matches(".exp-company-input")) {
      const item = activeElement.closest(".dynamic-item.exp-item");
      if (item) updateExperienceHeaderLabel(item);
    }
    generateCV();
  });
  educationList.addEventListener("input", () => {
    educationManuallyEdited = true;
    generateCV();
  });
  [projectsList, languagesList, interestsList].forEach((list) => {
    list.addEventListener("input", () => {
      additionalManuallyEdited = true;
      generateCV();
    });
  });

  experienceList.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".dynamic-item");
    if (!item) return;
    if (target.matches(".exp-current-input")) {
      syncCurrentJobState(item);
    } else if (target.matches(".exp-multi-role-input")) {
      const rolesList = item.querySelector(".exp-roles-list");
      if (target.checked && rolesList && !rolesList.children.length) {
        buildRoleItem(item);
        applyI18n(currentLang);
      }
      syncExperienceMode(item);
    } else if (target.matches(".role-current-input")) {
      const roleItem = target.closest(".role-item");
      if (roleItem) syncRoleCurrentState(roleItem);
    } else {
      return;
    }
    experienceManuallyEdited = true;
    generateCV();
  });

  experienceList.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const handle = target.closest(".exp-drag-handle");
    const item = target.closest(".dynamic-item.exp-item");
    if (!item) return;

    if (handle) {
      item.dataset.dragReady = "1";
    } else {
      delete item.dataset.dragReady;
    }
  });

  experienceList.addEventListener("dragstart", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".dynamic-item.exp-item");
    if (!item) return;

    if (item.dataset.dragReady !== "1") {
      event.preventDefault();
      return;
    }

    item.classList.add("is-dragging");
    item.dataset.startIndex = String(Array.from(experienceList.children).indexOf(item));

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "experience");
    }
  });

  experienceList.addEventListener("dragover", (event) => {
    event.preventDefault();
    const dragging = experienceList.querySelector(".dynamic-item.exp-item.is-dragging");
    if (!dragging) return;

    const afterElement = getDragAfterElement(experienceList, event.clientY);
    if (!afterElement) {
      experienceList.appendChild(dragging);
    } else {
      experienceList.insertBefore(dragging, afterElement);
    }
  });

  experienceList.addEventListener("drop", (event) => {
    event.preventDefault();
  });

  experienceList.addEventListener("dragend", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest(".dynamic-item.exp-item");
    if (!item) return;

    const startIndex = Number(item.dataset.startIndex);
    const endIndex = Array.from(experienceList.children).indexOf(item);

    item.classList.remove("is-dragging");
    delete item.dataset.dragReady;
    delete item.dataset.startIndex;

    if (!Number.isNaN(startIndex) && startIndex !== endIndex) {
      experienceManuallyEdited = true;
      generateCV();
    }
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

  document.getElementById("addProjectBtn").addEventListener("click", () => {
    additionalManuallyEdited = true;
    buildSimpleAdditionalItem(projectsList);
    applyI18n(currentLang);
  });

  document.getElementById("addLanguageBtn").addEventListener("click", () => {
    additionalManuallyEdited = true;
    buildSimpleAdditionalItem(languagesList);
    applyI18n(currentLang);
  });

  document.getElementById("addInterestBtn").addEventListener("click", () => {
    additionalManuallyEdited = true;
    buildSimpleAdditionalItem(interestsList);
    applyI18n(currentLang);
  });

  if (loadCsvBtn && csvFileInput) {
    loadCsvBtn.addEventListener("click", () => csvFileInput.click());
    csvFileInput.addEventListener("change", async (event) => {
      const input = event.target;
      const file = input.files && input.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const success = applyCsvData(text);
        if (!success) {
          window.alert("CSV vacío o inválido.");
        } else {
          applyI18n(currentLang);
          generateCV();
        }
      } catch (error) {
        window.alert("No se pudo leer el CSV.");
      } finally {
        input.value = "";
      }
    });
  }

  function clearFormCompletely() {
    experienceManuallyEdited = false;
    educationManuallyEdited = false;
    additionalManuallyEdited = false;

    staticInputIds.forEach((id) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.value = "";
    });

    experienceList.innerHTML = "";
    educationList.innerHTML = "";
    projectsList.innerHTML = "";
    languagesList.innerHTML = "";
    interestsList.innerHTML = "";

    buildExperienceItem();
    buildEducationItem();
    buildSimpleAdditionalItem(projectsList);
    buildSimpleAdditionalItem(languagesList);
    buildSimpleAdditionalItem(interestsList);

    const showEducation = document.getElementById("showEducation");
    const showCertifications = document.getElementById("showCertifications");
    const showAdditional = document.getElementById("showAdditional");
    if (showEducation) showEducation.checked = true;
    if (showCertifications) showCertifications.checked = true;
    if (showAdditional) showAdditional.checked = true;

    const photoInput = document.getElementById("photo");
    const previewPhoto = document.getElementById("previewPhoto");
    const avatarCircle = document.getElementById("avatarCircle");
    if (photoInput) photoInput.value = "";
    if (previewPhoto) previewPhoto.src = "";
    if (avatarCircle) avatarCircle.classList.remove("has-photo");

    applyI18n(currentLang);
    generateCV();
  }
  if (sampleCsvBtn) {
    sampleCsvBtn.addEventListener("click", downloadSampleCsv);
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches(".exp-collapse-btn")) {
      const experienceItem = target.closest(".dynamic-item.exp-item");
      if (!experienceItem) return;
      experienceItem.classList.toggle("is-collapsed");
      updateExperienceCollapseButton(experienceItem);
      return;
    }

    if (target.matches(".exp-add-role-btn")) {
      const experienceItem = target.closest(".dynamic-item");
      if (!experienceItem) return;
      experienceManuallyEdited = true;
      buildRoleItem(experienceItem);
      applyI18n(currentLang);
      generateCV();
      return;
    }

    if (!target.matches(".item-remove-btn")) return;

    const type = target.getAttribute("data-remove");
    if (type === "role") {
      const roleItem = target.closest(".role-item");
      if (!roleItem) return;
      const expItem = roleItem.closest(".dynamic-item");
      roleItem.remove();
      if (expItem) {
        const roles = expItem.querySelector(".exp-roles-list");
        if (roles && !roles.children.length) {
          buildRoleItem(expItem);
          applyI18n(currentLang);
        }
      }
      experienceManuallyEdited = true;
      generateCV();
      return;
    }

    const item = target.closest(".dynamic-item");
    if (!item) return;
    const additionalItem = target.closest(".additional-item");
    if (additionalItem) {
      const parentList = additionalItem.parentElement;
      additionalItem.remove();
      if (parentList && !parentList.children.length) {
        buildSimpleAdditionalItem(parentList);
        applyI18n(currentLang);
      }
      additionalManuallyEdited = true;
      generateCV();
      return;
    }

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

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  initializeFormSectionCollapse();
  currentLang = null;
  const initialLang = localStorage.getItem("preferredLang") || (navigator.language && navigator.language.startsWith("es") ? "es" : "en");
  setLanguage(initialLang);
});
