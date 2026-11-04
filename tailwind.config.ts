import type { Config } from 'tailwindcss';

import { COLOR_TOKENS, colorVariable, toKebabCase } from './src/core/theme/colorVariables';
import { fonts, radius, sizes, spacing, typography } from './src/core/theme/theme';

/**
 * Sem valores próprios: tudo vem de src/core/theme/theme.ts (REGRAS.md, regra 3).
 * As chaves de `theme` substituem a escala padrão do Tailwind (não existe bg-white nem p-4).
 */

const px = (value: number): string => `${value}px`;

const mapEntries = <T, R>(source: Record<string, T>, map: (value: T) => R): Record<string, R> =>
  Object.fromEntries(Object.entries(source).map(([key, value]) => [toKebabCase(key), map(value)]));

// Cores como variáveis CSS: o ThemeProvider troca os valores entre light e dark.
const colors = Object.fromEntries(
  COLOR_TOKENS.map((token) => [
    toKebabCase(token),
    `rgb(var(${colorVariable(token)}) / <alpha-value>)`,
  ]),
);

const fontSize = mapEntries(typography, (style) => {
  const lineHeight = 'lineHeight' in style ? px(style.lineHeight) : undefined;
  const letterSpacing = 'letterSpacing' in style ? px(style.letterSpacing) : undefined;
  return [px(style.fontSize), { lineHeight, letterSpacing }] as [
    string,
    { lineHeight?: string; letterSpacing?: string },
  ];
});

const componentSizes = mapEntries(
  {
    touchTarget: sizes.touchTarget,
    header: sizes.header,
    brandPoint: sizes.brandPoint,
    wordCard: sizes.wordCard.height,
    tabs: sizes.tabs,
    tabItem: sizes.tabItem,
    button: sizes.button,
    input: sizes.input,
    chip: sizes.chip,
    progressTrack: sizes.progressTrack,
  },
  px,
);

export default {
  content: ['./src/**/*.{ts,tsx}'],
  // O preset do NativeWind não publica tipos ESM válidos, então entra por require.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  theme: {
    colors,
    fontFamily: mapEntries(fonts, (family) => [family]),
    fontSize,
    spacing: { 0: '0px', ...mapEntries(spacing, px) },
    borderRadius: { none: '0px', ...mapEntries(radius, px) },
    extend: {
      height: componentSizes,
      width: componentSizes,
      minHeight: componentSizes,
      minWidth: componentSizes,
    },
  },
  plugins: [],
} satisfies Config;
