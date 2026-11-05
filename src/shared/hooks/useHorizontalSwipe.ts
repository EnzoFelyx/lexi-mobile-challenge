import { useRef } from 'react';
import type { GestureResponderEvent, ViewProps } from 'react-native';

import { isHorizontalDirection, isHorizontalSwipe, swipeDirectionFor } from '@/shared/utils/swipe';

export interface HorizontalSwipeOptions {
  /** Dedo para a esquerda (próxima). */
  onSwipeLeft: () => void;
  /** Dedo para a direita (anterior). */
  onSwipeRight: () => void;
  canSwipeLeft: boolean;
  canSwipeRight: boolean;
}

export type SwipeResponderProps = Pick<
  ViewProps,
  | 'onStartShouldSetResponderCapture'
  | 'onMoveShouldSetResponderCapture'
  | 'onResponderTerminationRequest'
  | 'onResponderMove'
  | 'onResponderRelease'
  | 'onResponderTerminate'
>;

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

const pointOf = ({ nativeEvent }: GestureResponderEvent): TouchPoint => ({
  x: nativeEvent.pageX,
  y: nativeEvent.pageY,
  time: nativeEvent.timestamp,
});

/**
 * Arrasto horizontal para trocar de página, sem movimento na tela (pedido do autor): o conteúdo
 * fica parado e, ao soltar, a ação é chamada se o arrasto foi longo ou rápido. Só toma o gesto
 * quando ele é claramente horizontal (até ~20°), então a rolagem vertical e os toques de dentro
 * continuam; se o dedo virar diagonal no meio, o gesto é cancelado.
 *
 * Usa as props de responder do React Native (handlers de evento comuns, que leem as opções
 * atuais) em vez do PanResponder, que é criado no render e não poderia ler as opções mais novas.
 */
export function useHorizontalSwipe({
  onSwipeLeft,
  onSwipeRight,
  canSwipeLeft,
  canSwipeRight,
}: HorizontalSwipeOptions): SwipeResponderProps {
  const start = useRef<TouchPoint | null>(null);
  const last = useRef<TouchPoint | null>(null);
  // Velocidade horizontal do último trecho (pt/ms), para o arrasto rápido.
  const velocity = useRef(0);
  // O dedo saiu da horizontal no meio do arrasto: não troca mais de palavra neste gesto.
  const cancelled = useRef(false);

  const track = (point: TouchPoint) => {
    const previous = last.current;
    if (previous && point.time > previous.time) {
      velocity.current = (point.x - previous.x) / (point.time - previous.time);
    }
    last.current = point;
  };

  return {
    // Só anota onde o dedo começou; o gesto continua com os filhos.
    onStartShouldSetResponderCapture: (event) => {
      const point = pointOf(event);
      start.current = point;
      last.current = point;
      velocity.current = 0;
      cancelled.current = false;
      return false;
    },
    // Captura antes dos filhos (ScrollView, toques) só quando o arrasto é horizontal.
    onMoveShouldSetResponderCapture: (event) => {
      const origin = start.current;
      if (!origin) {
        return false;
      }
      const point = pointOf(event);
      return isHorizontalSwipe(point.x - origin.x, point.y - origin.y);
    },
    onResponderTerminationRequest: () => false,
    onResponderMove: (event) => {
      const origin = start.current;
      if (!origin) {
        return;
      }
      const point = pointOf(event);
      track(point);
      if (!isHorizontalDirection(point.x - origin.x, point.y - origin.y)) {
        cancelled.current = true;
      }
    },
    onResponderRelease: (event) => {
      const origin = start.current;
      start.current = null;
      if (!origin || cancelled.current) {
        return;
      }
      const point = pointOf(event);
      track(point);
      const direction = swipeDirectionFor(point.x - origin.x, point.y - origin.y, velocity.current);
      if (direction === 'left' && canSwipeLeft) {
        onSwipeLeft();
      } else if (direction === 'right' && canSwipeRight) {
        onSwipeRight();
      }
    },
    onResponderTerminate: () => {
      start.current = null;
    },
  };
}
