import { type Language, LANGUAGES } from '@/i18n/languages';
import { useLanguageStore } from '@/i18n/languageStore';
import { useTexts } from '@/i18n/useTexts';

import { chooseLanguage } from './languagePreference';
import type { PreferenceChoice } from './preferenceChoice';

/**
 * Language das configurações (pedido do autor, 2026-11-05): os nomes no idioma atual ("English /
 * Portuguese" ou "Inglês / Português"). Só a interface muda; o conteúdo da API continua em inglês.
 */
export function useLanguagePreference(): PreferenceChoice<Language> {
  const t = useTexts();
  const selected = useLanguageStore((state) => state.language);

  return {
    selected,
    options: LANGUAGES.map((value) => ({ value, label: t.settings.languageNames[value] })),
    choose: chooseLanguage,
  };
}
