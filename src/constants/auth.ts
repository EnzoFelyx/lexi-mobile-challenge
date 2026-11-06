/** Dono dos favoritos e do histórico sem login (visitante, CLAUDE.md 6.7). Até a etapa 5, todos. */
export const GUEST_USER_ID = null;

/** Tamanho mínimo da senha: o mesmo do painel do Supabase (padrão de lá; decisão do autor). */
export const MIN_PASSWORD_LENGTH = 6;

/** Espera da autenticação de mentira, para o estado de carregamento aparecer na tela (parte 1). */
export const PREVIEW_AUTH_DELAY_MS = 1000;

/** Com a autenticação de mentira, entrar com este e-mail mostra "Wrong email or password". */
export const PREVIEW_WRONG_EMAIL = 'wrong@example.com';

/** Com a autenticação de mentira, cadastrar este e-mail mostra "This email is already registered". */
export const PREVIEW_TAKEN_EMAIL = 'taken@example.com';
