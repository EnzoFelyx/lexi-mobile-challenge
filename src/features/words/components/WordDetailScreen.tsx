import { ScrollView, View } from 'react-native';

import { useRecordWordView } from '@/features/history/hooks/useRecordWordView';
import { en } from '@/i18n/en';
import { MessageScreen } from '@/shared/components/MessageScreen';
import { Spinner } from '@/shared/components/Spinner';

import { useWordDetail } from '../hooks/useWordDetail';
import { DetailToolbar } from './DetailToolbar';
import { HeadwordCard } from './HeadwordCard';
import { MeaningsSection } from './MeaningsSection';

interface WordDetailScreenProps {
  word: string;
  onClose: () => void;
}

/**
 * Detalhe da palavra (folha `formSheet`). Carregamento e erros ainda são provisórios: o skeleton
 * e o "Word not found" do Figma entram na parte 5 da etapa 3.
 */
export function WordDetailScreen({ word, onClose }: WordDetailScreenProps) {
  const { state, retry } = useWordDetail(word);
  useRecordWordView(state.status === 'found' ? state.detail.word : null);

  return (
    <View className="flex-1 gap-sm bg-background px-xl pt-lg">
      <DetailToolbar onClose={onClose} />
      {state.status === 'loading' ? (
        <View className="flex-1 items-center justify-center">
          <Spinner accessibilityLabel={en.wordDetail.loading} />
        </View>
      ) : null}
      {state.status === 'not_found' ? (
        <MessageScreen
          title={en.wordDetail.notFoundTitle}
          message={en.wordDetail.notFoundMessage}
          action={{ label: en.wordDetail.retry, onPress: retry }}
        />
      ) : null}
      {state.status === 'error' ? (
        <MessageScreen
          title={en.wordDetail.errorTitle}
          message={en.wordDetail.errorMessage}
          action={{ label: en.wordDetail.retry, onPress: retry }}
        />
      ) : null}
      {state.status === 'found' ? (
        <ScrollView
          contentContainerClassName="gap-lg-plus pb-xl pt-sm"
          showsVerticalScrollIndicator={false}
        >
          <HeadwordCard word={state.detail.word} phonetic={state.detail.phonetic} />
          <MeaningsSection meanings={state.detail.meanings} />
        </ScrollView>
      ) : null}
    </View>
  );
}
