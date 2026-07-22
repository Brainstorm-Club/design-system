/* ==========================================================================
   Brainstorm Club — Design System · comportamenti UI condivisi
   --------------------------------------------------------------------------
   Nav responsive (hamburger), dropdown/menu, switch lingua. Delega sugli
   eventi: funziona anche con contenuto aggiunto dopo (SPA). Un solo avvio:

     import { initUI } from '@brainstorm/design-system/ui.js'
     initUI()   // avvia tema + nav + dropdown + lingua

   Markup di riferimento nella sezione "Sviluppo" della style guide.
   Vue/React: usa getLang()/setLang() + evento document 'bsc:langchange'
   (i18n resta dell'app). Il tema è in theme.js (initUI lo richiama).
   ========================================================================== */

import { initTheme } from './theme.js';
export { initTheme };
export { getTheme, setTheme, toggleTheme } from './theme.js';

/* ------------------------------- Lingua -------------------------------- */
export const LANG_KEY = 'bsc-lang';

/** Lingua attiva: attributo <html lang> → localStorage → default 'it'. */
export function getLang() {
  if (typeof document === 'undefined') return 'it';
  return document.documentElement.getAttribute('lang')
    || (typeof localStorage !== 'undefined' && localStorage.getItem(LANG_KEY))
    || 'it';
}

/** Imposta la lingua, la persiste e notifica (`bsc:langchange`). L'i18n è dell'app. */
export function setLang(lang) {
  if (typeof document === 'undefined') return lang;
  document.documentElement.setAttribute('lang', lang);
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* no storage */ }
  document.dispatchEvent(new CustomEvent('bsc:langchange', { detail: { lang } }));
  syncLang();
  return lang;
}

function syncLang() {
  const l = getLang();
  document.querySelectorAll('[data-bsc-lang-current]').forEach((el) => { el.textContent = l.toUpperCase(); });
  document.querySelectorAll('[data-bsc-lang]').forEach((el) => {
    el.setAttribute('aria-selected', String(el.getAttribute('data-bsc-lang') === l));
  });
}

/* ------------------------------ Dropdown ------------------------------- */
function closeDropdowns(except) {
  document.querySelectorAll('[data-bsc-dropdown].is-open').forEach((dd) => {
    if (dd === except) return;
    dd.classList.remove('is-open');
    const t = dd.querySelector('[data-bsc-dropdown-trigger]');
    if (t) t.setAttribute('aria-expanded', 'false');
  });
}

export function initDropdowns() {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest && e.target.closest('[data-bsc-dropdown-trigger]');
    if (trigger) {
      const dd = trigger.closest('[data-bsc-dropdown]');
      closeDropdowns(dd);
      const open = dd.classList.toggle('is-open');
      trigger.setAttribute('aria-expanded', String(open));
      return;
    }
    closeDropdowns(null); // click fuori → chiude tutto
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('[data-bsc-dropdown].is-open').forEach((dd) => {
      dd.classList.remove('is-open');
      const t = dd.querySelector('[data-bsc-dropdown-trigger]');
      if (t) { t.setAttribute('aria-expanded', 'false'); t.focus(); }
    });
  });
}

/** Collega gli item [data-bsc-lang] al cambio lingua (e chiude il dropdown). */
export function initLang() {
  if (typeof document === 'undefined') return;
  syncLang();
  document.addEventListener('click', (e) => {
    const item = e.target.closest && e.target.closest('[data-bsc-lang]');
    if (!item) return;
    setLang(item.getAttribute('data-bsc-lang'));
    closeDropdowns(null);
  });
}

/* ------------------------- Nav responsive ------------------------------ */
/* <button class="bsc-hamburger" data-bsc-nav-toggle aria-controls="main-nav" aria-expanded="false">
   <nav id="main-nav" class="bsc-nav" data-bsc-nav> … </nav>                                       */
function closeNav(nav) {
  nav.classList.remove('is-open');
  const tog = document.querySelector('[data-bsc-nav-toggle][aria-controls="' + nav.id + '"]');
  if (tog) tog.setAttribute('aria-expanded', 'false');
}

export function initNav() {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const tog = e.target.closest && e.target.closest('[data-bsc-nav-toggle]');
    if (tog) {
      const nav = document.getElementById(tog.getAttribute('aria-controls'));
      if (nav) { const open = nav.classList.toggle('is-open'); tog.setAttribute('aria-expanded', String(open)); }
      return;
    }
    const link = e.target.closest && e.target.closest('[data-bsc-nav].is-open a');
    if (link) closeNav(link.closest('[data-bsc-nav]')); // link cliccato → chiude (mobile)
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('[data-bsc-nav].is-open').forEach(closeNav);
  });
}

/* ------------------------------- Avvio --------------------------------- */
/** Avvia tutto: tema + nav + dropdown + lingua. */
export function initUI() {
  initTheme();
  initNav();
  initDropdowns();
  initLang();
}

export default initUI;
