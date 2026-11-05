import 'reflect-metadata';

import { container } from 'tsyringe';

import { DEFAULT_THEME_PREFERENCE } from '@/features/settings/domain/ThemePreference';
import { useThemePreferenceStore } from '@/features/settings/hooks/themePreferenceStore';
import { DEFAULT_LANGUAGE } from '@/i18n/languages';
import { useLanguageStore } from '@/i18n/languageStore';

// Reanimated 4.7 não importa no Jest (ver src/shared/testing/reanimatedMock.ts).
jest.mock('react-native-reanimated', () => jest.requireActual('@/shared/testing/reanimatedMock'));

// Sem a espera da autenticação de mentira e com a navegação normal, fora do modo temporário.
jest.mock('@/constants/auth', () => ({
  ...jest.requireActual('@/constants/auth'),
  PREVIEW_AUTH_DELAY_MS: 0,
}));
jest.mock('@/constants/navigation', () => ({
  ...jest.requireActual('@/constants/navigation'),
  AUTH_DESIGN_PREVIEW: false,
}));

// Os componentes nativos do SwiftUI (@expo/ui) não existem no Jest (ver expoUiMock.tsx).
jest.mock('@expo/ui/swift-ui', () => jest.requireActual('@/shared/testing/expoUiMock'));
jest.mock(
  '@expo/ui/swift-ui/modifiers',
  () => jest.requireActual('@/shared/testing/expoUiMock').modifiersMock,
);

// Cada teste registra os próprios mocks no container (REGRAS.md, regra 2). Idioma e tema ficam em
// stores globais: voltam ao padrão para um teste não vazar no outro.
afterEach(() => {
  container.reset();
  useLanguageStore.setState({ language: DEFAULT_LANGUAGE });
  useThemePreferenceStore.setState({ preference: DEFAULT_THEME_PREFERENCE });
});
