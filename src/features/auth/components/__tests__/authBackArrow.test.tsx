import { Stack } from 'expo-router';
import { fireEvent, renderRouter, screen, testRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import { FakeAuthService } from '@/features/auth/testing/FakeAuthService';
import type { AuthService } from '../../domain/AuthService';
import { useSessionStore } from '../../hooks/sessionStore';
import { useEntryNavigation } from '../../hooks/useEntryNavigation';
import { LoginScreen } from '../LoginScreen';
import { SignUpScreen } from '../SignUpScreen';

function Layout() {
  const { canEnterApp } = useEntryNavigation();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
      <Stack.Protected guard={canEnterApp}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
      </Stack.Protected>
    </Stack>
  );
}

const routes = {
  _layout: Layout,
  index: () => <Text>Word list</Text>,
  settings: () => <Text>Settings</Text>,
  login: () => <LoginScreen />,
  'sign-up': () => <SignUpScreen />,
};

const renderApp = () =>
  renderRouter(routes, { initialUrl: '/', wrapper: createQueryClientWrapper() });

const backArrow = () => screen.queryByRole('button', { name: en.header.back });

describe('back arrow on the login and the sign up', () => {
  beforeEach(() => {
    container.registerInstance<AuthService>(TOKENS.AuthService, new FakeAuthService());
    useSessionStore.setState({ status: 'guest', user: null, hasChosenGuest: false });
  });

  it('has no arrow on the login as the first screen, and one on the sign up that returns', async () => {
    const app = await renderApp();
    expect(app.getPathname()).toBe('/login');
    expect(backArrow()).toBeNull();

    await fireEvent.press(
      screen.getByRole('button', {
        name: `${en.auth.logIn.switchPrompt} ${en.auth.logIn.switchAction}`,
      }),
    );

    expect(app.getPathname()).toBe('/sign-up');
    await fireEvent.press(screen.getByRole('button', { name: en.header.back }));

    expect(app.getPathname()).toBe('/login');
    expect(backArrow()).toBeNull();
  });

  it('has an arrow on the login opened from the profile, back to the profile', async () => {
    useSessionStore.setState({ hasChosenGuest: true });
    const app = await renderApp();
    await testRouter.push('/settings');
    await testRouter.push('/login');

    await fireEvent.press(screen.getByRole('button', { name: en.header.back }));

    expect(app.getPathname()).toBe('/settings');
  });

  it('has an arrow on the sign up opened from the profile, back to the profile', async () => {
    useSessionStore.setState({ hasChosenGuest: true });
    const app = await renderApp();
    await testRouter.push('/settings');
    await testRouter.push('/sign-up');

    await fireEvent.press(screen.getByRole('button', { name: en.header.back }));

    expect(app.getPathname()).toBe('/settings');
  });
});
