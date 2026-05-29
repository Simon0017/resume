/**
 * UTILS.JS — Shared helper functions
 *
 * Pure utility functions with no side effects or global state.
 * Import only what you need in each module.
 */

// ============================================================
// DOM HELPERS
// ============================================================

/**
 * Shorthand for querySelector — returns first matching element.
 * @param {string} selector - CSS selector
 * @param {Element} [parent=document] - Root element to search within
 * @returns {Element|null}
 */
export const qs = (selector, parent = document) => parent.querySelector(selector);

/**
 * Shorthand for querySelectorAll — returns NodeList as Array.
 * @param {string} selector - CSS selector
 * @param {Element} [parent=document] - Root element to search within
 * @returns {Element[]}
 */
export const qsAll = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

/**
 * Creates an element with optional properties applied.
 * @param {string} tag - HTML tag name
 * @param {Object} [props={}] - Properties to assign (className, innerHTML, etc.)
 * @param {string} [props.className]
 * @param {string} [props.innerHTML]
 * @returns {Element}
 */
export function createElement(tag, props = {}) {
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  });
  return element;
}

/**
 * Adds one or more CSS classes to an element.
 * @param {Element} element
 * @param {...string} classNames
 */
export const addClass = (element, ...classNames) =>
  element.classList.add(...classNames);

/**
 * Removes one or more CSS classes from an element.
 * @param {Element} element
 * @param {...string} classNames
 */
export const removeClass = (element, ...classNames) =>
  element.classList.remove(...classNames);

/**
 * Toggles a CSS class on an element.
 * @param {Element} element
 * @param {string} className
 * @param {boolean} [force] - Force add (true) or remove (false)
 */
export const toggleClass = (element, className, force) =>
  element.classList.toggle(className, force);

// ============================================================
// PERFORMANCE HELPERS
// ============================================================

/**
 * Debounce — delays execution until after a pause in calls.
 * Ideal for resize/input events.
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Milliseconds to wait
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle — limits execution to once per interval.
 * Ideal for scroll events.
 * @param {Function} fn - Function to throttle
 * @param {number} interval - Minimum milliseconds between calls
 * @returns {Function}
 */
export function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// ============================================================
// ANIMATION HELPERS
// ============================================================

/**
 * Easing function — easeOutCubic.
 * Maps t (0-1) through a cubic ease-out curve.
 * @param {number} t - Progress value between 0 and 1
 * @returns {number}
 */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/**
 * Animates a numeric value from start to end over a given duration.
 * Uses requestAnimationFrame for smooth rendering.
 * @param {number} start - Starting value
 * @param {number} end - Target value
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} onUpdate - Called with current value each frame
 * @param {Function} [onComplete] - Called when animation finishes
 * @returns {Function} cancel - Call to stop animation
 */
export function animateNumber(start, end, duration, onUpdate, onComplete) {
  const startTime = performance.now();
  let rafId;

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentValue = Math.round(start + (end - start) * easedProgress);

    onUpdate(currentValue);

    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

// ============================================================
// BROWSER / DEVICE DETECTION
// ============================================================

/**
 * Checks whether WebGL is supported by the current browser.
 * Used to decide whether to initialise Three.js.
 * @returns {boolean}
 */
export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Returns true if the user prefers reduced motion.
 * All animations should respect this preference.
 * @returns {boolean}
 */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Returns true if the viewport is below the mobile breakpoint.
 * @param {number} [breakpoint=768]
 * @returns {boolean}
 */
export const isMobile = (breakpoint = 768) => window.innerWidth < breakpoint;

// ============================================================
// STRING HELPERS
// ============================================================

/**
 * Truncates a string to a maximum length, adding ellipsis if needed.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export const truncate = (str, maxLength) =>
  str.length > maxLength ? `${str.slice(0, maxLength - 3)}...` : str;

/**
 * Returns the current year as a string — for dynamic copyright footers.
 * @returns {string}
 */
export const currentYear = () => new Date().getFullYear().toString();
