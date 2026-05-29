/**
 * MODALS.JS — Modal open / close / navigation management
 *
 * Handles:
 *  - Opening and closing any modal by ID
 *  - Body scroll lock while modal is open
 *  - Keyboard trap (Escape closes, Tab stays in modal)
 *  - Backdrop click to dismiss
 *  - Navigation arrows between an array of modal data items
 */

import { qs, qsAll, addClass, removeClass } from './utils.js';

// ============================================================
// MODULE STATE
// ============================================================

/** Currently active modal element */
let activeModal    = null;
let activeBackdrop = null;

/** Navigation state for arrow-based modals (timeline, gallery) */
let navItems        = [];
let currentNavIndex = 0;
let populateFn      = null; // Function(item) that fills the modal body

// ============================================================
// PRIVATE HELPERS
// ============================================================

/**
 * Locks the document body scroll while a modal is open.
 * Preserves the current scroll position to avoid layout jump.
 */
function lockBodyScroll() {
  const scrollY = window.scrollY;
  document.body.style.position   = 'fixed';
  document.body.style.top        = `-${scrollY}px`;
  document.body.style.width      = '100%';
  document.body.style.overflowY  = 'scroll';
}

/**
 * Restores body scroll and returns to the previous scroll position.
 */
function unlockBodyScroll() {
  const scrollY = parseInt(document.body.style.top || '0', 10) * -1;
  document.body.style.position  = '';
  document.body.style.top       = '';
  document.body.style.width     = '';
  document.body.style.overflowY = '';
  window.scrollTo(0, scrollY);
}

/**
 * Handles keydown events on the document while a modal is open.
 * Closes on Escape; traps Tab focus within the modal.
 * @param {KeyboardEvent} event
 */
function handleKeyDown(event) {
  if (!activeModal) return;

  if (event.key === 'Escape') {
    closeModal();
    return;
  }

  // Tab trap — keep focus within the modal
  if (event.key === 'Tab') {
    const focusable = qsAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      activeModal
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Arrow key navigation within navItems
  if (navItems.length && event.key === 'ArrowRight') navigateModal(1);
  if (navItems.length && event.key === 'ArrowLeft')  navigateModal(-1);
}

// ============================================================
// NAVIGATION HELPERS
// ============================================================

/**
 * Updates the navigation arrow buttons' disabled state.
 */
function syncNavArrows() {
  const prevBtn = qs('.modal__arrow--prev', activeModal);
  const nextBtn = qs('.modal__arrow--next', activeModal);
  const counter = qs('.modal__nav-counter',  activeModal);

  if (prevBtn) prevBtn.disabled = currentNavIndex === 0;
  if (nextBtn) nextBtn.disabled = currentNavIndex === navItems.length - 1;
  if (counter) {
    counter.textContent = `${currentNavIndex + 1} / ${navItems.length}`;
  }
}

/**
 * Moves to the next or previous item in the navItems array.
 * @param {number} direction — +1 for next, -1 for previous
 */
export function navigateModal(direction) {
  const nextIndex = currentNavIndex + direction;
  if (nextIndex < 0 || nextIndex >= navItems.length) return;

  currentNavIndex = nextIndex;

  if (populateFn && activeModal) {
    populateFn(navItems[currentNavIndex], activeModal);
  }

  syncNavArrows();
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Opens a modal element by selector or DOM reference.
 *
 * @param {string|Element} modalOrSelector — Modal element or selector string
 * @param {Object} [navConfig] — Optional navigation configuration
 * @param {Array}    navConfig.items    — Array of data items to navigate
 * @param {number}   navConfig.startIndex — Initial item index
 * @param {Function} navConfig.populate   — Called with (item, modalEl) to fill content
 */
export function openModal(modalOrSelector, navConfig = null) {
  const modal = typeof modalOrSelector === 'string'
    ? qs(modalOrSelector)
    : modalOrSelector;

  if (!modal) return;

  activeModal    = modal;
  activeBackdrop = qs('.modal-backdrop');

  // Setup navigation if provided
  if (navConfig) {
    navItems        = navConfig.items    || [];
    currentNavIndex = navConfig.startIndex ?? 0;
    populateFn      = navConfig.populate  || null;

    if (populateFn) {
      populateFn(navItems[currentNavIndex], modal);
    }

    syncNavArrows();
  }

  // Activate
  addClass(modal,          'open');
  activeBackdrop && addClass(activeBackdrop, 'open');
  lockBodyScroll();
  document.addEventListener('keydown', handleKeyDown);

  // Focus the close button for keyboard accessibility
  const closeBtn = qs('.modal__close', modal);
  closeBtn?.focus();

  // Bind navigation arrows
  const prevBtn = qs('.modal__arrow--prev', modal);
  const nextBtn = qs('.modal__arrow--next', modal);
  prevBtn?.addEventListener('click', () => navigateModal(-1));
  nextBtn?.addEventListener('click', () => navigateModal(1));

  // Bind backdrop click
  activeBackdrop?.addEventListener('click', closeModal, { once: true });
}

/**
 * Closes the currently active modal.
 */
export function closeModal() {
  if (!activeModal) return;

  removeClass(activeModal, 'open');
  activeBackdrop && removeClass(activeBackdrop, 'open');
  unlockBodyScroll();
  document.removeEventListener('keydown', handleKeyDown);

  // Reset navigation state
  navItems        = [];
  currentNavIndex = 0;
  populateFn      = null;
  activeModal     = null;
}

/**
 * Initialises close buttons for all modals on the page.
 * Binds `.modal__close` buttons to closeModal().
 */
export function initModals() {
  qsAll('.modal__close').forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });
}
