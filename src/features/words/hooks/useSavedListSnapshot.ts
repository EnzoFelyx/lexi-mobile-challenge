import { useState } from 'react';

import { useFavorites } from '@/features/favorites/hooks/useFavorites';
import { useHistory } from '@/features/history/hooks/useHistory';

import type { WordSource } from '../domain/wordNavigation';

const NO_WORDS: readonly string[] = [];

/**
 * A lista de History ou Favorites como estava quando o detalhe abriu, para o Previous/Next.
 * Congelada de propósito: abrir uma palavra a leva ao topo da History, e desfavoritar no detalhe
 * a tira de Favorites; com a lista viva, a posição mudaria a cada passo. Assim, a navegação
 * segue a ordem que o usuário viu (decisão do autor, 2026-11-05). A aba se atualiza ao voltar.
 */
export function useSavedListSnapshot(source: WordSource | undefined): readonly string[] {
  const history = useHistory({ enabled: source === 'history' });
  const favorites = useFavorites({ enabled: source === 'favorites' });
  const saved = source === 'history' ? history : source === 'favorites' ? favorites : null;
  const [snapshot, setSnapshot] = useState<readonly string[] | null>(null);

  // Guarda a primeira leitura pronta (durante o render, padrão do React para estado derivado).
  if (snapshot === null && saved !== null && !saved.isLoading && !saved.isError) {
    setSnapshot(saved.words);
  }
  return snapshot ?? NO_WORDS;
}
