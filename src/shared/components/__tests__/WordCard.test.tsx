import { fireEvent, render, screen } from '@testing-library/react-native';

import { en } from '@/i18n/en';

import { WordCard } from '../WordCard';

describe('WordCard', () => {
  it('lets a long word wrap to two lines instead of shrinking it on one', async () => {
    await render(<WordCard word="advertisement" index={0} onPress={jest.fn()} />);

    const text = screen.getByText('advertisement');
    expect(text.props.numberOfLines).toBe(2);
    expect(text.props.android_hyphenationFrequency).toBe('full');
  });

  it('still opens a word without a result, telling it in the hint', async () => {
    const onPress = jest.fn();
    await render(<WordCard word="maucherite" index={2} onPress={onPress} isDimmed />);

    const card = screen.getByRole('button', { name: 'maucherite' });
    expect(card.props.accessibilityHint).toBe(en.words.notFoundWordHint);

    await fireEvent.press(card);

    expect(onPress).toHaveBeenCalledWith('maucherite', 2);
  });

  it('shows the word as a button that opens it', async () => {
    const onPress = jest.fn();
    await render(<WordCard word="hello" index={4} onPress={onPress} />);

    const card = screen.getByRole('button', { name: 'hello' });
    expect(card.props.accessibilityHint).toBe(en.words.openWordHint);

    await fireEvent.press(card);

    expect(onPress).toHaveBeenCalledWith('hello', 4);
  });
});
