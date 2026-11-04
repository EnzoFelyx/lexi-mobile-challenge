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
    lookingUp: 'Looking up a little more meaning…',
    notFound: {
      title: 'Word not found',
      message:
        'We couldn’t find a definition for this word. Try again, or discover the next word in your list.',
    },
    unavailable: {
      title: 'Couldn’t load the word',
      message: 'Check your internet connection and try again.',
    },
    rateLimited: {
      title: 'Too many lookups',
      message: 'Too many lookups right now. Wait a moment and try again.',
    },
    reassurance: 'Your place is saved. There’s always another word to explore.',
    retry: 'Retry',
    next: 'Next',
    previous: 'Previous',
    previousHint: 'Opens the previous word in this list',
    nextHint: 'Opens the next word in this list',
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
  pronunciation: {
    accent: {
      uk: 'British pronunciation',
      us: 'American pronunciation',
      au: 'Australian pronunciation',
      ca: 'Canadian pronunciation',
    },
    generic: 'Pronunciation',
    preparing: 'Preparing audio',
    play: (word: string) => `Play the pronunciation of ${word}`,
    playWithVoice: (word: string) => `Play the pronunciation of ${word} with the device voice`,
    pause: 'Pause the pronunciation',
    progress: 'Pronunciation progress',
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
