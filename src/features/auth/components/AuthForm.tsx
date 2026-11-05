import { BookOpen } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/core/theme/useTheme';
import { useTexts } from '@/i18n/useTexts';
import { AppHeader } from '@/shared/components/AppHeader';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { EmailField } from '@/shared/components/EmailField';
import { FormError } from '@/shared/components/FormError';
import { PasswordField } from '@/shared/components/PasswordField';

import type { AuthFormState } from '../hooks/useAuthForm';

interface AuthFormProps {
  intro: { eyebrow: string; title: string; message?: string };
  /** Sem ação, o header fica sem a seta de voltar. */
  onBack?: () => void;
  form: AuthFormState;
  password: {
    placeholder: string;
    autoComplete: 'current-password' | 'new-password';
  };
  submitLabel: string;
  submittingLabel: string;
  /** Segunda ação abaixo do botão principal (ex.: continuar como visitante). */
  secondaryAction?: { label: string; onPress: () => void };
  modeSwitch: { prompt: string; action: string; onPress: () => void };
}

/**
 * Formulário comum do login e do cadastro (Figma `3:16034` e `3:16074`, com a introdução mais curta e
 * sem o card "rediscover" e os termos; decisões do autor). Rola e sobe com o teclado, que o Figma não mostra.
 */
export function AuthForm({
  intro,
  onBack,
  form,
  password,
  submitLabel,
  submittingLabel,
  secondaryAction,
  modeSwitch,
}: AuthFormProps) {
  const t = useTexts();
  const { colors, sizes } = useTheme();

  return (
    <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-background">
      <AppHeader onBack={onBack} showTagline />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow gap-xl px-xl pb-xl pt-xxl"
        >
          <View className="gap-md">
            <AppText variant="eyebrow" tone="accent">
              {intro.eyebrow}
            </AppText>
            <AppText variant="authTitle" accessibilityRole="header">
              {intro.title}
            </AppText>
            {intro.message ? (
              <AppText variant="message" tone="secondary">
                {intro.message}
              </AppText>
            ) : null}
          </View>
          <View className="gap-lg">
            {form.formError ? <FormError message={form.formError} /> : null}
            <EmailField
              label={t.auth.email}
              placeholder={t.auth.emailPlaceholder}
              value={form.email}
              onChangeText={form.changeEmail}
              error={form.emailError}
              disabled={form.isSubmitting}
            />
            <PasswordField
              label={t.auth.password}
              placeholder={password.placeholder}
              autoComplete={password.autoComplete}
              value={form.password}
              onChangeText={form.changePassword}
              onSubmitEditing={form.submit}
              error={form.passwordError}
              disabled={form.isSubmitting}
            />
          </View>
          <View className="gap-sm">
            <Button
              label={form.isSubmitting ? submittingLabel : submitLabel}
              onPress={form.submit}
              loading={form.isSubmitting}
            />
            {secondaryAction ? (
              <>
                {/* A escolha já é anunciada pelos dois botões: o "ou" é só visual. */}
                <View
                  accessibilityElementsHidden
                  importantForAccessibility="no-hide-descendants"
                  className="my-sm flex-row items-center gap-md"
                >
                  <View className="h-or-divider flex-1 bg-border" />
                  <AppText variant="subtitle" tone="secondary">
                    {t.auth.or}
                  </AppText>
                  <View className="h-or-divider flex-1 bg-border" />
                </View>
                <Button
                  label={secondaryAction.label}
                  variant="outline"
                  onPress={secondaryAction.onPress}
                  disabled={form.isSubmitting}
                />
              </>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${modeSwitch.prompt} ${modeSwitch.action}`}
              accessibilityState={{ disabled: form.isSubmitting }}
              disabled={form.isSubmitting}
              onPress={modeSwitch.onPress}
              className="min-h-touch-target items-center justify-center active:opacity-80"
            >
              <AppText variant="subtitle" tone="secondary">
                {modeSwitch.prompt}{' '}
                <AppText variant="labelStrong" tone="accent">
                  {modeSwitch.action}
                </AppText>
              </AppText>
            </Pressable>
          </View>
          <View className="mt-auto flex-row items-center justify-center gap-sm">
            <BookOpen
              size={sizes.noteIcon}
              color={colors.accent}
              strokeWidth={sizes.iconStrokeWidth}
            />
            <AppText variant="note" tone="secondary">
              {t.auth.footer}
            </AppText>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
