/* ==========================================================================
   Brainstorm Club — Design System · gestione unificata del tema
   --------------------------------------------------------------------------
   UNO switch per tutte le app (sito, character builder, Harp Forge, tracker).
   Tema a TRE stati di scelta esplicita: scuro (carbone) · chiaro (carta) ·
   automatico (segue l'OS). Default = scuro. 'auto' viene sempre RISOLTO in un
   tema effettivo concreto: data-theme e `bsc-theme` restano espliciti, così le
   app bi-stato non regrediscono. Zero configurazione: un pulsante con
   data-bsc-theme-toggle + initTheme() → il toggle cicla scuro→chiaro→auto.

     import { initTheme } from '@brainstorm/design-system/theme.js'
     initTheme()

     <button class="bsc-theme-toggle" data-bsc-theme-toggle aria-label="Cambia tema"></button>
     (initTheme() inietta le icone luna/sole/auto; nessun testo)

   Per evitare il "flash" al caricamento, aggiungi nell'<head>, PRIMA del CSS
   (risolve anche 'auto' e imposta data-theme-pref per l'icona giusta):
     <script>try{var p=localStorage.getItem('bsc-theme-pref')||localStorage.getItem('bsc-theme')||'dark',
       e=p==='auto'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):p,
       d=document.documentElement;d.setAttribute('data-theme',e);d.setAttribute('data-theme-pref',p)}catch(e){}</script>

   In un framework (Vue/React) usa getThemePref()/setThemePref()/cycleTheme()
   per il tri-stato, oppure getTheme()/setTheme()/toggleTheme() per il bi-stato;
   ascolta l'evento `bsc:themechange` (detail.theme = effettivo) per la UI.
   ========================================================================== */

import {
  getTheme, setTheme, THEME_KEY,
  getThemePref, setThemePref, resolveTheme, THEME_PREF_KEY,
} from './tokens.js';

export {
  getTheme, setTheme, THEME_KEY,
  getThemePref, setThemePref, resolveTheme, THEME_PREF_KEY,
};

/** Alterna carbone ⇄ carta (bi-stato). Ritorna il tema effettivo. */
export function toggleTheme() {
  return setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/** Cicla la preferenza: scuro → chiaro → auto → scuro. Ritorna la preferenza. */
export function cycleTheme() {
  const order = ['dark', 'light', 'auto'];
  return setThemePref(order[(order.indexOf(getThemePref()) + 1) % order.length]);
}

/* Icone del toggle (nessun testo). Quale si vede lo decide il CSS: luna/sole via
   [data-theme] (effettivo), l'icona "auto" via [data-theme-pref="auto"]. */
const TOGGLE_ICONS =
  '<svg class="bsc-tt-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">'
  + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
  + '<svg class="bsc-tt-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">'
  + '<circle cx="12" cy="12" r="5" stroke-width="2"/>'
  + '<path stroke-linecap="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
/* Icona "auto": cerchio mezzo pieno (contrasto/sistema). */
const AUTO_ICON =
  '<svg class="bsc-tt-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">'
  + '<circle cx="12" cy="12" r="9" stroke-width="2"/>'
  + '<path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" stroke="none"/></svg>';
const PREF_LABEL = { dark: 'scuro', light: 'chiaro', auto: 'automatico' };

/** Allinea i pulsanti [data-bsc-theme-toggle]: aria + icone luna/sole/auto. */
function syncToggles() {
  const pref = getThemePref();
  document.querySelectorAll('[data-bsc-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', `Tema: ${PREF_LABEL[pref]} (cambia)`);
    btn.removeAttribute('aria-pressed'); // stato ternario: l'aria-label descrive il tema
    // Inietta le icone (una sola volta ciascuna), preservando quelle già nel markup.
    if (!btn.querySelector('.bsc-tt-moon')) btn.insertAdjacentHTML('beforeend', TOGGLE_ICONS);
    if (!btn.querySelector('.bsc-tt-auto')) btn.insertAdjacentHTML('beforeend', AUTO_ICON);
  });
}

/** Applica la preferenza persistita (o scuro di default), risolve 'auto' e
 *  collega tutti i toggle (click → cicla). Reagisce ai cambi di tema dell'OS. */
export function initTheme() {
  if (typeof document === 'undefined') return;
  setThemePref(getThemePref());  // risolve (auto→OS) + applica + notifica
  syncToggles();
  document.addEventListener('bsc:themechange', syncToggles);
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (getThemePref() === 'auto') setTheme(resolveTheme('auto'));
    });
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('[data-bsc-theme-toggle]');
    if (btn) { e.preventDefault(); cycleTheme(); }
  });
}

export default initTheme;
