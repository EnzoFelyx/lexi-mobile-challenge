import { Heart } from 'lucide-react-native';

import { useTheme } from '@/core/theme/useTheme';
import { en } from '@/i18n/en';
import { ListSummary } from '@/shared/components/ListSummary';
import { Note } from '@/shared/components/Note';
import { SavedWordsScreen } from '@/shared/components/SavedWordsScreen';
import { openWordDetail, openWordList } from '@/shared/utils/navigation';

import { useFavorites } from '../hooks/useFavorites';

const openFromFavorites = (word: string, index: number) =>
  openWordDetail(word, { source: 'favorites', index });

const texts = { ...en.favorites, retry: en.savedWords.retry };

// No Figma, a tela vazia de Favorites mantém o mesmo texto de apoio do título.
const empty = {
  ...en.favorites.empty,
  subtitle: en.favorites.subtitle,
  icon: Heart,
  actionLabel: en.savedWords.exploreWordList,
  onAction: openWordList,
};

/** Aba Favorites (Figma 3:15731 e o vazio 3:15798): palavras salvas, da mais recente. */
export function FavoritesScreen() {
  const favorites = useFavorites();
  const { colors, sizes } = useTheme();

  return (
    <SavedWordsScreen
      saved={favorites}
      texts={texts}
      summary={
        <ListSummary
          label={en.favorites.summary}
          count={en.favorites.count(favorites.words.length)}
          labelTone="accent"
          icon={
            <Heart
              size={sizes.summaryIcon}
              color={colors.accent}
              fill={colors.accent}
              strokeWidth={sizes.iconStrokeWidth}
            />
          }
        />
      }
      note={<Note icon={Heart} text={en.favorites.note} tone="accent" />}
      empty={empty}
      onWordPress={openFromFavorites}
    />
  );
}
