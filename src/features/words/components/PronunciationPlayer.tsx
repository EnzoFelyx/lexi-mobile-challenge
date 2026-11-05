import type { Texts } from '@/i18n/types';
import { useTexts } from '@/i18n/useTexts';
import { formatDuration } from '@/shared/utils/formatDuration';

import { type PronunciationPlayer as Player, usePronunciation } from '../hooks/usePronunciation';
import { AudioPlayer } from './AudioPlayer';

interface PronunciationPlayerProps {
  word: string;
  audioUrls: readonly string[];
}

const labelFor = (t: Texts, { kind, accent, status }: Player): string => {
  // A voz do aparelho usa o rótulo genérico (decisão do autor); o leitor de tela diz qual é.
  if (kind === 'voice') {
    return t.pronunciation.generic;
  }
  if (status === 'loading') {
    return t.pronunciation.preparing;
  }
  return accent ? t.pronunciation.accent[accent] : t.pronunciation.generic;
};

// Só mostra a duração quando ela existe: carregando (ou sem duração conhecida) e na voz do
// aparelho fica vazio. O Figma mostra "–:––" ao carregar; tirado por decisão do autor.
const durationTextFor = ({ kind, status, duration }: Player): string | null =>
  kind === 'voice' || status === 'loading' || duration === null ? null : formatDuration(duration);

/** Liga a pronúncia da palavra (mp3 ou voz do aparelho) ao player do Figma. */
export function PronunciationPlayer({ word, audioUrls }: PronunciationPlayerProps) {
  const t = useTexts();
  const player = usePronunciation(word, audioUrls);

  return (
    <AudioPlayer
      label={labelFor(t, player)}
      status={player.status}
      progress={player.progress}
      durationText={durationTextFor(player)}
      buttonLabel={
        player.status === 'playing'
          ? t.pronunciation.pause
          : player.kind === 'voice'
            ? t.pronunciation.playWithVoice(word)
            : t.pronunciation.play(word)
      }
      progressLabel={t.pronunciation.progress}
      onToggle={player.toggle}
    />
  );
}
