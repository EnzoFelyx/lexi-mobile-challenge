import { TEXTS } from './languages';
import { useLanguageStore } from './languageStore';
import type { Texts } from './types';

/** Textos da interface no idioma escolhido; a tela re-renderiza quando o idioma muda. */
export function useTexts(): Texts {
  return TEXTS[useLanguageStore((state) => state.language)];
}
