import { View } from 'react-native';

import { AppText } from './AppText';

interface SectionHeadingProps {
  title: string;
  /** Texto de apoio abaixo do título; opcional (Settings não tem, decisão do autor). */
  subtitle?: string;
}

/** Título de seção do Figma (Fraunces 32), com o texto de apoio abaixo quando houver. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <View className="gap-xxs">
      <AppText variant="display" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="subtitle" tone="secondary">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
