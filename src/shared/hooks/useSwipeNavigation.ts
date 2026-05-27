import { useRef } from 'react';
import type { TouchEvent } from 'react';

interface UseSwipeNavigationOptions {
  onNext: () => void;
  onPrev: () => void;
  minSwipeDistance?: number;
  disabled?: boolean;
}

interface SwipePoint {
  x: number;
  y: number;
}

export function useSwipeNavigation({
  onNext,
  onPrev,
  minSwipeDistance = 40,
  disabled = false,
}: UseSwipeNavigationOptions) {
  const startPointRef = useRef<SwipePoint | null>(null);

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (disabled || event.touches.length !== 1) return;

    const touch = event.touches[0];
    startPointRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startPoint = startPointRef.current;
    startPointRef.current = null;

    if (disabled || !startPoint || event.changedTouches.length === 0) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - startPoint.x;
    const deltaY = touch.clientY - startPoint.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX < minSwipeDistance || absDeltaX <= absDeltaY) return;

    if (deltaX < 0) {
      onNext();
      return;
    }

    onPrev();
  };

  return {
    onTouchStart,
    onTouchEnd,
  };
}
