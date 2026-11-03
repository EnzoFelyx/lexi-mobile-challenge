/**
 * Tokens da injeção de dependência: um por interface do `domain` (REGRAS.md, regra 2).
 * Cada etapa acrescenta os seus, ex.: `WordRepository: Symbol('WordRepository')`.
 */
export const TOKENS = {} as const satisfies Record<string, symbol>;

export type Token = (typeof TOKENS)[keyof typeof TOKENS];
