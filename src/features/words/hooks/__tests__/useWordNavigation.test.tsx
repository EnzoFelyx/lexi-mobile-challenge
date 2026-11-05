import { act, renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import type { FavoritesRepository } from '@/features/favorites/domain/FavoritesRepository';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import type { HistoryRepository } from '@/features/history/domain/HistoryRepository';
import { useHistory } from '@/features/history/hooks/useHistory';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { WordPosition } from '../../domain/wordNavigation';
import type { WordCursor, WordPage, WordRepository } from '../../domain/WordRepository';
import { useWordNavigation } from '../useWordNavigation';

const FIRST_PAGE: WordPage = {
  words: ['hello', 'today', 'great'],
  nextCursor: { word: 'great', sortKey: 3 },
};
const SECOND_PAGE: WordPage = { words: ['peace'], nextCursor: null };

const registerRepository = () => {
  const getPage = jest.fn((cursor: WordCursor | null) =>
    Promise.resolve(cursor ? SECOND_PAGE : FIRST_PAGE),
  );
  container.registerInstance<WordRepository>(TOKENS.WordRepository, { getPage });
  return getPage;
};

/** Lista guardada que o teste pode trocar, como o banco depois de uma gravação. */
const createSavedList = (initial: string[]) => {
  let saved = [...initial];
  return {
    list: async () => [...saved],
    set: (words: string[]) => {
      saved = [...words];
    },
  };
};

const registerHistory = (initial: string[]) => {
  const saved = createSavedList(initial);
  container.registerInstance<HistoryRepository>(TOKENS.HistoryRepository, {
    recordView: async () => undefined,
    list: saved.list,
    clear: async () => undefined,
  });
  return saved;
};

const registerFavorites = (initial: string[]) => {
  const saved = createSavedList(initial);
  container.registerInstance<FavoritesRepository>(TOKENS.FavoritesRepository, {
    list: saved.list,
    add: async () => undefined,
    remove: async () => undefined,
  });
  return saved;
};

const renderNavigation = (word: string, position: WordPosition | null) => {
  const onNavigate = jest.fn();
  const rendered = renderHook(() => useWordNavigation({ word, position, onNavigate }), {
    wrapper: createQueryClientWrapper(),
  });
  return { onNavigate, rendered };
};

describe('useWordNavigation', () => {
  it('disables "Previous" on the first word and moves forward with "Next"', async () => {
    registerRepository();
    const { onNavigate, rendered } = renderNavigation('hello', { source: 'words', index: 0 });
    const { result } = await rendered;
    await waitFor(() => expect(result.current.canGoNext).toBe(true));

    expect(result.current.canGoPrevious).toBe(false);
    await act(async () => result.current.goToNext());

    expect(onNavigate).toHaveBeenCalledWith('today', { source: 'words', index: 1 });
  });

  it('goes back to the previous word', async () => {
    registerRepository();
    const { onNavigate, rendered } = renderNavigation('today', { source: 'words', index: 1 });
    const { result } = await rendered;
    await waitFor(() => expect(result.current.canGoPrevious).toBe(true));

    await act(async () => result.current.goToPrevious());

    expect(onNavigate).toHaveBeenCalledWith('hello', { source: 'words', index: 0 });
  });

  it('loads the next page when "Next" is pressed on the last loaded word', async () => {
    const getPage = registerRepository();
    const { onNavigate, rendered } = renderNavigation('great', { source: 'words', index: 2 });
    const { result } = await rendered;
    await waitFor(() => expect(result.current.canGoNext).toBe(true));

    await act(async () => result.current.goToNext());

    await waitFor(() =>
      expect(onNavigate).toHaveBeenCalledWith('peace', { source: 'words', index: 3 }),
    );
    expect(getPage).toHaveBeenCalledTimes(2);
  });

  it('disables "Next" on the last word of the whole list', async () => {
    registerRepository();
    const { rendered } = renderNavigation('peace', { source: 'words', index: 3 });
    const { result } = await rendered;
    await waitFor(() => expect(result.current.canGoPrevious).toBe(false));

    expect(result.current.canGoNext).toBe(false);
  });

  it('has no navigation when the detail was opened without a list', async () => {
    const getPage = registerRepository();
    const { rendered } = renderNavigation('hello', null);
    const { result } = await rendered;

    expect(result.current).toMatchObject({ canGoPrevious: false, canGoNext: false });
    expect(getPage).not.toHaveBeenCalled();
  });

  it('moves through the History in the order it had when the detail opened', async () => {
    const getPage = registerRepository();
    registerHistory(['wonder', 'quiet', 'bloom']);
    const { onNavigate, rendered } = renderNavigation('quiet', { source: 'history', index: 1 });
    const { result } = await rendered;
    await waitFor(() => expect(result.current.canGoNext).toBe(true));

    expect(result.current.canGoPrevious).toBe(true);
    await act(async () => result.current.goToNext());

    expect(onNavigate).toHaveBeenCalledWith('bloom', { source: 'history', index: 2 });
    expect(getPage).not.toHaveBeenCalled();
  });

  it('disables "Previous" and "Next" at the ends of the Favorites', async () => {
    registerFavorites(['serene', 'brave']);
    const first = await renderNavigation('serene', { source: 'favorites', index: 0 }).rendered;
    await waitFor(() => expect(first.result.current.canGoNext).toBe(true));
    const last = await renderNavigation('brave', { source: 'favorites', index: 1 }).rendered;
    await waitFor(() => expect(last.result.current.canGoPrevious).toBe(true));

    expect(first.result.current.canGoPrevious).toBe(false);
    expect(last.result.current.canGoNext).toBe(false);
  });

  it('keeps the History order while the opened word moves to the top', async () => {
    const history = registerHistory(['wonder', 'quiet', 'bloom']);
    const onNavigate = jest.fn();
    const position: WordPosition = { source: 'history', index: 1 };
    const { result } = await renderHook(
      () => ({
        navigation: useWordNavigation({ word: 'quiet', position, onNavigate }),
        tab: useHistory(),
      }),
      { wrapper: createQueryClientWrapper() },
    );
    await waitFor(() => expect(result.current.navigation.canGoNext).toBe(true));

    // Abrir "quiet" a leva ao topo da History.
    history.set(['quiet', 'wonder', 'bloom']);
    await act(async () => result.current.tab.retry());
    await waitFor(() => expect(result.current.tab.words[0]).toBe('quiet'));
    await act(async () => result.current.navigation.goToNext());

    expect(onNavigate).toHaveBeenCalledWith('bloom', { source: 'history', index: 2 });
  });

  it('keeps an unfavorited word in the navigation until the detail closes', async () => {
    const favorites = registerFavorites(['serene', 'brave', 'dream']);
    const onNavigate = jest.fn();
    const position: WordPosition = { source: 'favorites', index: 1 };
    const { result } = await renderHook(
      () => ({
        navigation: useWordNavigation({ word: 'brave', position, onNavigate }),
        tab: useFavorites(),
      }),
      { wrapper: createQueryClientWrapper() },
    );
    await waitFor(() => expect(result.current.navigation.canGoNext).toBe(true));

    favorites.set(['serene', 'dream']);
    await act(async () => result.current.tab.retry());
    await waitFor(() => expect(result.current.tab.words).toEqual(['serene', 'dream']));

    expect(result.current.navigation).toMatchObject({ canGoPrevious: true, canGoNext: true });
    await act(async () => result.current.navigation.goToNext());
    expect(onNavigate).toHaveBeenCalledWith('dream', { source: 'favorites', index: 2 });
  });
});
