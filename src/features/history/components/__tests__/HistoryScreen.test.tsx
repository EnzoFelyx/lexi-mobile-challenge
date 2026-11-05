import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, type AlertButton } from 'react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { en } from '@/i18n/en';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';
import { openWordDetail, openWordList } from '@/shared/utils/navigation';

import type { HistoryRepository } from '../../domain/HistoryRepository';
import { HistoryScreen } from '../HistoryScreen';

jest.mock('@/shared/utils/navigation', () => ({
  openWordDetail: jest.fn(),
  openWordList: jest.fn(),
}));

const registerHistory = (
  list: HistoryRepository['list'],
  clear: HistoryRepository['clear'] = async () => undefined,
) => {
  const repository: HistoryRepository = {
    recordView: async () => undefined,
    list,
    clear: jest.fn(clear),
  };
  container.registerInstance<HistoryRepository>(TOKENS.HistoryRepository, repository);
  return repository;
};

/** Histórico em memória: o que o "Clear" apaga some da próxima leitura. */
const registerSavedHistory = (initial: string[]) => {
  let saved = [...initial];
  return registerHistory(
    async () => [...saved],
    async () => {
      saved = [];
    },
  );
};

/** Toca no botão do alerta de confirmação com o texto dado. */
const pressAlertButton = async (alert: jest.SpyInstance, text: string) => {
  const buttons = alert.mock.calls[0]?.[2] as AlertButton[] | undefined;
  const button = buttons?.find((item) => item.text === text);
  await act(async () => button?.onPress?.());
};

const renderScreen = () => render(<HistoryScreen />, { wrapper: createQueryClientWrapper() });

describe('HistoryScreen', () => {
  afterEach(jest.restoreAllMocks);

  it('shows the viewed words with the count and the note', async () => {
    registerHistory(async () => ['wonder', 'quiet', 'bloom']);

    await renderScreen();

    expect(await screen.findByRole('header', { name: en.history.title })).toBeOnTheScreen();
    expect(screen.getByText(en.history.subtitle)).toBeOnTheScreen();
    expect(screen.getByText(en.history.summary(3))).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: en.history.clear })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'quiet' })).toBeOnTheScreen();
    expect(screen.getByText(en.history.note)).toBeOnTheScreen();
  });

  it('opens a word with its place in the history', async () => {
    registerHistory(async () => ['wonder', 'quiet']);

    await renderScreen();
    await fireEvent.press(await screen.findByRole('button', { name: 'quiet' }));

    expect(openWordDetail).toHaveBeenCalledWith('quiet', { source: 'history', index: 1 });
  });

  it('counts a single word in the singular', async () => {
    registerHistory(async () => ['wonder']);

    await renderScreen();

    expect(await screen.findByText('1 word viewed')).toBeOnTheScreen();
  });

  it('asks before clearing and shows the empty state once confirmed', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const repository = registerSavedHistory(['wonder', 'quiet']);

    await renderScreen();
    await fireEvent.press(await screen.findByRole('button', { name: en.history.clear }));

    expect(alert).toHaveBeenCalledWith(
      en.history.clearConfirm.title,
      en.history.clearConfirm.message,
      expect.any(Array),
    );
    expect(repository.clear).not.toHaveBeenCalled();

    await pressAlertButton(alert, en.history.clearConfirm.confirm);

    expect(repository.clear).toHaveBeenCalledWith(null);
    expect(await screen.findByRole('header', { name: en.history.empty.title })).toBeOnTheScreen();
  });

  it('keeps the history when the confirmation is cancelled', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const repository = registerSavedHistory(['wonder']);

    await renderScreen();
    await fireEvent.press(await screen.findByRole('button', { name: en.history.clear }));
    await pressAlertButton(alert, en.history.clearConfirm.cancel);

    expect(repository.clear).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'wonder' })).toBeOnTheScreen();
  });

  it('keeps the words and warns when clearing fails', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    registerHistory(
      async () => ['wonder'],
      async () => {
        throw new Error('database locked');
      },
    );

    await renderScreen();
    await fireEvent.press(await screen.findByRole('button', { name: en.history.clear }));
    await pressAlertButton(alert, en.history.clearConfirm.confirm);

    expect(alert).toHaveBeenLastCalledWith(
      en.history.clearErrorTitle,
      en.history.clearErrorMessage,
    );
    expect(screen.getByRole('button', { name: 'wonder' })).toBeOnTheScreen();
  });

  it('shows the empty state with a way back to the word list', async () => {
    registerHistory(async () => []);

    await renderScreen();

    expect(await screen.findByRole('header', { name: en.history.empty.title })).toBeOnTheScreen();
    expect(screen.getByText(en.history.empty.subtitle)).toBeOnTheScreen();
    expect(screen.getByText(en.history.empty.footer)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: en.savedWords.exploreWordList }));
    expect(openWordList).toHaveBeenCalledTimes(1);
  });

  it('shows an error with a retry when the history cannot be read', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const list = jest
      .fn<Promise<string[]>, [string | null]>()
      .mockRejectedValueOnce(new Error('database locked'))
      .mockResolvedValue(['wonder']);
    registerHistory(list);

    await renderScreen();
    await fireEvent.press(await screen.findByRole('button', { name: en.savedWords.retry }));

    expect(await screen.findByRole('button', { name: 'wonder' })).toBeOnTheScreen();
    expect(screen.queryByText(en.history.errorTitle)).toBeNull();
  });
});
