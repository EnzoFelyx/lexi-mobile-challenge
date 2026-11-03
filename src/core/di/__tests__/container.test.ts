import { inject, injectable } from 'tsyringe';

import { container } from '../container';

interface Greeter {
  greet(name: string): string;
}

const GREETER = Symbol('Greeter');

@injectable()
class Welcome {
  constructor(@inject(GREETER) private readonly greeter: Greeter) {}

  message(): string {
    return this.greeter.greet('Lexi');
  }
}

describe('DI container', () => {
  it('injects the implementation registered for a token', () => {
    container.register<Greeter>(GREETER, { useValue: { greet: (name) => `Hello, ${name}` } });

    expect(container.resolve(Welcome).message()).toBe('Hello, Lexi');
  });

  it('lets tests swap the implementation with registerInstance', () => {
    const mock: Greeter = { greet: jest.fn(() => 'mocked') };
    container.registerInstance<Greeter>(GREETER, mock);

    expect(container.resolve(Welcome).message()).toBe('mocked');
    expect(mock.greet).toHaveBeenCalledWith('Lexi');
  });
});
