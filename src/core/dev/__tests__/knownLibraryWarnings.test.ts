import { isKnownLibraryWarning } from '../knownLibraryWarnings';

describe('isKnownLibraryWarning', () => {
  it('matches the NativeWind ImageBackground deprecation', () => {
    expect(
      isKnownLibraryWarning(
        'ImageBackground is deprecated and will be removed in a future release. Use a View…',
      ),
    ).toBe(true);
  });

  it('matches the tab pager animation warning', () => {
    expect(
      isKnownLibraryWarning('Sending `onAnimatedValueUpdate` with no listeners registered.'),
    ).toBe(true);
  });

  it('keeps every other warning, including the Lexi logger ones', () => {
    expect(isKnownLibraryWarning('[history] Could not record "hello" as viewed.')).toBe(false);
    expect(isKnownLibraryWarning(new Error('ImageBackground is deprecated'))).toBe(false);
  });
});
