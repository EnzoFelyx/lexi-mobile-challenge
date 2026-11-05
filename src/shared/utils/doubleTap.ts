import { DOUBLE_TAP_DELAY_MS } from '@/constants/gestures';

/** O toque de agora completa um toque duplo com o anterior (nulo = não houve toque antes). */
export function isDoubleTap(previousTapAt: number | null, now: number): boolean {
  return previousTapAt !== null && now - previousTapAt <= DOUBLE_TAP_DELAY_MS;
}
