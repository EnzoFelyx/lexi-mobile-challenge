import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';
import { MessageScreen } from '@/shared/components/MessageScreen';
import { ProgressBar } from '@/shared/components/ProgressBar';

export type DictionarySetupScreenStatus = 'downloading' | 'saving' | 'error';

interface DictionarySetupScreenProps {
  status: DictionarySetupScreenStatus;
  progress: number;
  onRetry: () => void;
}

/**
 * Tela genérica de "preparando o dicionário" (sem frame no Figma ainda: o autor vai desenhar).
 * Baixando: indicador indeterminado. Gravando: barra com a porcentagem. Erro: "Try again".
 */
export function DictionarySetupScreen({ status, progress, onRetry }: DictionarySetupScreenProps) {
  const { colors } = useTheme();

  if (status === 'error') {
    return (
      <MessageScreen
        title={en.dictionarySetup.errorTitle}
        message={en.dictionarySetup.errorMessage}
        action={{ label: en.dictionarySetup.retry, onPress: onRetry }}
      />
    );
  }

  return (
    <View className="flex-1 justify-center gap-xl bg-background px-xl">
      <View className="gap-sm">
        <AppText variant="display" accessibilityRole="header">
          {en.dictionarySetup.title}
        </AppText>
        <AppText variant="body" tone="secondary">
          {en.dictionarySetup[status]}
        </AppText>
      </View>
      {status === 'saving' ? (
        <View className="gap-sm">
          <ProgressBar value={progress} accessibilityLabel={en.dictionarySetup.progressLabel} />
          <AppText variant="caption" tone="secondary">
            {en.dictionarySetup.percent(Math.round(progress * 100))}
          </AppText>
        </View>
      ) : (
        <ActivityIndicator
          color={colors.accent}
          accessibilityLabel={en.dictionarySetup.progressLabel}
        />
      )}
    </View>
  );
}
