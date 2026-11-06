import { act, renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';

import { FakeAuthService } from '@/features/auth/testing/FakeAuthService';
import type { AuthService } from '../../domain/AuthService';
import { useSessionStore } from '../sessionStore';
import { useAccount } from '../useAccount';
import { useSessionSync } from '../useSessionSync';

const renderSession = () =>
  renderHook(() => {
    useSessionSync();
    return useAccount();
  });

describe('useSessionSync and useAccount', () => {
  beforeEach(() => {
    container.registerInstance(TOKENS.AuthEntryStorage, {
      hasChosenGuest: () => false,
      saveGuestChoice: async () => undefined,
    });
    useSessionStore.setState({ status: 'loading', user: null });
  });

  it('becomes a guest once the saved session is read', async () => {
    container.registerInstance<AuthService>(TOKENS.AuthService, new FakeAuthService());

    const { result } = await renderSession();

    await waitFor(() => expect(result.current.status).toBe('guest'));
  });

  it('follows signing in and out', async () => {
    container.registerInstance<AuthService>(TOKENS.AuthService, new FakeAuthService());
    const { result } = await renderSession();
    await waitFor(() => expect(result.current.status).toBe('guest'));

    await act(() => result.current.signIn({ email: 'alex@example.com', password: '' }));
    expect(result.current).toMatchObject({
      status: 'signedIn',
      user: { email: 'alex@example.com' },
    });

    await act(async () => result.current.signOut());
    await waitFor(() => expect(result.current.status).toBe('guest'));
  });

  it('stays a guest when the saved session cannot be read', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const broken = new FakeAuthService();
    jest.spyOn(broken, 'getUser').mockRejectedValue(new Error('storage unavailable'));
    container.registerInstance<AuthService>(TOKENS.AuthService, broken);

    const { result } = await renderSession();

    await waitFor(() => expect(result.current.status).toBe('guest'));
    jest.restoreAllMocks();
  });
});
