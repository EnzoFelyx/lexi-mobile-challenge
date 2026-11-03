// Precisa vir antes de qualquer classe com decorator: a tsyringe lê os metadados pelo Reflect.
import 'reflect-metadata';

import { container } from 'tsyringe';

/**
 * Único lugar que conhece as implementações de `data/`.
 * Cada feature registra aqui as suas, ex.:
 * container.registerSingleton<WordRepository>(TOKENS.WordRepository, SqliteWordRepository);
 */
export function registerDependencies(): void {}

export { container };
