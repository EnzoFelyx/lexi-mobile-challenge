/**
 * Lexi design tokens
 * Extraídos do Figma (Component showcase · Light / Dark).
 * O arquivo não possui variáveis do Figma: os valores abaixo vêm das camadas.
 *
 * Fontes (etapa 1): npx expo install @expo-google-fonts/fraunces @expo-google-fonts/inter expo-font
 */

export const palette = {
  light: {
    background: '#F8F7F3', // fundo das telas
    surface: '#FFFFFF', // cards, inputs, botão secundário, aba ativa
    surfaceMuted: '#EEEFE9', // trilho das abas, botão de favorito (outline)
    border: '#DFE3DC', // bordas, divisores, trilho do progresso
    textPrimary: '#202925',
    textSecondary: '#67716B', // fonética, placeholders, legendas
    accent: '#14665C', // aba ativa, botão primário, progresso, chips
    onAccent: '#FFFFFF', // texto sobre o botão primário
    accentSoft: '#E5F0EA', // fundo do chip de classe gramatical
    playerIdle: '#E4E7E0', // botão de play enquanto o áudio carrega
  },
  dark: {
    background: '#111715',
    surface: '#1C2521',
    surfaceMuted: '#26322C',
    border: '#34423A',
    textPrimary: '#F0F2EB',
    textSecondary: '#ACB8AF',
    accent: '#82D3BF',
    onAccent: '#102B23',
    accentSoft: '#213E34',
    playerIdle: '#304038',
  },
} as const;

export const fonts = {
  serifSemiBold: 'Fraunces_600SemiBold',
  sansRegular: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
} as const;

export const typography = {
  // Fraunces
  display: { fontFamily: fonts.serifSemiBold, fontSize: 32 }, // títulos de seção/telas
  headwordCard: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 19,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  // TODO: confirmar no frame "Word detail" o tamanho do headword grande (caixa de 54pt de altura)

  // Inter
  body: { fontFamily: fonts.sansRegular, fontSize: 14 }, // inputs, definições
  button: { fontFamily: fonts.sansSemiBold, fontSize: 14 },
  label: { fontFamily: fonts.sansMedium, fontSize: 13 }, // labels de input, aba inativa
  labelStrong: { fontFamily: fonts.sansSemiBold, fontSize: 13 }, // aba ativa
  description: { fontFamily: fonts.sansRegular, fontSize: 12, lineHeight: 19 },
  chip: { fontFamily: fonts.sansSemiBold, fontSize: 11 },
  caption: { fontFamily: fonts.sansRegular, fontSize: 10, lineHeight: 14 }, // fonética no card
  eyebrow: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

export const spacing = {
  xxs: 4,
  xs: 5, // gap entre headword e fonética no card
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24, // gutter lateral das telas
  xxl: 32,
} as const;

export const radius = {
  sm: 8, // chip, abas internas
  md: 12, // cards, botões, inputs, trilho das abas
  pill: 100, // play, favorito, progresso
} as const;

export const sizes = {
  touchTarget: 44, // mínimo para qualquer ação
  tabs: 52,
  tabItem: 44,
  button: 52,
  input: 56,
  chip: 26,
  progressTrack: 4,
  wordCard: { width: 106, height: 104 },
  gridGap: 12,
  screenWidth: 390, // referência do design (iPhone)
} as const;

export type ThemeMode = keyof typeof palette;
export type ThemeColors = (typeof palette)[ThemeMode];

export const createTheme = (mode: ThemeMode) => ({
  mode,
  colors: palette[mode],
  fonts,
  typography,
  spacing,
  radius,
  sizes,
});

export type Theme = ReturnType<typeof createTheme>;
