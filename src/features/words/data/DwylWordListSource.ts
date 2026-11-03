import { injectable } from 'tsyringe';
import { z } from 'zod';

import { DWYL_WORDS_URL } from '@/constants/words';

import type { WordListSource } from '../domain/WordListSource';

// Formato do words_dictionary.json: { "a": 1, "aa": 1, … }.
const wordsDictionarySchema = z.record(z.string(), z.number());

@injectable()
export class DwylWordListSource implements WordListSource {
  async fetchWords(): Promise<string[]> {
    const response = await fetch(DWYL_WORDS_URL);
    if (!response.ok) {
      throw new Error(`Word list download failed with HTTP ${response.status}`);
    }
    const parsed = wordsDictionarySchema.safeParse(await response.json());
    if (!parsed.success) {
      throw new Error(`Unexpected word list format: ${parsed.error.message}`);
    }
    return Object.keys(parsed.data);
  }
}
