import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import type { FavoritesRepository } from '@/features/favorites/domain/FavoritesRepository';
import type { HistoryRepository } from '@/features/history/domain/HistoryRepository';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { DictionaryService } from '../../domain/DictionaryService';
import type { WordCacheRepository } from '../../domain/WordCacheRepository';
import type { WordLookup } from '../../domain/WordDetail';
import { WordDetailScreen } from '../WordDetailScreen';

const HELLO: WordLookup = {
  status: 'found',
  detail: {
    word: 'hello',
    phonetic: '/həˈləʊ/',
    audioUrls: [],
    meanings: [
      { partOfSpeech: 'noun', definitions: [{ definition: 'A greeting.', example: 'Say hello.' }] },
    ],
  },
};

/** Favoritos em memória, como o banco: o que o coração grava volta na próxima leitura. */
const createFavorites = (): FavoritesRepository => {
  let saved: string[] = [];
  return {
    list: jest.fn(async () => [...saved]),
    add: jest.fn(async (word: string) => {
      saved = [word, ...saved];
    }),
    remove: jest.fn(async (word: string) => {
      saved = saved.filter((item) => item !== word);
    }),
  };
};

let favorites = createFavorites();

const register = (lookup: WordLookup) => {
  const history: HistoryRepository = {
    recordView: jest.fn().mockResolvedValue(undefined),
    list: async () => [],
  };
  container.registerInstance<WordCacheRepository>(TOKENS.WordCacheRepository, {
    get: async () => null,
    save: async () => undefined,
  });
  container.registerInstance<DictionaryService>(TOKENS.DictionaryService, {
    lookup: async () => lookup,
  });
  container.registerInstance<HistoryRepository>(TOKENS.HistoryRepository, history);
  favorites = createFavorites();
  container.registerInstance<FavoritesRepository>(TOKENS.FavoritesRepository, favorites);
  return history;
};

const renderDetail = (word: string, onClose = jest.fn()) =>
  render(
    <WordDetailScreen word={word} position={null} onClose={onClose} onNavigate={jest.fn()} />,
    {
      wrapper: createQueryClientWrapper(),
    },
  );

describe('WordDetailScreen', () => {
  it('shows the word, its phonetic and its meanings, and records it in the history', async () => {
    const history = register(HELLO);

    await renderDetail('hello');

    expect(await screen.findByRole('header', { name: 'hello' })).toBeOnTheScreen();
    expect(screen.getByText('/həˈləʊ/')).toBeOnTheScreen();
    expect(screen.getByRole('header', { name: en.wordDetail.meanings })).toBeOnTheScreen();
    expect(screen.getByText('A greeting.')).toBeOnTheScreen();
    expect(history.recordView).toHaveBeenCalledWith('hello', null);
  });

  it('says the word was not found and keeps it out of the history', async () => {
    const history = register({ status: 'not_found', word: 'maucherite' });

    await renderDetail('maucherite');

    expect(await screen.findByText(en.wordDetail.notFound.title)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.wordDetail.retry })).toBeOnTheScreen();
    expect(history.recordView).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: en.favorites.save('maucherite') })).toBeNull();
  });

  it('saves a found word as a favorite from the heart', async () => {
    register(HELLO);

    await renderDetail('hello');
    const heart = await screen.findByRole('button', { name: en.favorites.save('hello') });
    await waitFor(() => expect(heart).toBeEnabled());
    await fireEvent.press(heart);

    expect(
      await screen.findByRole('button', { name: en.favorites.remove('hello') }),
    ).toBeSelected();
    expect(favorites.add).toHaveBeenCalledWith('hello', null);
  });

  it('shows the loading skeleton while the word is looked up', async () => {
    register(HELLO);

    await renderDetail('hello');

    expect(screen.getByLabelText(en.wordDetail.loading)).toBeOnTheScreen();
    expect(await screen.findByRole('header', { name: 'hello' })).toBeOnTheScreen();
  });

  it('closes when the X is pressed', async () => {
    register(HELLO);
    const onClose = jest.fn();

    await renderDetail('hello', onClose);
    // Espera o detalhe e o coração ficarem prontos, para nada mudar depois do teste.
    const heart = await screen.findByRole('button', { name: en.favorites.save('hello') });
    await waitFor(() => expect(heart).toBeEnabled());
    await fireEvent.press(screen.getByRole('button', { name: en.wordDetail.close }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
