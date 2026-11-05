import { ArrowRight, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';

import { AppText } from './AppText';
import { Button } from './Button';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  action: EmptyStateAction;
}

/**
 * Estado vazio do Figma: ilustração (ícone com dois traços de "palavras"), título, texto e o botão
 * principal. A ilustração é decorativa e fica fora do leitor de tela.
 */
export function EmptyState({ icon: Icon, title, message, action }: EmptyStateProps) {
  const { colors, sizes } = useTheme();

  return (
    <View className="items-center gap-xl">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="h-empty-illustration w-empty-illustration items-center justify-center gap-sm rounded-empty-illustration bg-accent-soft"
      >
        <Icon
          size={sizes.illustrationIcon}
          color={colors.accent}
          strokeWidth={sizes.iconStrokeWidth}
        />
        <View className="flex-row gap-xxs">
          <View className="h-word-mark-thickness w-word-mark-long rounded-word-mark bg-accent/30" />
          <View className="h-word-mark-thickness w-word-mark-short rounded-word-mark bg-accent/30" />
        </View>
      </View>
      <View className="gap-md">
        <AppText variant="emptyTitle" accessibilityRole="header" className="text-center">
          {title}
        </AppText>
        <AppText variant="message" tone="secondary" className="text-center">
          {message}
        </AppText>
      </View>
      <Button label={action.label} icon={ArrowRight} onPress={action.onPress} className="w-full" />
    </View>
  );
}
