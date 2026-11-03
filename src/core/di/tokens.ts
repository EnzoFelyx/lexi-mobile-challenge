/**
 * Tokens da injeção de dependência: um por interface do `domain` (REGRAS.md, regra 2),
 * mais a infraestrutura compartilhada (banco). Nunca use strings soltas.
 */
export const TOKENS = {
  Database: Symbol('Database'),
} as const satisfies Record<string, symbol>;

export type Token = (typeof TOKENS)[keyof typeof TOKENS];
