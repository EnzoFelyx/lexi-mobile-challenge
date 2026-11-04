import { type LogScope, logger } from './logger';

interface AvailabilityMessages {
  unavailable: string;
  available: string;
}

export interface AvailabilityLog {
  markUnavailable(detail?: unknown): void;
  markAvailable(): void;
}

/**
 * Registra (em `debug`) só quando um serviço externo muda de estado: uma linha quando fica
 * indisponível e uma quando volta. Evita uma linha por tentativa enquanto ele segue fora do ar.
 */
export function createAvailabilityLog(
  scope: LogScope,
  messages: AvailabilityMessages,
): AvailabilityLog {
  let state: 'unknown' | 'available' | 'unavailable' = 'unknown';
  return {
    markUnavailable(detail) {
      if (state !== 'unavailable') {
        logger.debug(scope, messages.unavailable, detail);
      }
      state = 'unavailable';
    },
    markAvailable() {
      if (state === 'unavailable') {
        logger.debug(scope, messages.available);
      }
      state = 'available';
    },
  };
}
