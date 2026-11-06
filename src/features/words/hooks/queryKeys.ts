/** Chaves estáveis do React Query da feature de palavras. */
export const wordQueryKeys = {
  dictionarySetup: ['words', 'dictionary-setup'] as const,
  list: ['words', 'list'] as const,
  notFound: ['words', 'not-found'] as const,
  detail: (word: string) => ['words', 'detail', word] as const,
};
