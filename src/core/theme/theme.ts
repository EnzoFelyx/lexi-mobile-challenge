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
    error: '#AD302B', // texto e borda de erro dos formulários
    errorSoft: '#FBECEA', // fundo da mensagem de erro do formulário
    surfaceDisabled: '#E4E7E0', // fundo do campo desabilitado
    scrim: '#000000', // fundo escurecido atrás dos diálogos
    textDisabled: '#56615A', // rótulo e valor do campo desabilitado
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
    error: '#FFAAA3',
    errorSoft: '#382421',
    surfaceDisabled: '#26322C',
    scrim: '#000000',
    textDisabled: '#ACB8AF',
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
  authTitle: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 38,
    lineHeight: 44,
    letterSpacing: -1,
  }, // título do login e do cadastro
  heading: { fontFamily: fonts.serifSemiBold, fontSize: 24 }, // "Meanings"
  title: { fontFamily: fonts.serifSemiBold, fontSize: 30 }, // título dos estados de erro do detalhe
  emptyTitle: { fontFamily: fonts.serifSemiBold, fontSize: 27 }, // título dos estados vazios

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
  fieldError: { fontFamily: fonts.sansRegular, fontSize: 11, lineHeight: 16 }, // erro abaixo do campo
  formError: { fontFamily: fonts.sansMedium, fontSize: 13, lineHeight: 20 }, // erro do formulário
  tagline: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  }, // "ENGLISH, EVERY DAY" no header das telas de login e cadastro
  meta: { fontFamily: fonts.sansSemiBold, fontSize: 10 }, // rótulo do player ("British pronunciation")
  chip: { fontFamily: fonts.sansSemiBold, fontSize: 11 },
  caption: { fontFamily: fonts.sansRegular, fontSize: 10, lineHeight: 14 }, // fonética no card
  eyebrow: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 10,
    letterSpacing: 1.3,
    textTransform: 'uppercase' as const,
  }, // rótulo do resumo de History e Favorites ("RECENTLY VIEWED")
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
  sheet: 28, // cantos da folha do detalhe no Android (Material 3)
  illustration: 36, // quadrado da ilustração dos estados de erro
  emptyIllustration: 40, // quadrado da ilustração dos estados vazios
  wordMark: 2, // traços decorativos da ilustração dos estados vazios
  pill: 100, // play, favorito, progresso
} as const;

export const sizes = {
  touchTarget: 44, // mínimo para qualquer ação
  header: 64, // header com logo e botão de conta
  brandPoint: 6, // ponto de acento ao lado do logo
  icon: 18, // ícones de botão
  closeIcon: 20, // "X" do detalhe
  playIcon: 20, // play/pause do player
  favoriteIcon: 21, // coração do detalhe
  row: 56, // linha das preferências nas configurações
  favoriteBurst: 72, // coração do toque duplo ao favoritar, no centro do detalhe (fora do Figma)
  illustration: 112, // quadrado da ilustração dos estados de erro
  illustrationIcon: 44, // ícone dentro da ilustração
  emptyIllustration: 120, // quadrado da ilustração dos estados vazios
  wordMarkLong: 24, // traços decorativos ("palavras") abaixo do ícone do estado vazio
  wordMarkShort: 12,
  wordMarkThickness: 3,
  summaryIcon: 12, // coração do resumo de Favorites
  noteIcon: 16, // ícone da nota no rodapé de History e Favorites
  spinner: 16, // loader-circle do "carregando mais"
  scrollThumb: 4, // barrinha de rolagem rápida (fora do Figma: mesma espessura do trilho de progresso)
  accountIcon: 19,
  iconStrokeWidth: 1.7, // traço dos ícones Lucide no Figma
  tabs: 52,
  tabItem: 44,
  button: 52,
  input: 56,
  fieldActiveBorder: 1.5, // contorno do campo com erro ou em foco
  chip: 26,
  progressTrack: 4,
  divider: 1, // linha divisória
  sheetHandleWidth: 32, // puxador da folha no Android (Material 3)
  sheetHandleThickness: 4,
  radio: 20, // botão de rádio das preferências no Android (Material 3)
  radioDot: 10,
  orDivider: 1.5, // traços do "ou" no login (fora do Figma, pedido do autor)
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
