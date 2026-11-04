import { injectable } from 'tsyringe';

import { DICTIONARY_API_URL } from '@/constants/words';

import type { DictionaryService } from '../domain/DictionaryService';
import { toWordDetail } from '../domain/toWordDetail';
import type { WordLookup } from '../domain/WordDetail';
import { dictionaryResponseSchema } from './dictionarySchemas';

const HTTP_NOT_FOUND = 404;

@injectable()
export class FreeDictionaryService implements DictionaryService {
  async lookup(word: string): Promise<WordLookup> {
    const response = await fetch(`${DICTIONARY_API_URL}/${encodeURIComponent(word)}`);
    if (response.status === HTTP_NOT_FOUND) {
      return { status: 'not_found', word };
    }
    if (!response.ok) {
      throw new Error(`Dictionary lookup for "${word}" failed with HTTP ${response.status}`);
    }
    const parsed = dictionaryResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new Error(`Unexpected dictionary response for "${word}": ${parsed.error.message}`);
    }
    return { status: 'found', detail: toWordDetail(parsed.data) };
  }
}
