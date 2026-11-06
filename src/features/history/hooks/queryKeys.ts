/** Chaves estáveis do React Query do histórico. */
export const historyQueryKeys = {
  /** Por dono: uma conta nunca vê a lista em memória de outra nem a do visitante. */
  list: (ownerId: string | null) => ['history', 'list', ownerId] as const,
};
