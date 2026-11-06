import { isAndroid13OrNewer, supportsNativeSheet } from '../nativeSheet';

describe('isAndroid13OrNewer', () => {
  it.each([
    ['android', 32, false],
    ['android', 33, true],
    ['android', 36, true],
    ['ios', '26.0', false],
  ])('on %s %s: %s', (os, version, expected) => {
    expect(isAndroid13OrNewer(os, version)).toBe(expected);
  });
});

describe('supportsNativeSheet', () => {
  it('uses the sheet on iOS, whatever the version', () => {
    expect(supportsNativeSheet('ios', '26.0')).toBe(true);
  });

  it.each([
    [31, false],
    [32, false],
    [33, true],
    [36, true],
  ])('on Android API %d: %s', (version, expected) => {
    expect(supportsNativeSheet('android', version)).toBe(expected);
  });
});
