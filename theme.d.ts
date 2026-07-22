/* Tipi per theme.js — switch tema unificato del design system. */
export type Theme = 'dark' | 'light';

export { getTheme, setTheme, THEME_KEY } from './tokens.js';

/** Alterna carbone ⇄ carta. Ritorna il nuovo tema. */
export function toggleTheme(): Theme;

/** Applica il tema persistito (o scuro di default) e collega i toggle. */
export function initTheme(): void;

declare const _default: typeof initTheme;
export default _default;
