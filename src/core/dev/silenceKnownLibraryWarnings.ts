// @ts-expect-error módulo interno do React Native, sem tipos publicados. Caminho relativo porque o
// React Native avisa sobre importações `react-native/Libraries/...`.
import HMRClient from '../../../node_modules/react-native/Libraries/Utilities/HMRClient';

import { isKnownLibraryWarning, silenceKnownLibraryWarnings } from './knownLibraryWarnings';

// Módulo só de efeito: o `index.ts` o importa antes do Expo Router (imports rodam na ordem).
silenceKnownLibraryWarnings();

// O terminal recebe os logs pelo HMRClient, e um aviso nativo pode chegar sem passar pelo
// `console.warn` filtrado acima.
if (__DEV__) {
  const sendLogToTerminal = HMRClient.log;
  HMRClient.log = (level: string, data: readonly unknown[]) => {
    if (!isKnownLibraryWarning(data[0])) {
      sendLogToTerminal(level, data);
    }
  };
}
