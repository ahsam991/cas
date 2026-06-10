"use client";

import * as React from "react";

import { MOCKSY_SESSION_KEY } from "@/lib/mocksy/session";
import { MOCKSY_SESSION_UPDATED_EVENT } from "@/lib/mocksy/session-events";
import type { MockSession } from "@/lib/mocksy/types";

let cachedRaw: string | null | undefined;
let cachedSession: MockSession | null | undefined;

function readSessionFromStorage(): MockSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(MOCKSY_SESSION_KEY);

  if (raw === cachedRaw) {
    return cachedSession ?? null;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedSession = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as MockSession;
    if (parsed?.sessionId && Array.isArray(parsed.questionIds) && parsed.questionIds.length) {
      cachedSession = parsed;
      return parsed;
    }
  } catch {
    cachedSession = null;
    return null;
  }

  cachedSession = null;
  return null;
}

function subscribeMocksySession(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const onStorage = (e: StorageEvent) => {
    if (e.key === MOCKSY_SESSION_KEY) onStoreChange();
  };

  const onLocal = () => onStoreChange();

  window.addEventListener("storage", onStorage);
  window.addEventListener(MOCKSY_SESSION_UPDATED_EVENT, onLocal);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(MOCKSY_SESSION_UPDATED_EVENT, onLocal);
  };
}

export function useMocksySession() {
  return React.useSyncExternalStore(subscribeMocksySession, readSessionFromStorage, () => null);
}
