import { isFastScrollUseful, scrollOffsetFor, thumbHeightFor, thumbOffsetFor } from '../fastScroll';

const metrics = { contentHeight: 10_000, viewportHeight: 800 };

describe('fast scroll math', () => {
  it('sizes the thumb by the visible share of the content, with a minimum', () => {
    expect(thumbHeightFor({ contentHeight: 1600, viewportHeight: 800 }, 44)).toBe(400);
    expect(thumbHeightFor(metrics, 44)).toBe(64);
    expect(thumbHeightFor({ contentHeight: 1_000_000, viewportHeight: 800 }, 44)).toBe(44);
  });

  it('places the thumb at the top, middle and bottom of the track', () => {
    const thumb = thumbHeightFor(metrics, 44);
    const trackRange = metrics.viewportHeight - thumb;

    expect(thumbOffsetFor(0, metrics, thumb)).toBe(0);
    expect(thumbOffsetFor(4600, metrics, thumb)).toBeCloseTo(trackRange / 2);
    expect(thumbOffsetFor(9200, metrics, thumb)).toBeCloseTo(trackRange);
    expect(thumbOffsetFor(99_999, metrics, thumb)).toBeCloseTo(trackRange);
  });

  it('turns a dragged thumb position back into the matching scroll offset', () => {
    const thumb = thumbHeightFor(metrics, 44);

    expect(scrollOffsetFor(thumbOffsetFor(3000, metrics, thumb), metrics, thumb)).toBeCloseTo(3000);
    expect(scrollOffsetFor(-50, metrics, thumb)).toBe(0);
  });

  it('is only useful when there are several screens of content', () => {
    expect(isFastScrollUseful(metrics, 3)).toBe(true);
    expect(isFastScrollUseful({ contentHeight: 1600, viewportHeight: 800 }, 3)).toBe(false);
  });
});
