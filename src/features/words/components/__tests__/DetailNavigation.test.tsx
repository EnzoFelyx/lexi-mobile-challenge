import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import type { WordNavigation } from '../../hooks/useWordNavigation';
import { DetailNavigation } from '../DetailNavigation';

const navigationWith = (overrides: Partial<WordNavigation>): WordNavigation => ({
  canGoPrevious: true,
  canGoNext: true,
  isLoadingNext: false,
  goToPrevious: jest.fn(),
  goToNext: jest.fn(),
  ...overrides,
});

describe('DetailNavigation', () => {
  it('moves to the previous and next words', async () => {
    const navigation = navigationWith({});
    await render(<DetailNavigation navigation={navigation} />);

    await fireEvent.press(screen.getByRole('button', { name: en.wordDetail.previous }));
    await fireEvent.press(screen.getByRole('button', { name: en.wordDetail.next }));

    expect(navigation.goToPrevious).toHaveBeenCalledTimes(1);
    expect(navigation.goToNext).toHaveBeenCalledTimes(1);
  });

  it('disables the buttons at the ends of the list', async () => {
    await render(
      <DetailNavigation navigation={navigationWith({ canGoPrevious: false, canGoNext: false })} />,
    );

    expect(screen.getByRole('button', { name: en.wordDetail.previous })).toBeDisabled();
    expect(screen.getByRole('button', { name: en.wordDetail.next })).toBeDisabled();
  });

  it('disables "Next" while the next words load', async () => {
    await render(<DetailNavigation navigation={navigationWith({ isLoadingNext: true })} />);

    expect(screen.getByRole('button', { name: en.wordDetail.next })).toBeDisabled();
  });
});
