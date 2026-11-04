/** Devolve o controle ao event loop entre trabalhos longos, para a interface atualizar. */
export function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
