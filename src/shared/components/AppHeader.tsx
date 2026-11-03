import { UserRound } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { en } from '@/i18n/en';

import { AppText } from './AppText';

interface AppHeaderProps {
  onAccountPress: () => void;
}

/** Header do Figma: logo "Lexi" com o ponto da marca e o botão de conta (44pt). */
export function AppHeader({ onAccountPress }: AppHeaderProps) {
  const { colors, sizes } = useTheme();

  return (
    <View className="h-header flex-row items-center justify-between px-xl">
      <View className="flex-row items-baseline gap-sm">
        <AppText variant="logo" accessibilityRole="header">
          {en.appName}
        </AppText>
        <View className="h-brand-point w-brand-point rounded-pill bg-accent" />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={en.header.accountLabel}
        accessibilityHint={en.header.accountHint}
        onPress={onAccountPress}
        className="h-touch-target w-touch-target items-center justify-center rounded-pill bg-surface-muted active:opacity-80"
      >
        <UserRound
          size={sizes.accountIcon}
          color={colors.textPrimary}
          strokeWidth={sizes.iconStrokeWidth}
        />
      </Pressable>
    </View>
  );
}
