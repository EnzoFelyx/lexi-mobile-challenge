import { act } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { renderRouter, screen, testRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';

import { useEntryNavigation } from '../useEntryNavigation';
import { useSessionStore } from '../sessionStore';

function Layout() {
  const { canEnterApp } = useEntryNavigation();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="sign-up" />
      <Stack.Protected guard={canEnterApp}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}

const routes = {
  _layout: Layout,
  index: () => <Text>Word list</Text>,
  login: () => <Text>Login</Text>,
  'sign-up': () => <Text>Sign up</Text>,
};

const setSession = (state: Partial<ReturnType<typeof useSessionStore.getState>>) =>
  act(() => useSessionStore.setState(state));

describe('useEntryNavigation', () => {
  beforeEach(() => {
    useSessionStore.setState({ status: 'guest', user: null, hasChosenGuest: false });
  });

  it('opens on the login for a first-time visitor', async () => {
    const app = await renderRouter(routes, { initialUrl: '/' });

    expect(app.getPathname()).toBe('/login');
  });

  it('opens on the list for someone who already chose to be a guest', async () => {
    useSessionStore.setState({ hasChosenGuest: true });

    const app = await renderRouter(routes, { initialUrl: '/' });

    expect(app.getPathname()).toBe('/');
  });

  it('opens on the list with a saved session', async () => {
    useSessionStore.setState({ status: 'signedIn', user: { id: 'u', email: 'a@b.co' } });

    const app = await renderRouter(routes, { initialUrl: '/' });

    expect(app.getPathname()).toBe('/');
  });

  it('goes to the list after choosing the guest, with no way back to the login', async () => {
    const app = await renderRouter(routes, { initialUrl: '/' });

    await setSession({ hasChosenGuest: true });

    expect(app.getPathname()).toBe('/');
    expect(screen.getByText('Word list')).toBeOnTheScreen();
    expect(app.getRouterState()?.routes).toHaveLength(1);
  });

  it('goes to the list after logging in from the sign up', async () => {
    const app = await renderRouter(routes, { initialUrl: '/login' });
    await testRouter.push('/sign-up');

    await setSession({ status: 'signedIn', user: { id: 'u', email: 'a@b.co' } });

    expect(app.getPathname()).toBe('/');
    expect(app.getRouterState()?.routes).toHaveLength(1);
  });
});
