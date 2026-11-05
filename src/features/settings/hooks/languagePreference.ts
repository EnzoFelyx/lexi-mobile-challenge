import { container } from '@/core/di/container';
import { TOKENS } from '@/core/di/tokens';
import type { Language } from '@/i18n/languages';
import { useLanguageStore } from '@/i18n/languageStore';
import { logger } from '@/shared/utils/logger';

import type { PreferenceStorage } from '../domain/PreferenceStorage';

const storage = () => container.resolve<PreferenceStorage>(TOKENS.PreferenceStorage);

/** Aplica o idioma salvo antes da primeira tela (leitura síncrona). Chamado no layout raiz. */
export function applySavedLanguage(): void {
  try {
    useLanguageStore.getState().setLanguage(storage().getLanguage());
  } catch (error: unknown) {
    // Sem a preferência, o app fica em inglês, como antes.
    logger.warn('settings', 'Could not read the saved language.', error);
  }
}

/** Troca o idioma na hora e salva a escolha; se salvar falhar, vale só até fechar o app. */
export function chooseLanguage(language: Language): void {
  useLanguageStore.getState().setLanguage(language);
  storage()
    .saveLanguage(language)
    .catch((error: unknown) => logger.warn('settings', 'Could not save the language.', error));
}
