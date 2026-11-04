import { View } from 'react-native';

import { en } from '@/i18n/en';
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
  if (status === 'loading') {
    return (
      <View className="h-xxl flex-row items-center justify-center gap-sm">
        <Spinner accessibilityLabel={en.words.loadingMore} />
        <AppText variant="note" tone="secondary">
          {en.words.loadingMore}
        </AppText>
      </View>
    );
  }
  if (status === 'error') {
    return (
      <View className="items-center gap-sm">
        <AppText variant="note" tone="secondary">
          {en.words.loadMoreError}
        </AppText>
        <Button label={en.words.retry} variant="secondary" onPress={onRetry} className="w-full" />
      </View>
    );
  }
  return null;
}
