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

/* ---------------------- Copertine con sinossi -------------------------- */
/* <div class="bsc-cover" tabindex="0" role="button" aria-expanded="false"
        aria-describedby="syn-1"> <img …> <p class="bsc-cover__synopsis" id="syn-1">…</p> </div>
   L'hover mostra l'overlay su desktop (CSS); qui tap/click e Invio/Spazio
   aprono/chiudono (touch + tastiera), Esc e click-fuori chiudono.            */
function closeCover(c) { c.classList.remove('is-syn'); c.setAttribute('aria-expanded', 'false'); }

export function initCovers() {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const cover = e.target.closest && e.target.closest('.bsc-cover[aria-describedby]');
    document.querySelectorAll('.bsc-cover.is-syn').forEach((c) => { if (c !== cover) closeCover(c); });
    if (cover) { const open = cover.classList.toggle('is-syn'); cover.setAttribute('aria-expanded', String(open)); }
  });
  document.addEventListener('keydown', (e) => {
    const cover = e.target.closest && e.target.closest('.bsc-cover[aria-describedby]');
    if (cover && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault(); const open = cover.classList.toggle('is-syn'); cover.setAttribute('aria-expanded', String(open)); return;
    }
    if (e.key === 'Escape') document.querySelectorAll('.bsc-cover.is-syn').forEach(closeCover);
  });
}

/* ------------------------------- Toast --------------------------------- */
let _toastEl = null;
let _toastTimer = null;
/** Mostra un toast transitorio (bottom-center). Crea/riusa un unico live
 *  region ARIA, così chiamate ripetute non accumulano nodi.
 *  @param {string} message  testo da mostrare
 *  @param {{duration?: number}} [opts]  durata in ms (default 2500) */
export function bscToast(message, opts) {
  if (typeof document === 'undefined') return;
  const duration = (opts && opts.duration) || 2500;
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.className = 'bsc-toast';
    _toastEl.setAttribute('role', 'status');
    _toastEl.setAttribute('aria-live', 'polite');
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = message;
  void _toastEl.offsetWidth; // reflow: riavvia la transizione anche a toast già visibile
  _toastEl.classList.add('is-show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => { if (_toastEl) _toastEl.classList.remove('is-show'); }, duration);
}

/* ----------------------------- Bottom sheet ---------------------------- */
function _resolveSheet(elOrId) {
  if (!elOrId) return null;
  return typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
}
/** Apre un bottom sheet (per id o elemento .bsc-sheet-backdrop). */
export function openSheet(elOrId) {
  const sheet = _resolveSheet(elOrId);
  if (!sheet) return;
  sheet.hidden = false;
  document.body.style.overflow = 'hidden';
  const focusable = sheet.querySelector('[autofocus], .bsc-sheet__close, button, [href], input, select, textarea');
  if (focusable && focusable.focus) focusable.focus();
  document.dispatchEvent(new CustomEvent('bsc:sheetopen', { detail: { sheet } }));
}
/** Chiude un bottom sheet; senza argomento chiude quello aperto. */
export function closeSheet(elOrId) {
  const sheet = elOrId ? _resolveSheet(elOrId) : document.querySelector('.bsc-sheet-backdrop:not([hidden])');
  if (!sheet) return;
  sheet.hidden = true;
  document.body.style.overflow = '';
  document.dispatchEvent(new CustomEvent('bsc:sheetclose', { detail: { sheet } }));
}
/** Auto-wire dei bottom sheet via data-attr: [data-bsc-sheet-open="id"],
 *  [data-bsc-sheet-close], click sul backdrop, tasto Esc. */
export function initSheets() {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (!t || !t.closest) return;
    const opener = t.closest('[data-bsc-sheet-open]');
    if (opener) { openSheet(opener.getAttribute('data-bsc-sheet-open')); return; }
    const closer = t.closest('[data-bsc-sheet-close]');
    if (closer) { closeSheet(closer.closest('.bsc-sheet-backdrop')); return; }
    if (t.classList && t.classList.contains('bsc-sheet-backdrop')) closeSheet(t);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSheet();
  });
}

/* ------------------------------- Avvio --------------------------------- */
/** Avvia tutto: tema + nav + dropdown + lingua + copertine + bottom sheet. */
export function initUI() {
  initTheme();
  initNav();
  initDropdowns();
  initLang();
  initCovers();
  initSheets();
}

export default initUI;
