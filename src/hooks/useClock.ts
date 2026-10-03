import { useEffect, useState } from 'react';

/** A Date that refreshes on an interval. Pass `enabled=false` to pause. */
export function useClock(intervalMs = 1000, enabled = true) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, enabled]);
  return now;
}
