import { type QueryKey, useQuery } from '@tanstack/react-query';

/** Uma lista que o próprio usuário monta (History, Favorites), pronta para a tela. */
export interface SavedWords {
  words: readonly string[];
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
}

const NO_WORDS: readonly string[] = [];

/** Lê a lista inteira pelo React Query; ela muda só quando o app grava (e invalida a chave). */
export function useSavedWords(queryKey: QueryKey, load: () => Promise<string[]>): SavedWords {
  const query = useQuery({ queryKey, queryFn: load, staleTime: Infinity });

  return {
    words: query.data ?? NO_WORDS,
    isLoading: query.isPending,
    isError: query.isError,
    retry: () => void query.refetch(),
  };
}
