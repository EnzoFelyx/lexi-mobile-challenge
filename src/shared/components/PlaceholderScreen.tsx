import { View } from 'react-native';

import { SAMPLE_WORD } from '@/constants/words';
import { useTexts } from '@/i18n/useTexts';
import { openWordDetail } from '@/shared/utils/navigation';

import { AppText } from './AppText';
import { Button } from './Button';

interface PlaceholderScreenProps {
  title: string;
  showSampleWord?: boolean;
}

const openSampleWord = () => openWordDetail(SAMPLE_WORD);

/** Tela provisória da fundação (etapa 1): some quando cada rota ganhar a tela real. */
export function PlaceholderScreen({ title, showSampleWord = true }: PlaceholderScreenProps) {
  const t = useTexts();
  return (
    <View className="flex-1 gap-xl bg-background px-xl pt-xl">
      <View className="gap-xxs">
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        <AppText variant="description" tone="secondary">
          {t.placeholder.note}
        </AppText>
      </View>
      {showSampleWord ? (
        <Button label={t.placeholder.openSampleWord} variant="secondary" onPress={openSampleWord} />
      ) : null}
    </View>
  );
}
