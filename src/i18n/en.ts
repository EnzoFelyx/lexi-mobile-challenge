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
    tabLabel: (name: string, position: number, total: number) =>
      `${name}, tab ${position} of ${total}`,
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
} as const;
