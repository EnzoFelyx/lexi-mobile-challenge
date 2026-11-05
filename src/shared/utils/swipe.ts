import {
  SWIPE_COMMIT_DISTANCE,
  SWIPE_COMMIT_VELOCITY,
  SWIPE_DIRECTION_RATIO,
  SWIPE_FLICK_MIN_DISTANCE,
  SWIPE_START_DISTANCE,
} from '@/constants/gestures';

/** Para onde o dedo foi: `left` = próxima página, `right` = anterior. */
export type SwipeDirection = 'left' | 'right';

/** A direção do movimento é horizontal (até ~20°); diagonal ou vertical não conta. */
export function isHorizontalDirection(dx: number, dy: number): boolean {
  return Math.abs(dx) >= Math.abs(dy) * SWIPE_DIRECTION_RATIO;
}

/** O movimento já é um arrasto horizontal (e não rolagem vertical, diagonal nem toque). */
export function isHorizontalSwipe(dx: number, dy: number): boolean {
  return Math.abs(dx) > SWIPE_START_DISTANCE && isHorizontalDirection(dx, dy);
}

/**
 * Ao soltar: troca se o arrasto inteiro ficou horizontal e foi longo, ou rápido e não muito
 * curto; senão, nada.
 */
export function swipeDirectionFor(dx: number, dy: number, vx: number): SwipeDirection | null {
  if (!isHorizontalDirection(dx, dy)) {
    return null;
  }
  const long = Math.abs(dx) >= SWIPE_COMMIT_DISTANCE;
  const flick = Math.abs(vx) >= SWIPE_COMMIT_VELOCITY && Math.abs(dx) >= SWIPE_FLICK_MIN_DISTANCE;
  if (!long && !flick) {
    return null;
  }
  return dx < 0 ? 'left' : 'right';
}
