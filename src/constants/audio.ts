/** Intervalo dos avisos de progresso do player: a barra anda suave sem pesar o JS thread. */
export const PLAYER_STATUS_INTERVAL_MS = 100;

/**
 * Rede de segurança: sem o mp3 pronto neste tempo (rede muito lenta), o player usa a voz do
 * aparelho. Falhas do servidor (502, 404…) já trocam na hora, sem esperar.
 */
export const PLAYER_LOAD_TIMEOUT_MS = 4000;

/** Pasta, dentro do cache do aparelho, onde ficam os mp3 já baixados. */
export const PRONUNCIATION_CACHE_DIR = 'pronunciations';
