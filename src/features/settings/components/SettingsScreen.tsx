import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { PREVIEW_CREDENTIALS } from '@/constants/auth';
import { AccountProfileCard } from '@/features/auth/components/AccountProfileCard';
import { GuestProfileCard } from '@/features/auth/components/GuestProfileCard';
import { useAccount } from '@/features/auth/hooks/useAccount';
import { en } from '@/i18n/en';
import { AppText } from '@/shared/components/AppText';
import { SectionHeading } from '@/shared/components/SectionHeading';

import { useThemePreference } from '../hooks/useThemePreference';
import { PreferenceRow } from './PreferenceRow';

interface SettingsSectionProps {
  title: string;
  children: ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <View className="gap-md">
      <AppText variant="labelStrong" accessibilityRole="header">
        {title}
      </AppText>
      {children}
    </View>
  );
}

/**
 * Perfil e configurações (Figma "Settings", 46:13683 a 46:13845), aberto pelo botão de conta:
 * o perfil (visitante ou logado), as preferências e a frase do rodapé.
 */
export function SettingsScreen() {
  const account = useAccount();
  const theme = useThemePreference();
  // Parte 1 da etapa 5: entra direto na conta de mentira, até a tela de login existir.
  const previewSignIn = () => void account.signIn(PREVIEW_CREDENTIALS);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow gap-xl px-xl pb-xl pt-xl"
    >
      <SectionHeading title={en.settings.title} />
      {account.status === 'loading' ? null : (
        <SettingsSection title={en.settings.profile}>
          {account.user ? (
            <AccountProfileCard email={account.user.email} onLogOut={account.signOut} />
          ) : (
            <GuestProfileCard onLogIn={previewSignIn} onCreateAccount={previewSignIn} />
          )}
        </SettingsSection>
      )}
      <SettingsSection title={en.settings.preferences}>
        <View className="overflow-hidden rounded-md border border-border bg-surface">
          <PreferenceRow
            label={en.settings.appearance}
            value={en.settings.themeName[theme.preference]}
            onPress={theme.openThemeDialog}
            accessibilityHint={en.settings.appearanceHint}
          />
          <PreferenceRow label={en.settings.language} value={en.settings.languageName} />
        </View>
      </SettingsSection>
      <AppText variant="note" tone="secondary" className="mt-auto text-center">
        {en.settings.footer}
      </AppText>
    </ScrollView>
  );
}
