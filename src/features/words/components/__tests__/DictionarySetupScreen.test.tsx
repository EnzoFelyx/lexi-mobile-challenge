import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { DictionarySetupScreen } from '../DictionarySetupScreen';

describe('DictionarySetupScreen', () => {
  it('shows the saving progress as a percentage', async () => {
    await render(<DictionarySetupScreen status="saving" progress={0.42} onRetry={jest.fn()} />);

    expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({ now: 42 });
    expect(screen.getByText('42%')).toBeOnTheScreen();
  });

  it('explains the one-time download while the list is downloading', async () => {
    await render(<DictionarySetupScreen status="downloading" progress={0} onRetry={jest.fn()} />);

    expect(screen.getByText(en.dictionarySetup.downloading)).toBeOnTheScreen();
  });

  it('offers to try again after a failure', async () => {
    const onRetry = jest.fn();
    await render(<DictionarySetupScreen status="error" progress={0} onRetry={onRetry} />);

    await fireEvent.press(screen.getByRole('button', { name: en.dictionarySetup.retry }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
