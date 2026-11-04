import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { WordDetailError } from '../WordDetailError';

describe('WordDetailError', () => {
  it('explains a word not found and offers to retry', async () => {
    const onRetry = jest.fn();
    await render(<WordDetailError kind="not_found" onRetry={onRetry} />);

    expect(screen.getByRole('header', { name: en.wordDetail.notFound.title })).toBeOnTheScreen();
    expect(screen.getByText(en.wordDetail.reassurance)).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: en.wordDetail.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('has its own message for the API rate limit', async () => {
    await render(<WordDetailError kind="rate_limited" onRetry={jest.fn()} />);

    expect(screen.getByText(en.wordDetail.rateLimited.message)).toBeOnTheScreen();
  });

  it('asks to check the connection when the lookup fails', async () => {
    await render(<WordDetailError kind="unavailable" onRetry={jest.fn()} />);

    expect(screen.getByText(en.wordDetail.unavailable.message)).toBeOnTheScreen();
  });

  it('shows "Next" only when there is a next word to go to', async () => {
    const onNext = jest.fn();
    const { rerender } = await render(<WordDetailError kind="not_found" onRetry={jest.fn()} />);
    expect(screen.queryByRole('button', { name: en.wordDetail.next })).not.toBeOnTheScreen();

    await rerender(<WordDetailError kind="not_found" onRetry={jest.fn()} onNext={onNext} />);
    await fireEvent.press(screen.getByRole('button', { name: en.wordDetail.next }));

    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
