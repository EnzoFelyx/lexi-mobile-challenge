import { injectable } from 'tsyringe';

import type { AuthService, AuthUser } from '../domain/AuthService';

const notConfigured = () => new Error('Supabase is not configured: copy .env.example to .env');

/** Sem o `.env`, o app continua como visitante; entrar mostra o erro do formulário. */
@injectable()
export class UnavailableAuthService implements AuthService {
  async getUser(): Promise<AuthUser | null> {
    return null;
  }

  async signIn(): Promise<AuthUser> {
    throw notConfigured();
  }

  async signUp(): Promise<AuthUser> {
    throw notConfigured();
  }

  async signOut(): Promise<void> {}

  onUserChange(): () => void {
    return () => undefined;
  }
}
