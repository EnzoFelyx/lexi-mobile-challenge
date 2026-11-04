import { View } from 'react-native';

import { en } from '@/i18n/en';
import { MessageScreen } from '@/shared/components/MessageScreen';
import { SectionHeading } from '@/shared/components/SectionHeading';
import { Spinner } from '@/shared/components/Spinner';
import { openWordDetail } from '@/shared/utils/navigation';

import { useWordList } from '../hooks/useWordList';
import { type LoadMoreStatus, LoadMoreFooter } from './LoadMoreFooter';
import { WordGrid } from './WordGrid';

/** Aba Word list: grade com rolagem infinita, com carregamento, erro e lista vazia tratados. */
export function WordListScreen() {
  const list = useWordList();

  if (list.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner accessibilityLabel={en.words.loading} />
      </View>
    );
  }
  if (list.error === 'firstPage') {
    return (
      <MessageScreen
        title={en.words.errorTitle}
        message={en.words.errorMessage}
        action={{ label: en.words.retry, onPress: list.retry }}
      />
    );
  }
  if (list.words.length === 0) {
    return <MessageScreen title={en.words.emptyTitle} message={en.words.emptyMessage} />;
  }

  const footerStatus: LoadMoreStatus =
    list.error === 'nextPage' ? 'error' : list.isLoadingMore ? 'loading' : 'idle';

  return (
    <WordGrid
      words={list.words}
      onWordPress={openWordDetail}
      onEndReached={list.loadNextPage}
      header={<SectionHeading title={en.words.title} subtitle={en.words.subtitle} />}
      footer={<LoadMoreFooter status={footerStatus} onRetry={list.retry} />}
    />
  );
}
