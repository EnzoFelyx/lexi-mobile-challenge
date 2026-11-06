import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { Button } from '@/shared/components/Button';

import type { WordNavigation } from '../hooks/useWordNavigation';

interface DetailNavigationProps {
  navigation: WordNavigation;
}

/** Rodapé do detalhe (Figma): "Previous" secundário e "Next" primário, desabilitados nas pontas. */
export function DetailNavigation({ navigation }: DetailNavigationProps) {
  const t = useTexts();
  return (
    <View className="flex-row gap-md pb-xl pt-sm">
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
