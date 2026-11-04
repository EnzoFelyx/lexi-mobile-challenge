// Gera src/features/words/data/commonWords.json: as camadas de palavras comuns que abrem a Word list.
// Uso: node scripts/build-common-words.mjs
//
// 1. Basic English de Ogden (~850 palavras, domínio público), da Simple English Wikipedia.
// 2. As ~10 mil palavras mais frequentes do inglês (first20hours/google-10000-english, versão
//    sem palavrões; uso educacional e pessoal), sem palavras de menos de 3 letras e sem siglas.
// Só entram palavras que existem na lista do dwyl, de onde vem a Word list.
import { writeFileSync } from 'node:fs';

const SOURCES = {
  basicEnglish:
    'https://simple.wikipedia.org/w/index.php?title=Wikipedia:BASIC_English_alphabetical_wordlist&action=raw',
  frequent:
    'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt',
  dwyl: 'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json',
};
const OUTPUT = 'src/features/words/data/commonWords.json';
// A página lista 854 itens (as 850 de Ogden e algumas variantes); a faixa só detecta mudança de formato.
const BASIC_ENGLISH_SIZE_RANGE = [800, 900];
const MIN_FREQUENT_LENGTH = 3;
// Siglas e termos da web que existem no dwyl mas não ajudam quem estuda inglês.
const FREQUENT_BLOCKLIST = new Set(['usa', 'faq', 'com', 'pst', 'gif', 'asp', 'php', 'xml']);

const download = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed (${response.status}): ${url}`);
  }
  return response.text();
};

const unique = (words) => [...new Set(words)];

const [basicEnglishWiki, frequentText, dwylJson] = await Promise.all(
  Object.values(SOURCES).map(download),
);
const dwyl = JSON.parse(dwylJson);
const isWord = (word) => /^[a-z]+$/.test(word) && Object.hasOwn(dwyl, word);

// Só o trecho da lista (de "=== A ===" até "== Related pages =="); itens como
// [[wikt:apple|apple]] ou [[cork (material)|cork]].
const listStart = basicEnglishWiki.indexOf('=== A ===');
const listEnd = basicEnglishWiki.indexOf('== Related pages ==');
if (listStart < 0 || listEnd < listStart) {
  throw new Error('Basic English word list not found in the Wikipedia page');
}
const basicEnglishAll = unique(
  [...basicEnglishWiki.slice(listStart, listEnd).matchAll(/\[\[[^|\]]+\|([^\]]+)\]\]/g)].map(
    ([, word]) => word.trim().toLowerCase(),
  ),
);
const [minBasicEnglish, maxBasicEnglish] = BASIC_ENGLISH_SIZE_RANGE;
if (basicEnglishAll.length < minBasicEnglish || basicEnglishAll.length > maxBasicEnglish) {
  throw new Error(`Unexpected Basic English list size: ${basicEnglishAll.length}`);
}
const basicEnglish = basicEnglishAll.filter(isWord);
const inBasicEnglish = new Set(basicEnglish);

const frequent = unique(
  frequentText
    .split('\n')
    .map((word) => word.trim().toLowerCase())
    .filter(
      (word) =>
        word.length >= MIN_FREQUENT_LENGTH &&
        !FREQUENT_BLOCKLIST.has(word) &&
        !inBasicEnglish.has(word) &&
        isWord(word),
    ),
);

writeFileSync(OUTPUT, `${JSON.stringify({ basicEnglish, frequent })}\n`);
process.stdout.write(
  `${OUTPUT}: ${basicEnglish.length} Basic English + ${frequent.length} frequent words\n`,
);
