import type { AuthService, AuthUser, Credentials } from '../domain/AuthService';

/** Autenticação em memória para os testes: aceita qualquer e-mail e avisa quem escuta. */
export class FakeAuthService implements AuthService {
  private user: AuthUser | null = null;
  private readonly listeners = new Set<(user: AuthUser | null) => void>();

  async getUser(): Promise<AuthUser | null> {
    return this.user;
  }

  async signIn({ email }: Credentials): Promise<AuthUser> {
    return this.enter(email);
  }

  async signUp({ email }: Credentials): Promise<AuthUser> {
    return this.enter(email);
  }

  async signOut(): Promise<void> {
    this.user = null;
    this.notify();
  }

  onUserChange(listener: (user: AuthUser | null) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private enter(email: string): AuthUser {
    const user = { id: 'fake-user', email };
    this.user = user;
    this.notify();
    return user;
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.user));
  }
}
