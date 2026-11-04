import { useEffect, useState } from 'react';
import {
  type GestureResponderHandlers,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  PanResponder,
} from 'react-native';
import {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  FAST_SCROLL_FADE_MS,
  FAST_SCROLL_HIDE_DELAY_MS,
  FAST_SCROLL_MIN_SCREENS,
} from '@/constants/fastScroll';
import { sizes } from '@/core/theme/theme';
import {
  isFastScrollUseful,
  scrollOffsetFor,
  thumbHeightFor,
  thumbOffsetFor,
} from '@/shared/utils/fastScroll';

export interface FastScrollListProps {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onLayout: (event: LayoutChangeEvent) => void;
  onContentSizeChange: (width: number, height: number) => void;
  showsVerticalScrollIndicator: false;
}

export interface FastScrollThumb {
  style: ReturnType<typeof useAnimatedStyle>;
  panHandlers: GestureResponderHandlers;
}

// A barrinha nunca fica menor que a área de toque mínima.
const MIN_THUMB_HEIGHT = sizes.touchTarget;

/**
 * Rolagem rápida: uma barrinha no canto direito que, arrastada, percorre toda a lista
 * (o conteúdo já carregado) usando a altura inteira da tela. Tudo fica em shared values do
 * Reanimated, então rolar não re-renderiza a lista.
 */
export function useFastScroll(scrollTo: (offset: number) => void): {
  listProps: FastScrollListProps;
  thumb: FastScrollThumb;
} {
  const reduceMotion = useReducedMotion();
  const contentHeight = useSharedValue(0);
  const viewportHeight = useSharedValue(0);
  const scrollOffset = useSharedValue(0);
  const opacity = useSharedValue(0);
  const fadeDuration = useSharedValue(FAST_SCROLL_FADE_MS);
  const dragging = useSharedValue(false);
  const dragStartThumbOffset = useSharedValue(0);

  useEffect(() => {
    fadeDuration.set(reduceMotion ? 0 : FAST_SCROLL_FADE_MS);
  }, [reduceMotion, fadeDuration]);

  // Criado uma vez: os callbacks só leem shared values, que mantêm a mesma identidade.
  // `scrollTo` também precisa ser estável (o WordGrid passa uma função que usa o ref da lista).
  const [panResponder] = useState(() => {
    const metrics = () => ({
      contentHeight: contentHeight.get(),
      viewportHeight: viewportHeight.get(),
    });
    const endDrag = () => {
      dragging.set(false);
      opacity.set(
        withDelay(FAST_SCROLL_HIDE_DELAY_MS, withTiming(0, { duration: fadeDuration.get() })),
      );
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => isFastScrollUseful(metrics(), FAST_SCROLL_MIN_SCREENS),
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: () => {
        const current = metrics();
        dragging.set(true);
        dragStartThumbOffset.set(
          thumbOffsetFor(scrollOffset.get(), current, thumbHeightFor(current, MIN_THUMB_HEIGHT)),
        );
        opacity.set(withTiming(1, { duration: fadeDuration.get() }));
      },
      onPanResponderMove: (_event, gesture) => {
        const current = metrics();
        const thumbOffset = dragStartThumbOffset.get() + gesture.dy;
        scrollTo(scrollOffsetFor(thumbOffset, current, thumbHeightFor(current, MIN_THUMB_HEIGHT)));
      },
      onPanResponderRelease: endDrag,
      onPanResponderTerminate: endDrag,
    });
  });

  const style = useAnimatedStyle(() => {
    const current = { contentHeight: contentHeight.get(), viewportHeight: viewportHeight.get() };
    if (!isFastScrollUseful(current, FAST_SCROLL_MIN_SCREENS)) {
      return { opacity: 0, height: 0, transform: [{ translateY: 0 }] };
    }
    const height = thumbHeightFor(current, MIN_THUMB_HEIGHT);
    return {
      opacity: opacity.get(),
      height,
      transform: [{ translateY: thumbOffsetFor(scrollOffset.get(), current, height) }],
    };
  });

  const listProps: FastScrollListProps = {
    onScroll: (event) => {
      scrollOffset.set(event.nativeEvent.contentOffset.y);
      if (dragging.get()) {
        return;
      }
      // Aparece ao rolar e some depois de um tempo parado (cada evento reinicia a contagem).
      opacity.set(
        withSequence(
          withTiming(1, { duration: fadeDuration.get() }),
          withDelay(FAST_SCROLL_HIDE_DELAY_MS, withTiming(0, { duration: fadeDuration.get() })),
        ),
      );
    },
    onLayout: (event) => viewportHeight.set(event.nativeEvent.layout.height),
    onContentSizeChange: (_width, height) => contentHeight.set(height),
    showsVerticalScrollIndicator: false,
  };

  return { listProps, thumb: { style, panHandlers: panResponder.panHandlers } };
}
