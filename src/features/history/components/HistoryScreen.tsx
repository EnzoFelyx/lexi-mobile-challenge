import { History } from 'lucide-react-native';

import { useTexts } from '@/i18n/useTexts';
import { ListSummary } from '@/shared/components/ListSummary';
import { Note } from '@/shared/components/Note';
import { SavedWordsScreen } from '@/shared/components/SavedWordsScreen';
import { openWordDetail, openWordList } from '@/shared/utils/navigation';

import { useClearHistory } from '../hooks/useClearHistory';
import { useHistory } from '../hooks/useHistory';

const openFromHistory = (word: string, index: number) =>
  openWordDetail(word, { source: 'history', index });

/**
 * Aba History (Figma 3:15625 e o vazio 3:15690): palavras vistas, da mais recente. No resumo, a
 * contagem fica no rótulo e o "Clear" à direita (pedido do autor; o Figma mostra só a contagem).
 */
export function HistoryScreen() {
  const t = useTexts();
  const history = useHistory();
  const { requestClear, isClearing } = useClearHistory();
  const texts = { ...t.history, retry: t.savedWords.retry };
  const empty = {
    ...t.history.empty,
    icon: History,
    actionLabel: t.savedWords.exploreWordList,
    onAction: openWordList,
  };

  return (
    <SavedWordsScreen
      saved={history}
      texts={texts}
      summary={
        <ListSummary
          label={t.history.summary(history.words.length)}
          action={{
            label: t.history.clear,
            accessibilityHint: t.history.clearHint,
            onPress: requestClear,
            disabled: isClearing,
          }}
        />
      }
      note={<Note icon={History} text={t.history.note} />}
      empty={empty}
      onWordPress={openFromHistory}
    />
  );
}
