import { PreviewAuthService } from '../PreviewAuthService';

describe('PreviewAuthService', () => {
  it('starts as a guest', async () => {
    expect(await new PreviewAuthService().getUser()).toBeNull();
  });

  it('signs in with the given e-mail and signs out, telling every listener', async () => {
    const auth = new PreviewAuthService();
    const listener = jest.fn();
    auth.onUserChange(listener);

    const user = await auth.signIn({ email: 'alex@example.com', password: '' });
    await auth.signOut();

    expect(user.email).toBe('alex@example.com');
    expect(listener.mock.calls).toEqual([[user], [null]]);
    expect(await auth.getUser()).toBeNull();
  });

  it('stops telling a listener that unsubscribed', async () => {
    const auth = new PreviewAuthService();
    const listener = jest.fn();
    const unsubscribe = auth.onUserChange(listener);

    unsubscribe();
    await auth.signIn({ email: 'alex@example.com', password: '' });

    expect(listener).not.toHaveBeenCalled();
  });
});
