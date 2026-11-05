/**
 * A lista de favoritas depois de marcar ou desmarcar uma palavra, sem alterar a original: a nova
 * favorita entra no topo (mais recente primeiro), como o banco vai devolver.
 */
export function withFavorite(words: readonly string[], word: string, favorite: boolean): string[] {
  const others = words.filter((item) => item !== word);
  return favorite ? [word, ...others] : others;
}
