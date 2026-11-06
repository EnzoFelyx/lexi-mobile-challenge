/** Chaves estáveis do React Query dos favoritos. */
export const favoriteQueryKeys = {
  /** Por dono: uma conta nunca vê a lista em memória de outra nem a do visitante. */
  list: (ownerId: string | null) => ['favorites', 'list', ownerId] as const,
};
