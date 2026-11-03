import { router } from 'expo-router';

/** Abre o detalhe da palavra (folha `formSheet`). */
export function openWordDetail(word: string): void {
  router.push({ pathname: '/word/[word]', params: { word } });
}

export function openLogin(): void {
  router.push('/login');
}
