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
    textSecondary: '#636D67', // fonética, placeholders, legendas (Figma: #67716B, escurecido para AA sobre surfaceMuted)
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
  sansItalic: 'Inter_400Regular_Italic', // fonética e exemplos do detalhe
} as const;

export const typography = {
  // Fraunces
  display: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.7,
  }, // títulos de seção/telas
  logo: { fontFamily: fonts.serifSemiBold, fontSize: 30, letterSpacing: -1.4 }, // "Lexi" no header
  headwordCard: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 19,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  headwordLarge: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 48,
    lineHeight: 54,
    letterSpacing: -1.4,
  }, // palavra no card do detalhe
  heading: { fontFamily: fonts.serifSemiBold, fontSize: 24 }, // "Meanings"
  title: { fontFamily: fonts.serifSemiBold, fontSize: 30 }, // título dos estados de erro do detalhe

  // Inter
  body: { fontFamily: fonts.sansRegular, fontSize: 14 }, // inputs, definições
  button: { fontFamily: fonts.sansSemiBold, fontSize: 14 },
  label: { fontFamily: fonts.sansMedium, fontSize: 13 }, // labels de input, aba inativa
  labelStrong: { fontFamily: fonts.sansSemiBold, fontSize: 13 }, // aba ativa
  description: { fontFamily: fonts.sansRegular, fontSize: 12, lineHeight: 19 },
  subtitle: { fontFamily: fonts.sansRegular, fontSize: 13, lineHeight: 18 }, // texto de apoio dos títulos
  definition: { fontFamily: fonts.sansRegular, fontSize: 13, lineHeight: 20 }, // significado no detalhe
  phonetic: { fontFamily: fonts.sansItalic, fontSize: 16, lineHeight: 20 }, // fonética no detalhe
  example: { fontFamily: fonts.sansItalic, fontSize: 12, lineHeight: 19 }, // exemplo de uso
  note: { fontFamily: fonts.sansRegular, fontSize: 11 }, // "Finding more words…"
  message: { fontFamily: fonts.sansRegular, fontSize: 14, lineHeight: 22 }, // texto dos estados de erro
  hint: { fontFamily: fonts.sansRegular, fontSize: 11, lineHeight: 18 }, // caixa "Your place is saved…"
  meta: { fontFamily: fonts.sansSemiBold, fontSize: 10 }, // rótulo do player ("British pronunciation")
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
  lgPlus: 20, // padding do card da palavra e espaço entre blocos do detalhe
  xl: 24, // gutter lateral das telas
  xxl: 32,
} as const;

export const radius = {
  sm: 8, // chip, abas internas
  md: 12, // cards, botões, inputs, trilho das abas
  lg: 16, // card da palavra no detalhe
  illustration: 36, // quadrado da ilustração dos estados de erro
  pill: 100, // play, favorito, progresso
} as const;

export const sizes = {
  touchTarget: 44, // mínimo para qualquer ação
  header: 64, // header com logo e botão de conta
  brandPoint: 6, // ponto de acento ao lado do logo
  icon: 18, // ícones de botão
  closeIcon: 20, // "X" do detalhe
  playIcon: 20, // play/pause do player
  illustration: 112, // quadrado da ilustração dos estados de erro
  illustrationIcon: 44, // ícone dentro da ilustração
  spinner: 16, // loader-circle do "carregando mais"
  scrollThumb: 4, // barrinha de rolagem rápida (fora do Figma: mesma espessura do trilho de progresso)
  accountIcon: 19,
  iconStrokeWidth: 1.7, // traço dos ícones Lucide no Figma
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
