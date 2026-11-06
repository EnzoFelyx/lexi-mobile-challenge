import { create } from 'zustand';

import { DEFAULT_THEME_PREFERENCE, type ThemePreference } from '../domain/ThemePreference';

interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

/** Tema escolhido, compartilhado entre o layout raiz (que o aplica ao abrir) e as configurações. */
export const useThemePreferenceStore = create<ThemePreferenceState>()((set) => ({
  preference: DEFAULT_THEME_PREFERENCE,
  setPreference: (preference) => set({ preference }),
}));
