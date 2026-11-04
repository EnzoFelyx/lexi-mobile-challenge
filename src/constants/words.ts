/** Colunas da grade de palavras (wireframe do desafio). */
export const WORD_GRID_COLUMNS = 3;

/** Itens por página da Word list: 20 linhas × 3 colunas, enche a tela algumas vezes sem pesar a query. */
export const WORD_LIST_PAGE_SIZE = 20 * WORD_GRID_COLUMNS;

/** Palavra de exemplo (a primeira do Figma) usada pelas telas provisórias para abrir o detalhe. */
export const SAMPLE_WORD = 'hello';

/** Lista de palavras do desafio (dwyl/english-words), ~370 mil chaves, ~7 MB. */
export const DWYL_WORDS_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';

/** Palavras por INSERT no seed: 5.000 × 2 parâmetros fica bem abaixo do limite de 32.766 do SQLite. */
export const SEED_BATCH_SIZE = 5000;

/**
 * Faixa do `sort_key` aleatório de cada camada (palavras comuns primeiro): inteiro de 31 bits,
 * espalha 370 mil palavras com poucas colisões.
 */
export const WORD_SORT_KEY_RANGE = 2 ** 31;
