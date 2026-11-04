// Só letras minúsculas de a a z: a lista do dwyl tem 2 entradas com hífen ("jean-pierre",
// "jean-christophe") que a API não conhece.
const LISTABLE_WORD = /^[a-z]+$/;

/** Se a palavra entra na Word list (filtro leve contra o "Word not found"). */
export function isListableWord(word: string): boolean {
  return LISTABLE_WORD.test(word);
}
