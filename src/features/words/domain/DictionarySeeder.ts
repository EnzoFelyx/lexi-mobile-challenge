/** Fração concluída do seed, de 0 a 1. */
export type SeedProgressListener = (fraction: number) => void;

/** Grava a lista de palavras no aparelho uma única vez. */
export interface DictionarySeeder {
  isSeeded(): Promise<boolean>;
  seed(words: readonly string[], onProgress: SeedProgressListener): Promise<void>;
}
