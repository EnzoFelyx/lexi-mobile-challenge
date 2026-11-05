import { en } from './en';
import { ptBR } from './pt-BR';
import type { Texts } from './types';

/** Idiomas da interface (o conteúdo do dicionário, vindo da API, é sempre em inglês). */
export const LANGUAGES = ['en', 'pt-BR'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Inglês é o padrão, independente do idioma do celular (CLAUDE.md, seção 1). */
export const DEFAULT_LANGUAGE: Language = 'en';

export const TEXTS: Record<Language, Texts> = {
  en,
  'pt-BR': ptBR,
};
