import { AppState } from 'react-native';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import { TOKENS } from '@/core/di/tokens';
import type { LexiSupabaseClient } from '@/core/supabase/client';

import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '../domain/AuthErrors';
import type { AuthService, AuthUser, Credentials } from '../domain/AuthService';

const authUserSchema = z.object({ id: z.string(), email: z.string() });

const EMAIL_TAKEN_CODES: readonly (string | undefined)[] = ['user_already_exists', 'email_exists'];

const toAuthUser = (user: unknown): AuthUser => authUserSchema.parse(user);

const toUserOrNull = (user: unknown): AuthUser | null => (user ? toAuthUser(user) : null);

/** Login do Supabase; a sessão fica salva no aparelho e funciona sem conexão. */
@injectable()
export class SupabaseAuthService implements AuthService {
  constructor(@inject(TOKENS.SupabaseClient) private readonly client: LexiSupabaseClient) {
    // Renova a sessão só com o app aberto, como recomenda o Supabase para apps móveis.
    AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void this.client.auth.startAutoRefresh();
      } else {
        void this.client.auth.stopAutoRefresh();
      }
    });
  }

  async getUser(): Promise<AuthUser | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) {
      throw error;
    }
    return toUserOrNull(data.session?.user);
  }

  async signIn({ email, password }: Credentials): Promise<AuthUser> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) {
      throw error.code === 'invalid_credentials' ? new InvalidCredentialsError() : error;
    }
    return toAuthUser(data.user);
  }

  async signUp({ email, password }: Credentials): Promise<AuthUser> {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) {
      throw EMAIL_TAKEN_CODES.includes(error.code) ? new EmailAlreadyRegisteredError() : error;
    }
    return toAuthUser(data.user);
  }

  async signOut(): Promise<void> {
    // `local`: sair tem de funcionar sem conexão; a sessão some do aparelho de qualquer forma.
    const { error } = await this.client.auth.signOut({ scope: 'local' });
    if (error) {
      throw error;
    }
  }

  onUserChange(listener: (user: AuthUser | null) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange((_event, session) => {
      listener(toUserOrNull(session?.user));
    });
    return () => data.subscription.unsubscribe();
  }
}
