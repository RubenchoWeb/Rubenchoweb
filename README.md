# 💼 Rubenchoweb — WordPress Tech Lead Portfolio

[![HTML5](https://img.shields.io/badge/HTML5-Semantic-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Responsive-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)](#)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide-5E5CE6)](#)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-222?logo=github)](#)
[![SEO](https://img.shields.io/badge/SEO-Optimized-brightgreen)](#)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-90%2B-success)](#)

Personal portfolio of **Ruben Rodriguez**,  
**WordPress Tech Lead / Senior WordPress Developer**, specialized in scalable WordPress architectures, custom plugin development, and performance-driven web solutions.

🌍 **Live site:**  
- Primary: https://rubenchoweb.com  
- GitHub Pages: https://rubenchoweb.github.io/Rubenchoweb/

---

## 🇬🇧 English Version

### 👋 About Me

I’m a **Senior WordPress Developer & Tech Lead** with experience building and leading **custom WordPress ecosystems** for high-traffic and business-critical platforms.

**Core strengths**
- Custom WordPress themes & plugins (architecture + maintainability)
- WooCommerce extensions and business logic
- REST API integrations (3rd-party services, CRM, payments, etc.)
- Performance optimization (Core Web Vitals, caching, query tuning)
- Technical leadership (planning, reviews, documentation, stakeholder alignment)

This portfolio reflects **how I design and ship production-grade web solutions**: simple where possible, robust where needed.

---

### 🧠 Why this portfolio is built this way

This project was intentionally built as a **100% static site** using **Vanilla JavaScript**, without frameworks or build tools.

**Goals**
- ⚡ Maximum performance (minimal JS, clean markup)
- 🧩 Clear, maintainable code (easy for any dev to read)
- 🌍 Multi-language support (EN / ES)
- 🚀 Simple, reliable deployment (GitHub Pages)

This mirrors real-world WordPress best practices:
> **Avoid over-engineering. Build only what adds value.**

---

### 🛠️ Tech Stack

**Frontend**
- **Semantic HTML5**
- **CSS3**
  - CSS Variables
  - Flexbox & Grid
  - Responsive layout (mobile-first)
- **Vanilla JavaScript (ES6+)**
  - UI interactions
  - Dynamic sections rendering
  - Language switch + persistence
  - Typewriter and carousel logic

**Icons**
- **Lucide Icons (via CDN)**
  - Lightweight SVG icon system
  - Uses `data-lucide="icon-name"`
  - Re-rendered after dynamic DOM updates via `lucide.createIcons()`

**Tooling & Infrastructure**
- Git & GitHub
- GitHub Pages
- WSL + VS Code (Linux-based dev environment)

---

### 🌍 Internationalization (i18n)

The site includes a **custom lightweight i18n system** built without external libraries.

**How it works**
- `translations.js` contains all strings and structured content for EN/ES
- Elements with `data-i18n="path.to.key"` are updated on language change
- Preferred language is saved in `localStorage`
- Dynamic sections (Experience, Education, PM Skills) are re-rendered on switch

This approach keeps things lightweight while reflecting the same concerns as multilingual WordPress setups (WPML/Polylang), but with **zero plugin overhead**.

---

### 🎨 Lucide Icons integration

Lucide icons are loaded via CDN for static-host compatibility.

**HTML**
```html
<i data-lucide="check-circle"></i>
```

**JS**
```js
lucide.createIcons();
```

**Note:** whenever the project injects new HTML into the DOM (e.g., PM skills or experience timeline), it calls `lucide.createIcons()` again to render the newly added icons.

---

### 📁 Project Structure

```text
/
├── index.html        # Main HTML structure
├── style.css         # Global styles & responsive layout
├── main.js           # UI logic, animations, i18n, interactions
├── translations.js   # Language definitions (EN / ES)
└── README.md         # Project documentation
```

---

### 🚀 Deployment & Hosting

**Hosting**
- GitHub Pages (static hosting)
- Optional custom domain support (e.g., `rubenchoweb.com`)
- HTTPS enabled via GitHub Pages

**Deployment flow**
1. Push to `main`
2. GitHub Pages serves the static content
3. Updates go live quickly

No build step, no server maintenance, no CI complexity.

---

### 📊 SEO & Lighthouse (practical checklist)

This project targets strong baseline scores by design:
- Semantic HTML (better crawlability + accessibility)
- Clear heading hierarchy (H1 → H2 → H3)
- Meta title + description
- Responsive layout and lightweight assets

> **Badge note:** The “Lighthouse 90+” badge represents the intended target. Scores may vary depending on network conditions and device.

---

### 🎯 CTA — Hiring & Collaboration

#### I’m open to:
- **Senior WordPress Developer** roles
- **WordPress Tech Lead** positions
- Remote-first teams
- Complex WordPress / WooCommerce projects
- Architecture + performance + integrations consulting

If your team needs someone who:
- Understands WordPress beyond themes
- Can lead technical decisions and guide delivery
- Writes clean, scalable code
- Thinks in performance and business impact

👉 **Let’s talk.**

---

### 📬 Contact

- ✉️ Email: **rubenchoweb@outlook.com**
- 💼 LinkedIn: *(add link)*
- 🧑‍💻 GitHub: https://github.com/RubenchoWeb

---

## 🇪🇸 Versión en Español

### 👋 Sobre mí

Soy **WordPress Developer Senior / Tech Lead**, con experiencia construyendo y liderando **ecosistemas WordPress a medida** para plataformas de alto tráfico y proyectos críticos para el negocio.

**Fortalezas**
- Temas y plugins personalizados (arquitectura + mantenibilidad)
- Extensiones WooCommerce y lógica de negocio
- Integraciones REST API (CRM, pasarelas, servicios externos)
- Optimización de rendimiento (Core Web Vitals, cachés, SQL)
- Liderazgo técnico (planificación, revisiones, documentación, alineación)

Este portafolio refleja mi forma real de trabajar: **simple, escalable y orientada a resultados**.

---

### 🧠 Por qué está hecho así

Este proyecto se construyó como un **sitio 100% estático** con **JavaScript Vanilla**, sin frameworks ni build tools.

**Objetivos**
- ⚡ Máximo rendimiento
- 🧩 Código claro y mantenible
- 🌍 Soporte multi-idioma (EN / ES)
- 🚀 Despliegue simple y confiable (GitHub Pages)

Enfoque alineado con buenas prácticas reales en WordPress:
> **Evitar complejidad innecesaria. Construir lo que aporta valor.**

---

### 🛠️ Tecnologías

**Frontend**
- **HTML5 semántico**
- **CSS3**
  - Variables CSS
  - Flexbox & Grid
  - Diseño responsive (mobile-first)
- **JavaScript Vanilla (ES6+)**
  - Interacciones UI
  - Render dinámico de secciones
  - Traducciones + persistencia
  - Typewriter y carrusel

**Iconos**
- **Lucide Icons (CDN)**
  - SVGs livianos
  - Uso con `data-lucide="icon-name"`
  - Re-render dinámico con `lucide.createIcons()`

**Infraestructura**
- Git & GitHub
- GitHub Pages
- WSL + VS Code

---

### 🌍 Internacionalización (i18n)

Sistema liviano sin librerías externas:
- `translations.js` contiene textos y datos estructurados EN/ES
- Se actualiza el contenido usando `data-i18n="ruta.a.llave"`
- El idioma se guarda en `localStorage`
- Secciones dinámicas se re-renderizan al cambiar el idioma

---

### 🎨 Iconos con Lucide

**HTML**
```html
<i data-lucide="check-circle"></i>
```

**JS**
```js
lucide.createIcons();
```

**Nota:** cuando se inyecta HTML (ej. skills de PM o experiencia), se vuelve a ejecutar `lucide.createIcons()` para pintar iconos nuevos.

---

### 🚀 Deploy & Dominio propio (`rubenchoweb.com`)

Este portafolio puede funcionar con GitHub Pages **con o sin dominio**.

**A) GitHub Pages (URL por defecto)**
1. Repo → **Settings** → **Pages**
2. Source: `Deploy from a branch`
3. Branch: `main` / Folder: `/ (root)`
4. Tu sitio queda en: `https://rubenchoweb.github.io/Rubenchoweb/`

**B) Dominio propio (ej: `rubenchoweb.com`)**
1. En GitHub Pages, agrega el dominio en **Custom domain**
2. Crea un archivo `CNAME` en la raíz del repo con:
   ```
   rubenchoweb.com
   ```
3. Configura DNS:

**Opción recomendada (A records + www CNAME)**
- `A` @ → `185.199.108.153`
- `A` @ → `185.199.109.153`
- `A` @ → `185.199.110.153`
- `A` @ → `185.199.111.153`
- `CNAME` `www` → `rubenchoweb.github.io`

4. Activa **Enforce HTTPS** en GitHub Pages cuando esté disponible.

> Nota: la propagación DNS puede tardar.

---

### 🎯 CTA — Oportunidades (WordPress Senior / Tech Lead)

Estoy abierto a:
- **Roles Senior WordPress**
- **Posiciones Tech Lead**
- Equipos remotos
- Proyectos WordPress / WooCommerce complejos
- Consultoría de arquitectura, performance e integraciones

Si buscas a alguien que:
- Domine WordPress más allá de “instalar plugins”
- Diseñe arquitecturas escalables
- Tome decisiones técnicas con criterio
- Aporte liderazgo real

👉 **Conversemos.**

---

© 2025 — Built with ❤️ using HTML, CSS & Vanilla JavaScript