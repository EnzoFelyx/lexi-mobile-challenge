import { injectable } from 'tsyringe';

import { PREVIEW_AUTH_DELAY_MS, PREVIEW_TAKEN_EMAIL, PREVIEW_WRONG_EMAIL } from '@/constants/auth';

import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '../domain/AuthErrors';
import type { AuthService, AuthUser, Credentials } from '../domain/AuthService';

const PREVIEW_USER_ID = 'preview-user';

const wait = () => new Promise((resolve) => setTimeout(resolve, PREVIEW_AUTH_DELAY_MS));

/**
 * Autenticação de mentira, só para a parte 1 da etapa 5 (o visual antes do Supabase; decisão do
 * autor): aceita qualquer e-mail, com uma pequena espera, e guarda a sessão só na memória (fechar
 * o app volta ao visitante). Dois e-mails simulam os erros do formulário. Sai do container na
 * parte 3, quando o Supabase entra.
 */
@injectable()
export class PreviewAuthService implements AuthService {
  private user: AuthUser | null = null;

  private readonly listeners = new Set<(user: AuthUser | null) => void>();

  async getUser(): Promise<AuthUser | null> {
    return this.user;
  }

  async signIn({ email }: Credentials): Promise<AuthUser> {
    await wait();
    if (email === PREVIEW_WRONG_EMAIL) {
      throw new InvalidCredentialsError();
    }
    return this.enter(email);
  }

  async signUp({ email }: Credentials): Promise<AuthUser> {
    await wait();
    if (email === PREVIEW_TAKEN_EMAIL) {
      throw new EmailAlreadyRegisteredError();
    }
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
    const user = { id: PREVIEW_USER_ID, email };
    this.user = user;
    this.notify();
    return user;
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.user));
  }
}
