export const MOCKSY_SESSION_UPDATED_EVENT = "mocksy:session-updated";

export function notifyMocksySessionUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(MOCKSY_SESSION_UPDATED_EVENT));
}
