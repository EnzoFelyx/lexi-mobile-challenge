import { File } from 'expo-file-system';

import {
  cacheFileNameFor,
  FileSystemPronunciationAudioCache,
} from '../FileSystemPronunciationAudioCache';

jest.mock('expo-file-system', () => {
  const existing = new Set<string>();
  class Directory {
    readonly uri: string;
    constructor(...parts: (string | { uri: string })[]) {
      this.uri = parts.map((part) => (typeof part === 'string' ? part : part.uri)).join('/');
    }
    create = jest.fn();
  }
  class File {
    readonly uri: string;
    constructor(directory: { uri: string }, name: string) {
      this.uri = `${directory.uri}/${name}`;
    }
    get exists() {
      return existing.has(this.uri);
    }
    static downloadFileAsync = jest.fn(async (_url: string, file: File) => {
      existing.add(file.uri);
      return file;
    });
    static markExisting = (uri: string) => existing.add(uri);
    static reset = () => existing.clear();
  }
  return { Directory, File, Paths: { cache: { uri: 'file:///cache' } } };
});

type MockFile = typeof File & { markExisting: (uri: string) => void; reset: () => void };
const MockedFile = File as MockFile;
const download = jest.mocked(File.downloadFileAsync);

const URL = 'https://api.dictionaryapi.dev/media/pronunciations/en/hello-uk.mp3';
const LOCAL = 'file:///cache/pronunciations/hello-uk.mp3';

describe('FileSystemPronunciationAudioCache', () => {
  beforeEach(() => {
    MockedFile.reset();
    download.mockClear();
  });

  it('names the local file after the audio file of the API', () => {
    expect(cacheFileNameFor(URL)).toBe('hello-uk.mp3');
    expect(cacheFileNameFor('https://x/he llo-uk.mp3?v=2')).toBe('he_llo-uk.mp3');
  });

  it('downloads the mp3 the first time and returns the local file', async () => {
    await expect(new FileSystemPronunciationAudioCache().resolve(URL)).resolves.toBe(LOCAL);

    expect(download).toHaveBeenCalledWith(URL, expect.anything(), { idempotent: true });
  });

  it('reuses the stored file without downloading again', async () => {
    MockedFile.markExisting(LOCAL);

    await expect(new FileSystemPronunciationAudioCache().resolve(URL)).resolves.toBe(LOCAL);

    expect(download).not.toHaveBeenCalled();
  });

  it('fails when the server does not deliver the audio', async () => {
    download.mockRejectedValueOnce(new Error('response has status 502'));

    await expect(new FileSystemPronunciationAudioCache().resolve(URL)).rejects.toThrow('502');
  });

  it('does not download a failed audio again in the same session', async () => {
    download.mockRejectedValueOnce(new Error('response has status 502'));
    const cache = new FileSystemPronunciationAudioCache();
    await expect(cache.resolve(URL)).rejects.toThrow('502');

    await expect(cache.resolve(URL)).rejects.toThrow('already failed');

    expect(download).toHaveBeenCalledTimes(1);
  });
});
