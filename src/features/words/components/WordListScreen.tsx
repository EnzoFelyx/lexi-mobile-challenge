import { useTexts } from '@/i18n/useTexts';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { MessageScreen } from '@/shared/components/MessageScreen';
import { SectionHeading } from '@/shared/components/SectionHeading';
import { WordGrid } from '@/shared/components/WordGrid';
import { openWordDetail } from '@/shared/utils/navigation';

import { useNotFoundWords } from '../hooks/useNotFoundWords';
import { useWordList } from '../hooks/useWordList';
import { type LoadMoreStatus, LoadMoreFooter } from './LoadMoreFooter';

const openFromWordList = (word: string, index: number) =>
  openWordDetail(word, { source: 'words', index });

/** Aba Word list: grade com rolagem infinita, com carregamento, erro e lista vazia tratados. */
export function WordListScreen() {
  const t = useTexts();
  const list = useWordList();
  const notFoundWords = useNotFoundWords();

  if (list.isLoading) {
    return <LoadingScreen label={t.words.loading} />;
  }
  if (list.error === 'firstPage') {
    return (
      <MessageScreen
        title={t.recoverableError.title}
        message={t.words.errorMessage}
        action={{ label: t.words.retry, onPress: list.retry }}
      />
    );
  }
  if (list.words.length === 0) {
    return <MessageScreen title={t.words.emptyTitle} message={t.words.emptyMessage} />;
  }

  const footerStatus: LoadMoreStatus =
    list.error === 'nextPage' ? 'error' : list.isLoadingMore ? 'loading' : 'idle';

  return (
    <WordGrid
      words={list.words}
      dimmedWords={notFoundWords}
      onWordPress={openFromWordList}
      onEndReached={list.loadNextPage}
      header={<SectionHeading title={t.words.title} subtitle={t.words.subtitle} />}
      footer={<LoadMoreFooter status={footerStatus} onRetry={list.retry} />}
    />
  );
}
