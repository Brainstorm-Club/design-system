/* ==========================================================================
   Brainstorm Club — Design System · token in JavaScript/TypeScript
   --------------------------------------------------------------------------
   Gli stessi valori di tokens.css, per usarli nel CODICE dell'app dove il CSS
   non arriva: colori dei grafici, canvas, stili dinamici, temi runtime.

     import { bsc, cssVar } from '@brainstorm/design-system/tokens.js'
     ctx.fillStyle = bsc.color.rosso           // '#C2332B'
     el.style.color = cssVar('--bsc-primary')  // valore risolto a runtime (segue il tema)

   NB: per i colori che cambiano col tema (superfici, testo, primary) preferisci
   `cssVar()` che legge la variabile CSS viva; l'oggetto `bsc` sono i valori base.
   ========================================================================== */

export const bsc = {
  color: {
    carbone: '#181617',
    rosso:   '#C2332B',
    bianco:  '#F4F1EC',
    carta:   '#EFEAE1',
    rosso900: '#6E1C16', rosso700: '#9E2820', rosso600: '#C2332B', rosso400: '#D9584E', rosso200: '#EB9B95',
    neutro: {
      950: '#131112', 900: '#1E1B1C', 800: '#2A2626', 700: '#3B3636', 600: '#55504F',
      500: '#726B6A', 400: '#8A8180', 300: '#ABA3A1', 200: '#CFC8C4', 100: '#E6E0DA', 50: '#F4F1EC',
    },
    successo: '#4C8C63', attenzione: '#D19A2E', errore: '#C2332B', info: '#4E7A8C',
  },
  font: {
    display: '"Courier Prime","Courier New","Courier",ui-monospace,monospace',
    mono:    '"Courier Prime","Courier New",ui-monospace,monospace',
    body:    '"Atkinson Hyperlegible",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  },
  // scala tipografica (rem)
  text: { xs: '0.75rem', sm: '0.875rem', base: '1rem', lg: '1.25rem', xl: '1.5625rem',
          '2xl': '1.953rem', '3xl': '2.441rem', '4xl': '3.052rem', '5xl': '3.815rem' },
  // spaziatura base 4px (rem)
  space: { 1: '0.25rem', 2: '0.5rem', 3: '0.75rem', 4: '1rem', 5: '1.5rem', 6: '2rem', 7: '3rem', 8: '4rem', 9: '6rem' },
  radius: { none: '0', sm: '3px', md: '6px', lg: '12px', pill: '999px',
            sketch: '255px 15px 225px 15px / 15px 225px 15px 255px' },
  // sequenza suggerita per serie di grafici (accento + neutri caldi + semantici)
  chart: ['#C2332B', '#8A8180', '#4E7A8C', '#D19A2E', '#4C8C63', '#9E2820', '#CFC8C4'],
};

/** Legge una variabile CSS del design system risolta a runtime (segue il tema attivo).
 *  @param {string} name  es. '--bsc-primary'
 *  @param {Element} [el] elemento da cui leggere (default: :root) */
export function cssVar(name, el) {
  const target = el || (typeof document !== 'undefined' ? document.documentElement : null);
  if (!target) return '';
  return getComputedStyle(target).getPropertyValue(name).trim();
}

/** Chiave localStorage del tema (condivisa da tutte le app). */
export const THEME_KEY = 'bsc-theme';

/** Tema attivo: attributo → localStorage → default 'dark' (carbone). */
export function getTheme() {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme')
    || (typeof localStorage !== 'undefined' && localStorage.getItem(THEME_KEY))
    || 'dark';
}

/** Imposta il tema EFFETTIVO, lo persiste e notifica (`bsc:themechange`).
 *  Livello "effettivo": il valore è sempre 'dark' o 'light' (mai 'auto'), così
 *  il contratto condiviso (data-theme + localStorage `bsc-theme`) resta esplicito
 *  e leggibile da ogni app. @param {'dark'|'light'} theme */
export function setTheme(theme) {
  const t = theme === 'light' ? 'light' : 'dark';
  if (typeof document === 'undefined') return t;
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(THEME_KEY, t); } catch (e) { /* storage non disponibile */ }
  document.dispatchEvent(new CustomEvent('bsc:themechange', { detail: { theme: t } }));
  return t;
}

/* --- Livello PREFERENZA (scelta esplicita dell'utente) -------------------
   Il tema è a tre stati: 'dark' | 'light' | 'auto'. 'auto' segue l'OS ma viene
   SEMPRE risolto in un tema effettivo concreto (via setTheme), così data-theme
   e `bsc-theme` restano espliciti e le app bi-stato (harp, sito) non regrediscono.
   La preferenza vive in una chiave separata; l'attributo data-theme-pref sul
   <html> serve solo a mostrare l'icona giusta del toggle. Default: scuro. */

/** Chiave localStorage della PREFERENZA di tema ('dark'|'light'|'auto'). */
export const THEME_PREF_KEY = 'bsc-theme-pref';

/** Preferenza esplicita: 'dark' | 'light' | 'auto'. Default 'dark'.
 *  Migra dal vecchio valore effettivo (`bsc-theme`) se la preferenza non esiste. */
export function getThemePref() {
  if (typeof localStorage === 'undefined') return 'dark';
  try {
    const p = localStorage.getItem(THEME_PREF_KEY);
    if (p === 'dark' || p === 'light' || p === 'auto') return p;
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch (e) { return 'dark'; }
}

/** Risolve una preferenza nel tema EFFETTIVO ('dark'|'light').
 *  'auto' segue l'OS; se non determinabile, default 'dark' (carbone). */
export function resolveTheme(pref) {
  const p = pref || getThemePref();
  if (p === 'light' || p === 'dark') return p;
  if (typeof window !== 'undefined' && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

/** Imposta la PREFERENZA, la persiste, marca `data-theme-pref` sul <html> e
 *  applica il tema effettivo via setTheme (aggiorna data-theme, `bsc-theme`,
 *  evento). @param {'dark'|'light'|'auto'} pref  Ritorna la preferenza applicata. */
export function setThemePref(pref) {
  const p = (pref === 'light' || pref === 'auto') ? pref : 'dark';
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme-pref', p);
    try { localStorage.setItem(THEME_PREF_KEY, p); } catch (e) { /* no storage */ }
  }
  setTheme(resolveTheme(p));
  return p;
}

export default bsc;
