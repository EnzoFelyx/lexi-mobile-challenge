import { fireEvent, render, screen } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';
import { goBack, openWordList, switchToLogin, switchToSignUp } from '@/shared/utils/navigation';

import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '../../domain/AuthErrors';
import type { AuthEntryStorage } from '../../domain/AuthEntryStorage';
import type { AuthService, AuthUser } from '../../domain/AuthService';
import { useSessionStore } from '../../hooks/sessionStore';
import { LoginScreen } from '../LoginScreen';
import { SignUpScreen } from '../SignUpScreen';

jest.mock('@/shared/utils/navigation', () => ({
  goBack: jest.fn(),
  openWordList: jest.fn(),
  switchToLogin: jest.fn(),
  switchToSignUp: jest.fn(),
}));

const CREDENTIALS = { email: 'alex@example.com', password: '12345678' };
const USER: AuthUser = { id: 'user', email: CREDENTIALS.email };

const registerAuth = (overrides: Partial<AuthService> = {}) => {
  const auth: AuthService = {
    getUser: jest.fn(async () => null),
    signIn: jest.fn(async () => USER),
    signUp: jest.fn(async () => USER),
    signOut: jest.fn(async () => undefined),
    onUserChange: jest.fn(() => () => undefined),
    ...overrides,
  };
  container.registerInstance<AuthService>(TOKENS.AuthService, auth);
  return auth;
};

const registerEntryStorage = () => {
  const storage: AuthEntryStorage = {
    hasChosenGuest: () => false,
    saveGuestChoice: jest.fn(async () => undefined),
  };
  container.registerInstance<AuthEntryStorage>(TOKENS.AuthEntryStorage, storage);
  return storage;
};

const renderScreen = (screenElement: React.ReactElement) =>
  render(screenElement, { wrapper: createQueryClientWrapper() });

const fillIn = async (email: string, password: string) => {
  await fireEvent.changeText(screen.getByLabelText(en.auth.email), email);
  await fireEvent.changeText(screen.getByLabelText(en.auth.password), password);
};

const pressButton = (name: string) => fireEvent.press(screen.getByRole('button', { name }));

beforeEach(() => useSessionStore.setState({ status: 'guest', user: null, hasChosenGuest: false }));
afterEach(jest.clearAllMocks);

