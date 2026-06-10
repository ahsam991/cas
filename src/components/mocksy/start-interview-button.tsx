"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { MOCKSY_SESSION_KEY, createMockSession } from "@/lib/mocksy/session";
import { notifyMocksySessionUpdated } from "@/lib/mocksy/session-events";
import { Button } from "@/components/ui/button";

function randomSeed() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function StartInterviewButton(props: React.ComponentProps<typeof Button>) {
  const router = useRouter();

  return (
    <Button
      type="button"
      {...props}
      onClick={() => {
        const session = createMockSession(randomSeed());
        sessionStorage.setItem(MOCKSY_SESSION_KEY, JSON.stringify(session));
        notifyMocksySessionUpdated();
        router.push("/interview");
      }}
    />
  );
}
