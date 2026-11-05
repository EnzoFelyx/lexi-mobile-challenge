import { Heart } from 'lucide-react-native';
import { Pressable } from 'react-native';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';

interface FavoriteButtonProps {
  word: string;
  isFavorite: boolean;
  disabled: boolean;
  onPress: () => void;
}

const backgroundClass: Record<'saved' | 'unsaved', string> = {
  saved: 'bg-accent-soft',
  unsaved: 'bg-surface-muted',
};

/**
 * Favorito do Figma (44×44): coração em contorno sobre `surfaceMuted` quando não salvo, e
 * preenchido sobre `accentSoft` quando salvo. O estado muda a forma, não só a cor.
 */
export function FavoriteButton({ word, isFavorite, disabled, onPress }: FavoriteButtonProps) {
  const t = useTexts();
  const { colors, sizes } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? t.favorites.remove(word) : t.favorites.save(word)}
      accessibilityState={{ selected: isFavorite, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`h-touch-target w-touch-target items-center justify-center rounded-pill active:opacity-80 ${
        backgroundClass[isFavorite ? 'saved' : 'unsaved']
      }`}
    >
      <Heart
        size={sizes.favoriteIcon}
        color={colors.accent}
        fill={isFavorite ? colors.accent : 'none'}
        strokeWidth={sizes.iconStrokeWidth}
      />
    </Pressable>
  );
}
