"use client";

import { useEffect, useState } from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (cb: () => void) => () => void;
};

export function usePersistHydrated(persist: PersistApi | undefined): boolean {
  // Always false on server and first client render — zustand may already
  // have rehydrated from localStorage before React hydrates, which causes
  // a mismatch if we read hasHydrated() in the useState initializer.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!persist) {
      setHydrated(true);
      return;
    }
    if (persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    return persist.onFinishHydration(() => {
      setHydrated(true);
    });
  }, [persist]);

  return hydrated;
}
