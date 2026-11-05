import { act, renderHook } from '@testing-library/react-native';
import type { GestureResponderEvent } from 'react-native';

import { SWIPE_COMMIT_DISTANCE } from '@/constants/gestures';

import { type HorizontalSwipeOptions, useHorizontalSwipe } from '../useHorizontalSwipe';

const touch = (x: number, y: number, timestamp: number) =>
  ({ nativeEvent: { pageX: x, pageY: y, timestamp } }) as GestureResponderEvent;

const renderSwipe = (options: Partial<HorizontalSwipeOptions> = {}) => {
  const callbacks = { onSwipeLeft: jest.fn(), onSwipeRight: jest.fn() };
  const rendered = renderHook(() =>
    useHorizontalSwipe({ canSwipeLeft: true, canSwipeRight: true, ...callbacks, ...options }),
  );
  return { ...callbacks, rendered };
};

/** Um arrasto completo: começa em x=200, passa pelo meio e solta em `endX`, em `duration` ms. */
const drag = async (
  props: ReturnType<typeof useHorizontalSwipe>,
  endX: number,
  { y = 0, duration = 300 } = {},
) => {
  await act(async () => {
    props.onStartShouldSetResponderCapture?.(touch(200, 0, 0));
    const middle = touch((200 + endX) / 2, y / 2, duration / 2);
    if (props.onMoveShouldSetResponderCapture?.(middle)) {
      props.onResponderMove?.(middle);
      props.onResponderRelease?.(touch(endX, y, duration));
    }
  });
};

describe('useHorizontalSwipe', () => {
  it('goes to the next page when the finger moves left far enough', async () => {
    const { onSwipeLeft, onSwipeRight, rendered } = renderSwipe();
    const { result } = await rendered;

    await drag(result.current, 200 - SWIPE_COMMIT_DISTANCE - 10);

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('goes to the previous page when the finger moves right', async () => {
    const { onSwipeRight, rendered } = renderSwipe();
    const { result } = await rendered;

    await drag(result.current, 200 + SWIPE_COMMIT_DISTANCE + 10);

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('stays on the page after a short, slow drag', async () => {
    const { onSwipeLeft, rendered } = renderSwipe();
    const { result } = await rendered;

    await drag(result.current, 170, { duration: 1000 });

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('leaves vertical scrolling alone', async () => {
    const { onSwipeLeft, rendered } = renderSwipe();
    const { result } = await rendered;

    await drag(result.current, 190, { y: 300 });

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('cancels the swipe when the finger turns diagonal halfway', async () => {
    const { onSwipeLeft, rendered } = renderSwipe();
    const { result } = await rendered;
    const props = result.current;

    await act(async () => {
      props.onStartShouldSetResponderCapture?.(touch(200, 0, 0));
      const straight = touch(160, 2, 50);
      if (props.onMoveShouldSetResponderCapture?.(straight)) {
        props.onResponderMove?.(straight);
        props.onResponderMove?.(touch(60, 90, 150));
        // Volta para a horizontal antes de soltar: continua cancelado.
        props.onResponderRelease?.(touch(40, 10, 200));
      }
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('does not move past the ends of the list', async () => {
    const { onSwipeLeft, rendered } = renderSwipe({ canSwipeLeft: false });
    const { result } = await rendered;

    await drag(result.current, 0);

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('never takes the touch at its start, so taps and scrolling still reach the content', async () => {
    const { rendered } = renderSwipe();
    const { result } = await rendered;

    expect(result.current.onStartShouldSetResponderCapture?.(touch(0, 0, 0))).toBe(false);
    expect(result.current.onResponderTerminationRequest?.(touch(0, 0, 0))).toBe(false);
  });
});
