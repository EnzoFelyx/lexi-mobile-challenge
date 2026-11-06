import { fireEvent, render, screen } from '@testing-library/react-native';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import type { ReactNode } from 'react';

import { en } from '@/i18n/en';

import { BackButton } from '../BackButton.ios';

jest.mock('expo-glass-effect', () => {
  const { View: MockView } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    GlassView: ({ children }: { children: ReactNode }) => (
      <MockView testID="glass">{children}</MockView>
    ),
    isGlassEffectAPIAvailable: jest.fn(() => true),
    isLiquidGlassAvailable: jest.fn(() => true),
  };
});

describe('BackButton on iOS', () => {
  it('uses the native glass and goes back when pressed', async () => {
    const onPress = jest.fn();
    await render(<BackButton onPress={onPress} />);

    expect(screen.getByTestId('glass')).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: en.header.back }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps the plain button on an iOS without Liquid Glass', async () => {
    jest.mocked(isLiquidGlassAvailable).mockReturnValueOnce(false);
    const onPress = jest.fn();
    await render(<BackButton onPress={onPress} />);

    expect(screen.queryByTestId('glass')).toBeNull();
    await fireEvent.press(screen.getByRole('button', { name: en.header.back }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
