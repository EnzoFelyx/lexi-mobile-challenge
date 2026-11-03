import { act, renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { DictionarySeeder } from '../../domain/DictionarySeeder';
import type { WordListSource } from '../../domain/WordListSource';
import { useDictionarySetup } from '../useDictionarySetup';

const registerServices = (seeder: DictionarySeeder, source: WordListSource) => {
  container.registerInstance<DictionarySeeder>(TOKENS.DictionarySeeder, seeder);
  container.registerInstance<WordListSource>(TOKENS.WordListSource, source);
};

describe('useDictionarySetup', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('is ready without downloading when the dictionary is already on the device', async () => {
    const source: WordListSource = { fetchWords: jest.fn() };
    registerServices({ isSeeded: async () => true, seed: jest.fn() }, source);

    const { result } = await renderHook(() => useDictionarySetup(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(source.fetchWords).not.toHaveBeenCalled();
  });

  it('downloads and saves the words on the first run', async () => {
    const seed = jest.fn(async (_words: readonly string[], onProgress: (f: number) => void) => {
      onProgress(1);
    });
    registerServices(
      { isSeeded: async () => false, seed },
      { fetchWords: async () => ['a', 'hello'] },
    );

    const { result } = await renderHook(() => useDictionarySetup(), {
      wrapper: createQueryClientWrapper(),
    });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(seed).toHaveBeenCalledWith(['a', 'hello'], expect.any(Function));
    expect(result.current.progress).toBe(1);
  });

  it('shows the error and recovers when the user retries', async () => {
    const fetchWords = jest
      .fn<Promise<string[]>, []>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce(['a']);
    registerServices({ isSeeded: async () => false, seed: async () => undefined }, { fetchWords });

    const { result } = await renderHook(() => useDictionarySetup(), {
      wrapper: createQueryClientWrapper(),
    });
    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(fetchWords).toHaveBeenCalledTimes(2);
  });
});
