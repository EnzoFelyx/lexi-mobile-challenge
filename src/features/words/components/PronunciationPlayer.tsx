import { en } from '@/i18n/en';
import { formatDuration } from '@/shared/utils/formatDuration';

import { type PronunciationPlayer as Player, usePronunciation } from '../hooks/usePronunciation';
import { AudioPlayer } from './AudioPlayer';

interface PronunciationPlayerProps {
  word: string;
  audioUrls: readonly string[];
}

const labelFor = ({ kind, accent, status }: Player): string => {
  // A voz do aparelho usa o rótulo genérico (decisão do autor); o leitor de tela diz qual é.
  if (kind === 'voice') {
    return en.pronunciation.generic;
  }
  if (status === 'loading') {
    return en.pronunciation.preparing;
  }
  return accent ? en.pronunciation.accent[accent] : en.pronunciation.generic;
};

const durationTextFor = ({ kind, status, duration }: Player): string | null => {
  if (kind === 'voice') {
    return null;
  }
  return status === 'loading' || duration === null
    ? en.pronunciation.unknownDuration
    : formatDuration(duration);
};

/** Liga a pronúncia da palavra (mp3 ou voz do aparelho) ao player do Figma. */
export function PronunciationPlayer({ word, audioUrls }: PronunciationPlayerProps) {
  const player = usePronunciation(word, audioUrls);

  return (
    <AudioPlayer
      label={labelFor(player)}
      status={player.status}
      progress={player.progress}
      durationText={durationTextFor(player)}
      buttonLabel={
        player.status === 'playing'
          ? en.pronunciation.pause
          : player.kind === 'voice'
            ? en.pronunciation.playWithVoice(word)
            : en.pronunciation.play(word)
      }
      progressLabel={en.pronunciation.progress}
      onToggle={player.toggle}
    />
  );
}
