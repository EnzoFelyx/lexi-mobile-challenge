import commonWords from './commonWords.json';

/**
 * Camadas que abrem a Word list (gerado por `scripts/build-common-words.mjs`):
 * 1. Basic English de Ogden; 2. palavras mais frequentes do inglês. O resto do dwyl vem depois.
 */
export const COMMON_WORD_TIERS: readonly ReadonlySet<string>[] = [
  new Set(commonWords.basicEnglish),
  new Set(commonWords.frequent),
];
