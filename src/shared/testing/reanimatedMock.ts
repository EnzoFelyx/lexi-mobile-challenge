import { View } from 'react-native';

/**
 * Mock mínimo do Reanimated para o Jest. O Reanimated 4.7 quebra ao ser importado no Jest
 * (registra um recurso de CSS nativo que o modo de teste não tem), e o mock oficial importa o
 * mesmo código. Cobre só o que o app usa; animações ficam paradas nos testes.
 */
const identity = <T>(value: T): T => value;

export default { View };

export const Easing = { linear: identity };

export const useSharedValue = <T>(initial: T) => {
  let current = initial;
  return {
    get: () => current,
    set: (next: T) => {
      current = next;
    },
  };
};

export const useAnimatedStyle = <T>(factory: () => T): T => factory();

export const useReducedMotion = (): boolean => false;

export const withTiming = identity;

export const withRepeat = identity;

export const withDelay = (_delay: number, animation: unknown) => animation;

export const withSequence = (...animations: unknown[]) => animations.at(-1);

export const cancelAnimation = (): void => undefined;
