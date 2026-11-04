import { createAudioPlayer } from 'expo-audio';
import { injectable } from 'tsyringe';

import { PLAYER_STATUS_INTERVAL_MS } from '@/constants/audio';

import type { PronunciationAudio, PronunciationAudioFactory } from '../domain/PronunciationAudio';
import { ensurePlaybackAudioMode } from './playbackAudioMode';

@injectable()
export class ExpoPronunciationAudioFactory implements PronunciationAudioFactory {
  create(url: string): PronunciationAudio {
    void ensurePlaybackAudioMode();
    const player = createAudioPlayer(url, { updateInterval: PLAYER_STATUS_INTERVAL_MS });
    return {
      play: () => player.play(),
      pause: () => player.pause(),
      seekToStart: () => player.seekTo(0),
      subscribe: (listener) => {
        const subscription = player.addListener('playbackStatusUpdate', (status) =>
          listener({
            isLoaded: status.isLoaded,
            playing: status.playing,
            currentTime: status.currentTime,
            duration: status.duration,
            didJustFinish: status.didJustFinish,
          }),
        );
        return () => subscription.remove();
      },
      // createAudioPlayer não libera sozinho: sem isso, o player fica na memória.
      release: () => player.remove(),
    };
  }
}
