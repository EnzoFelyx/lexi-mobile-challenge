import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { useTexts } from '@/i18n/useTexts';
import type { Texts } from '@/i18n/types';
import { logger } from '@/shared/utils/logger';

import { EmailAlreadyRegisteredError, InvalidCredentialsError } from '../domain/AuthErrors';
import type { Credentials } from '../domain/AuthService';
import {
  type CredentialIssues,
  hasCredentialIssues,
  validateCredentials,
} from '../domain/credentialsValidation';
import { useAccount } from './useAccount';

export type AuthMode = 'logIn' | 'signUp';

export interface AuthFormState {
  email: string;
  password: string;
  emailError?: string;
  passwordError?: string;
  formError?: string;
  isSubmitting: boolean;
  changeEmail: (email: string) => void;
  changePassword: (password: string) => void;
  submit: () => void;
}

const isExpectedError = (error: unknown): boolean =>
  error instanceof InvalidCredentialsError || error instanceof EmailAlreadyRegisteredError;

const formErrorText = (t: Texts, error: unknown): string => {
  if (error instanceof InvalidCredentialsError) {
    return t.auth.wrongCredentials;
  }
  if (error instanceof EmailAlreadyRegisteredError) {
    return t.auth.emailTaken;
  }
  return t.auth.unavailable;
};

/** Estado do login e do cadastro: valida os campos, envia e traduz os erros para a tela. */
export function useAuthForm(mode: AuthMode): AuthFormState {
  const t = useTexts();
  const { signIn, signUp } = useAccount();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [issues, setIssues] = useState<CredentialIssues>({});
  const mutation = useMutation({
    mutationFn: (credentials: Credentials) =>
      mode === 'logIn' ? signIn(credentials) : signUp(credentials),
    onError: (error) => {
      if (!isExpectedError(error)) {
        logger.warn('auth', `Could not ${mode}.`, error);
      }
    },
  });

  return {
    email,
    password,
    emailError: issues.email ? t.auth.invalidEmail : undefined,
    passwordError: issues.password ? t.auth.passwordRule : undefined,
    formError: mutation.isError ? formErrorText(t, mutation.error) : undefined,
    isSubmitting: mutation.isPending,
    changeEmail: (value) => {
      setEmail(value);
      setIssues(({ password: passwordIssue }) => ({
        ...(passwordIssue ? { password: passwordIssue } : {}),
      }));
      mutation.reset();
    },
    changePassword: (value) => {
      setPassword(value);
      setIssues(({ email: emailIssue }) => ({ ...(emailIssue ? { email: emailIssue } : {}) }));
      mutation.reset();
    },
    submit: () => {
      const credentials = { email: email.trim(), password };
      const found = validateCredentials(credentials);
      setIssues(found);
      if (!hasCredentialIssues(found)) {
        mutation.mutate(credentials);
      }
    },
  };
}
