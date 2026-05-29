/**
 * THEME.JS — Light / dark mode management
 *
 * Handles:
 *  - System preference detection on first visit
 *  - localStorage persistence across sessions
 *  - Smooth CSS transitions between themes
 *  - Toggle button state synchronisation
 */

import { qs } from './utils.js';

// ============================================================
// CONSTANTS
// ============================================================

const STORAGE_KEY  = 'cn-theme-preference';
const LIGHT_THEME  = 'light';
const DARK_THEME   = 'dark';
const ATTR_THEME   = 'data-theme';

// ============================================================
// PRIVATE HELPERS
// ============================================================

/**
 * Reads the system's preferred colour scheme.
 * Falls back to 'light' if the API is unavailable.
 * @returns {'light' | 'dark'}
 */
function getSystemPreference() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK_THEME;
  }
  return LIGHT_THEME;
}

/**
 * Reads the persisted user preference from localStorage.
 * Returns null if no preference has been saved.
 * @returns {'light' | 'dark' | null}
 */
function getSavedPreference() {
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * Persists the user's theme choice to localStorage.
 * @param {'light' | 'dark'} theme
 */
function savePreference(theme) {
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Applies the chosen theme to the document root element.
 * Dark mode is activated with [data-theme="dark"]; light mode
 * removes the attribute so CSS variables use their defaults.
 * @param {'light' | 'dark'} theme
 */
function applyTheme(theme) {
  if (theme === DARK_THEME) {
    document.documentElement.setAttribute(ATTR_THEME, DARK_THEME);
  } else {
    document.documentElement.removeAttribute(ATTR_THEME);
  }
}

/**
 * Updates the toggle button icon and accessible label to reflect
 * the currently active theme.
 * @param {Element} button - The toggle button element
 * @param {'light' | 'dark'} theme
 */
function syncToggleButton(button, theme) {
  if (!button) return;

  const iconEl  = button.querySelector('i');
  const isDark  = theme === DARK_THEME;

  if (iconEl) {
    iconEl.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  }

  button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  button.setAttribute('title',      isDark ? 'Light mode'           : 'Dark mode');
}

// ============================================================
// PUBLIC API
// ============================================================

/**
 * Returns the current active theme.
 * @returns {'light' | 'dark'}
 */
export function getCurrentTheme() {
  return document.documentElement.getAttribute(ATTR_THEME) === DARK_THEME
    ? DARK_THEME
    : LIGHT_THEME;
}

/**
 * Programmatically sets the theme and persists the choice.
 * @param {'light' | 'dark'} theme
 */
export function setTheme(theme) {
  applyTheme(theme);
  savePreference(theme);

  const toggleButton = qs('.theme-toggle');
  syncToggleButton(toggleButton, theme);
}

/**
 * Toggles between light and dark modes.
 */
export function toggleTheme() {
  const next = getCurrentTheme() === DARK_THEME ? LIGHT_THEME : DARK_THEME;
  setTheme(next);
}

/**
 * Initialises the theme system:
 *  1. Determine initial theme (saved → system → light)
 *  2. Apply it without transition to avoid flash on load
 *  3. Bind the toggle button click handler
 *  4. Watch for system preference changes
 */
export function initTheme() {
  // Determine starting theme — saved preference wins over system
  const initialTheme = getSavedPreference() ?? getSystemPreference();

  // Apply immediately (before fonts/styles paint) to prevent flash
  applyTheme(initialTheme);

  // Sync toggle button once DOM is ready
  const toggleButton = qs('.theme-toggle');
  syncToggleButton(toggleButton, initialTheme);

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleTheme);
  }

  // React to OS-level theme changes only if no stored preference
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      // Only auto-switch when the user hasn't made an explicit choice
      if (!getSavedPreference()) {
        setTheme(event.matches ? DARK_THEME : LIGHT_THEME);
      }
    });
}
