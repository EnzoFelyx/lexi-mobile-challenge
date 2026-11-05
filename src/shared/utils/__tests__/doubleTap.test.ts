import { DOUBLE_TAP_DELAY_MS } from '@/constants/gestures';

import { isDoubleTap } from '../doubleTap';

describe('isDoubleTap', () => {
  it('needs a tap before', () => {
    expect(isDoubleTap(null, 1000)).toBe(false);
  });

  it('counts two taps within the delay', () => {
    expect(isDoubleTap(1000, 1000 + DOUBLE_TAP_DELAY_MS)).toBe(true);
  });

  it('ignores two taps too far apart', () => {
    expect(isDoubleTap(1000, 1001 + DOUBLE_TAP_DELAY_MS)).toBe(false);
  });
});
