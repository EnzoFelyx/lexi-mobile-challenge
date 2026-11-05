import { MIN_PASSWORD_LENGTH } from '@/constants/auth';

import type { Credentials } from './AuthService';

export interface CredentialIssues {
  email?: 'invalid';
  password?: 'tooShort';
}

// Só barra o que claramente não é e-mail; quem decide se a conta existe é o serviço.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Confere os campos antes de chamar o serviço; vale igual para entrar e para cadastrar (Figma). */
export function validateCredentials({ email, password }: Credentials): CredentialIssues {
  return {
    ...(EMAIL_PATTERN.test(email.trim()) ? {} : { email: 'invalid' }),
    ...(password.length >= MIN_PASSWORD_LENGTH ? {} : { password: 'tooShort' }),
  };
}

export function hasCredentialIssues(issues: CredentialIssues): boolean {
  return Object.keys(issues).length > 0;
}
