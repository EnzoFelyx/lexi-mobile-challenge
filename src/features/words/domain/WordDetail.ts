export interface Definition {
  definition: string;
  example: string | null;
}

/** Significados de uma classe gramatical (noun, verb…), já juntando todas as entradas da API. */
export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
}

export interface WordDetail {
  word: string;
  /** Ex.: "/həˈləʊ/"; nulo quando a API não traz. */
  phonetic: string | null;
  /** mp3 da pronúncia, sem repetidos, na ordem da API. Pode ser vazio (aí entra a voz do aparelho). */
  audioUrls: string[];
  meanings: Meaning[];
}

/** Resultado da busca: a palavra encontrada ou "não existe na API" (404, também guardado em cache). */
export type WordLookup =
  { status: 'found'; detail: WordDetail } | { status: 'not_found'; word: string };

/** Entrada da API já validada, só com os campos que o app usa. */
export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: { text?: string; audio?: string }[];
  meanings: { partOfSpeech: string; definitions: { definition: string; example?: string }[] }[];
}
