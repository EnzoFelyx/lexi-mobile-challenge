import { View } from 'react-native';

import { AppText } from './AppText';

interface SectionHeadingProps {
  title: string;
  subtitle: string;
}

/** Título de seção do Figma (Fraunces 32) com o texto de apoio abaixo. */
export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <View className="gap-xxs">
      <AppText variant="display" accessibilityRole="header">
        {title}
      </AppText>
      <AppText variant="subtitle" tone="secondary">
        {subtitle}
      </AppText>
    </View>
  );
}
