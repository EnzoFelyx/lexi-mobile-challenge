import { View } from 'react-native';

import { useTexts } from '@/i18n/useTexts';
import { AppText } from '@/shared/components/AppText';
import { Button } from '@/shared/components/Button';
import { Spinner } from '@/shared/components/Spinner';

export type LoadMoreStatus = 'idle' | 'loading' | 'error';

interface LoadMoreFooterProps {
  status: LoadMoreStatus;
  onRetry: () => void;
}

/** Fim da grade: "Finding more words…" enquanto carrega, ou o aviso de erro com "Try again". */
export function LoadMoreFooter({ status, onRetry }: LoadMoreFooterProps) {
  const t = useTexts();
  if (status === 'loading') {
    return (
      <View className="flex-row items-center justify-center gap-sm py-sm">
        <Spinner accessibilityLabel={t.words.loadingMore} />
        <AppText variant="note" tone="secondary">
          {t.words.loadingMore}
        </AppText>
      </View>
    );
  }
  if (status === 'error') {
    return (
      <View className="items-center gap-sm">
        <AppText variant="note" tone="secondary">
          {t.words.loadMoreError}
        </AppText>
        <Button label={t.words.retry} variant="secondary" onPress={onRetry} className="w-full" />
      </View>
    );
  }
  return null;
}
