import { act, renderHook, waitFor } from '@testing-library/react-native';

import { WORD_LIST_PAGE_SIZE } from '@/constants/words';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { WordCursor, WordPage, WordRepository } from '../../domain/WordRepository';
import { useWordList } from '../useWordList';

const FIRST_PAGE: WordPage = {
  words: ['hello', 'today'],
  nextCursor: { word: 'today', sortKey: 2 },
};
const LAST_PAGE: WordPage = { words: ['great'], nextCursor: null };

const registerRepository = (getPage: WordRepository['getPage']) => {
  container.registerInstance<WordRepository>(TOKENS.WordRepository, { getPage });
};

const renderWordList = () =>
  renderHook(() => useWordList(), { wrapper: createQueryClientWrapper() });

describe('useWordList', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('loads the first page of the list', async () => {
    const getPage = jest.fn().mockResolvedValue(FIRST_PAGE);
    registerRepository(getPage);

    const { result } = await renderWordList();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.words).toEqual(['hello', 'today']);
    expect(result.current.hasMore).toBe(true);
    expect(getPage).toHaveBeenCalledWith(null, WORD_LIST_PAGE_SIZE);
  });

  it('appends the next page, starting after the last cursor', async () => {
    const getPage = jest.fn((cursor: WordCursor | null) =>
      Promise.resolve(cursor ? LAST_PAGE : FIRST_PAGE),
    );
    registerRepository(getPage);
    const { result } = await renderWordList();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.loadNextPage());

    await waitFor(() => expect(result.current.words).toEqual(['hello', 'today', 'great']));
    expect(getPage).toHaveBeenLastCalledWith(FIRST_PAGE.nextCursor, WORD_LIST_PAGE_SIZE);
    expect(result.current.hasMore).toBe(false);
  });

  it('fetches each page only once when the end is reached repeatedly', async () => {
    let resolveNext: (page: WordPage) => void = () => undefined;
    const getPage = jest.fn((cursor: WordCursor | null) =>
      cursor
        ? new Promise<WordPage>((resolve) => {
            resolveNext = resolve;
          })
        : Promise.resolve(FIRST_PAGE),
    );
    registerRepository(getPage);
    const { result } = await renderWordList();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.loadNextPage());
    await waitFor(() => expect(result.current.isLoadingMore).toBe(true));
    await act(async () => {
      result.current.loadNextPage();
      result.current.loadNextPage();
    });
    await act(async () => resolveNext(LAST_PAGE));

    await waitFor(() => expect(result.current.isLoadingMore).toBe(false));
    expect(getPage).toHaveBeenCalledTimes(2);
  });

  it('does not ask for more after the last page', async () => {
    const getPage = jest.fn().mockResolvedValue(LAST_PAGE);
    registerRepository(getPage);
    const { result } = await renderWordList();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.loadNextPage());

    expect(getPage).toHaveBeenCalledTimes(1);
    expect(result.current.hasMore).toBe(false);
  });

  it('reports a failed next page and retries only that page', async () => {
    const getPage = jest
      .fn()
      .mockResolvedValueOnce(FIRST_PAGE)
      .mockRejectedValueOnce(new Error('database locked'))
      .mockResolvedValueOnce(LAST_PAGE);
    registerRepository(getPage);
    const { result } = await renderWordList();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.loadNextPage());
    await waitFor(() => expect(result.current.error).toBe('nextPage'));
    expect(result.current.words).toEqual(['hello', 'today']);

    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.words).toEqual(['hello', 'today', 'great']));
    expect(result.current.error).toBeNull();
  });

  it('reports a failed first page and loads it again on retry', async () => {
    const getPage = jest
      .fn()
      .mockRejectedValueOnce(new Error('database locked'))
      .mockResolvedValueOnce(FIRST_PAGE);
    registerRepository(getPage);
    const { result } = await renderWordList();

    await waitFor(() => expect(result.current.error).toBe('firstPage'));

    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.words).toEqual(['hello', 'today']));
    expect(result.current.error).toBeNull();
  });
});
