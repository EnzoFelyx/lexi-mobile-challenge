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
  },
  history: {
    title: 'History',
  },
  favorites: {
    title: 'Favorites',
  },
  wordDetail: {
    close: 'Close',
  },
  auth: {
    loginTitle: 'Log in',
  },
  placeholder: {
    note: 'This screen is a placeholder for the next stages.',
    openSampleWord: 'Open a sample word',
  },
} as const;
