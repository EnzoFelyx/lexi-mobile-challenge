import { Pressable, ScrollView, View } from 'react-native';

import { FavoriteBurstHeart } from '@/features/favorites/components/FavoriteBurstHeart';
import { useFavoriteDoubleTap } from '@/features/favorites/hooks/useFavoriteDoubleTap';

import type { WordDetail } from '../domain/WordDetail';
import { HeadwordCard } from './HeadwordCard';
import { MeaningsSection } from './MeaningsSection';
import { PronunciationPlayer } from './PronunciationPlayer';

interface WordDetailContentProps {
  detail: WordDetail;
}

/**
 * Conteúdo da palavra encontrada: card com o player e os significados. Toque duplo em qualquer
 * parte (card ou significados) alterna o favorito (pedido do autor, 2026-11-05); os botões de
 * dentro (play, "Show more"/"Show less") recebem o toque antes e não contam. Ao favoritar, um
 * coração aparece no centro da área visível (não do conteúdo, para nunca ficar fora da tela numa
 * lista longa); ao desfavoritar, não há animação, só o coração da barra muda.
 * A área fica fora do leitor de tela: lá o toque duplo ativa, e o favorito tem o coração da barra.
 */
export function WordDetailContent({ detail }: WordDetailContentProps) {
  const { handleTap, burst } = useFavoriteDoubleTap(detail.word);

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="pb-xl pt-sm" showsVerticalScrollIndicator={false}>
        <Pressable accessible={false} onPress={handleTap} className="gap-lg-plus">
          <HeadwordCard word={detail.word} phonetic={detail.phonetic}>
            <PronunciationPlayer
              key={detail.word}
              word={detail.word}
              audioUrls={detail.audioUrls}
            />
          </HeadwordCard>
          <MeaningsSection meanings={detail.meanings} />
        </Pressable>
      </ScrollView>
      {burst ? <FavoriteBurstHeart key={burst.id} /> : null}
    </View>
  );
}
