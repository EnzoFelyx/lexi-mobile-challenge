import { router } from 'expo-router';

import { AUTH_DESIGN_PREVIEW } from '@/constants/navigation';

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
  if (AUTH_DESIGN_PREVIEW) {
    return;
  }
  router.navigate('/');
}

/** Abre o perfil e as configurações (botão de conta do header). */
export function openSettings(): void {
  router.push('/settings');
}

export function openLogin(): void {
  router.push('/login');
}

/** Abre o cadastro a partir do perfil. */
export function openSignUp(): void {
  router.push('/sign-up');
}

/** Abre o cadastro a partir do login; o voltar do cadastro retorna para ele. */
export function switchToSignUp(): void {
  router.push('/sign-up');
}

/** Vai para o login: volta para ele se já estiver na pilha, senão toma o lugar da tela atual. */
export function switchToLogin(): void {
  router.dismissTo('/login');
}

export function goBack(): void {
  router.back();
}

/** Ao entrar no app: tira o login e o cadastro da pilha e abre a lista, sem volta para eles. */
export function enterApp(): void {
  if (router.canDismiss()) {
    router.dismissAll();
  }
  router.replace('/');
}
