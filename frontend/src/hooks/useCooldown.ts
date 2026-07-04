import { useState, useCallback, useRef, useEffect } from "react";

const COOLDOWN_DURATION = 3000; // 3 seconds
const TICK_INTERVAL = 50; // Update every 50ms for smooth animation

export function useCooldown() {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [remainingMs, setRemainingMs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startCooldown = useCallback(() => {
    clearTimer();

    const endTime = Date.now() + COOLDOWN_DURATION;
    endTimeRef.current = endTime;
    setIsCoolingDown(true);
    setRemainingMs(COOLDOWN_DURATION);

    timerRef.current = setInterval(() => {
      const remaining = endTimeRef.current - Date.now();
      if (remaining <= 0) {
        setIsCoolingDown(false);
        setRemainingMs(0);
        clearTimer();
      } else {
        setRemainingMs(remaining);
      }
    }, TICK_INTERVAL);
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const progress = isCoolingDown
    ? 1 - remainingMs / COOLDOWN_DURATION
    : 0;

  return {
    isCoolingDown,
    remainingMs,
    progress,
    startCooldown,
    cooldownDuration: COOLDOWN_DURATION,
  };
}
