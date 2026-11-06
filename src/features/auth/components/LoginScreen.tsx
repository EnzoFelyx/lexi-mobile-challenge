import { useTexts } from '@/i18n/useTexts';
import { goBack, switchToSignUp } from '@/shared/utils/navigation';

import { useAccount } from '../hooks/useAccount';
import { useAuthForm } from '../hooks/useAuthForm';
import { useCanEnterApp } from '../hooks/useEntryNavigation';
import { AuthForm } from './AuthForm';

/** Login (Figma `3:16034`), com a opção de seguir como visitante (decisão do autor). */
export function LoginScreen() {
  const t = useTexts();
  const { continueAsGuest } = useAccount();
  // Como primeira tela do app, não há para onde voltar; com o app já aberto, veio do perfil.
  const canEnterApp = useCanEnterApp();
  const form = useAuthForm('logIn');

  return (
    <AuthForm
      intro={t.auth.logIn.intro}
      onBack={canEnterApp ? goBack : undefined}
      form={form}
      password={{ placeholder: t.auth.logIn.passwordPlaceholder, autoComplete: 'current-password' }}
      submitLabel={t.auth.logIn.submit}
      submittingLabel={t.auth.logIn.submitting}
      secondaryAction={{ label: t.auth.logIn.guest, onPress: continueAsGuest }}
      modeSwitch={{
        prompt: t.auth.logIn.switchPrompt,
        action: t.auth.logIn.switchAction,
        onPress: switchToSignUp,
      }}
    />
  );
}
