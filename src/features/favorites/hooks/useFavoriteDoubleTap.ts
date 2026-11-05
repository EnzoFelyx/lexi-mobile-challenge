import { useRef, useState } from 'react';

import { isDoubleTap } from '@/shared/utils/doubleTap';

import { useFavoriteToggle } from './useFavoriteToggle';

/** Um toque duplo que favoritou a palavra: `id` recomeça a animação a cada vez. */
export interface FavoriteBurst {
  id: number;
}

export interface FavoriteDoubleTap {
  /** Chamado a cada toque: no segundo toque rápido, alterna o favorito. */
  handleTap: () => void;
  burst: FavoriteBurst | null;
}

/**
 * Favoritar com toque duplo no card da palavra, como nas redes sociais (pedido do autor,
 * 2026-11-05): alterna o favorito, igual ao coração da barra. O "burst" da animação só vem ao
 * favoritar; ao desfavoritar, só o coração da barra muda (pedido do autor).
 */
export function useFavoriteDoubleTap(word: string): FavoriteDoubleTap {
  const { isFavorite, isReady, toggleFavorite } = useFavoriteToggle(word);
  const lastTapAt = useRef<number | null>(null);
  const [burst, setBurst] = useState<FavoriteBurst | null>(null);

  const handleTap = () => {
    const now = Date.now();
    if (!isDoubleTap(lastTapAt.current, now)) {
      lastTapAt.current = now;
      return;
    }
    // Recomeça a contagem: um terceiro toque rápido não desfaz o que o duplo fez.
    lastTapAt.current = null;
    if (!isReady) {
      return;
    }
    toggleFavorite();
    if (!isFavorite) {
      setBurst((previous) => ({ id: (previous?.id ?? 0) + 1 }));
    }
  };

  return { handleTap, burst };
}
