import type { WordLookup } from './WordDetail';

/** Busca da palavra no dicionário online. 404 vira `not_found`; outros erros são lançados. */
export interface DictionaryService {
  lookup(word: string): Promise<WordLookup>;
}
