import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import type { PreferenceChoice } from '../../hooks/preferenceChoice';

// O Jest resolve a versão iOS por padrão; aqui entra a do Android.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PreferenceMenu } = require('../PreferenceMenu.tsx') as typeof import('../PreferenceMenu');

const choice = (choose: (value: string) => void): PreferenceChoice<string> => ({
  selected: 'dark',
  options: [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ],
  choose,
});

const renderMenu = (choose = jest.fn()) =>
  render(<PreferenceMenu label="Appearance" choice={choice(choose)} accessibilityHint="Chooses" />);

const openMenu = () => fireEvent.press(screen.getByRole('button', { name: 'Appearance, Dark' }));

describe('PreferenceMenu on Android', () => {
  it('stays closed until the row is pressed', async () => {
    await renderMenu();

    expect(screen.queryByRole('radio', { name: 'Light' })).toBeNull();
  });

  it('marks the current option and applies the chosen one, closing', async () => {
    const choose = jest.fn();
    await renderMenu(choose);
    await openMenu();

    expect(screen.getByRole('radio', { name: 'Dark', checked: true })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Light', checked: false })).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('radio', { name: 'Light' }));

    expect(choose).toHaveBeenCalledWith('light');
    expect(screen.queryByRole('radio', { name: 'Light' })).toBeNull();
  });

  it('closes without choosing when pressing outside', async () => {
    const choose = jest.fn();
    await renderMenu(choose);
    await openMenu();

    await fireEvent.press(screen.getByRole('button', { name: en.settings.closePicker }));

    expect(choose).not.toHaveBeenCalled();
    expect(screen.queryByRole('radio', { name: 'Light' })).toBeNull();
  });
});
