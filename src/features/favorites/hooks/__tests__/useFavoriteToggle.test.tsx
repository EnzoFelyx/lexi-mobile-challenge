import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { FavoritesRepository } from '../../domain/FavoritesRepository';
import { useFavorites } from '../useFavorites';
import { useFavoriteToggle } from '../useFavoriteToggle';

/** Repositório em memória; `failWrites` faz cada gravação falhar. */
const registerFavorites = (initial: string[], { failWrites = false } = {}) => {
  let saved = [...initial];
  const write = (change: () => void) => async () => {
    if (failWrites) {
      throw new Error('database locked');
    }
    change();
  };
  const repository: FavoritesRepository = {
    list: jest.fn(async () => [...saved]),
    add: jest.fn((word: string) =>
      write(() => {
        saved = [word, ...saved.filter((item) => item !== word)];
      })(),
    ),
    remove: jest.fn((word: string) =>
      write(() => {
        saved = saved.filter((item) => item !== word);
      })(),
    ),
  };
  container.registerInstance<FavoritesRepository>(TOKENS.FavoritesRepository, repository);
  return repository;
};

/** O coração de uma palavra e a aba Favorites, lado a lado no mesmo QueryClient. */
const renderToggle = (word: string) =>
  renderHook(() => ({ toggle: useFavoriteToggle(word), list: useFavorites() }), {
    wrapper: createQueryClientWrapper(),
  });

describe('useFavoriteToggle', () => {
  afterEach(jest.restoreAllMocks);

  it('knows whether the word is a favorite once the list is read', async () => {
    registerFavorites(['hello']);

    const { result } = await renderToggle('hello');

    await waitFor(() => expect(result.current.toggle.isReady).toBe(true));
    expect(result.current.toggle.isFavorite).toBe(true);
  });

  it('saves a favorite and shows it at the top of the Favorites tab', async () => {
    const repository = registerFavorites(['today']);
    const { result } = await renderToggle('hello');
    await waitFor(() => expect(result.current.toggle.isReady).toBe(true));

    await act(() => result.current.toggle.toggleFavorite());

    await waitFor(() => expect(result.current.toggle.isFavorite).toBe(true));
    expect(result.current.list.words).toEqual(['hello', 'today']);
    await waitFor(() => expect(repository.add).toHaveBeenCalledWith('hello', null));
  });

  it('removes a favorite', async () => {
    const repository = registerFavorites(['hello', 'today']);
    const { result } = await renderToggle('hello');
    await waitFor(() => expect(result.current.toggle.isReady).toBe(true));

    await act(() => result.current.toggle.toggleFavorite());

    await waitFor(() => expect(result.current.toggle.isFavorite).toBe(false));
    await waitFor(() => expect(repository.remove).toHaveBeenCalledWith('hello', null));
    await waitFor(() => expect(result.current.list.words).toEqual(['today']));
  });

  it('reverts the heart and the tab and warns when saving fails', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    registerFavorites(['today'], { failWrites: true });
    const { result } = await renderToggle('hello');
    await waitFor(() => expect(result.current.toggle.isReady).toBe(true));

    await act(() => result.current.toggle.toggleFavorite());

    await waitFor(() =>
      expect(alert).toHaveBeenCalledWith(
        en.favorites.saveErrorTitle,
        en.favorites.saveErrorMessage,
      ),
    );
    expect(result.current.toggle.isFavorite).toBe(false);
    expect(result.current.list.words).toEqual(['today']);
  });
});
