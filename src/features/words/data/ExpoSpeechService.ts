import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { injectable } from 'tsyringe';

import { logger } from '@/shared/utils/logger';

import type { SpeechService } from '../domain/PronunciationAudio';
import { ensurePlaybackAudioMode } from './playbackAudioMode';

/**
 * No Android, o expo-speech só aceita o idioma sem a região: com "en-US", ele considera o valor
 * inválido e usa o idioma do aparelho, lendo a palavra inglesa com a voz em português.
 */
export const speechLanguageFor = (os: string): string => (os === 'android' ? 'en' : 'en-US');

@injectable()
export class ExpoSpeechService implements SpeechService {
  speak(text: string, onFinish: () => void): void {
    // Sem a sessão de playback, o iOS cala a voz com a chave de silencioso.
    void ensurePlaybackAudioMode().then(() => this.speakNow(text, onFinish));
  }

  private speakNow(text: string, onFinish: () => void): void {
    Speech.speak(text, {
      language: speechLanguageFor(Platform.OS),
      onDone: onFinish,
      onStopped: onFinish,
      onError: (error) => {
        logger.warn('words', `The device voice could not read "${text}".`, error);
        onFinish();
      },
    });
  }

  stop(): void {
    void Speech.stop();
  }
}
