export interface ScrollMetrics {
  /** Altura de todo o conteúdo já renderizável da lista. */
  contentHeight: number;
  /** Altura visível da lista. */
  viewportHeight: number;
}

// Todas são worklets: rodam também na thread de UI, dentro de useAnimatedStyle.
const clamp = (value: number, min: number, max: number): number => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

/** Altura da barrinha: proporcional ao que está visível, nunca menor que `minHeight`. */
export function thumbHeightFor(
  { contentHeight, viewportHeight }: ScrollMetrics,
  minHeight: number,
) {
  'worklet';
  if (contentHeight <= 0 || viewportHeight <= 0) {
    return minHeight;
  }
  return clamp((viewportHeight / contentHeight) * viewportHeight, minHeight, viewportHeight);
}

/** Posição da barrinha (do topo da lista) para um deslocamento de rolagem. */
export function thumbOffsetFor(scrollOffset: number, metrics: ScrollMetrics, thumbHeight: number) {
  'worklet';
  const scrollRange = metrics.contentHeight - metrics.viewportHeight;
  const trackRange = metrics.viewportHeight - thumbHeight;
  if (scrollRange <= 0 || trackRange <= 0) {
    return 0;
  }
  return clamp(scrollOffset / scrollRange, 0, 1) * trackRange;
}

/** Inverso: o deslocamento de rolagem para a barrinha arrastada até `thumbOffset`. */
export function scrollOffsetFor(thumbOffset: number, metrics: ScrollMetrics, thumbHeight: number) {
  'worklet';
  const scrollRange = metrics.contentHeight - metrics.viewportHeight;
  const trackRange = metrics.viewportHeight - thumbHeight;
  if (scrollRange <= 0 || trackRange <= 0) {
    return 0;
  }
  return clamp(thumbOffset / trackRange, 0, 1) * scrollRange;
}

/** Só vale mostrar o atalho quando a lista tem várias telas de conteúdo. */
export function isFastScrollUseful(
  { contentHeight, viewportHeight }: ScrollMetrics,
  minScreens: number,
) {
  'worklet';
  return viewportHeight > 0 && contentHeight >= viewportHeight * minScreens;
}
