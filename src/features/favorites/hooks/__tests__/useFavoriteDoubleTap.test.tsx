import { act, renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { FavoritesRepository } from '../../domain/FavoritesRepository';
import { useFavoriteDoubleTap } from '../useFavoriteDoubleTap';
import { useFavoriteToggle } from '../useFavoriteToggle';

const registerFavorites = (initial: string[]) => {
  let saved = [...initial];
  container.registerInstance<FavoritesRepository>(TOKENS.FavoritesRepository, {
    list: async () => [...saved],
    add: async (word: string) => {
      saved = [word, ...saved];
    },
    remove: async (word: string) => {
      saved = saved.filter((item) => item !== word);
    },
  });
};

/** O toque duplo e o coração da barra da mesma palavra, no mesmo QueryClient. */
const renderDoubleTap = async () => {
  const rendered = await renderHook(
    () => ({ doubleTap: useFavoriteDoubleTap('hello'), heart: useFavoriteToggle('hello') }),
    { wrapper: createQueryClientWrapper() },
  );
  await waitFor(() => expect(rendered.result.current.heart.isReady).toBe(true));
  return rendered;
};

const doubleTap = async (handleTap: () => void) => {
  const now = jest.spyOn(Date, 'now');
  now.mockReturnValue(1000);
  await act(async () => handleTap());
  now.mockReturnValue(1100);
  await act(async () => handleTap());
};

describe('useFavoriteDoubleTap', () => {
  afterEach(jest.restoreAllMocks);

  it('shows the heart animation when the double tap saves the word', async () => {
    registerFavorites([]);
    const { result } = await renderDoubleTap();

    await doubleTap(result.current.doubleTap.handleTap);

    expect(result.current.doubleTap.burst).toEqual({ id: 1 });
    await waitFor(() => expect(result.current.heart.isFavorite).toBe(true));
  });

  it('removes the favorite without the animation, updating only the bar heart', async () => {
    registerFavorites(['hello']);
    const { result } = await renderDoubleTap();

    await doubleTap(result.current.doubleTap.handleTap);

    await waitFor(() => expect(result.current.heart.isFavorite).toBe(false));
    expect(result.current.doubleTap.burst).toBeNull();
  });
});
