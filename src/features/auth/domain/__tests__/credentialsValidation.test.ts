import { hasCredentialIssues, validateCredentials } from '../credentialsValidation';

describe('validateCredentials', () => {
  it('accepts a valid email, even with spaces around it, and an 8 character password', () => {
    const issues = validateCredentials({ email: ' alex@example.com ', password: '12345678' });

    expect(hasCredentialIssues(issues)).toBe(false);
  });

  it.each(['', 'alex', 'alex@', 'alex@example', 'al ex@example.com'])(
    'rejects the email "%s"',
    (email) => {
      expect(validateCredentials({ email, password: '12345678' })).toEqual({ email: 'invalid' });
    },
  );

  it('rejects a password shorter than 8 characters', () => {
    expect(validateCredentials({ email: 'alex@example.com', password: '1234567' })).toEqual({
      password: 'tooShort',
    });
  });
});
