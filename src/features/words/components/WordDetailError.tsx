import {
  ArrowRight,
  BookSearch,
  Hourglass,
  Info,
  type LucideIcon,
  RotateCw,
  WifiOff,
} from 'lucide-react-native';
import { View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Note } from '@/shared/components/Note';

export type WordDetailErrorKind = 'not_found' | 'unavailable' | 'rate_limited';

interface WordDetailErrorProps {
  kind: WordDetailErrorKind;
  onRetry: () => void;
  /** Próxima palavra da lista de origem; sem ela, o botão "Next" não aparece. */
  onNext?: () => void;
}

const content: Record<WordDetailErrorKind, { icon: LucideIcon; title: string; message: string }> = {
  not_found: { icon: BookSearch, ...en.wordDetail.notFound },
  unavailable: { icon: WifiOff, ...en.wordDetail.unavailable },
  rate_limited: { icon: Hourglass, ...en.wordDetail.rateLimited },
};

/**
 * Estado de erro do detalhe (Figma 3:15979): ilustração, título, texto, a caixa "Your place is
 * saved…" e os botões Retry e Next. O mesmo layout serve para "Word not found" (404), falha de
 * rede e limite da API (429), cada um com o seu texto e ícone.
 */
export function WordDetailError({ kind, onRetry, onNext }: WordDetailErrorProps) {
  const { colors, sizes } = useTheme();
  const { icon: Icon, title, message } = content[kind];

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center gap-xl">
        <View className="h-illustration w-illustration items-center justify-center rounded-illustration bg-accent-soft">
          <Icon
            size={sizes.illustrationIcon}
            color={colors.accent}
            strokeWidth={sizes.iconStrokeWidth}
          />
        </View>
        <View className="gap-md">
          <AppText variant="title" accessibilityRole="header" className="text-center">
            {title}
          </AppText>
          <AppText variant="message" tone="secondary" className="text-center">
            {message}
          </AppText>
        </View>
        <Note icon={Info} text={en.wordDetail.reassurance} iconSize={sizes.icon} />
      </View>
      <View className="flex-row gap-md pb-xl pt-sm">
        <Button label={en.wordDetail.retry} icon={RotateCw} onPress={onRetry} className="flex-1" />
        {onNext ? (
          <Button
            label={en.wordDetail.next}
            icon={ArrowRight}
            variant="secondary"
            onPress={onNext}
            className="flex-1"
          />
        ) : null}
      </View>
    </View>
  );
}
