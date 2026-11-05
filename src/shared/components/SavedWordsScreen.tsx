import type { LucideIcon } from 'lucide-react-native';
import type { ReactElement } from 'react';
import { ScrollView, View } from 'react-native';

import type { SavedWords } from '@/shared/hooks/useSavedWords';

import { AppText } from './AppText';
import { EmptyState } from './EmptyState';
import { LoadingScreen } from './LoadingScreen';
import { MessageScreen } from './MessageScreen';
import { SectionHeading } from './SectionHeading';
import { WordGrid } from './WordGrid';

interface SavedWordsEmpty {
  /** O Figma troca o texto de apoio do título na tela vazia de History. */
  subtitle: string;
  icon: LucideIcon;
  title: string;
  message: string;
  footer: string;
  actionLabel: string;
  onAction: () => void;
}

interface SavedWordsTexts {
  title: string;
  subtitle: string;
  loading: string;
  errorTitle: string;
  errorMessage: string;
  retry: string;
}

interface SavedWordsScreenProps {
  saved: SavedWords;
  texts: SavedWordsTexts;
  /** Linha de resumo acima da grade (rótulo e contagem). */
  summary: ReactElement;
  /** Nota no fim da grade. */
  note: ReactElement;
  empty: SavedWordsEmpty;
  onWordPress: (word: string, index: number) => void;
}

/**
 * Aba de uma lista montada pelo usuário (History, Favorites), nos frames do Figma: título,
 * resumo, a mesma grade da Word list e a nota no fim; ou o estado vazio com o botão para a Word
 * list. Carregamento e erro tratados.
 */
export function SavedWordsScreen({
  saved,
  texts,
  summary,
  note,
  empty,
  onWordPress,
}: SavedWordsScreenProps) {
  if (saved.isLoading) {
    return <LoadingScreen label={texts.loading} />;
  }
  if (saved.isError) {
    return (
      <MessageScreen
        title={texts.errorTitle}
        message={texts.errorMessage}
        action={{ label: texts.retry, onPress: saved.retry }}
      />
    );
  }
  if (saved.words.length === 0) {
    return (
      // ScrollView: com fonte grande, o conteúdo pode passar da altura da tela.
      <ScrollView
        className="flex-1 bg-background"
        contentContainerClassName="grow gap-xl px-xl pb-xxl pt-xl"
      >
        <SectionHeading title={texts.title} subtitle={empty.subtitle} />
        <View className="flex-1 justify-center">
          <EmptyState
            icon={empty.icon}
            title={empty.title}
            message={empty.message}
            action={{ label: empty.actionLabel, onPress: empty.onAction }}
          />
        </View>
        <AppText variant="note" tone="secondary" className="text-center">
          {empty.footer}
        </AppText>
      </ScrollView>
    );
  }

  return (
    <WordGrid
      words={saved.words}
      onWordPress={onWordPress}
      header={
        <View className="gap-xl">
          <SectionHeading title={texts.title} subtitle={texts.subtitle} />
          {summary}
        </View>
      }
      // A célula já deixa 12pt abaixo da última linha; o Figma tem 24pt até a nota.
      footer={<View className="pt-md">{note}</View>}
    />
  );
}
