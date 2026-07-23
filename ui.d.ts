/* Tipi per ui.js — comportamenti UI condivisi (nav, dropdown, lingua, tema). */
export type Theme = 'dark' | 'light';
export type ThemePref = 'dark' | 'light' | 'auto';

export {
  getTheme, setTheme, toggleTheme, initTheme,
  getThemePref, setThemePref, cycleTheme,
} from './theme.js';

export const LANG_KEY: string;

/** Lingua attiva: <html lang> → localStorage → default 'it'. */
export function getLang(): string;
/** Imposta la lingua, la persiste e notifica (`bsc:langchange`). */
export function setLang(lang: string): string;

export function initNav(): void;
export function initDropdowns(): void;
export function initLang(): void;
export function initCovers(): void;

/** Mostra un toast transitorio (bottom-center), riusando un unico live region. */
export function bscToast(message: string, opts?: { duration?: number }): void;

/** Apre un bottom sheet (per id o elemento `.bsc-sheet-backdrop`). */
export function openSheet(elOrId: string | HTMLElement): void;
/** Chiude un bottom sheet; senza argomento chiude quello aperto. */
export function closeSheet(elOrId?: string | HTMLElement): void;
/** Auto-wire dei bottom sheet via data-attr (open/close, backdrop, Esc). */
export function initSheets(): void;

/** Avvia tutto: tema + nav + dropdown + lingua + copertine + bottom sheet. */
export function initUI(): void;

declare const _default: typeof initUI;
export default _default;
