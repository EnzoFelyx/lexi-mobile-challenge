import { View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';

interface AccountProfileCardProps {
  email: string;
  onLogOut: () => void;
}

/** Perfil de quem está logado (Figma "Profile · Account"): o e-mail e o "Log out". */
export function AccountProfileCard({ email, onLogOut }: AccountProfileCardProps) {
  const t = useTexts();
  return (
    <View className="gap-lg-plus rounded-lg bg-surface-muted p-lg-plus">
      <View className="gap-xxs">
        <AppText variant="heading" accessibilityRole="header">
          {t.settings.account.title}
        </AppText>
        <AppText variant="body" tone="secondary">
          {email}
        </AppText>
      </View>
      <Button label={t.settings.account.logOut} variant="secondary" onPress={onLogOut} />
    </View>
  );
}
