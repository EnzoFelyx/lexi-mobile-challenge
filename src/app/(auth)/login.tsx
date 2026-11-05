import { useTexts } from '@/i18n/useTexts';
import { PlaceholderScreen } from '@/shared/components/PlaceholderScreen';

export default function LoginScreen() {
  const t = useTexts();
  return <PlaceholderScreen title={t.auth.loginTitle} showSampleWord={false} />;
}
