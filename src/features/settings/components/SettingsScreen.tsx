import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';

import { AccountProfileCard } from '@/features/auth/components/AccountProfileCard';
import { GuestProfileCard } from '@/features/auth/components/GuestProfileCard';
import { useAccount } from '@/features/auth/hooks/useAccount';
import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';
import { SectionHeading } from '@/shared/components/SectionHeading';
import { openLogin, openSignUp } from '@/shared/utils/navigation';

import { useLanguagePreference } from '../hooks/useLanguagePreference';
import { useThemePreference } from '../hooks/useThemePreference';
import { PreferenceMenu } from './PreferenceMenu';

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
  const t = useTexts();
  const account = useAccount();
  const theme = useThemePreference();
  const language = useLanguagePreference();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="grow gap-xl px-xl pb-xl pt-xl"
    >
      <SectionHeading title={t.settings.title} />
      {account.status === 'loading' ? null : (
        <SettingsSection title={t.settings.profile}>
          {account.user ? (
            <AccountProfileCard email={account.user.email} onLogOut={account.signOut} />
          ) : (
            <GuestProfileCard onLogIn={openLogin} onCreateAccount={openSignUp} />
          )}
        </SettingsSection>
      )}
      <SettingsSection title={t.settings.preferences}>
        <View className="overflow-hidden rounded-md border border-border bg-surface">
          <PreferenceMenu
            label={t.settings.appearance}
            choice={theme}
            accessibilityHint={t.settings.appearanceHint}
          />
          <PreferenceMenu
            label={t.settings.language}
            choice={language}
            accessibilityHint={t.settings.languageHint}
          />
        </View>
      </SettingsSection>
      <AppText variant="note" tone="secondary" className="mt-auto text-center">
        {t.settings.footer}
      </AppText>
    </ScrollView>
  );
}
