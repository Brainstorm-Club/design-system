/* Tipi per tokens.js — token del design system in JavaScript/TypeScript. */
export type Theme = 'dark' | 'light';

export const THEME_KEY: string;
export function getTheme(): Theme;
export function setTheme(theme: Theme): Theme;

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
