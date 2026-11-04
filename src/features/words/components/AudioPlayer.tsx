import { Pause, Play } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { AppText } from '@/shared/components/AppText';
import { LoadingDots } from '@/shared/components/LoadingDots';
import { ProgressBar } from '@/shared/components/ProgressBar';

import type { PlayerStatus } from '../hooks/usePronunciation';

interface AudioPlayerProps {
  label: string;
  status: PlayerStatus;
  progress: number;
  /** Texto à direita ("0:02" ou "–:––"); nulo esconde (voz do aparelho). */
  durationText: string | null;
  buttonLabel: string;
  progressLabel: string;
  onToggle: () => void;
}

const buttonClass: Record<PlayerStatus, string> = {
  loading: 'bg-player-idle',
  ready: 'bg-accent active:opacity-80',
  playing: 'bg-accent active:opacity-80',
};

/**
 * Player do Figma: botão de 44pt, rótulo, duração e trilho de progresso. Carregando: indicador
 * de atividade no círculo e reticências animadas depois do rótulo.
 */
export function AudioPlayer({
  label,
  status,
  progress,
  durationText,
  buttonLabel,
  progressLabel,
  onToggle,
}: AudioPlayerProps) {
  const { colors, sizes } = useTheme();
  const Icon = status === 'playing' ? Pause : Play;

  return (
    <View className="h-touch-target flex-row items-center gap-md">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
        accessibilityState={{ disabled: status === 'loading' }}
        disabled={status === 'loading'}
        onPress={onToggle}
        className={`h-touch-target w-touch-target items-center justify-center rounded-pill ${buttonClass[status]}`}
      >
        {status === 'loading' ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Icon
            size={sizes.playIcon}
            color={colors.onAccent}
            fill={colors.onAccent}
            strokeWidth={sizes.iconStrokeWidth}
          />
        )}
      </Pressable>
      <View className="flex-1 gap-sm">
        <View className="flex-row justify-between">
          <View className="flex-row">
            <AppText variant="meta" tone="accent">
              {label}
            </AppText>
            {status === 'loading' ? <LoadingDots variant="meta" tone="accent" /> : null}
          </View>
          {durationText ? (
            <AppText variant="caption" tone="secondary">
              {durationText}
            </AppText>
          ) : null}
        </View>
        <ProgressBar value={progress} accessibilityLabel={progressLabel} />
      </View>
    </View>
  );
}