describe('LoginScreen', () => {
  it('shows the introduction and no back arrow as the first screen', async () => {
    registerAuth();
    await renderScreen(<LoginScreen />);

    expect(screen.getByRole('header', { name: en.auth.logIn.intro.title })).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: en.header.back })).toBeNull();
    expect(screen.getByText(en.auth.footer)).toBeOnTheScreen();
    expect(screen.getByText(en.auth.or, { includeHiddenElements: true })).toBeOnTheScreen();
  });

  it('shows the field errors, without calling the service, and clears them while typing', async () => {
    const auth = registerAuth();
    await renderScreen(<LoginScreen />);

    await fillIn('alex@', '123');
    await pressButton(en.auth.logIn.submit);

    expect(screen.getByText(en.auth.invalidEmail)).toBeOnTheScreen();
    expect(screen.getByText(en.auth.passwordRule)).toBeOnTheScreen();
    expect(auth.signIn).not.toHaveBeenCalled();

    await fireEvent.changeText(screen.getByLabelText(en.auth.email), CREDENTIALS.email);

    expect(screen.queryByText(en.auth.invalidEmail)).toBeNull();
    expect(screen.getByText(en.auth.passwordRule)).toBeOnTheScreen();
  });

  it('logs in with the trimmed email', async () => {
    const auth = registerAuth();
    await renderScreen(<LoginScreen />);

    await fillIn(` ${CREDENTIALS.email} `, CREDENTIALS.password);
    await pressButton(en.auth.logIn.submit);

    await screen.findByRole('button', { name: en.auth.logIn.submit });
    expect(auth.signIn).toHaveBeenCalledWith(CREDENTIALS);
  });

  it('shows the busy button and blocks the fields and the other actions while logging in', async () => {
    registerAuth({ signIn: jest.fn(() => new Promise<AuthUser>(() => undefined)) });
    await renderScreen(<LoginScreen />);

    await fillIn(CREDENTIALS.email, CREDENTIALS.password);
    await pressButton(en.auth.logIn.submit);

    expect(
      await screen.findByRole('button', { name: en.auth.logIn.submitting, busy: true }),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText(en.auth.email).props.editable).toBe(false);
    expect(screen.getByRole('button', { name: en.auth.logIn.guest })).toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: `${en.auth.logIn.switchPrompt} ${en.auth.logIn.switchAction}`,
      }),
    ).toBeDisabled();
  });

  it('shows wrong credentials as a form error', async () => {
    registerAuth({ signIn: jest.fn(() => Promise.reject(new InvalidCredentialsError())) });
    await renderScreen(<LoginScreen />);

    await fillIn(CREDENTIALS.email, CREDENTIALS.password);
    await pressButton(en.auth.logIn.submit);

    expect(await screen.findByRole('alert')).toHaveTextContent(en.auth.wrongCredentials);
  });

  it('shows a generic form error when the service fails', async () => {
    registerAuth({ signIn: jest.fn(() => Promise.reject(new Error('offline'))) });
    await renderScreen(<LoginScreen />);

    await fillIn(CREDENTIALS.email, CREDENTIALS.password);
    await pressButton(en.auth.logIn.submit);

    expect(await screen.findByRole('alert')).toHaveTextContent(en.auth.unavailable);
  });

  it('enters as a guest on the first opening and remembers the choice', async () => {
    registerAuth();
    const storage = registerEntryStorage();
    await renderScreen(<LoginScreen />);

    await pressButton(en.auth.logIn.guest);

    expect(useSessionStore.getState().hasChosenGuest).toBe(true);
    expect(storage.saveGuestChoice).toHaveBeenCalledTimes(1);
    expect(openWordList).not.toHaveBeenCalled();
  });

  it('goes back to the list when a guest opened the login from the profile', async () => {
    registerAuth();
    useSessionStore.setState({ hasChosenGuest: true });
    await renderScreen(<LoginScreen />);

    await pressButton(en.auth.logIn.guest);

    expect(openWordList).toHaveBeenCalledTimes(1);
  });

  it('switches to the sign up', async () => {
    registerAuth();
    await renderScreen(<LoginScreen />);

    await pressButton(`${en.auth.logIn.switchPrompt} ${en.auth.logIn.switchAction}`);

    expect(switchToSignUp).toHaveBeenCalledTimes(1);
  });
});

describe('SignUpScreen', () => {
  it('goes back to the previous screen with the arrow', async () => {
    registerAuth();
    await renderScreen(<SignUpScreen />);

    expect(screen.getByRole('header', { name: en.auth.signUp.intro.title })).toBeOnTheScreen();
    expect(screen.getByText(en.auth.signUp.intro.message)).toBeOnTheScreen();
    await pressButton(en.header.back);

    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('shows the password rule only as an error and offers no guest option', async () => {
    registerAuth();
    await renderScreen(<SignUpScreen />);

    expect(screen.queryByText(en.auth.passwordRule)).toBeNull();
    expect(screen.getByText(en.auth.footer)).toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: en.auth.logIn.guest })).toBeNull();
    expect(screen.queryByText(en.auth.or, { includeHiddenElements: true })).toBeNull();

    await fillIn(CREDENTIALS.email, '123');
    await pressButton(en.auth.signUp.submit);

    expect(screen.getByText(en.auth.passwordRule)).toBeOnTheScreen();
  });

  it('creates the account', async () => {
    const auth = registerAuth();
    await renderScreen(<SignUpScreen />);

    await fillIn(CREDENTIALS.email, CREDENTIALS.password);
    await pressButton(en.auth.signUp.submit);

    await screen.findByRole('button', { name: en.auth.signUp.submit });
    expect(auth.signUp).toHaveBeenCalledWith(CREDENTIALS);
  });

  it('tells when the email is already registered', async () => {
    registerAuth({ signUp: jest.fn(() => Promise.reject(new EmailAlreadyRegisteredError())) });
    await renderScreen(<SignUpScreen />);

    await fillIn(CREDENTIALS.email, CREDENTIALS.password);
    await pressButton(en.auth.signUp.submit);

    expect(await screen.findByRole('alert')).toHaveTextContent(en.auth.emailTaken);
  });

  it('switches to the login', async () => {
    registerAuth();
    await renderScreen(<SignUpScreen />);

    await pressButton(`${en.auth.signUp.switchPrompt} ${en.auth.signUp.switchAction}`);

    expect(switchToLogin).toHaveBeenCalledTimes(1);
  });
});
