import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { FavoriteButton } from '../FavoriteButton';

describe('FavoriteButton', () => {
  it('offers to save a word that is not a favorite', async () => {
    const onPress = jest.fn();
    await render(
      <FavoriteButton word="hello" isFavorite={false} disabled={false} onPress={onPress} />,
    );

    const button = screen.getByRole('button', { name: en.favorites.save('hello') });
    await fireEvent.press(button);

    expect(button).not.toBeSelected();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('offers to remove a favorite and reads as selected', async () => {
    await render(<FavoriteButton word="hello" isFavorite disabled={false} onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: en.favorites.remove('hello') })).toBeSelected();
  });

  it('does nothing while disabled', async () => {
    const onPress = jest.fn();
    await render(<FavoriteButton word="hello" isFavorite={false} disabled onPress={onPress} />);

    const button = screen.getByRole('button', { name: en.favorites.save('hello') });
    await fireEvent.press(button);

    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });
});
