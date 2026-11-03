import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { AppHeader } from '../AppHeader';

describe('AppHeader', () => {
  it('shows the app name as the header', async () => {
    await render(<AppHeader onAccountPress={jest.fn()} />);

    expect(screen.getByRole('header')).toHaveTextContent(en.appName);
  });

  it('opens the account when the account button is pressed', async () => {
    const onAccountPress = jest.fn();
    await render(<AppHeader onAccountPress={onAccountPress} />);

    await fireEvent.press(screen.getByRole('button', { name: en.header.accountLabel }));

    expect(onAccountPress).toHaveBeenCalledTimes(1);
  });
});
