import { View } from 'react-native';

import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';

interface GuestProfileCardProps {
  onLogIn: () => void;
  onCreateAccount: () => void;
}

/** Perfil do visitante (Figma "Profile · Guest"): convite para entrar, levando os dados junto. */
export function GuestProfileCard({ onLogIn, onCreateAccount }: GuestProfileCardProps) {
  return (
    <View className="gap-lg rounded-lg bg-surface-muted p-lg-plus">
      <View className="gap-md">
        <AppText variant="heading" accessibilityRole="header">
          {en.settings.guest.title}
        </AppText>
        <AppText variant="message" tone="secondary">
          {en.settings.guest.message}
        </AppText>
      </View>
      <View className="gap-sm">
        <Button label={en.settings.guest.logIn} onPress={onLogIn} />
        <Button
          label={en.settings.guest.createAccount}
          variant="secondary"
          onPress={onCreateAccount}
        />
      </View>
    </View>
  );
}
