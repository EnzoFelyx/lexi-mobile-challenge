import { parseRows, wordCacheRowSchema, wordRowSchema } from '../validation';

describe('database row validation', () => {
  it('accepts rows in the shape of the schema', () => {
    const rows = parseRows('words', wordRowSchema, [{ word: 'hello', sortKey: 42 }]);

    expect(rows).toEqual([{ word: 'hello', sortKey: 42 }]);
  });

  it('accepts a cached 404 without payload', () => {
    const [row] = parseRows('word_cache', wordCacheRowSchema, [
      { word: 'qwxz', payload: null, status: 'not_found', fetchedAt: new Date(0) },
    ]);

    expect(row?.status).toBe('not_found');
  });

  it('rejects rows outside the schema, naming the table', () => {
    expect(() =>
      parseRows('word_cache', wordCacheRowSchema, [
        { word: 'hello', payload: null, status: 'unknown', fetchedAt: new Date(0) },
      ]),
    ).toThrow('Invalid rows read from "word_cache"');
  });
});
