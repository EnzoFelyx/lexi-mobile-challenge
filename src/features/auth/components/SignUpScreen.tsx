import { useTexts } from '@/i18n/useTexts';
import { goBack, switchToLogin } from '@/shared/utils/navigation';

import { useAuthForm } from '../hooks/useAuthForm';
import { AuthForm } from './AuthForm';

/** Cadastro (Figma `3:16074`). */
export function SignUpScreen() {
  const t = useTexts();
  const form = useAuthForm('signUp');

  return (
    <AuthForm
      intro={t.auth.signUp.intro}
      onBack={goBack}
      form={form}
      password={{
        placeholder: t.auth.signUp.passwordPlaceholder,
        autoComplete: 'new-password',
      }}
      submitLabel={t.auth.signUp.submit}
      submittingLabel={t.auth.signUp.submitting}
      modeSwitch={{
        prompt: t.auth.signUp.switchPrompt,
        action: t.auth.signUp.switchAction,
        onPress: switchToLogin,
      }}
    />
  );
}
