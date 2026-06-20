"use client";

import { useCallback, useEffect, useState } from "react";
import { STARTING_ELO } from "./ranks";

const STORAGE_KEY = "stark.ranked.elo";

/**
 * The user's ranked Elo, persisted in localStorage (frontend-only). Starts at
 * STARTING_ELO; survives reloads so progression feels real.
 */
export function useLocalElo(): [number, (next: number) => void, boolean] {
  const [elo, setEloState] = useState(STARTING_ELO);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw != null) {
        const n = Number(raw);
        if (Number.isFinite(n)) setEloState(n);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setElo = useCallback((next: number) => {
    setEloState(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
  }, []);

  return [elo, setElo, hydrated];
}
