import { LogBox } from 'react-native';

/**
 * Avisos de bibliotecas que o Lexi não tem como corrigir. Cada um com o motivo.
 *
 * - `ImageBackground is deprecated`: o NativeWind (react-native-css-interop 0.2.7, a versão mais
 *   nova) registra o `className` no ImageBackground ao ser importado, e no React Native 0.88 só
 *   acessar o componente já dispara o aviso. O Lexi não usa ImageBackground.
 */
export const KNOWN_LIBRARY_WARNINGS = ['ImageBackground is deprecated'] as const;

export const isKnownLibraryWarning = (message: unknown): boolean =>
  typeof message === 'string' &&
  KNOWN_LIBRARY_WARNINGS.some((warning) => message.startsWith(warning));

/**
 * Esconde só esses avisos, na tela (LogBox) e no terminal, e só em desenvolvimento. Precisa rodar
 * antes de qualquer componente carregar: o aviso sai quando o NativeWind é importado, por isso é
 * chamado pelo `index.ts` da raiz, antes do Expo Router.
 */
export function silenceKnownLibraryWarnings(): void {
  if (!__DEV__) {
    return;
  }
  LogBox.ignoreLogs([...KNOWN_LIBRARY_WARNINGS]);
  const warn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (!isKnownLibraryWarning(args[0])) {
      warn(...args);
    }
  };
}
