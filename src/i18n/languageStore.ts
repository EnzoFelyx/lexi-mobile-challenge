import { create } from 'zustand';

import { DEFAULT_LANGUAGE, type Language } from './languages';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

/** Idioma da interface, escolhido em Settings; todas as telas leem por `useTexts`. */
export const useLanguageStore = create<LanguageState>()((set) => ({
  language: DEFAULT_LANGUAGE,
  setLanguage: (language) => set({ language }),
}));
