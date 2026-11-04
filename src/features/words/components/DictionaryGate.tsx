import type { ReactNode } from 'react';

import { useDictionarySetup } from '../hooks/useDictionarySetup';
import { DictionarySetupScreen } from './DictionarySetupScreen';

interface DictionaryGateProps {
  children: ReactNode;
}

/** Só mostra o conteúdo quando a lista de palavras já está no aparelho. */
export function DictionaryGate({ children }: DictionaryGateProps) {
  const setup = useDictionarySetup();

  if (setup.status === 'ready') {
    return children;
  }
  // A checagem leva milissegundos: não pisca a tela de setup em toda abertura.
  if (setup.status === 'checking') {
    return null;
  }
  return (
    <DictionarySetupScreen status={setup.status} progress={setup.progress} onRetry={setup.retry} />
  );
}
