import type { en } from './en';

/** Troca os textos literais por `string`, mantendo a forma e as funções (com os parâmetros). */
type Widen<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : { readonly [K in keyof T]: Widen<T[K]> };

/** Forma de todos os textos da interface: cada idioma precisa ter exatamente estas chaves. */
export type Texts = Widen<typeof en>;
