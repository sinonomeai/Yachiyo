import { useEffect, useCallback, useRef } from "react";
interface DebounceProps {
  fn: (...arg: any[]) => void;
  delay: number;
}
export const useDebounce = ({ fn, delay }: DebounceProps) => {
  const timeRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const debounce = useCallback((...args:any[]) => {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(()=>fn(...args), delay);
  }, [fn, delay]);
  useEffect(() => {
    return () => {
      if (timeRef.current) clearTimeout(timeRef.current);
    };
  }, []);
  return debounce;
};
