/* Tipi per ui.js — comportamenti UI condivisi (nav, dropdown, lingua, tema). */
export type Theme = 'dark' | 'light';

export { getTheme, setTheme, toggleTheme, initTheme } from './theme.js';

export const LANG_KEY: string;

/** Lingua attiva: <html lang> → localStorage → default 'it'. */
export function getLang(): string;
/** Imposta la lingua, la persiste e notifica (`bsc:langchange`). */
export function setLang(lang: string): string;

export function initNav(): void;
export function initDropdowns(): void;
export function initLang(): void;
export function initCovers(): void;

/** Avvia tutto: tema + nav + dropdown + lingua. */
export function initUI(): void;

declare const _default: typeof initUI;
export default _default;
