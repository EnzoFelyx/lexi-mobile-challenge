import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { type ReactElement, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { WORD_GRID_COLUMNS, WORD_LIST_END_THRESHOLD } from '@/constants/words';
import { sizes, spacing } from '@/core/theme/theme';
import { FastScrollbar } from '@/shared/components/FastScrollbar';
import { useFastScroll } from '@/shared/hooks/useFastScroll';

import { WordCard } from './WordCard';

interface WordGridProps {
  words: readonly string[];
  onWordPress: (word: string, index: number) => void;
  onEndReached?: () => void;
  header: ReactElement;
  footer?: ReactElement | null;
}

const HALF_GAP = sizes.gridGap / 2;

// A FlashList divide a largura igualmente entre as colunas: o espaço entre os cards vem de meia
// margem em cada célula, e o conteúdo compensa para manter o gutter de 24pt do Figma.
// contentContainerStyle não aceita className, por isso StyleSheet com os tokens do tema.
const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.xl - HALF_GAP,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  inset: { paddingHorizontal: HALF_GAP },
  header: { paddingHorizontal: HALF_GAP, paddingBottom: spacing.xl },
  cell: { paddingHorizontal: HALF_GAP, paddingBottom: sizes.gridGap },
});

const keyExtractor = (word: string) => word;

/**
 * Grade de 3 colunas do wireframe, com título que rola junto, rodapé de carregamento e a
 * barrinha de rolagem rápida no canto direito.
 */
export function WordGrid({ words, onWordPress, onEndReached, header, footer }: WordGridProps) {
  const listRef = useRef<FlashListRef<string>>(null);
  const { listProps, thumb } = useFastScroll((offset) =>
    listRef.current?.scrollToOffset({ offset, animated: false }),
  );

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.cell}>
      <WordCard word={item} index={index} onPress={onWordPress} />
    </View>
  );

  return (
    <View className="flex-1" onLayout={listProps.onLayout}>
      <FlashList
        ref={listRef}
        data={words}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={WORD_GRID_COLUMNS}
        onEndReached={onEndReached}
        onEndReachedThreshold={WORD_LIST_END_THRESHOLD}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<View style={styles.header}>{header}</View>}
        ListFooterComponent={footer ? <View style={styles.inset}>{footer}</View> : null}
        onScroll={listProps.onScroll}
        onContentSizeChange={listProps.onContentSizeChange}
        showsVerticalScrollIndicator={listProps.showsVerticalScrollIndicator}
      />
      <FastScrollbar thumb={thumb} />
    </View>
  );
}
