import { useCallback, useEffect, useState } from 'react';

export type UseLocalStorageStateArgs<T> = {
  key: string;
  initialValue: T;
};

type EventPayload<T> = {
  key: string;
  value: T;
};

export function useLocalStorageGlobalState<T = unknown>({
  key,
  initialValue,
}: UseLocalStorageStateArgs<T>): [T, (newValue: T) => void, () => void] {
  const [item, setItemState] = useState<unknown>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : initialValue;
  });

  const setItem = useCallback(
    (newValue: T) => {
      setItemState(newValue);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newValue));
        const event = new CustomEvent<EventPayload<T>>(`storageChange:${key}`, {
          detail: { key, value: newValue },
        });
        window.dispatchEvent(event);
      }
    },
    [key]
  );

  const removeItem = useCallback(() => {
    setItemState(initialValue);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
      const event = new CustomEvent<EventPayload<T>>(`storageChange:${key}`, {
        detail: { key, value: initialValue },
      });
      window.dispatchEvent(event);
    }
  }, [key, initialValue]);

  const syncItem = useCallback(
    (e: CustomEvent<EventPayload<T>>) => {
      if (e.detail.key === key) {
        setItemState(e.detail.value);
      }
    },
    [key]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const eventKey = `storageChange:${key}`;
    window.addEventListener(eventKey, syncItem as EventListener);

    return () =>
      window.removeEventListener(eventKey, syncItem as EventListener);
  }, [key, syncItem]);

  return [item as T, setItem, removeItem];
}
