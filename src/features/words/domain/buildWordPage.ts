import type { WordEntry } from './WordEntry';
import type { WordPage } from './WordRepository';

/**
 * Monta a página a partir de `limit + 1` linhas: a linha extra só indica que há mais,
 * sem precisar de uma consulta vazia no fim da lista.
 */
export function buildWordPage(rows: readonly WordEntry[], limit: number): WordPage {
  const pageRows = rows.slice(0, limit);
  const last = pageRows.at(-1);
  const hasMore = rows.length > limit;
  return {
    words: pageRows.map((row) => row.word),
    nextCursor: hasMore && last ? { word: last.word, sortKey: last.sortKey } : null,
  };
}
