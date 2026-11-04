import 'reflect-metadata';

import { container } from 'tsyringe';

// Reanimated 4.7 não importa no Jest (ver src/shared/testing/reanimatedMock.ts).
jest.mock('react-native-reanimated', () => jest.requireActual('@/shared/testing/reanimatedMock'));

// Cada teste registra os próprios mocks no container (REGRAS.md, regra 2).
afterEach(() => {
  container.reset();
});
