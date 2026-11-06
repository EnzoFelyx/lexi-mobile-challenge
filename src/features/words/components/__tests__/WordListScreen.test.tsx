import { render, screen, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { WordRepository } from '../../domain/WordRepository';
import { WordListScreen } from '../WordListScreen';

jest.mock('@/shared/utils/navigation', () => ({ openWordDetail: jest.fn() }));

const registerRepository = (getPage: WordRepository['getPage'], notFoundWords: string[] = []) => {
  container.registerInstance<WordRepository>(TOKENS.WordRepository, { getPage });
  container.registerInstance(TOKENS.WordCacheRepository, {
    listNotFound: async () => notFoundWords,
  });
};

const renderScreen = () => render(<WordListScreen />, { wrapper: createQueryClientWrapper() });

describe('WordListScreen', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  it('shows the section heading and the words as cards', async () => {
    registerRepository(async () => ({ words: ['hello', 'today', 'great'], nextCursor: null }));

    await renderScreen();

    expect(await screen.findByRole('header', { name: en.words.title })).toBeOnTheScreen();
    expect(screen.getByText(en.words.subtitle)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'today' })).toBeOnTheScreen();
  });

  it('dims only the words without a result, which keep opening', async () => {
    registerRepository(async () => ({ words: ['hello', 'zzz'], nextCursor: null }), ['zzz']);

    await renderScreen();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'zzz' }).props.accessibilityHint).toBe(
        en.words.notFoundWordHint,
      ),
    );
    expect(screen.getByRole('button', { name: 'hello' }).props.accessibilityHint).toBe(
      en.words.openWordHint,
    );
  });

  it('shows the cards normally when the words without a result cannot be read', async () => {
    registerRepository(async () => ({ words: ['hello'], nextCursor: null }));
    container.registerInstance(TOKENS.WordCacheRepository, {
      listNotFound: async () => {
        throw new Error('database locked');
      },
    });

    await renderScreen();

    expect(await screen.findByRole('button', { name: 'hello' })).toBeOnTheScreen();
  });

  it('shows an error with a retry when the list cannot be read', async () => {
    registerRepository(async () => {
      throw new Error('database locked');
    });

    await renderScreen();

    expect(await screen.findByText(en.recoverableError.title)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.words.retry })).toBeOnTheScreen();
  });

  it('explains when the dictionary is empty', async () => {
    registerRepository(async () => ({ words: [], nextCursor: null }));

    await renderScreen();

    expect(await screen.findByText(en.words.emptyTitle)).toBeOnTheScreen();
  });
});
