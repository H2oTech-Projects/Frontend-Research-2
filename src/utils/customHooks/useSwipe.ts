import { useRef } from "react";

interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  // onSwipeRight?: () => void;
  threshold?: number; // minimum px to consider as swipe
}

export function useSwipe({ onSwipeLeft,  threshold = 50 }: UseSwipeOptions) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if ((e.target as HTMLElement).closest("#map")) return;
    startX.current = touch.clientX;
    startY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - startX.current;
    const diffY = touch.clientY - startY.current;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
      // if (diffX > 0) {
      //   onSwipeRight?.();
      // } else {
        onSwipeLeft?.();
      // }
    }

    startX.current = null;
    startY.current = null;
  };

  return { handleTouchStart, handleTouchEnd };
}
