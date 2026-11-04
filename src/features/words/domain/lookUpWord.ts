import type { DictionaryService } from './DictionaryService';
import type { WordCacheRepository } from './WordCacheRepository';
import type { WordLookup } from './WordDetail';

interface LookUpWordOptions {
  /** Ignora o cache e consulta a API de novo (o "Retry" do "Word not found"). */
  refresh?: boolean;
}

/**
 * Cache persistente antes da API (o React Query fica na frente, em memória). A resposta da API
 * é guardada, inclusive o 404; erros de rede não, para a próxima tentativa funcionar.
 */
export async function lookUpWord(
  word: string,
  cache: WordCacheRepository,
  service: DictionaryService,
  { refresh = false }: LookUpWordOptions = {},
): Promise<WordLookup> {
  if (!refresh) {
    const cached = await cache.get(word);
    if (cached) {
      return cached;
    }
  }
  const lookup = await service.lookup(word);
  await cache.save(lookup);
  return lookup;
}
