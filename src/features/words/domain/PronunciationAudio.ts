export interface AudioPlaybackStatus {
  isLoaded: boolean;
  playing: boolean;
  /** Segundos. */
  currentTime: number;
  /** Segundos; 0 enquanto não se sabe. */
  duration: number;
  didJustFinish: boolean;
}

/** Um mp3 carregado para tocar. Quem cria chama `release()` quando não precisar mais. */
export interface PronunciationAudio {
  play(): void;
  pause(): void;
  seekToStart(): Promise<void>;
  subscribe(listener: (status: AudioPlaybackStatus) => void): () => void;
  release(): void;
}

/**
 * Guarda os mp3 no aparelho: devolve o endereço local, baixando só na primeira vez.
 * Falha (ex.: servidor respondendo 502) se não conseguir baixar.
 */
export interface PronunciationAudioCache {
  resolve(url: string): Promise<string>;
}

export interface PronunciationAudioFactory {
  create(url: string): PronunciationAudio;
}

/** Voz do aparelho (TTS), usada quando a palavra não tem mp3. */
export interface SpeechService {
  speak(text: string, onFinish: () => void): void;
  stop(): void;
}
