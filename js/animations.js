/**
 * ANIMATIONS.JS — Scroll-triggered animations and header effects
 *
 * Handles:
 *  - Intersection Observer–based reveal animations
 *  - Sticky header scroll behaviour
 *  - Scroll-progress bar
 *  - Scroll-to-top button visibility
 *  - Parallax hero background
 *  - Active nav link highlighting
 *  - Counter animations for statistics
 */

import { qs, qsAll, throttle, animateNumber, prefersReducedMotion } from './utils.js';
import { ANIMATION_CONFIG } from './config.js';

// ============================================================
// INTERSECTION OBSERVER — SCROLL REVEALS
// ============================================================

/**
 * Creates an Intersection Observer that adds `is-visible` to
 * any element with a `[data-animate]` attribute once it enters
 * the viewport.  Staggered children within `[data-stagger]`
 * parents get progressive transition-delay applied in CSS.
 *
 * @returns {IntersectionObserver}
 */
function createRevealObserver() {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after reveal so it doesn't re-trigger on scroll-up
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  ANIMATION_CONFIG.scrollThreshold,
      rootMargin: ANIMATION_CONFIG.scrollRootMargin,
    }
  );
}

let revealObserver;

/**
 * Attaches the reveal observer to every `[data-animate]` element.
 * If reduced-motion is requested, elements are made visible immediately.
 */
export function initScrollReveal() {
  const targets = qsAll('[data-animate]');
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    // Respect the user's accessibility preference — show all immediately
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = createRevealObserver();
  targets.forEach((el) => revealObserver.observe(el));
}

// ============================================================
// HEADER SCROLL BEHAVIOUR
// ============================================================

/**
 * Adds/removes `.header--scrolled` class based on scroll position.
 * Also updates the active navigation link.
 */
function handleHeaderScroll() {
  const header = qs('.header');
  if (!header) return;

  const isScrolled = window.scrollY > 24;
  header.classList.toggle('header--scrolled', isScrolled);
}

/**
 * Highlights the nav link whose target section is currently
 * within the viewport using scroll position.
 */
function updateActiveNavLink() {
  const sections = qsAll('section[id]');
  const navLinks = qsAll('.nav__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  let currentId = '';
  const scrollMidpoint = window.scrollY + window.innerHeight * 0.45;

  sections.forEach((section) => {
    if (section.offsetTop <= scrollMidpoint) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

// ============================================================
// SCROLL-PROGRESS BAR
// ============================================================

/**
 * Updates the CSS transform of the progress bar element to
 * reflect how far the user has scrolled through the page.
 */
function updateProgressBar() {
  const bar = qs('.progress-bar');
  if (!bar) return;

  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? scrollTop / docHeight : 0;

  bar.style.transform = `scaleX(${progress})`;
}

// ============================================================
// SCROLL-TO-TOP BUTTON
// ============================================================

/**
 * Shows or hides the scroll-to-top button based on page position.
 */
function updateScrollTopButton() {
  const btn = qs('.scroll-top');
  if (!btn) return;

  btn.classList.toggle('visible', window.scrollY > 500);
}

/**
 * Binds the scroll-to-top button click to smooth-scroll back.
 */
function initScrollTopButton() {
  const btn = qs('.scroll-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// COUNTER ANIMATIONS (STATISTICS)
// ============================================================

/**
 * Animates all elements with `[data-counter]` from 0 to their
 * target value when they first enter the viewport.
 */
export function initCounterAnimations() {
  const counters = qsAll('[data-counter]');
  if (!counters.length || prefersReducedMotion()) return;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target  = parseInt(element.getAttribute('data-counter'), 10);
        const suffix  = element.getAttribute('data-counter-suffix') || '';

        animateNumber(
          0,
          target,
          ANIMATION_CONFIG.counterDuration,
          (value) => { element.textContent = value + suffix; }
        );

        counterObserver.unobserve(element);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => counterObserver.observe(el));
}

// ============================================================
// PARALLAX (HERO)
// ============================================================

/**
 * Applies a mild parallax offset to the hero background on scroll.
 * Only runs when reduced-motion is not preferred.
 */
function applyParallax() {
  const hero = qs('.hero');
  if (!hero || prefersReducedMotion()) return;

  const scrolled = window.scrollY;
  // Move background at 35% the scroll speed for a subtle depth effect
  hero.style.setProperty('--parallax-offset', `${scrolled * 0.35}px`);
}

// ============================================================
// MASTER SCROLL HANDLER
// ============================================================

/**
 * Combines all scroll-dependent updates into a single throttled
 * listener to avoid multiple separate event handlers.
 */
const onScroll = throttle(() => {
  handleHeaderScroll();
  updateActiveNavLink();
  updateProgressBar();
  updateScrollTopButton();
  applyParallax();
}, 16); // ~60fps

// ============================================================
// INITIALISATION
// ============================================================

/**
 * Wires up all animation and scroll behaviour.
 * Should be called once after the DOM is ready.
 */
export function initAnimations() {
  // Scroll listener
  window.addEventListener('scroll', onScroll, { passive: true });

  // Run once to set initial states before first scroll
  handleHeaderScroll();
  updateProgressBar();
  updateScrollTopButton();

  // Bind scroll-to-top button
  initScrollTopButton();

  // Scroll-reveal observer
  initScrollReveal();

  // Counter animations
  initCounterAnimations();
}
