import { renderHook, waitFor } from '@testing-library/react-native';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { createQueryClientWrapper } from '@/shared/testing/queryClientWrapper';

import type { HistoryRepository } from '../../domain/HistoryRepository';
import { useHistory } from '../useHistory';
import { useRecordWordView } from '../useRecordWordView';

const registerHistory = (
  recordView: HistoryRepository['recordView'],
  list: HistoryRepository['list'] = async () => [],
) => {
  const repository: HistoryRepository = {
    recordView: jest.fn(recordView),
    list: jest.fn(list),
    clear: jest.fn(async () => undefined),
  };
  container.registerInstance<HistoryRepository>(TOKENS.HistoryRepository, repository);
  return repository;
};

const renderRecord = (initialWord: string | null) =>
  renderHook(({ word }: { word: string | null }) => useRecordWordView(word), {
    initialProps: { word: initialWord },
    wrapper: createQueryClientWrapper(),
  });

describe('useRecordWordView', () => {
  it('records a found word for the guest, once', async () => {
    const repository = registerHistory(async () => undefined);

    const { rerender } = await renderRecord('hello');
    await rerender({ word: 'hello' });

    expect(repository.recordView).toHaveBeenCalledTimes(1);
    expect(repository.recordView).toHaveBeenCalledWith('hello', null);
  });

  it('records nothing while there is no found word (loading or not found)', async () => {
    const repository = registerHistory(async () => undefined);

    await renderRecord(null);

    expect(repository.recordView).not.toHaveBeenCalled();
  });

  it('records the word once a retry finds it', async () => {
    const repository = registerHistory(async () => undefined);

    const { rerender } = await renderRecord(null);
    await rerender({ word: 'colour' });

    expect(repository.recordView).toHaveBeenCalledWith('colour', null);
  });

  it('records the next word when the detail moves to another one', async () => {
    const repository = registerHistory(async () => undefined);

    const { rerender } = await renderRecord('hello');
    await rerender({ word: 'today' });

    expect(repository.recordView).toHaveBeenLastCalledWith('today', null);
  });

  it('refreshes the History tab after recording', async () => {
    const viewed: string[] = [];
    registerHistory(
      async (word) => {
        viewed.unshift(word);
      },
      async () => [...viewed],
    );

    const { result } = await renderHook(
      () => {
        useRecordWordView('hello');
        return useHistory();
      },
      { wrapper: createQueryClientWrapper() },
    );

    await waitFor(() => expect(result.current.words).toEqual(['hello']));
  });

  it('only warns when recording fails, without breaking the screen', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    registerHistory(async () => {
      throw new Error('database locked');
    });

    await renderRecord('hello');

    await waitFor(() => expect(warn).toHaveBeenCalled());
  });
});
