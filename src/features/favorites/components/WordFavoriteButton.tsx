import { useFavoriteToggle } from '../hooks/useFavoriteToggle';
import { FavoriteButton } from './FavoriteButton';

interface WordFavoriteButtonProps {
  word: string;
}

/** Liga o coração do Figma ao favorito da palavra (atualização otimista). */
export function WordFavoriteButton({ word }: WordFavoriteButtonProps) {
  const { isFavorite, isReady, toggleFavorite } = useFavoriteToggle(word);

  return (
    <FavoriteButton
      word={word}
      isFavorite={isFavorite}
      disabled={!isReady}
      onPress={toggleFavorite}
    />
  );
}
