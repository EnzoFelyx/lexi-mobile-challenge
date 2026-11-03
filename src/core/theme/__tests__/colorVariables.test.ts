import {
  COLOR_TOKENS,
  colorVariable,
  colorVariablesFor,
  hexToRgbChannels,
  toKebabCase,
} from '../colorVariables';
import { palette } from '../theme';

describe('colorVariables', () => {
  it('converts camelCase token names to kebab-case', () => {
    expect(toKebabCase('textSecondary')).toBe('text-secondary');
    expect(toKebabCase('background')).toBe('background');
  });

  it('names the CSS variable after the token', () => {
    expect(colorVariable('accentSoft')).toBe('--color-accent-soft');
  });

  it('converts a hex color to space-separated RGB channels', () => {
    expect(hexToRgbChannels('#14665C')).toBe('20 102 92');
  });

  it('rejects colors that are not #RRGGBB', () => {
    expect(() => hexToRgbChannels('#FFF')).toThrow('expected #RRGGBB');
  });

  it('builds one variable per token for each theme mode', () => {
    const light = colorVariablesFor('light');
    const dark = colorVariablesFor('dark');

    expect(Object.keys(light)).toHaveLength(COLOR_TOKENS.length);
    expect(light['--color-surface']).toBe(hexToRgbChannels(palette.light.surface));
    expect(dark['--color-surface']).toBe(hexToRgbChannels(palette.dark.surface));
  });
});
