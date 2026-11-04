import { ArrowLeft, ArrowRight } from 'lucide-react-native';
import { View } from 'react-native';

import { en } from '@/i18n/en';
import { Button } from '@/shared/components/Button';

import type { WordNavigation } from '../hooks/useWordNavigation';

interface DetailNavigationProps {
  navigation: WordNavigation;
}

/** Rodapé do detalhe (Figma): "Previous" secundário e "Next" primário, desabilitados nas pontas. */
export function DetailNavigation({ navigation }: DetailNavigationProps) {
  return (
    <View className="flex-row gap-md pb-xl pt-sm">
      <Button
        label={en.wordDetail.previous}
        icon={ArrowLeft}
        variant="secondary"
        accessibilityHint={en.wordDetail.previousHint}
        disabled={!navigation.canGoPrevious}
        onPress={navigation.goToPrevious}
        className="flex-1"
      />
      <Button
        label={en.wordDetail.next}
        icon={ArrowRight}
        accessibilityHint={en.wordDetail.nextHint}
        disabled={!navigation.canGoNext || navigation.isLoadingNext}
        onPress={navigation.goToNext}
        className="flex-1"
      />
    </View>
  );
}
