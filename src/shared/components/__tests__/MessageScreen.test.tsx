import { fireEvent, render, screen } from '@testing-library/react-native';

import { MessageScreen } from '../MessageScreen';

describe('MessageScreen', () => {
  it('shows the title as a header and the message', async () => {
    await render(<MessageScreen title="Something went wrong" message="Try again later." />);

    expect(screen.getByRole('header', { name: 'Something went wrong' })).toBeOnTheScreen();
    expect(screen.getByText('Try again later.')).toBeOnTheScreen();
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('runs the action when its button is pressed', async () => {
    const onPress = jest.fn();
    await render(
      <MessageScreen
        title="Offline"
        message="Check your connection."
        action={{ label: 'Try again', onPress }}
      />,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Try again' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
