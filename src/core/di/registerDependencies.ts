import type { SQLiteDatabase } from 'expo-sqlite';

import { database, type Database, sqliteConnection } from '@/core/database/client';
import { PreviewAuthService } from '@/features/auth/data/PreviewAuthService';
import type { AuthService } from '@/features/auth/domain/AuthService';
import { KvPreferenceStorage } from '@/features/settings/data/KvPreferenceStorage';
import type { PreferenceStorage } from '@/features/settings/domain/PreferenceStorage';
import { SqliteFavoritesRepository } from '@/features/favorites/data/SqliteFavoritesRepository';
import type { FavoritesRepository } from '@/features/favorites/domain/FavoritesRepository';
import { SqliteHistoryRepository } from '@/features/history/data/SqliteHistoryRepository';
import type { HistoryRepository } from '@/features/history/domain/HistoryRepository';
import type { DictionarySeeder } from '@/features/words/domain/DictionarySeeder';
import type { DictionaryService } from '@/features/words/domain/DictionaryService';
import type {
  PronunciationAudioCache,
  PronunciationAudioFactory,
  SpeechService,
} from '@/features/words/domain/PronunciationAudio';
import type { WordCacheRepository } from '@/features/words/domain/WordCacheRepository';
import type { WordListSource } from '@/features/words/domain/WordListSource';
import type { WordRepository } from '@/features/words/domain/WordRepository';
import { DwylWordListSource } from '@/features/words/data/DwylWordListSource';
import { ExpoPronunciationAudioFactory } from '@/features/words/data/ExpoPronunciationAudioFactory';
import { ExpoSpeechService } from '@/features/words/data/ExpoSpeechService';
import { FileSystemPronunciationAudioCache } from '@/features/words/data/FileSystemPronunciationAudioCache';
import { FreeDictionaryService } from '@/features/words/data/FreeDictionaryService';
import { SqliteDictionarySeeder } from '@/features/words/data/SqliteDictionarySeeder';
import { SqliteWordCacheRepository } from '@/features/words/data/SqliteWordCacheRepository';
import { SqliteWordRepository } from '@/features/words/data/SqliteWordRepository';

import { container } from './container';
import { TOKENS } from './tokens';

/**
 * Único lugar que conhece as implementações de `data/` (e o único que abre o banco).
 * Cada feature registra aqui as suas, ex.:
 * container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
 */
export function registerDependencies(): void {
  container.registerInstance<Database>(TOKENS.Database, database);
  container.registerInstance<SQLiteDatabase>(TOKENS.SqliteConnection, sqliteConnection);

  container.registerSingleton<WordListSource>(TOKENS.WordListSource, DwylWordListSource);
  container.registerSingleton<DictionarySeeder>(TOKENS.DictionarySeeder, SqliteDictionarySeeder);
  container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
  container.registerSingleton<DictionaryService>(TOKENS.DictionaryService, FreeDictionaryService);
  container.registerSingleton<WordCacheRepository>(
    TOKENS.WordCacheRepository,
    SqliteWordCacheRepository,
  );
  container.registerSingleton<HistoryRepository>(TOKENS.HistoryRepository, SqliteHistoryRepository);
  // Parte 1 da etapa 5: autenticação de mentira, até o Supabase entrar (parte 3).
  container.registerSingleton<AuthService>(TOKENS.AuthService, PreviewAuthService);
  container.registerSingleton<PreferenceStorage>(TOKENS.PreferenceStorage, KvPreferenceStorage);
  container.registerSingleton<FavoritesRepository>(
    TOKENS.FavoritesRepository,
    SqliteFavoritesRepository,
  );
  container.registerSingleton<PronunciationAudioFactory>(
    TOKENS.PronunciationAudioFactory,
    ExpoPronunciationAudioFactory,
  );
  container.registerSingleton<PronunciationAudioCache>(
    TOKENS.PronunciationAudioCache,
    FileSystemPronunciationAudioCache,
  );
  container.registerSingleton<SpeechService>(TOKENS.SpeechService, ExpoSpeechService);
}
