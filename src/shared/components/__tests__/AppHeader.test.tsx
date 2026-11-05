import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { AppHeader } from '../AppHeader';

describe('AppHeader', () => {
  it('shows the tagline instead of the account button on the auth screens', async () => {
    await render(<AppHeader showTagline />);

    expect(screen.getByText(en.header.tagline)).toBeOnTheScreen();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('shows the app name as the header', async () => {
    await render(<AppHeader onAccountPress={jest.fn()} />);

    expect(screen.getByRole('header')).toHaveTextContent(en.appName);
  });

  it('opens the account from the tabs, without a back arrow', async () => {
    const onAccountPress = jest.fn();
    await render(<AppHeader onAccountPress={onAccountPress} />);

    await fireEvent.press(screen.getByRole('button', { name: en.header.accountLabel }));

    expect(onAccountPress).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: en.header.back })).toBeNull();
  });

  it('goes back from the settings, where the account button is only a marker', async () => {
    const onBack = jest.fn();
    await render(<AppHeader onBack={onBack} />);

    await fireEvent.press(screen.getByRole('button', { name: en.header.back }));

    expect(onBack).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: en.header.accountLabel })).toBeNull();
  });
});
