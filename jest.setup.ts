import 'reflect-metadata';

import { container } from 'tsyringe';

// Cada teste registra os próprios mocks no container (REGRAS.md, regra 2).
afterEach(() => {
  container.reset();
});
