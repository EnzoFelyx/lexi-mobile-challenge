import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';
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
  const t = useTexts();
  const { colors } = useTheme();

  if (status === 'error') {
    return (
      <MessageScreen
        title={t.recoverableError.title}
        message={t.dictionarySetup.errorMessage}
        action={{ label: t.dictionarySetup.retry, onPress: onRetry }}
      />
    );
  }

  return (
    <View className="flex-1 justify-center gap-xl bg-background px-xl">
      <View className="gap-sm">
        <AppText variant="display" accessibilityRole="header">
          {t.dictionarySetup.title}
        </AppText>
        <AppText variant="body" tone="secondary">
          {t.dictionarySetup[status]}
        </AppText>
      </View>
      {status === 'saving' ? (
        <View className="gap-sm">
          <ProgressBar value={progress} accessibilityLabel={t.dictionarySetup.progressLabel} />
          <AppText variant="caption" tone="secondary">
            {t.dictionarySetup.percent(Math.round(progress * 100))}
          </AppText>
        </View>
      ) : (
        <ActivityIndicator
          color={colors.accent}
          accessibilityLabel={t.dictionarySetup.progressLabel}
        />
      )}
    </View>
  );
}
