import { toWordDetail } from '../toWordDetail';
import type { DictionaryEntry } from '../WordDetail';

const HELLO_NOUN: DictionaryEntry = {
  word: 'hello',
  phonetics: [
    { audio: 'https://audio/hello-au.mp3' },
    { text: '/həˈləʊ/', audio: 'https://audio/hello-uk.mp3' },
    { text: '/həˈloʊ/', audio: '' },
  ],
  meanings: [
    { partOfSpeech: 'noun', definitions: [{ definition: '"Hello!" or an equivalent greeting.' }] },
  ],
};

const HELLO_VERB_AND_NOUN: DictionaryEntry = {
  word: 'hello',
  phonetic: '/hɛˈləʊ/',
  phonetics: [{ audio: 'https://audio/hello-uk.mp3' }],
  meanings: [
    {
      partOfSpeech: 'verb',
      definitions: [{ definition: 'To greet with "hello".', example: '  ' }],
    },
    { partOfSpeech: 'noun', definitions: [{ definition: 'A greeting.', example: 'Say hello.' }] },
  ],
};

describe('toWordDetail', () => {
  it('uses the first phonetic text when there is no top-level phonetic', () => {
    expect(toWordDetail([HELLO_NOUN]).phonetic).toBe('/həˈləʊ/');
  });

  it('prefers a top-level phonetic from any entry', () => {
    expect(toWordDetail([HELLO_NOUN, HELLO_VERB_AND_NOUN]).phonetic).toBe('/hɛˈləʊ/');
  });

  it('keeps every audio once, in order, skipping empty ones', () => {
    expect(toWordDetail([HELLO_NOUN, HELLO_VERB_AND_NOUN]).audioUrls).toEqual([
      'https://audio/hello-au.mp3',
      'https://audio/hello-uk.mp3',
    ]);
  });

  it('groups the meanings of all entries by part of speech', () => {
    const { meanings } = toWordDetail([HELLO_NOUN, HELLO_VERB_AND_NOUN]);

    expect(meanings.map((meaning) => meaning.partOfSpeech)).toEqual(['noun', 'verb']);
    expect(meanings[0]?.definitions).toEqual([
      { definition: '"Hello!" or an equivalent greeting.', example: null },
      { definition: 'A greeting.', example: 'Say hello.' },
    ]);
    expect(meanings[1]?.definitions).toEqual([
      { definition: 'To greet with "hello".', example: null },
    ]);
  });

  it('has no phonetic when the API gives none', () => {
    const detail = toWordDetail([{ word: 'qi', phonetics: [], meanings: [] }]);

    expect(detail).toEqual({ word: 'qi', phonetic: null, audioUrls: [], meanings: [] });
  });
});
