import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Appearance } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { FakeAuthService } from '@/features/auth/testing/FakeAuthService';
import type { AuthService } from '@/features/auth/domain/AuthService';
import { useSessionStore } from '@/features/auth/hooks/sessionStore';
import { useSessionSync } from '@/features/auth/hooks/useSessionSync';
import { en } from '@/i18n/en';
import { ptBR } from '@/i18n/pt-BR';
import { openLogin, openSignUp } from '@/shared/utils/navigation';

import type { PreferenceStorage } from '../../domain/PreferenceStorage';
import { useThemePreferenceStore } from '../../hooks/themePreferenceStore';

import { SettingsScreen } from '../SettingsScreen';

jest.mock('@/shared/utils/navigation', () => ({ openLogin: jest.fn(), openSignUp: jest.fn() }));

/** A tela com a sessão acompanhando o serviço, como no app. */
function SettingsWithSession() {
  useSessionSync();
  return <SettingsScreen />;
}

const registerStorage = () => {
  const storage: PreferenceStorage = {
    getTheme: () => 'system',
    saveTheme: jest.fn(async () => undefined),
    getLanguage: () => 'en',
    saveLanguage: jest.fn(async () => undefined),
  };
  container.registerInstance<PreferenceStorage>(TOKENS.PreferenceStorage, storage);
  return storage;
};

const renderSettings = async (auth: AuthService = new FakeAuthService()) => {
  container.registerInstance<AuthService>(TOKENS.AuthService, auth);
  await render(<SettingsWithSession />);
  await screen.findByRole('header', { name: en.settings.profile });
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    container.registerInstance(TOKENS.AuthEntryStorage, {
      hasChosenGuest: () => false,
      saveGuestChoice: async () => undefined,
    });
    useSessionStore.setState({ status: 'loading', user: null });
    useThemePreferenceStore.setState({ preference: 'system' });
  });

  afterEach(jest.restoreAllMocks);

  it('invites a guest to log in or create an account', async () => {
    await renderSettings();

    expect(screen.getByRole('header', { name: en.settings.title })).toBeOnTheScreen();
    expect(screen.getByText(en.settings.guest.message)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.settings.guest.logIn })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.settings.guest.createAccount })).toBeOnTheScreen();
  });

  it('opens the login and the sign up from the guest profile', async () => {
    await renderSettings();

    await fireEvent.press(screen.getByRole('button', { name: en.settings.guest.logIn }));
    await fireEvent.press(screen.getByRole('button', { name: en.settings.guest.createAccount }));

    expect(openLogin).toHaveBeenCalledTimes(1);
    expect(openSignUp).toHaveBeenCalledTimes(1);
  });

  it('shows the account after logging in and goes back to the guest after logging out', async () => {
    const auth = new FakeAuthService();
    await renderSettings(auth);

    await act(() => auth.signIn({ email: 'alex@example.com', password: '' }));

    expect(
      await screen.findByRole('header', { name: en.settings.account.title }),
    ).toBeOnTheScreen();
    expect(screen.getByText('alex@example.com')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: en.settings.account.logOut }));

    expect(await screen.findByRole('header', { name: en.settings.guest.title })).toBeOnTheScreen();
  });

  it('shows the current appearance and language, checked in the native menu', async () => {
    await renderSettings();

    expect(
      screen.getByLabelText(`${en.settings.appearance}, ${en.settings.themeName.system}`),
    ).toBeOnTheScreen();
    expect(
      screen.getByLabelText(`${en.settings.language}, ${en.settings.languageNames.en}`),
    ).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.settings.themeName.system })).toBeSelected();
    expect(screen.getByRole('button', { name: en.settings.languageNames.en })).toBeSelected();
    expect(screen.getByText(en.settings.footer)).toBeOnTheScreen();
  });

  it('chooses the theme in the native menu, applies it at once and saves it', async () => {
    const storage = registerStorage();
    const setColorScheme = jest.spyOn(Appearance, 'setColorScheme').mockImplementation(() => {});
    await renderSettings();

    await fireEvent.press(screen.getByRole('button', { name: en.settings.themeName.dark }));

    expect(setColorScheme).toHaveBeenCalledWith('dark');
    expect(storage.saveTheme).toHaveBeenCalledWith('dark');
    expect(screen.getByRole('button', { name: en.settings.themeName.dark })).toBeSelected();
    expect(
      screen.getByLabelText(`${en.settings.appearance}, ${en.settings.themeName.dark}`),
    ).toBeOnTheScreen();
  });

  it('switches the whole interface to Portuguese from the native menu and saves it', async () => {
    const storage = registerStorage();
    await renderSettings();

    await fireEvent.press(screen.getByRole('button', { name: en.settings.languageNames['pt-BR'] }));

    expect(storage.saveLanguage).toHaveBeenCalledWith('pt-BR');
    expect(screen.getByRole('header', { name: ptBR.settings.title })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: ptBR.settings.languageNames['pt-BR'] }),
    ).toBeSelected();
  });
});
