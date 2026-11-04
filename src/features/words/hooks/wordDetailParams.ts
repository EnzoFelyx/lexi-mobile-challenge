import { z } from 'zod';

import { WORD_SOURCES, type WordPosition } from '../domain/wordNavigation';

const paramsSchema = z.object({
  word: z.string().min(1),
  source: z.enum(WORD_SOURCES).optional(),
  index: z.coerce.number().int().nonnegative().optional(),
});

export interface WordDetailParams {
  word: string;
  /** Nulo quando a rota não diz de onde veio (ex.: link direto): sem Previous/Next. */
  position: WordPosition | null;
}

/**
 * Valida os parâmetros da rota do detalhe (vêm de fora, até de um link). Inválidos não quebram a
 * tela: sem palavra, devolve nulo; sem origem ou posição válidas, só desliga a navegação.
 */
export function parseWordDetailParams(params: Record<string, unknown>): WordDetailParams | null {
  const parsed = paramsSchema.safeParse(params);
  if (!parsed.success) {
    const word = z.string().min(1).safeParse(params.word);
    return word.success ? { word: word.data, position: null } : null;
  }
  const { word, source, index } = parsed.data;
  return {
    word,
    position: source !== undefined && index !== undefined ? { source, index } : null,
  };
}
