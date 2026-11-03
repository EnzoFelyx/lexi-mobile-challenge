import { palette, type ThemeColors, type ThemeMode } from './theme';

/**
 * Ponte entre os tokens de cor do `theme.ts` e as variáveis CSS do NativeWind.
 * Usado pelo `tailwind.config.ts` (nome das classes) e pelo ThemeProvider (valores por tema),
 * por isso não importa nada de React Native.
 */

export type ColorToken = keyof ThemeColors;

export const COLOR_TOKENS = Object.keys(palette.light) as ColorToken[];

export function toKebabCase(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export function colorVariable(token: ColorToken): string {
  return `--color-${toKebabCase(token)}`;
}

/** `#14665C` → `20 102 92`, formato que o Tailwind usa em `rgb(var(--x) / <alpha-value>)`. */
export function hexToRgbChannels(hex: string): string {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!match) {
    throw new Error(`Invalid theme color "${hex}": expected #RRGGBB`);
  }
  return match
    .slice(1)
    .map((channel) => parseInt(channel, 16))
    .join(' ');
}

export function colorVariablesFor(mode: ThemeMode): Record<string, string> {
  return Object.fromEntries(
    COLOR_TOKENS.map((token) => [colorVariable(token), hexToRgbChannels(palette[mode][token])]),
  );
}
