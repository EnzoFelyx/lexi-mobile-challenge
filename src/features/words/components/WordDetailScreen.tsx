import { ScrollView, View } from 'react-native';

import { useRecordWordView } from '@/features/history/hooks/useRecordWordView';

import { useWordDetail } from '../hooks/useWordDetail';
import { DetailToolbar } from './DetailToolbar';
import { HeadwordCard } from './HeadwordCard';
import { MeaningsSection } from './MeaningsSection';
import { PronunciationPlayer } from './PronunciationPlayer';
import { WordDetailError } from './WordDetailError';
import { WordDetailSkeleton } from './WordDetailSkeleton';

interface WordDetailScreenProps {
  word: string;
  onClose: () => void;
}

/**
 * Detalhe da palavra (folha `formSheet`): skeleton enquanto carrega, o detalhe com o player da
 * pronúncia, ou o estado de erro do Figma ("Word not found", falha de rede, limite da API).
 */
export function WordDetailScreen({ word, onClose }: WordDetailScreenProps) {
  const { state, retry } = useWordDetail(word);
  useRecordWordView(state.status === 'found' ? state.detail.word : null);

  return (
    // collapsable={false}: no iOS, o formSheet estica o ScrollView que for filho direto da folha
    // para o tamanho dela, a partir do topo. Se o Fabric achatar esta View (no primeiro instante
    // ela pode ficar só com layout), o ScrollView vira filho direto e cobre a barra, sem margem.
    <View collapsable={false} className="flex-1 gap-sm bg-background px-xl pt-lg">
      <DetailToolbar onClose={onClose} />
      {state.status === 'loading' ? <WordDetailSkeleton /> : null}
      {state.status === 'not_found' ? <WordDetailError kind="not_found" onRetry={retry} /> : null}
      {state.status === 'error' ? <WordDetailError kind={state.reason} onRetry={retry} /> : null}
      {state.status === 'found' ? (
        <ScrollView
          contentContainerClassName="gap-lg-plus pb-xl pt-sm"
          showsVerticalScrollIndicator={false}
        >
          <HeadwordCard word={state.detail.word} phonetic={state.detail.phonetic}>
            <PronunciationPlayer
              key={state.detail.word}
              word={state.detail.word}
              audioUrls={state.detail.audioUrls}
            />
          </HeadwordCard>
          <MeaningsSection meanings={state.detail.meanings} />
        </ScrollView>
      ) : null}
    </View>
  );
}
