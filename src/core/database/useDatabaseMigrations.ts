import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect } from 'react';

import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import type { Database } from './client';
import migrations from './migrations/migrations';

interface DatabaseMigrationsState {
  ready: boolean;
  error: Error | undefined;
}

/** Aplica as migrations geradas (`npm run db:generate`) antes de qualquer leitura do banco. */
export function useDatabaseMigrations(): DatabaseMigrationsState {
  const { success, error } = useMigrations(
    container.resolve<Database>(TOKENS.Database),
    migrations,
  );

  useEffect(() => {
    if (error) {
      logger.warn('database', 'Could not apply the local database migrations.', error);
    }
  }, [error]);

  return { ready: success, error };
}
