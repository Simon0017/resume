/**
 * MAIN.JS — Application entry point
 *
 * Orchestrates module initialisation in the correct order
 * after the DOM is ready. Handles:
 *  - Theme initialisation (before paint to avoid flash)
 *  - Navigation (mobile menu, smooth scroll)
 *  - Scroll animations and header behaviour
 *  - Content rendering (timeline, gallery, skills)
 *  - Three.js effects (with WebGL feature detection)
 *  - Dynamic footer year
 */

import { initTheme }        from './theme.js';
import { initAnimations }   from './animations.js';
import { initModals }       from './modals.js';
import { renderTimeline }   from './timeline.js';
import { initGallery }      from './gallery.js';
import { qs, qsAll, currentYear, supportsWebGL, isMobile } from './utils.js';
import { SKILLS, LANGUAGES, REFERENCES }  from './config.js';

// ============================================================
// NAVIGATION
// ============================================================

/**
 * Initialises the mobile hamburger menu toggle.
 */
function initMobileMenu() {
  const hamburger  = qs('.hamburger');
  const mobileMenu = qs('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    hamburger.classList.toggle('open', !isOpen);
    mobileMenu.classList.toggle('open', !isOpen);
    hamburger.setAttribute('aria-expanded', String(!isOpen));
  });

  // Close menu when a link is tapped
  qsAll('.mobile-menu__link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Applies smooth scroll to all anchor links pointing to page sections.
 */
function initSmoothScroll() {
  qsAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================================
// SKILLS SECTION RENDERING
// ============================================================

/**
 * Renders skill cards from the SKILLS config into the skills grid.
 */
function renderSkills() {
  const grid = qs('.skills__grid');
  if (!grid) return;

  grid.innerHTML = SKILLS.map(({ title, description, icon }) => `
    <div class="skill-card" data-animate="slide-up">
      <div class="skill-card__icon">
        <i class="fas ${icon}"></i>
      </div>
      <div>
        <h5 class="skill-card__title">${title}</h5>
        <p class="skill-card__desc">${description}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================
// LANGUAGES RENDERING
// ============================================================

/**
 * Renders language proficiency items from the LANGUAGES config.
 */
function renderLanguages() {
  const grid = qs('.languages__grid');
  if (!grid) return;

  grid.innerHTML = LANGUAGES.map(({ name, proficiency }) => {
    const dots = Array.from({ length: 5 }, (_, i) =>
      `<span class="lang-dot ${i < proficiency ? 'filled' : ''}"></span>`
    ).join('');

    return `
      <div class="language-item" data-animate="scale">
        <span class="language-item__name">${name}</span>
        <div class="lang-dots">${dots}</div>
        <span class="language-item__level">Native / Full Professional</span>
      </div>
    `;
  }).join('');
}

// ============================================================
// REFERENCES RENDERING
// ============================================================

/**
 * Renders reference cards from the REFERENCES config.
 */
function renderReferences() {
  const grid = qs('.references__grid');
  if (!grid) return;

  grid.innerHTML = REFERENCES.map(({ name, role, organisation, initials }) => `
    <div class="reference-card" data-animate="slide-up">
      <div class="reference-card__avatar">${initials}</div>
      <div>
        <p class="reference-card__name">${name}</p>
        <p class="reference-card__role">${role}</p>
        <p class="reference-card__org">${organisation}</p>
      </div>
    </div>
  `).join('');
}

// ============================================================
// DYNAMIC FOOTER YEAR
// ============================================================

/**
 * Populates any element with class `.year-dynamic` with the current year.
 */
function setDynamicYear() {
  qsAll('.year-dynamic').forEach((el) => {
    el.textContent = currentYear();
  });
}

// ============================================================
// THREE.JS EFFECTS
// ============================================================

/**
 * Conditionally loads and initialises Three.js particle effects.
 * Skips on devices that don't support WebGL or mobile devices
 * where the performance cost outweighs the benefit.
 */
async function initThreeEffects() {
  if (!supportsWebGL()) return;

  try {
    const { createParticleField } = await import('./three-effects.js');

    // Only show particle field on desktop to preserve mobile performance
    if (!isMobile()) {
      createParticleField('hero-canvas');
    }
  } catch (error) {
    // Three.js failed to load — fallback CSS animations already active
    console.info('[main] Three.js effects unavailable:', error.message);
  }
}

// ============================================================
// BOOTSTRAP
// ============================================================

/**
 * Main initialisation sequence.
 * Called once the DOM content has fully loaded.
 */
function bootstrap() {
  // Theme must be set first to prevent light/dark flash
  initTheme();

  // Navigation
  initMobileMenu();
  initSmoothScroll();

  // Modals
  initModals();

  // Render dynamic content
  renderTimeline();
  renderSkills();
  renderLanguages();
  renderReferences();
  initGallery();

  // Scroll behaviour and reveal animations
  initAnimations();

  // Dynamic content
  setDynamicYear();

  // Three.js — loaded after everything else to avoid blocking
  // Use requestIdleCallback for non-critical enhancement
  if ('requestIdleCallback' in window) {
    requestIdleCallback(initThreeEffects);
  } else {
    setTimeout(initThreeEffects, 500);
  }
}

// ============================================================
// ENTRY POINT
// ============================================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  // DOM already parsed (e.g. script placed at end of body)
  bootstrap();
}
