/** Linhas por página ao buscar do Supabase: o servidor devolve no máximo 1.000 por vez. */
export const SYNC_PAGE_SIZE = 1000;

/** Linhas por envio ao Supabase: listas grandes não viram uma única requisição enorme. */
export const SYNC_BATCH_SIZE = 500;

/** Espera máxima para enviar o que falta ao sair da conta: sair não pode travar sem conexão. */
export const SIGN_OUT_SYNC_TIMEOUT_MS = 3000;
