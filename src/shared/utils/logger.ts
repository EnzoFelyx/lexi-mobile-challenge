export type LogScope = 'database' | 'theme' | 'words' | 'history' | 'favorites';

const withDetail = (detail: unknown): unknown[] => (detail === undefined ? [] : [detail]);

/**
 * Registro para quem desenvolve (REGRAS.md, regra 6: nunca engolir erros). Só em desenvolvimento:
 * no APK não registra nada (um serviço de monitoramento de erros entraria aqui).
 * - `warn`: falha de verdade, já tratada na tela (no Expo Go também aparece como aviso amarelo).
 * - `debug`: situação esperada e já contornada (ex.: áudio da API fora do ar, voz no lugar);
 *   fica só no terminal, sem aviso no celular.
 */
export const logger = {
  warn(scope: LogScope, message: string, detail?: unknown): void {
    if (__DEV__) {
      console.warn(`[${scope}] ${message}`, ...withDetail(detail));
    }
  },
  debug(scope: LogScope, message: string, detail?: unknown): void {
    if (__DEV__) {
      // eslint-disable-next-line no-console -- nível de depuração, só no terminal do dev
      console.debug(`[${scope}] ${message}`, ...withDetail(detail));
    }
  },
};
