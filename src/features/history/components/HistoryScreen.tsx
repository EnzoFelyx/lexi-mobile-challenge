import { History } from 'lucide-react-native';

import { en } from '@/i18n/en';
import { ListSummary } from '@/shared/components/ListSummary';
import { Note } from '@/shared/components/Note';
import { SavedWordsScreen } from '@/shared/components/SavedWordsScreen';
import { openWordDetail, openWordList } from '@/shared/utils/navigation';

import { useClearHistory } from '../hooks/useClearHistory';
import { useHistory } from '../hooks/useHistory';

const openFromHistory = (word: string, index: number) =>
  openWordDetail(word, { source: 'history', index });

const texts = { ...en.history, retry: en.savedWords.retry };

const empty = {
  ...en.history.empty,
  icon: History,
  actionLabel: en.savedWords.exploreWordList,
  onAction: openWordList,
};

/**
 * Aba History (Figma 3:15625 e o vazio 3:15690): palavras vistas, da mais recente. No resumo, a
 * contagem fica no rótulo e o "Clear" à direita (pedido do autor; o Figma mostra só a contagem).
 */
export function HistoryScreen() {
  const history = useHistory();
  const { requestClear, isClearing } = useClearHistory();

  return (
    <SavedWordsScreen
      saved={history}
      texts={texts}
      summary={
        <ListSummary
          label={en.history.summary(history.words.length)}
          action={{
            label: en.history.clear,
            accessibilityHint: en.history.clearHint,
            onPress: requestClear,
            disabled: isClearing,
          }}
        />
      }
      note={<Note icon={History} text={en.history.note} />}
      empty={empty}
      onWordPress={openFromHistory}
    />
  );
}
