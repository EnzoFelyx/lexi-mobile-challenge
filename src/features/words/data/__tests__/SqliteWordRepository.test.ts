import type { Database } from '@/core/database/client';
import { words } from '@/core/database/schema';
import { createTestDatabase } from '@/core/database/testing/createTestDatabase';

import type { WordCursor } from '../../domain/WordRepository';
import { SqliteWordRepository } from '../SqliteWordRepository';

// Ordem esperada: sortKey e, no empate, a palavra.
const ENTRIES = [
  { word: 'peace', sortKey: 30 },
  { word: 'chair', sortKey: 10 },
  { word: 'hello', sortKey: 20 },
  { word: 'apple', sortKey: 20 },
  { word: 'today', sortKey: 40 },
];
const EXPECTED_ORDER = ['chair', 'apple', 'hello', 'peace', 'today'];

describe('SqliteWordRepository', () => {
  let database: Database;
  let close: () => void;
  let repository: SqliteWordRepository;

  beforeEach(async () => {
    ({ database, close } = createTestDatabase());
    await database.insert(words).values(ENTRIES);
    repository = new SqliteWordRepository(database);
  });

  afterEach(() => close());

  it('returns the first page ordered by sort key, then word', async () => {
    const page = await repository.getPage(null, 3);

    expect(page.words).toEqual(['chair', 'apple', 'hello']);
    expect(page.nextCursor).toEqual({ word: 'hello', sortKey: 20 });
  });

  it('continues right after the cursor, even across equal sort keys', async () => {
    const page = await repository.getPage({ word: 'apple', sortKey: 20 }, 2);

    expect(page.words).toEqual(['hello', 'peace']);
  });

  it('ends with no next cursor on the last page', async () => {
    const page = await repository.getPage({ word: 'peace', sortKey: 30 }, 3);

    expect(page).toEqual({ words: ['today'], nextCursor: null });
  });

  it('walks the whole list once, without repeating or skipping words', async () => {
    const seen: string[] = [];
    let cursor: WordCursor | null = null;
    do {
      const page = await repository.getPage(cursor, 2);
      seen.push(...page.words);
      cursor = page.nextCursor;
    } while (cursor);

    expect(seen).toEqual(EXPECTED_ORDER);
  });

  it('returns an empty page when there are no words', async () => {
    await database.delete(words);

    await expect(repository.getPage(null, 60)).resolves.toEqual({ words: [], nextCursor: null });
  });
});
