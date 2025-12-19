"use strict";

// main.js — DOM interactions, i18n and UI behaviours
document.addEventListener('DOMContentLoaded', () => {
  // Safe reference to translations (translations.js defines window.translations)
  const translations = window.translations || {};

  // --- Typewriter Effect Variables ---
  const textElement = document.getElementById('typewriter');
  let phrases = (translations['en'] && translations['en'].typewriter) || [];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  let typewriterTimeout;

  // --- Language Switcher Logic ---
  const langBtns = document.querySelectorAll('.lang-btn');
  let currentLang = localStorage.getItem('preferredLang') || 'en';

  // Detect browser language if no preference stored
  if (!localStorage.getItem('preferredLang')) {
    const browserLang = navigator.language && navigator.language.startsWith && navigator.language.startsWith('es') ? 'es' : 'en';
    currentLang = browserLang;
  }

  // Initial render
  setLanguage(currentLang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);

    // Update buttons UI
    langBtns.forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update Text Content (Static Elements)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = getNestedTranslation(translations[lang] || {}, key);
      if (translation) {
        el.textContent = translation;
      }
    });

    // Update Document Title (SEO)
    if (lang === 'es') {
      document.title = "Rubenchoweb | Desarrollador Web WordPress";
    } else {
      document.title = "Rubenchoweb | WordPress Web Developer";
    }

    // Reset Typewriter
    resetTypewriter(lang);

    // Render Dynamic Sections
    renderExperience(lang);
    renderEducation(lang);
    renderPMSkills(lang);
  }

  function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  }

  // --- Dynamic Rendering Functions ---

  function renderExperience(lang) {
    const container = document.getElementById('experience-container');
    const jobs = (translations[lang] && translations[lang].experience && translations[lang].experience.jobs) || [];

    container.innerHTML = jobs.map(job => `
      <div class="experience-card">
        <div class="timeline-dot"></div>
        <div class="exp-header">
          <div>
            <h3 class="exp-role">${job.role}</h3>
            <a href="${job.url}" target="_blank" class="exp-company">
              ${job.company} <i data-lucide="external-link" style="width:14px; height:14px;"></i>
            </a>
          </div>
          <span class="exp-period">${job.period}</span>
        </div>
        <ul class="exp-activities">
          ${job.activities.map(activity => `<li>${activity}</li>`).join('')}
        </ul>
        <div class="exp-tags">
          ${job.tech.map(t => `<span class="exp-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');

  }

  function renderEducation(lang) {
    const container = document.getElementById('education-container');
    const items = (translations[lang] && translations[lang].education && translations[lang].education.items) || [];

    container.innerHTML = items.map(item => `
      <div class="education-item">
        <div class="edu-info">
          <h3>${item.degree}</h3>
          <p>${item.institution}</p>
        </div>
        <span class="edu-year">${item.year}</span>
      </div>
    `).join('');
  }

  function renderPMSkills(lang) {
    const container = document.getElementById('pm-skills-list');
    const skills = (translations[lang] && translations[lang].pm_skills) || [];

    container.innerHTML = skills.map(skill => `
      <div class="pm-badge">
        <i data-lucide="check-circle"></i> ${skill}
      </div>
    `).join('');
    // Re-render icons AFTER injecting HTML
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const closeMenu = document.getElementById('close-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMenu() {
    navMenu.classList.toggle('active');
  }

  hamburger.addEventListener('click', toggleMenu);
  closeMenu.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });

  // --- Typewriter Functions ---
  function resetTypewriter(lang) {
    clearTimeout(typewriterTimeout);
    phrases = (translations[lang] && translations[lang].typewriter) || [];
    phraseIndex = 0;
    charIndex = 0;
    isDeleting = false;
    if (textElement) textElement.textContent = '';
    type();
  }

  function type() {
    if (!phrases || phrases.length === 0 || !textElement) return;

    const currentPhrase = phrases[phraseIndex] || '';

    if (isDeleting) {
      textElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50;
    } else {
      textElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 500;
    }

    typewriterTimeout = setTimeout(type, typeSpeed);
  }

  // --- Carousel Logic ---
  const track = document.getElementById('track');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('indicators');
  const cards = Array.from(track.children);
  
  let currentIndex = 0;
  let cardsPerView = 3;

  function updateCardsPerView() {
    if (window.innerWidth <= 768) {
      cardsPerView = 1;
    } else if (window.innerWidth <= 992) {
      cardsPerView = 2;
    } else {
      cardsPerView = 3;
    }
    updateCarousel();
    createIndicators();
  }

  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    const maxIndex = cards.length - cardsPerView;
    
    for (let i = 0; i <= maxIndex; i++) {
        const dot = document.createElement('div');
        dot.classList.add('indicator');
        if (i === currentIndex) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateCarousel();
        });
        indicatorsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 30; 
    const moveAmount = (cardWidth + gap) * currentIndex;
    
    track.style.transform = `translateX(-${moveAmount}px)`;

    const maxIndex = cards.length - cardsPerView;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;

    const dots = Array.from(indicatorsContainer.children);
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
    });
  }

  nextBtn.addEventListener('click', () => {
    const maxIndex = cards.length - cardsPerView;
    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  updateCardsPerView();
  
  window.addEventListener('resize', () => {
    currentIndex = 0;
    updateCardsPerView();
  });

  // --- Smooth Scroll & Active Link Detection ---
  
  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Active Section Detection (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '-70px 0px -50% 0px', // Adjust margin to trigger when section is in upper half
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to corresponding link
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
  });

  // Finalize icons rendering after initial DOM updates
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});
