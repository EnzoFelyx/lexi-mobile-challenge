/** Intervalo máximo entre dois toques para contar como toque duplo (padrão de iOS e Android). */
export const DOUBLE_TAP_DELAY_MS = 300;

/** Arrasto que começa a contar como horizontal (abaixo disso, pode ser só um toque tremido). */
export const SWIPE_START_DISTANCE = 12;

/**
 * O arrasto é horizontal quando anda este tanto mais na horizontal que na vertical: 2,75 ≈ até
 * 20° de inclinação. Mais que isso é diagonal e não troca de palavra (pedido do autor).
 */
export const SWIPE_DIRECTION_RATIO = 2.75;

/**
 * Distância que troca de palavra ao soltar (~10% de um celular de 390pt). Sensível de propósito
 * (pedido do autor): o arrasto é um atalho rápido, e a direção já filtra os acidentes.
 */
export const SWIPE_COMMIT_DISTANCE = 40;

/** Arrasto rápido (pt/ms) troca de palavra mesmo curto, a partir de uma distância mínima. */
export const SWIPE_COMMIT_VELOCITY = 0.3;
export const SWIPE_FLICK_MIN_DISTANCE = 16;
