import { useEffect, useRef, useCallback } from "react";
interface ThrottleProps {
  fn: (...args: any[]) => void;
  delay: number;
}
export const useThrottle = ({ fn, delay }: ThrottleProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const throttle = useCallback(
    (...args: any[]) => {
      if (timerRef.current) return;
      timerRef.current = setTimeout(() => {
        fn(...args);
        timerRef.current = undefined;
      }, delay);
    },
    [delay, fn],
  );
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  return throttle;
};
