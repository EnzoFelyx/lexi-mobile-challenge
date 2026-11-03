import { DWYL_WORDS_URL } from '@/constants/words';

import { DwylWordListSource } from '../DwylWordListSource';

const mockFetch = (response: Partial<Response>) => {
  globalThis.fetch = jest.fn().mockResolvedValue(response);
};

describe('DwylWordListSource', () => {
  it('downloads the dwyl dictionary and returns its words', async () => {
    mockFetch({ ok: true, status: 200, json: async () => ({ a: 1, hello: 1 }) });

    const words = await new DwylWordListSource().fetchWords();

    expect(globalThis.fetch).toHaveBeenCalledWith(DWYL_WORDS_URL);
    expect(words).toEqual(['a', 'hello']);
  });

  it('fails with the HTTP status when the download is rejected', async () => {
    mockFetch({ ok: false, status: 503 });

    await expect(new DwylWordListSource().fetchWords()).rejects.toThrow('HTTP 503');
  });

  it('fails when the file is not in the expected format', async () => {
    mockFetch({ ok: true, status: 200, json: async () => ['a', 'hello'] });

    await expect(new DwylWordListSource().fetchWords()).rejects.toThrow(
      'Unexpected word list format',
    );
  });
});
