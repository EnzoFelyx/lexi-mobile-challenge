import { View } from 'react-native';

import { AppText } from './AppText';

interface FormErrorProps {
  message: string;
}

/** Erro do formulário inteiro (Figma "Form error message"), como "Wrong email or password". */
export function FormError({ message }: FormErrorProps) {
  return (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      className="min-h-touch-target rounded-md border border-error bg-error-soft px-lg py-md"
    >
      <AppText variant="formError" tone="error">
        {message}
      </AppText>
    </View>
  );
}
