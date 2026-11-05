import { en } from '@/i18n/en';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { MessageScreen } from '@/shared/components/MessageScreen';
import { SectionHeading } from '@/shared/components/SectionHeading';
import { WordGrid } from '@/shared/components/WordGrid';
import { openWordDetail } from '@/shared/utils/navigation';

import { useWordList } from '../hooks/useWordList';
import { type LoadMoreStatus, LoadMoreFooter } from './LoadMoreFooter';

const openFromWordList = (word: string, index: number) =>
  openWordDetail(word, { source: 'words', index });

/** Aba Word list: grade com rolagem infinita, com carregamento, erro e lista vazia tratados. */
export function WordListScreen() {
  const list = useWordList();

  if (list.isLoading) {
    return <LoadingScreen label={en.words.loading} />;
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
      onWordPress={openFromWordList}
      onEndReached={list.loadNextPage}
      header={<SectionHeading title={en.words.title} subtitle={en.words.subtitle} />}
      footer={<LoadMoreFooter status={footerStatus} onRetry={list.retry} />}
    />
  );
}
