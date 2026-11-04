import * as Speech from 'expo-speech';
import { injectable } from 'tsyringe';

import { logger } from '@/shared/utils/logger';

import type { SpeechService } from '../domain/PronunciationAudio';
import { ensurePlaybackAudioMode } from './playbackAudioMode';

const SPEECH_LANGUAGE = 'en-US';

@injectable()
export class ExpoSpeechService implements SpeechService {
  speak(text: string, onFinish: () => void): void {
    // Sem a sessão de playback, o iOS cala a voz com a chave de silencioso.
    void ensurePlaybackAudioMode().then(() => this.speakNow(text, onFinish));
  }

  private speakNow(text: string, onFinish: () => void): void {
    Speech.speak(text, {
      language: SPEECH_LANGUAGE,
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
