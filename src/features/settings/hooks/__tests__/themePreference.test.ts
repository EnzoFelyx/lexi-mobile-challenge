import { Appearance } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';

import type { PreferenceStorage } from '../../domain/PreferenceStorage';
import { applySavedThemePreference, chooseThemePreference } from '../themePreference';
import { useThemePreferenceStore } from '../themePreferenceStore';

const registerStorage = (storage: Partial<PreferenceStorage>) =>
  container.registerInstance<PreferenceStorage>(TOKENS.PreferenceStorage, {
    getTheme: () => 'system',
    saveTheme: async () => undefined,
    getLanguage: () => 'en',
    saveLanguage: async () => undefined,
    ...storage,
  });

describe('theme preference', () => {
  beforeEach(() => {
    useThemePreferenceStore.setState({ preference: 'system' });
  });

  afterEach(jest.restoreAllMocks);

  it('applies the saved theme when the app opens', () => {
    const setColorScheme = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    registerStorage({ getTheme: () => 'light' });

    applySavedThemePreference();

    expect(setColorScheme).toHaveBeenCalledWith('light');
    expect(useThemePreferenceStore.getState().preference).toBe('light');
  });

  it('keeps following the phone when the saved theme cannot be read', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const setColorScheme = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    registerStorage({
      getTheme: () => {
        throw new Error('storage unavailable');
      },
    });

    applySavedThemePreference();

    expect(setColorScheme).not.toHaveBeenCalled();
    expect(useThemePreferenceStore.getState().preference).toBe('system');
  });

  it('keeps the chosen theme for the session even if saving fails', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    registerStorage({
      saveTheme: async () => {
        throw new Error('disk full');
      },
    });

    chooseThemePreference('dark');
    await Promise.resolve();
    await Promise.resolve();

    expect(useThemePreferenceStore.getState().preference).toBe('dark');
    expect(warn).toHaveBeenCalled();
  });
});
