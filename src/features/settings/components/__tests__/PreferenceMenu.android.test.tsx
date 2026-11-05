import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, type AlertButton } from 'react-native';

import type { PreferenceChoice } from '../../hooks/preferenceChoice';

// O Jest resolve a versão iOS por padrão; aqui entra a do Android (o diálogo no meio da tela).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PreferenceMenu } = require('../PreferenceMenu.tsx') as typeof import('../PreferenceMenu');

const choice = (choose: (value: string) => void): PreferenceChoice<string> => ({
  selected: 'dark',
  options: [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ],
  choose,
});

describe('PreferenceMenu (Android)', () => {
  afterEach(jest.restoreAllMocks);

  it('shows the current value and opens a native dialog with every option', async () => {
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    const choose = jest.fn();
    await render(
      <PreferenceMenu label="Appearance" choice={choice(choose)} accessibilityHint="Chooses" />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Appearance, Dark' }));
    const buttons = alert.mock.calls[0]?.[2] as AlertButton[];
    await act(async () => buttons.find((button) => button.text === 'Light')?.onPress?.());

    expect(buttons.map((button) => button.text)).toEqual(['Light', 'Dark', 'System']);
    expect(choose).toHaveBeenCalledWith('light');
  });
});
