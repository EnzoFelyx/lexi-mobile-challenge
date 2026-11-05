import { View } from 'react-native';

import { WordFavoriteButton } from '@/features/favorites/components/WordFavoriteButton';
import { useRecordWordView } from '@/features/history/hooks/useRecordWordView';

import type { WordPosition } from '../domain/wordNavigation';
import { useWordDetail } from '../hooks/useWordDetail';
import { useWordNavigation } from '../hooks/useWordNavigation';
import { DetailNavigation } from './DetailNavigation';
import { DetailToolbar } from './DetailToolbar';
import { WordDetailContent } from './WordDetailContent';
import { WordDetailError } from './WordDetailError';
import { WordDetailSkeleton } from './WordDetailSkeleton';

interface WordDetailScreenProps {
  word: string;
  /** De onde o detalhe foi aberto; nulo = sem Previous/Next. */
  position: WordPosition | null;
  onClose: () => void;
  onNavigate: (word: string, position: WordPosition) => void;
}

/**
 * Detalhe da palavra (folha `formSheet`): skeleton enquanto carrega, o detalhe com o player da
 * pronúncia, ou o estado de erro do Figma ("Word not found", falha de rede, limite da API).
 */
export function WordDetailScreen({ word, position, onClose, onNavigate }: WordDetailScreenProps) {
  const { state, retry } = useWordDetail(word);
  const navigation = useWordNavigation({ word, position, onNavigate });
  // No erro, o "Next" do Figma só aparece se houver próxima palavra.
  const nextWhenAvailable = navigation.canGoNext ? navigation.goToNext : undefined;
  useRecordWordView(state.status === 'found' ? state.detail.word : null);

  return (
    // collapsable={false}: no iOS, o formSheet estica o ScrollView que for filho direto da folha
    // para o tamanho dela, a partir do topo. Se o Fabric achatar esta View (no primeiro instante
    // ela pode ficar só com layout), o ScrollView vira filho direto e cobre a barra, sem margem.
    <View collapsable={false} className="flex-1 gap-sm bg-background px-xl pt-lg">
      <DetailToolbar
        onClose={onClose}
        // Só palavras encontradas podem ser favoritas, como no histórico.
        action={
          state.status === 'found' ? <WordFavoriteButton word={state.detail.word} /> : undefined
        }
      />
      {state.status === 'loading' ? (
        <WordDetailSkeleton withNavigation={position !== null} />
      ) : null}
      {state.status === 'not_found' ? (
        <WordDetailError kind="not_found" onRetry={retry} onNext={nextWhenAvailable} />
      ) : null}
      {state.status === 'error' ? (
        <WordDetailError kind={state.reason} onRetry={retry} onNext={nextWhenAvailable} />
      ) : null}
      {state.status === 'found' ? <WordDetailContent detail={state.detail} /> : null}
      {state.status === 'found' && position !== null ? (
        <DetailNavigation navigation={navigation} />
      ) : null}
    </View>
  );
}
