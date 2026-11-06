import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { Platform, View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { Button } from '@/shared/components/Button';

import type { WordNavigation } from '../hooks/useWordNavigation';

interface DetailNavigationProps {
  navigation: WordNavigation;
}

/** Layout do rodapé. No Android, 12pt a mais o afastam da barra de gestos (pedido do autor). */
export const DETAIL_FOOTER_CLASS = `flex-row gap-md pb-xl pt-sm ${Platform.OS === 'android' ? 'mb-md' : ''}`;

/** Rodapé do detalhe (Figma): "Previous" secundário e "Next" primário, desabilitados nas pontas. */
export function DetailNavigation({ navigation }: DetailNavigationProps) {
  const t = useTexts();
  return (
    <View className={DETAIL_FOOTER_CLASS}>
      <Button
        label={t.wordDetail.previous}
        icon={ArrowLeft}
        variant="secondary"
        accessibilityHint={t.wordDetail.previousHint}
        disabled={!navigation.canGoPrevious}
        onPress={navigation.goToPrevious}
        className="flex-1"
      />
      <Button
        label={t.wordDetail.next}
        icon={ArrowRight}
        accessibilityHint={t.wordDetail.nextHint}
        disabled={!navigation.canGoNext || navigation.isLoadingNext}
        onPress={navigation.goToNext}
        className="flex-1"
      />
    </View>
  );
}
