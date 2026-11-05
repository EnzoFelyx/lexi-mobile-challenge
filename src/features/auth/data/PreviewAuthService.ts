import { injectable } from 'tsyringe';

import type { AuthService, AuthUser, Credentials } from '../domain/AuthService';

const PREVIEW_USER_ID = 'preview-user';

/**
 * Autenticação de mentira, só para a parte 1 da etapa 5 (o visual antes do Supabase; decisão do
 * autor): entra com qualquer e-mail, na hora, e guarda a sessão só na memória (fechar o app volta
 * ao visitante). Sai do container na parte 3, quando o Supabase entra.
 */
@injectable()
export class PreviewAuthService implements AuthService {
  private user: AuthUser | null = null;

  private readonly listeners = new Set<(user: AuthUser | null) => void>();

  async getUser(): Promise<AuthUser | null> {
    return this.user;
  }

  async signIn({ email }: Credentials): Promise<AuthUser> {
    this.user = { id: PREVIEW_USER_ID, email };
    this.notify();
    return this.user;
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

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.user));
  }
}
