/* Tipi per theme.js — switch tema unificato del design system. */
import type { Theme, ThemePref } from './tokens.js';
export type { Theme, ThemePref };

export {
  getTheme, setTheme, THEME_KEY,
  getThemePref, setThemePref, resolveTheme, THEME_PREF_KEY,
} from './tokens.js';

/** Alterna carbone ⇄ carta (bi-stato). Ritorna il tema effettivo. */
export function toggleTheme(): Theme;

/** Cicla la preferenza: scuro → chiaro → auto → scuro. Ritorna la preferenza. */
export function cycleTheme(): ThemePref;

/** Applica la preferenza persistita, risolve 'auto' e collega i toggle. */
export function initTheme(): void;

declare const _default: typeof initTheme;
export default _default;
