/**
 * TIMELINE.JS — Career timeline rendering and interactions
 *
 * Renders the CAREER_TIMELINE data into the DOM and handles:
 *  - Alternating left/right layout (desktop) / single column (mobile)
 *  - Click-to-open detail modal with navigation arrows
 *  - Scroll-reveal on each timeline item via IntersectionObserver
 */

import { CAREER_TIMELINE } from './config.js';
import { qs, createElement } from './utils.js';
import { openModal } from './modals.js';

// ============================================================
// TEMPLATE BUILDERS
// ============================================================

/**
 * Builds the HTML string for the expanded modal content of a
 * single timeline entry.
 *
 * @param {Object} item — Career timeline entry from config.js
 * @returns {string} HTML string
 */
function buildModalHTML(item) {
  const skillTags = (item.skills || [])
    .map((s) => `<span class="tag tag--${item.type}">${s}</span>`)
    .join('');

  const resultHTML = item.result
    ? `<div class="timeline-modal__result">
         <i class="fas fa-trophy"></i>
         <span>${item.result}</span>
       </div>`
    : '';

  const referenceHTML = item.reference
    ? `<p class="timeline-modal__ref"><i class="fas fa-user-tie"></i> Reference: ${item.reference}</p>`
    : '';

  return `
    <div class="timeline-modal">
      <div class="timeline-modal__meta">
        <span class="tag tag--${item.type}">${capitalise(item.type)}</span>
        <span class="timeline-modal__year">${item.year}</span>
      </div>
      ${resultHTML}
      <h4 class="timeline-modal__org">${item.organisation}</h4>
      <p class="timeline-modal__detail">${item.detail}</p>
      ${skillTags ? `<div class="timeline-modal__skills flex flex-wrap gap-2">${skillTags}</div>` : ''}
      ${referenceHTML}
    </div>
  `;
}

/**
 * Builds a single timeline card element.
 *
 * @param {Object} item — Career timeline entry
 * @param {number} index — Index for staggered animation delay
 * @returns {Element}
 */
function buildTimelineCard(item, index) {
  const side = index % 2 === 0 ? 'left' : 'right';

  // Outer item row
  const row = createElement('div', {
    className: `timeline__item timeline__item--${side}`,
    'data-animate': 'slide-up',
  });
  row.style.transitionDelay = `${index * 60}ms`;

  // Left ghost spacer (for right-aligned items)
  const leftSpacer  = createElement('div', { className: 'timeline__spacer' });
  const rightSpacer = createElement('div', { className: 'timeline__spacer' });

  // Node column
  const nodeCol  = createElement('div', { className: 'timeline__node-col' });
  const node     = createElement('div', {
    className:       `timeline__node type-${item.type}`,
    role:            'button',
    tabIndex:        '0',
    'aria-label':    `${item.title} — click to expand`,
    innerHTML:       `<i class="fas ${item.icon}"></i>`,
  });
  nodeCol.appendChild(node);

  // Card wrapper
  const cardWrapper = createElement('div', { className: 'timeline__card-wrapper' });

  const card = createElement('div', {
    className:    'timeline__card',
    role:         'button',
    tabIndex:     '0',
    'aria-label': `Expand ${item.title}`,
  });

  card.innerHTML = `
    <div class="timeline__card-date">${item.year}</div>
    <h4 class="timeline__card-title">${item.title}</h4>
    <p class="timeline__card-org">${item.organisation}</p>
    <p class="timeline__card-desc">${item.description}</p>
    <span class="timeline__expand-hint">
      <i class="fas fa-expand-alt"></i> View details
    </span>
  `;

  if (item.highlight) {
    card.style.borderColor = 'rgba(201,168,76,0.4)';
    card.style.background  = 'linear-gradient(135deg, var(--color-bg-card), rgba(201,168,76,0.04))';
  }

  cardWrapper.appendChild(card);

  // Compose columns in the correct grid order
  if (side === 'left') {
    row.appendChild(cardWrapper);
    row.appendChild(nodeCol);
    row.appendChild(rightSpacer);
  } else {
    row.appendChild(leftSpacer);
    row.appendChild(nodeCol);
    row.appendChild(cardWrapper);
  }

  // Open modal on click / Enter key
  function openItemModal() {
    populateAndOpenModal(index);
  }

  card.addEventListener('click', openItemModal);
  node.addEventListener('click', openItemModal);
  card.addEventListener('keydown', (e) => e.key === 'Enter' && openItemModal());
  node.addEventListener('keydown', (e) => e.key === 'Enter' && openItemModal());

  return row;
}

// ============================================================
// MODAL POPULATION
// ============================================================

/**
 * Populates the shared timeline modal with data from a given
 * CAREER_TIMELINE item.
 *
 * @param {Object} item — Timeline entry
 * @param {Element} modalEl — Modal DOM element
 */
function populateTimelineModal(item, modalEl) {
  const titleEl = qs('.modal__title', modalEl);
  const bodyEl  = qs('.modal__body',  modalEl);

  if (titleEl) titleEl.textContent = item.title;
  if (bodyEl)  bodyEl.innerHTML    = buildModalHTML(item);
}

/**
 * Opens the timeline modal at a specific index, with arrow navigation.
 * @param {number} startIndex
 */
function populateAndOpenModal(startIndex) {
  const modal = qs('#timeline-modal');
  if (!modal) return;

  openModal(modal, {
    items:      CAREER_TIMELINE,
    startIndex,
    populate:   populateTimelineModal,
  });
}

// ============================================================
// TIMELINE LINE ANIMATION
// ============================================================

/**
 * Animates the vertical connector line using an IntersectionObserver
 * to trigger the CSS scale animation when the timeline enters view.
 */
function initTimelineLine() {
  const line = qs('.timeline__track');
  if (!line) return;

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        line.classList.add('animated');
        observer.disconnect();
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(qs('.timeline') || line);
}

// ============================================================
// UTILITIES
// ============================================================

/** Capitalises the first letter of a string. */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================================
// RENDER
// ============================================================

/**
 * Renders all CAREER_TIMELINE entries into the `.timeline__items`
 * container in the DOM.
 */
export function renderTimeline() {
  const container = qs('.timeline__items');
  if (!container) return;

  container.innerHTML = '';

  CAREER_TIMELINE.forEach((item, index) => {
    const row = buildTimelineCard(item, index);
    container.appendChild(row);
  });

  initTimelineLine();
}
