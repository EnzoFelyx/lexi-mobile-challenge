import { UnavailableAuthService } from '../UnavailableAuthService';

describe('UnavailableAuthService', () => {
  it('keeps the app as a guest when Supabase is not configured', async () => {
    expect(await new UnavailableAuthService().getUser()).toBeNull();
  });

  it('fails to log in and to sign up, for the form to show its error', async () => {
    const auth = new UnavailableAuthService();

    await expect(auth.signIn()).rejects.toThrow('Supabase is not configured');
    await expect(auth.signUp()).rejects.toThrow('Supabase is not configured');
  });

  it('logs out and subscribes without doing anything', async () => {
    const auth = new UnavailableAuthService();

    await expect(auth.signOut()).resolves.toBeUndefined();
    expect(() => auth.onUserChange()()).not.toThrow();
  });
});
