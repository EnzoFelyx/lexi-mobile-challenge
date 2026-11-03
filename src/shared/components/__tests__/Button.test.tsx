import { fireEvent, render, screen } from '@testing-library/react-native';
import { ArrowRight } from 'lucide-react-native';

import { Button } from '../Button';

describe('Button', () => {
  it('exposes the label as an accessible button', async () => {
    await render(<Button label="Continue" onPress={jest.fn()} icon={ArrowRight} />);

    expect(screen.getByRole('button', { name: 'Continue' })).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button label="Previous" variant="secondary" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Previous' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
