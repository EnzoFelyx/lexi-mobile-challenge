import { palette, type ThemeColors, type ThemeMode } from '../theme';

// Luminância relativa e razão de contraste da WCAG 2.x.
const relativeLuminance = (hex: string): number => {
  const [red = 0, green = 0, blue = 0] = [1, 3, 5].map((start) => {
    const channel = parseInt(hex.slice(start, start + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (foreground: string, background: string): number => {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)].sort(
    (a, b) => b - a,
  );
  return ((lighter ?? 0) + 0.05) / ((darker ?? 0) + 0.05);
};

type Token = keyof ThemeColors;

// Pares texto/fundo que aparecem nas telas do Figma (AA: 4,5:1 para texto).
const textPairs: [Token, Token][] = [
  ['textPrimary', 'background'],
  ['textPrimary', 'surface'],
  ['textPrimary', 'surfaceMuted'],
  ['textSecondary', 'background'],
  ['textSecondary', 'surface'],
  ['textSecondary', 'surfaceMuted'],
  ['accent', 'background'],
  ['accent', 'surface'],
  ['accent', 'accentSoft'],
  ['onAccent', 'accent'],
];

describe.each(['light', 'dark'] as ThemeMode[])('%s theme contrast', (mode) => {
  it.each(textPairs)('%s on %s meets WCAG AA for text', (foreground, background) => {
    const ratio = contrastRatio(palette[mode][foreground], palette[mode][background]);

    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
