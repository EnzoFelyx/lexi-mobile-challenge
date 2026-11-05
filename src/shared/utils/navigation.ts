import { router } from 'expo-router';

/** De qual lista e posição o detalhe foi aberto (o Previous/Next anda dentro dela). */
export interface ListPosition {
  source: string;
  index: number;
}

/** Abre o detalhe da palavra (folha `formSheet`), dizendo de qual lista e posição veio. */
export function openWordDetail(word: string, position?: ListPosition): void {
  const params = position
    ? { word, source: position.source, index: String(position.index) }
    : { word };
  router.push({ pathname: '/word/[word]', params });
}

/** Volta para a aba Word list (botão dos estados vazios). */
export function openWordList(): void {
  router.navigate('/');
}

export function openLogin(): void {
  router.push('/login');
}
