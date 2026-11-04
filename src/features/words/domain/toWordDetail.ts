import type { DictionaryEntry, Meaning, WordDetail } from './WordDetail';

const isFilled = (value: string | undefined): value is string =>
  value !== undefined && value.trim() !== '';

/**
 * Junta as entradas da API num detalhe só: a API pode devolver várias entradas para a mesma
 * palavra (ex.: substantivo e verbo separados). A fonética é a do topo ou a primeira da lista.
 */
export function toWordDetail(entries: readonly DictionaryEntry[]): WordDetail {
  const phonetic =
    entries.map((entry) => entry.phonetic).find(isFilled) ??
    entries.flatMap((entry) => entry.phonetics.map((item) => item.text)).find(isFilled) ??
    null;

  const audioUrls = [
    ...new Set(
      entries.flatMap((entry) => entry.phonetics.map((item) => item.audio)).filter(isFilled),
    ),
  ];

  const meanings = entries
    .flatMap((entry) => entry.meanings)
    .reduce<Meaning[]>((grouped, meaning) => {
      const definitions = meaning.definitions.map((item) => ({
        definition: item.definition,
        example: isFilled(item.example) ? item.example : null,
      }));
      const existing = grouped.find((group) => group.partOfSpeech === meaning.partOfSpeech);
      if (!existing) {
        return [...grouped, { partOfSpeech: meaning.partOfSpeech, definitions }];
      }
      return grouped.map((group) =>
        group === existing
          ? { ...group, definitions: [...group.definitions, ...definitions] }
          : group,
      );
    }, []);

  return { word: entries[0]?.word ?? '', phonetic, audioUrls, meanings };
}
