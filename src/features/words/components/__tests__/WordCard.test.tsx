import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { WordCard } from '../WordCard';

describe('WordCard', () => {
  it('shows the word as a button that opens it', async () => {
    const onPress = jest.fn();
    await render(<WordCard word="hello" onPress={onPress} />);

    const card = screen.getByRole('button', { name: 'hello' });
    expect(card.props.accessibilityHint).toBe(en.words.openWordHint);

    await fireEvent.press(card);

    expect(onPress).toHaveBeenCalledWith('hello');
  });
});
