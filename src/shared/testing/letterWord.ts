/** Palavra de teste só com letras a–z, única por índice (0 → "a", 25 → "z", 26 → "ba"…). */
export function letterWord(index: number, prefix = ''): string {
  let value = index;
  let letters = '';
  do {
    letters = String.fromCharCode(97 + (value % 26)) + letters;
    value = Math.floor(value / 26);
  } while (value > 0);
  return `${prefix}${letters}`;
}
