import {
  SWIPE_COMMIT_DISTANCE,
  SWIPE_COMMIT_VELOCITY,
  SWIPE_FLICK_MIN_DISTANCE,
  SWIPE_START_DISTANCE,
} from '@/constants/gestures';

import { isHorizontalSwipe, swipeDirectionFor } from '../swipe';

describe('isHorizontalSwipe', () => {
  it('takes a clearly horizontal drag', () => {
    expect(isHorizontalSwipe(-(SWIPE_START_DISTANCE + 8), 4)).toBe(true);
  });

  it('leaves vertical scrolling and diagonal drags alone', () => {
    expect(isHorizontalSwipe(4, 60)).toBe(false);
    expect(isHorizontalSwipe(60, 60)).toBe(false);
    // ~30°: ainda diagonal demais.
    expect(isHorizontalSwipe(60, 35)).toBe(false);
  });

  it('accepts a drag up to about 20 degrees', () => {
    // tan(20°) ≈ 0,36.
    expect(isHorizontalSwipe(100, 35)).toBe(true);
    expect(isHorizontalSwipe(100, 40)).toBe(false);
  });

  it('ignores a tiny shake of the finger', () => {
    expect(isHorizontalSwipe(SWIPE_START_DISTANCE, 0)).toBe(false);
  });
});

describe('swipeDirectionFor', () => {
  it('goes to the next page on a long drag to the left, and back to the right', () => {
    expect(swipeDirectionFor(-SWIPE_COMMIT_DISTANCE, 0, 0)).toBe('left');
    expect(swipeDirectionFor(SWIPE_COMMIT_DISTANCE, 0, 0)).toBe('right');
  });

  it('accepts a quick flick that is not too short', () => {
    expect(swipeDirectionFor(-SWIPE_FLICK_MIN_DISTANCE, 0, -SWIPE_COMMIT_VELOCITY)).toBe('left');
  });

  it('stays on the page when the whole drag ended up diagonal', () => {
    expect(swipeDirectionFor(-SWIPE_COMMIT_DISTANCE * 2, SWIPE_COMMIT_DISTANCE, -2)).toBeNull();
  });

  it('stays on the page after a short, slow drag or a tiny flick', () => {
    expect(swipeDirectionFor(-(SWIPE_COMMIT_DISTANCE - 1), 0, -0.1)).toBeNull();
    expect(swipeDirectionFor(-(SWIPE_FLICK_MIN_DISTANCE - 1), 0, -2)).toBeNull();
  });
});
