import { View } from 'react-native';

interface ProgressBarProps {
  /** Fração concluída, de 0 a 1. */
  value: number;
  accessibilityLabel: string;
}

const toPercent = (value: number): number => Math.round(Math.min(Math.max(value, 0), 1) * 100);

/** Trilho de progresso do Figma (4pt, `border` com preenchimento `accent`). */
export function ProgressBar({ value, accessibilityLabel }: ProgressBarProps) {
  const percent = toPercent(value);
  // Largura calculada em tempo de execução: único caso em que o estilo não cabe numa classe.
  const fillStyle = { width: `${percent}%` } as const;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      className="h-progress-track w-full overflow-hidden rounded-pill bg-border"
    >
      <View className="h-full rounded-pill bg-accent" style={fillStyle} />
    </View>
  );
}
