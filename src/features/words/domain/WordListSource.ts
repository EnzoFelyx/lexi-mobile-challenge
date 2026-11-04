/** De onde vem a lista completa de palavras (a API do dicionário não lista palavras). */
export interface WordListSource {
  fetchWords(): Promise<string[]>;
}
