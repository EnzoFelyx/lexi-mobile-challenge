import { useEffect, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { LOADING_DOTS_INTERVAL_MS, LOADING_DOTS_MAX } from '@/constants/animation';

import { AppText, type TextTone, type TextVariant } from './AppText';

interface LoadingDotsProps {
  variant: TextVariant;
  tone: TextTone;
}

/**
 * Reticências animadas depois de um texto de carregamento (. → .. → ...). Ficam fixas em "..."
 * com "Reduzir movimento" e escondidas do leitor de tela, que lê só o texto.
 */
export function LoadingDots({ variant, tone }: LoadingDotsProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const interval = setInterval(
      () => setCount((current) => (current % LOADING_DOTS_MAX) + 1),
      LOADING_DOTS_INTERVAL_MS,
    );
    return () => clearInterval(interval);
  }, [reduceMotion]);

  return (
    <AppText
      variant={variant}
      tone={tone}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {'.'.repeat(reduceMotion ? LOADING_DOTS_MAX : count)}
    </AppText>
  );
}
