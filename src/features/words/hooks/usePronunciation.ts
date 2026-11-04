import { useEffect, useRef, useState } from 'react';

import { PLAYER_LOAD_TIMEOUT_MS } from '@/constants/audio';
import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import { logger } from '@/shared/utils/logger';

import { type Accent, pickPronunciation } from '../domain/pronunciation';
import type {
  PronunciationAudio,
  PronunciationAudioCache,
  PronunciationAudioFactory,
  SpeechService,
} from '../domain/PronunciationAudio';

export type PlayerStatus = 'loading' | 'ready' | 'playing';

export interface PronunciationPlayer {
  /** `voice` = voz do aparelho (sem mp3, ou o mp3 não carregou). */
  kind: 'audio' | 'voice';
  accent: Accent | null;
  status: PlayerStatus;
  /** 0 a 1. Na voz do aparelho, fica cheia enquanto fala. */
  progress: number;
  /** Segundos; nulo enquanto não se sabe ou na voz do aparelho. */
  duration: number | null;
  toggle: () => void;
}

/**
 * Pronúncia da palavra: baixa o primeiro mp3 da API para o cache do aparelho (só na primeira vez)
 * e toca o arquivo local. Sem mp3, se o download falhar ou se não ficar pronto a tempo, usa a voz
 * do aparelho: o play nunca fica sem função (CLAUDE.md 6.5). Use com `key` na palavra, para
 * começar do zero a cada palavra.
 */
export function usePronunciation(word: string, audioUrls: readonly string[]): PronunciationPlayer {
  const pronunciation = pickPronunciation(audioUrls);
  const audioUrl = pronunciation.source === 'audio' ? pronunciation.url : null;

  const [audioFailed, setAudioFailed] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>(audioUrl ? 'loading' : 'ready');
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);
  const audioRef = useRef<PronunciationAudio | null>(null);
  const speakingRef = useRef(false);

  const usesVoice = audioUrl === null || audioFailed;

  useEffect(() => {
    if (audioUrl === null) {
      return;
    }
    let cancelled = false;
    // Já decidido: o áudio carregou ou a voz assumiu. O que chegar depois é ignorado.
    let settled = false;
    let fellBack = false;
    let audio: PronunciationAudio | null = null;
    let unsubscribe = () => {};
    let timeout: ReturnType<typeof setTimeout> | undefined;

    // Falhas do download já são registradas pelo cache (uma linha quando o servidor cai e outra
    // quando volta); aqui só o tempo limite, que não passa por ele.
    const fallBackToVoice = (reason: 'download_failed' | 'timeout') => {
      if (cancelled || settled) {
        return;
      }
      settled = true;
      fellBack = true;
      clearTimeout(timeout);
      if (reason === 'timeout') {
        logger.debug(
          'words',
          `The pronunciation audio of "${word}" took too long; using the voice.`,
        );
      }
      setAudioFailed(true);
      setStatus('ready');
    };

    timeout = setTimeout(() => fallBackToVoice('timeout'), PLAYER_LOAD_TIMEOUT_MS);

    container
      .resolve<PronunciationAudioCache>(TOKENS.PronunciationAudioCache)
      .resolve(audioUrl)
      .then((localUri) => {
        // Se a voz já assumiu (tempo limite), não cria o player do mp3.
        if (cancelled || fellBack) {
          return;
        }
        audio = container
          .resolve<PronunciationAudioFactory>(TOKENS.PronunciationAudioFactory)
          .create(localUri);
        audioRef.current = audio;
        const player = audio;
        unsubscribe = player.subscribe((playback) => {
          if (playback.duration > 0) {
            setDuration(playback.duration);
          }
          if (!playback.isLoaded) {
            return;
          }
          if (!settled) {
            settled = true;
            clearTimeout(timeout);
          }
          if (playback.didJustFinish) {
            setStatus('ready');
            setProgress(0);
            void player.seekToStart();
            return;
          }
          setStatus(playback.playing ? 'playing' : 'ready');
          setProgress(playback.duration > 0 ? playback.currentTime / playback.duration : 0);
        });
      })
      .catch(() => fallBackToVoice('download_failed'));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      unsubscribe();
      audio?.release();
      audioRef.current = null;
    };
  }, [audioUrl, word]);

  useEffect(
    () => () => {
      if (speakingRef.current) {
        container.resolve<SpeechService>(TOKENS.SpeechService).stop();
      }
    },
    [],
  );

  const speak = () => {
    const speech = container.resolve<SpeechService>(TOKENS.SpeechService);
    if (speakingRef.current) {
      speech.stop();
      return;
    }
    speakingRef.current = true;
    setStatus('playing');
    setProgress(1);
    speech.speak(word, () => {
      speakingRef.current = false;
      setStatus('ready');
      setProgress(0);
    });
  };

  const toggle = () => {
    if (status === 'loading') {
      return;
    }
    if (usesVoice) {
      speak();
      return;
    }
    if (status === 'playing') {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };

  return {
    kind: usesVoice ? 'voice' : 'audio',
    accent: pronunciation.source === 'audio' ? pronunciation.accent : null,
    status,
    progress,
    duration: usesVoice ? null : duration,
    toggle,
  };
}
