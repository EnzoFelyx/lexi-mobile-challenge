/**
 * Tokens da injeção de dependência: um por interface do `domain` (REGRAS.md, regra 2),
 * mais a infraestrutura compartilhada (banco). Nunca use strings soltas.
 */
export const TOKENS = {
  Database: Symbol('Database'),
  SqliteConnection: Symbol('SqliteConnection'),
  WordListSource: Symbol('WordListSource'),
  DictionarySeeder: Symbol('DictionarySeeder'),
  WordRepository: Symbol('WordRepository'),
  DictionaryService: Symbol('DictionaryService'),
  WordCacheRepository: Symbol('WordCacheRepository'),
  HistoryRepository: Symbol('HistoryRepository'),
  FavoritesRepository: Symbol('FavoritesRepository'),
  PronunciationAudioFactory: Symbol('PronunciationAudioFactory'),
  PronunciationAudioCache: Symbol('PronunciationAudioCache'),
  SpeechService: Symbol('SpeechService'),
} as const satisfies Record<string, symbol>;

export type Token = (typeof TOKENS)[keyof typeof TOKENS];
