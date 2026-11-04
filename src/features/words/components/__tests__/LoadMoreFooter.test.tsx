import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { LoadMoreFooter } from '../LoadMoreFooter';

describe('LoadMoreFooter', () => {
  it('says it is finding more words while the next page loads', async () => {
    await render(<LoadMoreFooter status="loading" onRetry={jest.fn()} />);

    expect(screen.getByText(en.words.loadingMore)).toBeOnTheScreen();
  });

  it('offers to try again when the next page fails', async () => {
    const onRetry = jest.fn();
    await render(<LoadMoreFooter status="error" onRetry={onRetry} />);

    await fireEvent.press(screen.getByRole('button', { name: en.words.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when idle', async () => {
    await render(<LoadMoreFooter status="idle" onRetry={jest.fn()} />);

    expect(screen.toJSON()).toBeNull();
  });
});
