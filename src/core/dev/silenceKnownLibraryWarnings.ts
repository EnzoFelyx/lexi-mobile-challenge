import { silenceKnownLibraryWarnings } from './knownLibraryWarnings';

// Módulo só de efeito: o `index.ts` o importa antes do Expo Router (imports rodam na ordem).
silenceKnownLibraryWarnings();
