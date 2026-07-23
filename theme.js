/* ==========================================================================
   Brainstorm Club — Design System · gestione unificata del tema
   --------------------------------------------------------------------------
   UNO switch per tutte le app (sito, character builder, Harp Forge, tracker).
   Default = carbone (scuro); il chiaro (carta) si attiva col toggle e si
   ricorda (localStorage). Zero configurazione: metti un pulsante con
   l'attributo data-bsc-theme-toggle e chiama initTheme().

     import { initTheme } from '@brainstorm/design-system/theme.js'
     initTheme()

     <button class="bsc-theme-toggle" data-bsc-theme-toggle aria-label="Cambia tema"></button>
     (initTheme() inietta le icone sole/luna; nessun testo)

   Per evitare il "flash" al caricamento, aggiungi nell'<head>, PRIMA del CSS:
     <script>try{document.documentElement.setAttribute('data-theme',
       localStorage.getItem('bsc-theme')||'dark')}catch(e){}</script>

   In un framework (Vue/React) usa getTheme()/setTheme()/toggleTheme() e
   ascolta l'evento `bsc:themechange` per aggiornare la UI.
   ========================================================================== */

import { getTheme, setTheme, THEME_KEY } from './tokens.js';

export { getTheme, setTheme, THEME_KEY };

/** Alterna carbone ⇄ carta. Ritorna il nuovo tema. */
export function toggleTheme() {
  return setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

/* Icone sole/luna del toggle (nessun testo). Quale si vede lo decide il CSS in
   base a [data-theme]: luna sul tema scuro, sole sul chiaro (vedi components.css). */
const TOGGLE_ICONS =
  '<svg class="bsc-tt-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">'
  + '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>'
  + '<svg class="bsc-tt-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">'
  + '<circle cx="12" cy="12" r="5" stroke-width="2"/>'
  + '<path stroke-linecap="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';

/** Allinea i pulsanti [data-bsc-theme-toggle] al tema: aria + icone sole/luna. */
function syncToggles() {
  const t = getTheme();
  document.querySelectorAll('[data-bsc-theme-toggle]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(t === 'light'));
    btn.setAttribute('aria-label', t === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro');
    // Inietta le icone una sola volta (se il pulsante non contiene già un'icona).
    if (!btn.querySelector('svg')) btn.innerHTML = TOGGLE_ICONS;
  });
}

/** Applica il tema persistito (o scuro di default) e collega tutti i toggle. */
export function initTheme() {
  if (typeof document === 'undefined') return;
  setTheme(getTheme());          // riafferma persistito/default + notifica
  syncToggles();
  document.addEventListener('bsc:themechange', syncToggles);
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('[data-bsc-theme-toggle]');
    if (btn) { e.preventDefault(); toggleTheme(); }
  });
}

export default initTheme;
