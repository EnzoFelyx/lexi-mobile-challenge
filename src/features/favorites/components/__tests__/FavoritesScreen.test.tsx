import { fireEvent, render, screen } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';
import { openWordDetail, openWordList } from '@/shared/utils/navigation';

import type { FavoritesRepository } from '../../domain/FavoritesRepository';
import { FavoritesScreen } from '../FavoritesScreen';

jest.mock('@/shared/utils/navigation', () => ({
  openWordDetail: jest.fn(),
  openWordList: jest.fn(),
}));

const registerFavorites = (words: string[]) => {
  container.registerInstance<FavoritesRepository>(TOKENS.FavoritesRepository, {
    list: async () => words,
    add: async () => undefined,
    remove: async () => undefined,
  });
};

const renderScreen = () => render(<FavoritesScreen />, { wrapper: createQueryClientWrapper() });

describe('FavoritesScreen', () => {
  it('shows the saved words with the count and the note', async () => {
    registerFavorites(['serene', 'brave']);

    await renderScreen();

    expect(await screen.findByRole('header', { name: en.favorites.title })).toBeOnTheScreen();
    expect(screen.getByText(en.favorites.summary)).toBeOnTheScreen();
    expect(screen.getByText(en.favorites.count(2))).toBeOnTheScreen();
    expect(screen.getByText(en.favorites.note)).toBeOnTheScreen();
  });

  it('opens a word with its place in the favorites', async () => {
    registerFavorites(['serene', 'brave']);

    await renderScreen();
    await fireEvent.press(await screen.findByRole('button', { name: 'serene' }));

    expect(openWordDetail).toHaveBeenCalledWith('serene', { source: 'favorites', index: 0 });
  });

  it('shows the empty state with a way back to the word list', async () => {
    registerFavorites([]);

    await renderScreen();

    expect(await screen.findByRole('header', { name: en.favorites.empty.title })).toBeOnTheScreen();
    expect(screen.getByText(en.favorites.subtitle)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: en.savedWords.exploreWordList }));
    expect(openWordList).toHaveBeenCalledTimes(1);
  });
});
