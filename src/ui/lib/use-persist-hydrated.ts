"use client";

import { useEffect, useState } from "react";

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (cb: () => void) => () => void;
};

export function usePersistHydrated(persist: PersistApi | undefined): boolean {
  const [hydrated, setHydrated] = useState(
    () => persist?.hasHydrated() ?? false,
  );

  useEffect(() => {
    if (!persist) {
      setHydrated(true);
      return;
    }
    setHydrated(persist.hasHydrated());
    const unsub = persist.onFinishHydration(() => {
      setHydrated(true);
    });
    const t = window.setTimeout(() => {
      setHydrated(persist.hasHydrated());
    }, 0);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, [persist]);

  return hydrated;
}
