/** Dono dos favoritos e do histórico sem login (visitante, CLAUDE.md 6.7). Até a etapa 5, todos. */
export const GUEST_USER_ID = null;

/**
 * Conta de mentira para ver o perfil logado antes da tela de login e do Supabase (parte 1 da etapa
 * 5, decisão do autor). O "Log in" das configurações entra com ela; sai quando a tela de login
 * existir.
 */
export const PREVIEW_CREDENTIALS = { email: 'alex@example.com', password: '' } as const;
