import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, type TextTone } from './AppText';

interface ListSummaryAction {
  label: string;
  accessibilityHint: string;
  onPress: () => void;
  disabled?: boolean;
}

interface ListSummaryProps {
  label: string;
  /** Texto à direita (ex.: a contagem de Favorites). */
  count?: string;
  /** Ação à direita no lugar da contagem (ex.: o "Clear" de History), como link sublinhado. */
  action?: ListSummaryAction;
  /** Ícone antes do rótulo (o coração de Favorites). */
  icon?: ReactNode;
  labelTone?: TextTone;
}

// A linha tem 24pt (Figma); a área de toque do link chega aos 44pt pelas bordas.
const ACTION_HIT_SLOP = { top: 10, bottom: 10, left: 12, right: 12 };

/** Linha de resumo acima da grade (Figma): rótulo em maiúsculas à esquerda, contagem ou ação à direita. */
export function ListSummary({
  label,
  count,
  action,
  icon,
  labelTone = 'secondary',
}: ListSummaryProps) {
  return (
    <View className="flex-row items-center justify-between gap-md">
      <View className="flex-1 flex-row items-center gap-xs">
        {icon}
        <AppText variant="overline" tone={labelTone} className="flex-shrink">
          {label}
        </AppText>
      </View>
      {action ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={action.label}
          accessibilityHint={action.accessibilityHint}
          accessibilityState={{ disabled: action.disabled }}
          disabled={action.disabled}
          hitSlop={ACTION_HIT_SLOP}
          onPress={action.onPress}
          className="active:opacity-60"
        >
          <AppText variant="description" tone="secondary" className="underline">
            {action.label}
          </AppText>
        </Pressable>
      ) : (
        <AppText variant="note" tone="secondary">
          {count}
        </AppText>
      )}
    </View>
  );
}
