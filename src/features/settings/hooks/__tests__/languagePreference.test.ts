import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { useLanguageStore } from '@/i18n/languageStore';

import type { PreferenceStorage } from '../../domain/PreferenceStorage';
import { applySavedLanguage, chooseLanguage } from '../languagePreference';

const registerStorage = (storage: Partial<PreferenceStorage>) =>
  container.registerInstance<PreferenceStorage>(TOKENS.PreferenceStorage, {
    getTheme: () => 'system',
    saveTheme: async () => undefined,
    getLanguage: () => 'en',
    saveLanguage: async () => undefined,
    ...storage,
  });

describe('language preference', () => {
  afterEach(jest.restoreAllMocks);

  it('applies the saved language when the app opens', () => {
    registerStorage({ getLanguage: () => 'pt-BR' });

    applySavedLanguage();

    expect(useLanguageStore.getState().language).toBe('pt-BR');
  });

  it('stays in English when the saved language cannot be read', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    registerStorage({
      getLanguage: () => {
        throw new Error('storage unavailable');
      },
    });

    applySavedLanguage();

    expect(useLanguageStore.getState().language).toBe('en');
  });

  it('keeps the chosen language for the session even if saving fails', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    registerStorage({
      saveLanguage: async () => {
        throw new Error('disk full');
      },
    });

    chooseLanguage('pt-BR');
    await Promise.resolve();
    await Promise.resolve();

    expect(useLanguageStore.getState().language).toBe('pt-BR');
    expect(warn).toHaveBeenCalled();
  });
});
