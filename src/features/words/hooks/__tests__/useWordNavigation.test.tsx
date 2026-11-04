import { act, renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
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

  it('has no navigation yet for History and Favorites (stage 4)', async () => {
    const getPage = registerRepository();
    const { rendered } = renderNavigation('hello', { source: 'history', index: 0 });
    const { result } = await rendered;

    expect(result.current).toMatchObject({ canGoPrevious: false, canGoNext: false });
    expect(getPage).not.toHaveBeenCalled();
  });
});
