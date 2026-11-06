/** E-mail ou senha não conferem ao entrar. */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('The email or the password is wrong');
    this.name = 'InvalidCredentialsError';
  }
}

/** Já existe uma conta com o e-mail do cadastro. */
export class EmailAlreadyRegisteredError extends Error {
  constructor() {
    super('This email is already registered');
    this.name = 'EmailAlreadyRegisteredError';
  }
}
