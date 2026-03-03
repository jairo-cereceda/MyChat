import { useEffect, type RefObject } from 'react';

export function useAutoFocus(
  ref: RefObject<HTMLTextAreaElement | null>,
  shouldFocus: boolean
) {
  useEffect(() => {
    if (shouldFocus) {
      setTimeout(() => {
        const el = ref.current;

        if (el) {
          el.focus();
          const length = el.value.length;
          el.setSelectionRange(length, length);
        }
      }, 50);
    }
  }, [shouldFocus, ref]);
}
