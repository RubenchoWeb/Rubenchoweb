window.translations = {
  en: {
    meta: {
      title: "ATS Resume Generator | Rubenchoweb"
    },
    nav: {
      home: "Home",
      skills: "Skills",
      experience: "Experience",
      education: "Education",
      projects: "Projects",
      contact: "Contact",
      cv_generator: "CV generator"
    },
    ats: {
      title: "ATS Resume Generator",
      subtitle: "Fill the form manually or upload a CSV to auto-complete your resume.",
      photo: {
        section: "Profile photo",
        label: "Upload photo (optional)",
        hint: "If you don't upload a photo, your initials will be shown."
      },
      personal: {
        section: "Personal information",
        full_name: "Full name",
        headline: "Professional title",
        email: "Email",
        linkedin: "LinkedIn",
        location: "Location"
      },
      profile: {
        section: "Professional summary",
        label: "Summary"
      },
      experience: {
        section: "Experience",
        add_btn: "+ Add experience",
        item_title: "Experience",
        company: "Company name",
        company_url: "Company website URL",
        role: "Role",
        role_item_title: "Role",
        role_bullets: "Role responsibilities (one per line)",
        location: "Location",
        start_date: "Start date",
        end_date: "End date",
        multi_role: "I had multiple roles here",
        roles_title: "Roles in this company",
        add_role_btn: "+ Add role",
        current_job: "I currently work here",
        present: "Present",
        bullets: "Responsibilities (one per line)"
      },
      education: {
        section: "Education",
        add_btn: "+ Add education",
        item_title: "Education",
        degree: "Degree",
        institution: "Institution",
        duration: "Duration",
        location: "Location"
      },
      skills: {
        section: "Skills and certifications",
        label: "Skills"
      },
      certifications: {
        section: "Certifications",
        label: "Certifications"
      },
      additional: {
        section: "Additional (Projects / Languages / Interests)",
        projects_label: "Projects (one per line)",
        languages_label: "Languages (one per line)",
        add_project: "+ Add project",
        add_language: "+ Add language",
        add_interest: "+ Add interest",
        item_title: "Item"
      },
      passions: {
        section: "Interests",
        label: "Interests",
        hint_html: "Format:<br />Title | Description<br />Separate each interest with a blank line."
      },
      actions: {
        load_csv: "Load CSV",
        sample_csv: "Sample CSV",
        generate: "Generate CSV",
        print: "Save PDF",
        clear_form: "Clear form",
        clear_confirm: "Are you sure you want to clear the form?",
        remove: "Remove",
        collapse_section: "Collapse",
        expand_section: "Expand",
        drag: "Drag to reorder"
      },
      preview: {
        profile: "Professional summary",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        certifications: "Certifications",
        additional: "Additional",
        projects: "Projects",
        languages: "Languages",
        passions: "Interests"
      },
      footer: {
        copy: "© 2025 Ruben Rodriguez. Built with HTML, CSS & Vanilla JS."
      },
      empty: {
        initials: "CV",
        name: "YOUR NAME",
        headline: "Your professional title",
        email: "your@email.com",
        linkedin: "linkedin.com/in/username",
        location: "City, Country",
        profile: "Add a professional summary.",
        experience: "Add work experience.",
        education: "Add education.",
        skills: "Add skills.",
        certifications: "Add certifications.",
        projects: "Add projects.",
        languages: "Add languages.",
        passions: "Add interests."
      },
      defaults: {
        fullName: "Ruben Rodriguez",
        headline: "Web Developer | Wordpress Shopify | E-commerce",
        email: "rubenchoweb@outlook.com",
        linkedin: "linkedin.com/in/rubenchoweb",
        location: "Medellin, Colombia",
        titleAdditional: "Additional",
        titleProjects: "Projects",
        titleLanguages: "Languages",
        titleInterests: "Interests",
        profile:
          "Web Developer with 8+ years of experience specializing in eCommerce platforms (WordPress, Shopify, and other CMS), focused on building high-converting websites, landing pages, and scalable marketing funnels.\n\nExperienced working with marketing agencies and cross-functional teams to deliver solutions aligned with paid media, CRO strategies, and business growth. Skilled in CRM integrations, technical SEO, and performance optimization.\n\nStrong ability to bridge marketing and development, combining no-code/low-code tools with custom code to deliver efficient, results-driven web solutions.",
        experienceItems: [
          {
            company: "Pangea Digital Marketing",
            companyUrl: "https://www.pangeadigitalmarketing.co/",
            title: "Web Developer (Freelance)",
            location: "Bogota, Colombia",
            startDate: "2020-03",
            endDate: "",
            isCurrent: true,
            hasMultipleRoles: false,
            bullets: [
              "Developed and maintained WordPress websites and landing pages for campaigns using Elementor and custom components.",
              "Integrated CRM and automation workflows via Zapier or n8n for WPForms, Meta leads and custom endpoints.",
              "Connected landing pages to CRMs and ERPs to support lead generation, attribution and sales operations.",
              "SEO-friendly development based on marketing and conversion requirements.",
              "Tech stack: Shopify, WordPress, Elementor, PHP, JavaScript, HTML5, CSS3, Liquid, MySQL, Bootstrap, CodeIgniter.",
              "Projects: https://blauresidence.com/, https://gprovivienda.com/, https://plazadelasamericas.com.co/, https://elretirocentrocomercial.com/"
            ],
            roles: []
          },
          {
            company: "Holafly",
            companyUrl: "https://esim.holafly.com/",
            title: "",
            location: "Remote",
            startDate: "",
            endDate: "",
            isCurrent: false,
            hasMultipleRoles: true,
            roles: [
              {
                title: "IT Project Manager",
                startDate: "2024-10",
                endDate: "2025-12",
                isCurrent: false,
                bullets: [
                  "Planned and delivered strategic technology initiatives aligned with business growth and customer experience.",
                  "Coordinated cross-functional teams (engineering, QA, marketing, stakeholders).",
                  "Ensured on-time, on-budget delivery with quality and performance standards.",
                  "Identified process improvements and proposed scalable technical solutions."
                ]
              },
              {
                title: "WordPress Tech Lead - eCommerce",
                startDate: "2024-10",
                endDate: "2025-12",
                isCurrent: false,
                bullets: [
                  "Led development of Holafly's eCommerce platform built on WordPress with a custom Shopify checkout.",
                  "Designed and developed custom WordPress plugins and scalable architectures.",
                  "Collaborated with marketing, design, and paid media teams to optimize conversion, tracking, and U/X across campaigns.",
                  "Improved performance, stability, SEO readiness, and Core Web Vitals to support high-traffic acquisition initiatives."
                ]
              },
              {
                title: "Web Developer",
                startDate: "2022-03",
                endDate: "2023-07",
                isCurrent: false,
                bullets: [
                  "Built campaign landing pages, product templates, and content components using WordPress, Shopify, and no-code tools.",
                  "Implemented marketing integrations (email, analytics, pixels, tracking) to support paid media and funnel performance.",
                  "Edited product and content templates.",
                  "Developed custom fields and editable components."
                ]
              }
            ],
            bullets: []
          },
          {
            company: "Sitetuners",
            companyUrl: "https://sitetuners.com/",
            title: "Developer Specialist",
            location: "Tampa FL, U.S.A.",
            startDate: "2021-05",
            endDate: "2021-09",
            isCurrent: false,
            hasMultipleRoles: false,
            bullets: [
              "Modified and extended existing WordPress and Shopify plugins to improve functionality and usability.",
              "Developed high-conversion landing pages with strong UX and CRO focus.",
              "Optimized technical SEO and on-page SEO, improving site structure, metadata, internal linking and indexability.",
              "Performed page speed and performance optimization, including asset optimization, Core Web Vitals improvements and loading-time reduction.",
              "Collaborated with SEO and marketing teams to implement technical recommendations based on audits.",
              "Technologies: WordPress, Shopify, HTML, CSS3, JavaScript, PHP, SQL, Liquid.",
              "Projects: https://barstoolchurch.com/, https://www.designerrevival.com/, https://www.fitnesshubshop.com/"
            ],
            roles: []
          },
          {
            company: "Lafam by EssilorLuxottica",
            companyUrl: "https://www.lafam.com.co/",
            title: "Web Master",
            location: "Colombia",
            startDate: "2019-05",
            endDate: "2021-05",
            isCurrent: false,
            hasMultipleRoles: false,
            bullets: [
              "Managed and maintained a Shopify eCommerce platform with 2,000+ products.",
              "Developed an internal WordPress employee benefits platform using digital coupons.",
              "Maintained a promotions system used nationwide by physical stores.",
              "Technologies: Shopify, WordPress, HTML, CSS, JavaScript, Liquid, PHP, Bootstrap.",
              "Projects: https://lafam.com.co/, https://beneficiosluxottica.com/"
            ],
            roles: []
          }
        ],
        educationItems: [
          {
            degree: "Ingeniería de Sistemas",
            institution: "Universidad Católica de Colombia",
            duration: "5 años",
            location: "Colombia"
          },
          {
            degree: "Continuous courses and learning",
            institution: "WordPress, Shopify, UI, CSS, JavaScript",
            duration: "In progress",
            location: "Online"
          }
        ],
        skills:
          "WordPress, Shopify, HTML, CSS, JavaScript, UI Frontend, Responsive Design, Forms, Landing Pages, Web integrations, Visual optimization, Technical support",
        certifications:
          "You can add relevant certifications, courses, or programs here related to web development, WordPress, Shopify, frontend, or digital marketing.",
        projects:
          "https://esim.holafly.com\nhttps://blauresidence.com/\nhttps://lafam.com.co/",
        languages:
          "Español - Nativo\nInglés - Profesional",
        passions:
          "Desarrollo web - Interés en construir sitios funcionales, claros y bien estructurados que resuelvan necesidades reales de negocio.\nDiseño UI - Motivado por mejorar interfaces visuales, organización de formularios y experiencia del usuario.\nTecnología y aprendizaje continuo - Interés constante en mejorar habilidades técnicas y explorar nuevas herramientas de desarrollo y automatización."
      }
    }
  },
  es: {
    meta: {
      title: "Generador de CV ATS | Rubenchoweb"
    },
    nav: {
      home: "Inicio",
      skills: "Habilidades",
      experience: "Experiencia",
      education: "Educación",
      projects: "Proyectos",
      contact: "Contacto",
      cv_generator: "CV generator"
    },
    ats: {
      title: "Generador de CV ATS",
      subtitle: "Llena el formulario manualmente o carga un CSV para completar tu CV automáticamente.",
      photo: {
        section: "Foto de perfil",
        label: "Subir foto (opcional)",
        hint: "Si no subes foto, se mostrarán tus iniciales."
      },
      personal: {
        section: "Información personal",
        full_name: "Nombre completo",
        headline: "Cargo / titular profesional",
        email: "Email",
        linkedin: "LinkedIn",
        location: "Ubicación"
      },
      profile: {
        section: "Perfil profesional",
        label: "Resumen profesional"
      },
      experience: {
        section: "Experiencia",
        add_btn: "+ Agregar experiencia",
        item_title: "Experiencia",
        company: "Nombre empresa",
        company_url: "Sitio web de la empresa (URL)",
        role: "Cargo",
        role_item_title: "Cargo",
        role_bullets: "Responsabilidades del cargo (una por línea)",
        location: "Lugar",
        start_date: "Fecha de ingreso",
        end_date: "Fecha de retiro",
        multi_role: "Tuve más de un cargo aquí",
        roles_title: "Cargos en esta empresa",
        add_role_btn: "+ Agregar cargo",
        current_job: "Actualmente trabajo aquí",
        present: "Actualidad",
        bullets: "Funciones (una por línea)"
      },
      education: {
        section: "Educación",
        add_btn: "+ Agregar educación",
        item_title: "Educación",
        degree: "Título",
        institution: "Institución",
        duration: "Duración",
        location: "Lugar"
      },
      skills: {
        section: "Habilidades y certificaciones",
        label: "Habilidades"
      },
      certifications: {
        section: "Certificaciones",
        label: "Certificaciones"
      },
      additional: {
        section: "Additional (Projects / Languages / Interests)",
        projects_label: "Projects (uno por línea)",
        languages_label: "Languages (uno por línea)",
        add_project: "+ Agregar proyecto",
        add_language: "+ Agregar idioma",
        add_interest: "+ Agregar interés",
        item_title: "Ítem"
      },
      passions: {
        section: "Pasiones / intereses",
        label: "Pasiones",
        hint_html: "Formato:<br />Título | Descripción<br />Separa cada pasión con una línea en blanco."
      },
      actions: {
        load_csv: "Cargar CSV",
        sample_csv: "CSV de ejemplo",
        generate: "Generar CSV",
        print: "Guardar PDF",
        clear_form: "Limpiar formulario",
        clear_confirm: "¿Seguro que quieres limpiar el formulario?",
        remove: "Eliminar",
        collapse_section: "Colapsar",
        expand_section: "Expandir",
        drag: "Arrastrar para ordenar"
      },
      preview: {
        profile: "Perfil profesional",
        experience: "Experiencia",
        education: "Educación",
        skills: "Habilidades",
        certifications: "Certificaciones",
        additional: "Additional",
        projects: "Projects",
        languages: "Languages",
        passions: "Pasiones"
      },
      footer: {
        copy: "© 2025 Ruben Rodriguez. Built with HTML, CSS & Vanilla JS."
      },
      empty: {
        initials: "CV",
        name: "TU NOMBRE",
        headline: "Tu cargo profesional",
        email: "tu@email.com",
        linkedin: "linkedin.com/in/usuario",
        location: "Ciudad, País",
        profile: "Agrega un perfil profesional.",
        experience: "Agrega experiencia laboral.",
        education: "Agrega educación.",
        skills: "Agrega habilidades.",
        certifications: "Agrega certificaciones.",
        projects: "Agrega proyectos.",
        languages: "Agrega idiomas.",
        passions: "Agrega intereses o pasiones."
      },
      defaults: {
        fullName: "Ruben Rodriguez",
        headline: "Web Developer | Wordpress Shopify | E-commerce",
        email: "rubenchoweb@outlook.com",
        linkedin: "linkedin.com/in/rubenchoweb",
        location: "Medellín, Colombia",
        titleAdditional: "Additional",
        titleProjects: "Projects",
        titleLanguages: "Languages",
        titleInterests: "Interests",
        profile:
          "Desarrollador web con más de 8 años de experiencia, especializado en plataformas eCommerce (WordPress, Shopify y otros CMS), enfocado en crear sitios web de alta conversión, landing pages y embudos de marketing escalables.\n\nExperiencia trabajando con agencias de marketing y equipos multidisciplinarios para entregar soluciones alineadas con paid media, estrategias CRO y crecimiento del negocio. Hábil en integraciones CRM, SEO técnico y optimización de rendimiento.\n\nFuerte capacidad para unir marketing y desarrollo, combinando herramientas no-code/low-code con código personalizado para entregar soluciones web eficientes y orientadas a resultados.",
        experienceItems: [
          {
            company: "Pangea Digital Marketing",
            companyUrl: "https://www.pangeadigitalmarketing.co/",
            title: "Web Developer (Freelance)",
            location: "Bogotá, Colombia",
            startDate: "2020-03",
            endDate: "",
            isCurrent: true,
            hasMultipleRoles: false,
            bullets: [
              "Developed and maintained WordPress websites and landing pages for campaigns using Elementor and custom components.",
              "Integrated CRM and automation workflows via Zapier or n8n for WPForms, Meta leads and custom endpoints.",
              "Connected landing pages to CRMs and ERPs to support lead generation, attribution and sales operations.",
              "SEO-friendly development based on marketing and conversion requirements.",
              "Tech stack: Shopify, WordPress, Elementor, PHP, JavaScript, HTML5, CSS3, Liquid, MySQL, Bootstrap, CodeIgniter.",
              "Projects: https://blauresidence.com/, https://gprovivienda.com/, https://plazadelasamericas.com.co/, https://elretirocentrocomercial.com/"
            ],
            roles: []
          },
          {
            company: "Holafly",
            companyUrl: "https://esim.holafly.com/",
            title: "",
            location: "Remote",
            startDate: "",
            endDate: "",
            isCurrent: false,
            hasMultipleRoles: true,
            roles: [
              {
                title: "IT Project Manager",
                startDate: "2024-10",
                endDate: "2025-12",
                isCurrent: false,
                bullets: [
                  "Planned and delivered strategic technology initiatives aligned with business growth and customer experience.",
                  "Coordinated cross-functional teams (engineering, QA, marketing, stakeholders).",
                  "Ensured on-time, on-budget delivery with quality and performance standards.",
                  "Identified process improvements and proposed scalable technical solutions."
                ]
              },
              {
                title: "WordPress Tech Lead - eCommerce",
                startDate: "2024-10",
                endDate: "2025-12",
                isCurrent: false,
                bullets: [
                  "Led development of Holafly's eCommerce platform built on WordPress with a custom Shopify checkout.",
                  "Designed and developed custom WordPress plugins and scalable architectures.",
                  "Collaborated with marketing, design, and paid media teams to optimize conversion, tracking, and U/X across campaigns.",
                  "Improved performance, stability, SEO readiness, and Core Web Vitals to support high-traffic acquisition initiatives."
                ]
              },
              {
                title: "Web Developer",
                startDate: "2022-03",
                endDate: "2023-07",
                isCurrent: false,
                bullets: [
                  "Built campaign landing pages, product templates, and content components using WordPress, Shopify, and no-code tools.",
                  "Implemented marketing integrations (email, analytics, pixels, tracking) to support paid media and funnel performance.",
                  "Edited product and content templates.",
                  "Developed custom fields and editable components."
                ]
              }
            ],
            bullets: []
          },
          {
            company: "Sitetuners",
            companyUrl: "https://sitetuners.com/",
            title: "Developer Specialist",
            location: "Tampa FL, U.S.A.",
            startDate: "2021-05",
            endDate: "2021-09",
            isCurrent: false,
            hasMultipleRoles: false,
            bullets: [
              "Modified and extended existing WordPress and Shopify plugins to improve functionality and usability.",
              "Developed high-conversion landing pages with strong UX and CRO focus.",
              "Optimized technical SEO and on-page SEO, improving site structure, metadata, internal linking and indexability.",
              "Performed page speed and performance optimization, including asset optimization, Core Web Vitals improvements and loading-time reduction.",
              "Collaborated with SEO and marketing teams to implement technical recommendations based on audits.",
              "Technologies: WordPress, Shopify, HTML, CSS3, JavaScript, PHP, SQL, Liquid.",
              "Projects: https://barstoolchurch.com/, https://www.designerrevival.com/, https://www.fitnesshubshop.com/"
            ],
            roles: []
          },
          {
            company: "Lafam by EssilorLuxottica",
            companyUrl: "https://www.lafam.com.co/",
            title: "Web Master",
            location: "Colombia",
            startDate: "2019-05",
            endDate: "2021-05",
            isCurrent: false,
            hasMultipleRoles: false,
            bullets: [
              "Managed and maintained a Shopify eCommerce platform with 2,000+ products.",
              "Developed an internal WordPress employee benefits platform using digital coupons.",
              "Maintained a promotions system used nationwide by physical stores.",
              "Technologies: Shopify, WordPress, HTML, CSS, JavaScript, Liquid, PHP, Bootstrap.",
              "Projects: https://lafam.com.co/, https://beneficiosluxottica.com/"
            ],
            roles: []
          }
        ],
        educationItems: [
          {
            degree: "Engineering: Computer Science",
            institution: "Universidad Catolica de Colombia",
            duration: "5 years",
            location: "Colombia"
          },
          {
            degree: "Cursos y aprendizaje continuo",
            institution: "WordPress, Shopify, UI, CSS, JavaScript",
            duration: "En curso",
            location: "Online"
          }
        ],
        skills:
          "WordPress, Shopify, HTML, CSS, JavaScript, UI Frontend, Responsive Design, Formularios, Landing Pages, Integraciones web, Optimización visual, Soporte técnico",
        certifications:
          "Puedes agregar aquí certificaciones, cursos o programas relevantes relacionados con desarrollo web, WordPress, Shopify, frontend o marketing digital.",
        projects:
          "https://esim.holafly.com\nhttps://blauresidence.com/\nhttps://lafam.com.co/",
        languages:
          "Spanish - Native\nEnglish - Professional",
        passions:
          "Web development - Interest in building functional, clear, and well-structured websites that solve real business needs.\nUI design - Motivated by improving visual interfaces, form organization, and user experience.\nTechnology and continuous learning - Constant interest in improving technical skills and exploring new tools for development and automation."
      }
    }
  }
};
