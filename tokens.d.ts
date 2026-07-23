/* Tipi per tokens.js — token del design system in JavaScript/TypeScript. */
/** Tema EFFETTIVO applicato al DOM. */
export type Theme = 'dark' | 'light';
/** PREFERENZA esplicita dell'utente (tri-stato). */
export type ThemePref = 'dark' | 'light' | 'auto';

export const THEME_KEY: string;
export function getTheme(): Theme;
export function setTheme(theme: Theme): Theme;

export const THEME_PREF_KEY: string;
/** Preferenza esplicita corrente; default 'dark'. Migra da `bsc-theme`. */
export function getThemePref(): ThemePref;
/** Risolve una preferenza nel tema effettivo ('auto' → OS; fallback 'dark'). */
export function resolveTheme(pref?: ThemePref): Theme;
/** Imposta la preferenza, marca data-theme-pref e applica il tema effettivo. */
export function setThemePref(pref: ThemePref): ThemePref;

export interface BscTokens {
  color: Record<string, string | Record<string, string>>;
  font: Record<'display' | 'mono' | 'body', string>;
  text: Record<string, string>;
  space: Record<string, string>;
  radius: Record<string, string>;
  chart: string[];
}
export const bsc: BscTokens;

/** Legge una variabile CSS del design system risolta a runtime (segue il tema). */
export function cssVar(name: string, el?: Element): string;

declare const _default: BscTokens;
export default _default;
