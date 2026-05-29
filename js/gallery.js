/**
 * GALLERY.JS — Certificate gallery rendering and lightbox
 *
 * Handles:
 *  - Rendering GALLERY_ITEMS into the gallery grid
 *  - Icon-based cards for achievement showcase
 *  - Lightbox for image items (when real photos are added)
 *  - Staggered entrance animations
 */

import { GALLERY_ITEMS } from './config.js';
import { qs, qsAll, createElement, addClass, removeClass } from './utils.js';

// ============================================================
// LIGHTBOX STATE
// ============================================================

let lightboxImages = [];
let currentLightboxIndex = 0;

// ============================================================
// TEMPLATE BUILDERS
// ============================================================

/**
 * Builds a gallery card for icon-type items (placeholders / achievements).
 * @param {Object} item — Gallery item from config.js
 * @param {number} index — For staggered animation delay
 * @returns {Element}
 */
function buildIconCard(item, index) {
  const card = createElement('div', {
    className:    'gallery__icon-item',
    role:         'button',
    tabIndex:     '0',
    'aria-label': item.title,
    'data-animate': 'scale',
  });

  card.style.transitionDelay = `${index * 60}ms`;

  card.innerHTML = `
    <div class="gallery__icon">
      <i class="fas ${item.icon}"></i>
    </div>
    <span class="gallery__icon-title">${item.title}</span>
    <span class="gallery__icon-subtitle">${item.subtitle}</span>
  `;

  // Open detail modal on click
  card.addEventListener('click', () => openGalleryModal(item));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openGalleryModal(item);
  });

  return card;
}

/**
 * Builds a gallery card for image-type items.
 * @param {Object} item — Gallery item
 * @param {number} index — For animation ordering
 * @returns {Element}
 */
function buildImageCard(item, index) {
  const card = createElement('div', {
    className:    'gallery__item',
    role:         'button',
    tabIndex:     '0',
    'aria-label': item.title,
    'data-animate': 'scale',
  });

  card.style.transitionDelay = `${index * 60}ms`;

  const img = createElement('img', {
    src:     item.src,
    alt:     item.title,
    loading: 'lazy',
  });

  // Blur-up effect: start blurred, clear on load
  img.classList.add('loading');
  img.addEventListener('load', () => img.classList.remove('loading'));

  const overlay = createElement('div', {
    className: 'gallery__overlay',
    innerHTML: `
      <span class="gallery__overlay-title">${item.title}</span>
      <span class="gallery__overlay-date">${item.subtitle}</span>
    `,
  });

  card.appendChild(img);
  card.appendChild(overlay);

  card.addEventListener('click', () => openLightbox(item.src, item.title));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') openLightbox(item.src, item.title);
  });

  return card;
}

// ============================================================
// GALLERY MODAL (for icon cards)
// ============================================================

/**
 * Opens the gallery detail modal with the selected item's content.
 * @param {Object} item — Gallery item from config.js
 */
function openGalleryModal(item) {
  const modal   = qs('#gallery-modal');
  const titleEl = qs('.modal__title',  modal);
  const bodyEl  = qs('.modal__body',   modal);

  if (!modal) return;

  if (titleEl) titleEl.textContent = item.title;

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div class="gallery-modal">
        <div class="gallery-modal__icon">
          <i class="fas ${item.icon}"></i>
        </div>
        <p class="gallery-modal__subtitle">${item.subtitle}</p>
        <p class="gallery-modal__desc">${item.description}</p>
        <p class="gallery-modal__placeholder">
          <i class="fas fa-info-circle"></i>
          Original certificate available upon request.
        </p>
      </div>
    `;
  }

  // Use the modals module to handle open/close/backdrop
  import('./modals.js').then(({ openModal }) => openModal(modal));
}

// ============================================================
// LIGHTBOX (for image cards)
// ============================================================

/**
 * Opens the fullscreen lightbox for a given image.
 * @param {string} src   — Image URL
 * @param {string} title — Caption text
 */
function openLightbox(src, title) {
  const lightbox = qs('.lightbox');
  if (!lightbox) return;

  const imgEl     = qs('.lightbox__img',    lightbox);
  const counterEl = qs('.lightbox__counter', lightbox);

  if (imgEl) {
    imgEl.src = src;
    imgEl.alt = title;
  }

  if (counterEl) counterEl.textContent = title;

  addClass(lightbox, 'open');
  document.body.style.overflow = 'hidden';

  // Escape closes lightbox
  document.addEventListener('keydown', closeLightboxOnEscape, { once: true });
}

/** Closes the lightbox. */
export function closeLightbox() {
  const lightbox = qs('.lightbox');
  if (!lightbox) return;

  removeClass(lightbox, 'open');
  document.body.style.overflow = '';
}

/** Keyboard handler to close lightbox on Escape. */
function closeLightboxOnEscape(event) {
  if (event.key === 'Escape') closeLightbox();
}

// ============================================================
// RENDER
// ============================================================

/**
 * Renders all GALLERY_ITEMS into the `.gallery__grid` container.
 */
export function renderGallery() {
  const container = qs('.gallery__grid');
  if (!container) return;

  container.innerHTML = '';

  GALLERY_ITEMS.forEach((item, index) => {
    const card = item.type === 'image'
      ? buildImageCard(item, index)
      : buildIconCard(item, index);

    container.appendChild(card);
  });
}

// ============================================================
// INITIALISATION
// ============================================================

/**
 * Initialises the gallery and lightbox close handlers.
 */
export function initGallery() {
  renderGallery();

  // Lightbox close button
  const closeBtn = qs('.lightbox__close');
  closeBtn?.addEventListener('click', closeLightbox);

  // Clicking outside image closes lightbox
  qs('.lightbox')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });
}
