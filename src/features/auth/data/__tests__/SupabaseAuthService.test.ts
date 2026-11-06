import type { LexiSupabaseClient } from '@/core/supabase/client';

import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '../../domain/AuthErrors';
import { SupabaseAuthService } from '../SupabaseAuthService';

const CREDENTIALS = { email: 'alex@example.com', password: '123456' };
const USER = { id: 'alex', email: CREDENTIALS.email };

const createAuth = () => ({
  getSession: jest.fn(async () => ({ data: { session: null as unknown }, error: null as unknown })),
  signInWithPassword: jest.fn(async () => ({ data: { user: USER }, error: null as unknown })),
  signUp: jest.fn(async () => ({ data: { user: USER }, error: null as unknown })),
  signOut: jest.fn(async (_options: unknown) => ({ error: null as unknown })),
  onAuthStateChange: jest.fn(),
  startAutoRefresh: jest.fn(),
  stopAutoRefresh: jest.fn(),
});

const serviceWith = (auth: ReturnType<typeof createAuth>) =>
  new SupabaseAuthService({ auth } as unknown as LexiSupabaseClient);

describe('SupabaseAuthService', () => {
  it('reads the saved session, or none for a guest', async () => {
    const auth = createAuth();
    expect(await serviceWith(auth).getUser()).toBeNull();

    auth.getSession.mockResolvedValueOnce({ data: { session: { user: USER } }, error: null });
    expect(await serviceWith(auth).getUser()).toEqual(USER);
  });

  it('logs in and turns wrong credentials into the domain error', async () => {
    const auth = createAuth();
    expect(await serviceWith(auth).signIn(CREDENTIALS)).toEqual(USER);

    auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: USER },
      error: { code: 'invalid_credentials' },
    });
    await expect(serviceWith(auth).signIn(CREDENTIALS)).rejects.toThrow(InvalidCredentialsError);
  });

  it.each(['user_already_exists', 'email_exists'])(
    'turns the sign up error %s into the domain error',
    async (code) => {
      const auth = createAuth();
      auth.signUp.mockResolvedValueOnce({ data: { user: USER }, error: { code } });

      await expect(serviceWith(auth).signUp(CREDENTIALS)).rejects.toThrow(
        EmailAlreadyRegisteredError,
      );
    },
  );

  it('keeps any other failure as it is, for the generic form error', async () => {
    const auth = createAuth();
    const failure = { code: 'over_request_rate_limit' };
    auth.signInWithPassword.mockResolvedValueOnce({ data: { user: USER }, error: failure });

    await expect(serviceWith(auth).signIn(CREDENTIALS)).rejects.toBe(failure);
  });

  it('logs out only on this device, so it works without a connection', async () => {
    const auth = createAuth();

    await serviceWith(auth).signOut();

    expect(auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('tells each session change and stops when unsubscribed', () => {
    const auth = createAuth();
    const unsubscribe = jest.fn();
    let onChange: (event: string, session: unknown) => void = () => undefined;
    auth.onAuthStateChange.mockImplementation((callback) => {
      onChange = callback;
      return { data: { subscription: { unsubscribe } } };
    });
    const listener = jest.fn();

    const stop = serviceWith(auth).onUserChange(listener);
    onChange('SIGNED_IN', { user: USER });
    onChange('SIGNED_OUT', null);
    stop();

    expect(listener.mock.calls).toEqual([[USER], [null]]);
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
