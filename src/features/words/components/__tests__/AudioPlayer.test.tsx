import { fireEvent, render, screen } from '@testing-library/react-native';

import { AudioPlayer } from '../AudioPlayer';

const baseProps = {
  label: 'British pronunciation',
  progress: 0.5,
  durationText: '0:02',
  buttonLabel: 'Play the pronunciation of hello',
  progressLabel: 'Pronunciation progress',
};

describe('AudioPlayer', () => {
  it('shows the accent, the duration and the progress, and plays on press', async () => {
    const onToggle = jest.fn();
    await render(<AudioPlayer {...baseProps} status="ready" onToggle={onToggle} />);

    expect(screen.getByText('British pronunciation')).toBeOnTheScreen();
    expect(screen.getByText('0:02')).toBeOnTheScreen();
    expect(screen.getByRole('progressbar')).toHaveAccessibilityValue({ now: 50 });

    await fireEvent.press(screen.getByRole('button', { name: baseProps.buttonLabel }));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('keeps the button disabled while the audio loads', async () => {
    await render(
      <AudioPlayer
        {...baseProps}
        label="Preparing audio"
        durationText="–:––"
        status="loading"
        onToggle={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: baseProps.buttonLabel })).toBeDisabled();
    expect(screen.getByText('Preparing audio')).toBeOnTheScreen();
    expect(screen.getByText('.', { includeHiddenElements: true })).toBeOnTheScreen();
  });
});
