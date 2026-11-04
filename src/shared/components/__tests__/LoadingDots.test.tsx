import { act, render, screen } from '@testing-library/react-native';

import { LOADING_DOTS_INTERVAL_MS } from '@/constants/animation';

import { LoadingDots } from '../LoadingDots';

describe('LoadingDots', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('cycles through one, two and three dots', async () => {
    await render(<LoadingDots variant="meta" tone="accent" />);
    const dots = () => screen.getByText(/^\.+$/, { includeHiddenElements: true });

    expect(dots()).toHaveTextContent('.');
    await act(async () => jest.advanceTimersByTime(LOADING_DOTS_INTERVAL_MS));
    expect(dots()).toHaveTextContent('..');
    await act(async () => jest.advanceTimersByTime(LOADING_DOTS_INTERVAL_MS));
    expect(dots()).toHaveTextContent('...');
    await act(async () => jest.advanceTimersByTime(LOADING_DOTS_INTERVAL_MS));
    expect(dots()).toHaveTextContent('.');
  });

  it('is hidden from screen readers, which read only the label', async () => {
    await render(<LoadingDots variant="meta" tone="accent" />);

    expect(screen.queryByText('.')).not.toBeOnTheScreen();
  });
});
