import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { DATABASE_NAME } from '@/constants/database';

import * as schema from './schema';

const sqlite = openDatabaseSync(DATABASE_NAME);

// WAL: a lista continua lendo enquanto o seed grava as palavras.
sqlite.execSync('PRAGMA journal_mode = WAL;');

/** Só o container da DI importa este client; o resto do app recebe o `Database` injetado. */
export const database = drizzle(sqlite, { schema });

export type Database = typeof database;
