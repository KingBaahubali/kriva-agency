import { useSyncExternalStore } from 'react';

/** Tiny external store: simulator → contact form hand-off of the chosen pod. */
let summary: string | null = null;
const listeners = new Set<() => void>();

export function setPodSummary(next: string | null) {
  summary = next;
  listeners.forEach((l) => l());
}

export function usePodSummary() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => summary,
    () => null,
  );
}
