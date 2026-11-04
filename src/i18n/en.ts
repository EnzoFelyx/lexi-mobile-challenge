/**
 * Todos os textos da interface (REGRAS.md: nada escrito direto no JSX).
 * Um objeto por área; plurais e labels de acessibilidade com parâmetro viram funções.
 */
export const en = {
  appName: 'Lexi',
  header: {
    accountLabel: 'Account',
    accountHint: 'Opens sign in',
  },
  tabs: {
    words: 'Word list',
    history: 'History',
    favorites: 'Favorites',
  },
  words: {
    title: 'Word list',
    subtitle: 'A little curiosity, every day.',
    loadingMore: 'Finding more words…',
    loading: 'Loading words',
    openWordHint: 'Opens the meanings and pronunciation',
    loadMoreError: "Couldn't load more words.",
    errorTitle: "Couldn't load the words",
    errorMessage: 'Something went wrong while reading the dictionary on this device.',
    emptyTitle: 'No words yet',
    emptyMessage: 'The dictionary is empty. Close the app and open it again to download it.',
    retry: 'Try again',
  },
  history: {
    title: 'History',
  },
  favorites: {
    title: 'Favorites',
  },
  wordDetail: {
    close: 'Close',
    title: 'Word explorer',
    meanings: 'Meanings',
    showMore: (count: number) => `Show ${count} more`,
    showLess: 'Show less',
    example: (text: string) => `“${text}”`,
    loading: 'Loading the word',
    notFoundTitle: 'Word not found',
    notFoundMessage: "This word isn't in the dictionary yet.",
    errorTitle: "Couldn't load the word",
    errorMessage: 'Check your internet connection and try again.',
    retry: 'Retry',
  },
  auth: {
    loginTitle: 'Log in',
  },
  dictionarySetup: {
    title: 'Preparing your dictionary',
    downloading: 'Downloading the word list. This only happens once.',
    saving: 'Saving 370,000 words on your device…',
    progressLabel: 'Dictionary setup progress',
    percent: (value: number) => `${value}%`,
    errorTitle: "Couldn't prepare the dictionary",
    errorMessage:
      'Check your internet connection and try again. The word list is downloaded only once.',
    retry: 'Try again',
  },
  database: {
    unavailableTitle: 'Something went wrong',
    unavailableMessage:
      "We couldn't open the dictionary on this device. Close the app and open it again.",
  },
  placeholder: {
    note: 'This screen is a placeholder for the next stages.',
    openSampleWord: 'Open a sample word',
  },
} as const;
