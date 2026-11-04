import { DICTIONARY_API_URL } from '@/constants/words';

import { FreeDictionaryService } from '../FreeDictionaryService';

const respond = (status: number, body?: unknown) => {
  globalThis.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  });
};

const HELLO_RESPONSE = [
  {
    word: 'hello',
    phonetics: [{ text: '/həˈləʊ/', audio: 'https://audio/hello-uk.mp3' }],
    meanings: [{ partOfSpeech: 'noun', definitions: [{ definition: 'A greeting.' }] }],
    license: { name: 'CC BY-SA 3.0' },
  },
];

describe('FreeDictionaryService', () => {
  it('returns the word detail built from the API response', async () => {
    respond(200, HELLO_RESPONSE);

    const lookup = await new FreeDictionaryService().lookup('hello');

    expect(globalThis.fetch).toHaveBeenCalledWith(`${DICTIONARY_API_URL}/hello`);
    expect(lookup).toEqual({
      status: 'found',
      detail: {
        word: 'hello',
        phonetic: '/həˈləʊ/',
        audioUrls: ['https://audio/hello-uk.mp3'],
        meanings: [
          { partOfSpeech: 'noun', definitions: [{ definition: 'A greeting.', example: null }] },
        ],
      },
    });
  });

  it('reports a 404 as a word not found', async () => {
    respond(404, { title: 'No Definitions Found' });

    await expect(new FreeDictionaryService().lookup('maucherite')).resolves.toEqual({
      status: 'not_found',
      word: 'maucherite',
    });
  });

  it('encodes the word in the URL', async () => {
    respond(404);

    await new FreeDictionaryService().lookup('jean-pierre?x');

    expect(globalThis.fetch).toHaveBeenCalledWith(`${DICTIONARY_API_URL}/jean-pierre%3Fx`);
  });

  it('fails on other HTTP errors so they are not cached', async () => {
    respond(500);

    await expect(new FreeDictionaryService().lookup('hello')).rejects.toThrow('HTTP 500');
  });

  it('fails when the response is not in the expected format', async () => {
    respond(200, { word: 'hello' });

    await expect(new FreeDictionaryService().lookup('hello')).rejects.toThrow(
      'Unexpected dictionary response',
    );
  });
});
