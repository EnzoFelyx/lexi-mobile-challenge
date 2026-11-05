import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { DOUBLE_TAP_DELAY_MS } from '@/constants/gestures';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import type { FavoritesRepository } from '@/features/favorites/domain/FavoritesRepository';
import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { SpeechService } from '../../domain/PronunciationAudio';
import type { WordDetail } from '../../domain/WordDetail';
import { WordDetailContent } from '../WordDetailContent';

const definitions = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    definition: `Meaning ${index + 1}.`,
    example: null,
  }));

const HELLO: WordDetail = {
  word: 'hello',
  phonetic: '/həˈləʊ/',
  audioUrls: [],
  meanings: [{ partOfSpeech: 'noun', definitions: definitions(4) }],
};

const registerFavorites = (initial: string[]) => {
  let saved = [...initial];
  const repository: FavoritesRepository = {
    list: jest.fn(async () => [...saved]),
    add: jest.fn(async (word: string) => {
      saved = [word, ...saved];
    }),
    remove: jest.fn(async (word: string) => {
      saved = saved.filter((item) => item !== word);
    }),
  };
  container.registerInstance<FavoritesRepository>(TOKENS.FavoritesRepository, repository);
  // A voz termina na hora: nada fica falando depois do teste.
  container.registerInstance<SpeechService>(TOKENS.SpeechService, {
    speak: jest.fn((_text: string, onFinish: () => void) => onFinish()),
    stop: jest.fn(),
  });
  return repository;
};

/** Mostra a lista de favoritas ao lado do conteúdo, para esperar ela ser lida. */
function SavedWords() {
  const { words, isLoading } = useFavorites();
  return <Text>{isLoading ? 'loading' : `saved: ${words.join(',')}`}</Text>;
}

const renderContent = async () => {
  await render(
    <>
      <SavedWords />
      <WordDetailContent detail={HELLO} />
    </>,
    { wrapper: createQueryClientWrapper() },
  );
  await screen.findByText(/^saved:/);
};

/**
 * Dois toques no mesmo elemento, com `gap` ms entre eles (controla o relógio). O elemento é
 * buscado uma vez: botões como "Show more" e o play mudam de nome no primeiro toque.
 */
const tapTwice = async (target: Parameters<typeof fireEvent.press>[0], gap: number) => {
  const now = jest.spyOn(Date, 'now');
  now.mockReturnValue(1000);
  await fireEvent.press(target);
  now.mockReturnValue(1000 + gap);
  await fireEvent.press(target);
};

describe('WordDetailContent', () => {
  afterEach(jest.restoreAllMocks);

  it('saves the word with a double tap on the word card', async () => {
    const repository = registerFavorites([]);
    await renderContent();

    await tapTwice(screen.getByRole('header', { name: 'hello' }), DOUBLE_TAP_DELAY_MS);

    await waitFor(() => expect(repository.add).toHaveBeenCalledWith('hello', null));
    expect(await screen.findByText('saved: hello')).toBeOnTheScreen();
  });

  it('removes a favorite with a double tap on a meaning', async () => {
    const repository = registerFavorites(['hello']);
    await renderContent();

    await tapTwice(screen.getByText('Meaning 2.'), 100);

    await waitFor(() => expect(repository.remove).toHaveBeenCalledWith('hello', null));
  });

  it('does nothing on two slow taps', async () => {
    const repository = registerFavorites([]);
    await renderContent();

    await tapTwice(screen.getByText('Meaning 1.'), DOUBLE_TAP_DELAY_MS + 1);

    expect(repository.add).not.toHaveBeenCalled();
  });

  it('does not undo the double tap with a quick third tap', async () => {
    const repository = registerFavorites([]);
    await renderContent();
    const now = jest.spyOn(Date, 'now');

    for (const time of [1000, 1100, 1200]) {
      now.mockReturnValue(time);
      await fireEvent.press(screen.getByText('Meaning 1.'));
    }

    await waitFor(() => expect(repository.add).toHaveBeenCalledTimes(1));
    expect(repository.remove).not.toHaveBeenCalled();
  });

  it('keeps "Show more" and "Show less" to themselves', async () => {
    const repository = registerFavorites([]);
    await renderContent();

    // Dois toques rápidos no mesmo botão: abre e fecha, sem favoritar.
    await tapTwice(screen.getByRole('button', { name: en.wordDetail.showMore(1) }), 100);

    expect(screen.getByRole('button', { name: en.wordDetail.showMore(1) })).toBeOnTheScreen();
    expect(repository.add).not.toHaveBeenCalled();
  });

  it('keeps the play button to itself', async () => {
    const repository = registerFavorites([]);
    await renderContent();

    await tapTwice(
      screen.getByRole('button', { name: en.pronunciation.playWithVoice('hello') }),
      100,
    );

    expect(repository.add).not.toHaveBeenCalled();
  });
});
