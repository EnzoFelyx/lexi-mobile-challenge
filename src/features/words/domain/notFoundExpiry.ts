import { NOT_FOUND_CACHE_TTL_MS } from '@/constants/words';

/** 404 guardados antes deste momento já venceram: a palavra volta e a API é consultada de novo. */
export function notFoundCutoff(now: Date): Date {
  return new Date(now.getTime() - NOT_FOUND_CACHE_TTL_MS);
}

/** Se um "Word not found" guardado em `fetchedAt` ainda vale. */
export function isNotFoundStillValid(fetchedAt: Date, now: Date): boolean {
  return fetchedAt.getTime() > notFoundCutoff(now).getTime();
}
