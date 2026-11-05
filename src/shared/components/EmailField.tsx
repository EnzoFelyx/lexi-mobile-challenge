import { TextField, type TextFieldProps } from './TextField';

/** Campo de e-mail do Figma: teclado de e-mail, sem letra maiúscula nem correção automática. */
export function EmailField(props: TextFieldProps) {
  return (
    <TextField
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      autoComplete="email"
      textContentType="emailAddress"
      {...props}
    />
  );
}
