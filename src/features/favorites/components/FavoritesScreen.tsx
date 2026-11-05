import { Heart } from 'lucide-react-native';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';
import { ListSummary } from '@/shared/components/ListSummary';
import { Note } from '@/shared/components/Note';
import { SavedWordsScreen } from '@/shared/components/SavedWordsScreen';
import { openWordDetail, openWordList } from '@/shared/utils/navigation';

import { useFavorites } from '../hooks/useFavorites';

const openFromFavorites = (word: string, index: number) =>
  openWordDetail(word, { source: 'favorites', index });

/** Aba Favorites (Figma 3:15731 e o vazio 3:15798): palavras salvas, da mais recente. */
export function FavoritesScreen() {
  const t = useTexts();
  const texts = { ...t.favorites, retry: t.savedWords.retry };
  // No Figma, a tela vazia de Favorites mantém o mesmo texto de apoio do título.
  const empty = {
    ...t.favorites.empty,
    subtitle: t.favorites.subtitle,
    icon: Heart,
    actionLabel: t.savedWords.exploreWordList,
    onAction: openWordList,
  };
  const favorites = useFavorites();
  const { colors, sizes } = useTheme();

  return (
    <SavedWordsScreen
      saved={favorites}
      texts={texts}
      summary={
        <ListSummary
          label={t.favorites.summary}
          count={t.favorites.count(favorites.words.length)}
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
      note={<Note icon={Heart} text={t.favorites.note} tone="accent" />}
      empty={empty}
      onWordPress={openFromFavorites}
    />
  );
}
