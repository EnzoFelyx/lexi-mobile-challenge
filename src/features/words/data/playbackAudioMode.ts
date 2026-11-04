import { setAudioModeAsync } from 'expo-audio';

import { logger } from '@/shared/utils/logger';

let configured: Promise<void> | null = null;

/**
 * Sessão de áudio para tocar a pronúncia. No iOS o padrão nativo do expo-audio é
 * `playsInSilentMode: false` (categoria `ambient`), e a chave de silencioso cala o app; a
 * pronúncia é um som que o usuário pediu, então toca mesmo assim. Música de outro app só abaixa
 * (`duckOthers`). A voz do aparelho usa a mesma sessão. Configura uma vez só.
 */
export function ensurePlaybackAudioMode(): Promise<void> {
  configured ??= setAudioModeAsync({
    playsInSilentMode: true,
    interruptionMode: 'duckOthers',
  }).catch((error: unknown) => {
    configured = null;
    logger.warn('words', 'Could not configure the audio session.', error);
  });
  return configured;
}
