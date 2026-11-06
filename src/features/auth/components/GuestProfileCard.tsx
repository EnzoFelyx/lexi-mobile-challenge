import { View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';

interface GuestProfileCardProps {
  onLogIn: () => void;
  onCreateAccount: () => void;
}

/** Perfil do visitante (Figma "Profile · Guest"): convite para entrar, levando os dados junto. */
export function GuestProfileCard({ onLogIn, onCreateAccount }: GuestProfileCardProps) {
  const t = useTexts();
  return (
    <View className="gap-lg rounded-lg bg-surface-muted p-lg-plus">
      <View className="gap-md">
        <AppText variant="heading" accessibilityRole="header">
          {t.settings.guest.title}
        </AppText>
        <AppText variant="message" tone="secondary">
          {t.settings.guest.message}
        </AppText>
      </View>
      <View className="gap-sm">
        <Button label={t.settings.guest.logIn} onPress={onLogIn} />
        <Button
          label={t.settings.guest.createAccount}
          variant="secondary"
          onPress={onCreateAccount}
        />
      </View>
    </View>
  );
}
