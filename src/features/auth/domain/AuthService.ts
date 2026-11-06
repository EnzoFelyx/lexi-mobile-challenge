/** Usuário com sessão aberta. */
export interface AuthUser {
  id: string;
  email: string;
}

export interface Credentials {
  email: string;
  password: string;
}

/**
 * Autenticação (diferencial 4). A UI só conhece esta interface: na parte 1 da etapa 5 o
 * container usa uma implementação de mentira, e na parte 3 passa a usar o Supabase.
 */
export interface AuthService {
  /** O usuário da sessão salva no aparelho, ou nulo (visitante). */
  getUser(): Promise<AuthUser | null>;
  signIn(credentials: Credentials): Promise<AuthUser>;
  /** Cria a conta e já entra nela (sem confirmação de e-mail, CLAUDE.md 6.7). */
  signUp(credentials: Credentials): Promise<AuthUser>;
  signOut(): Promise<void>;
  /** Avisa a cada entrada ou saída; devolve a função que cancela o aviso. */
  onUserChange(listener: (user: AuthUser | null) => void): () => void;
}
