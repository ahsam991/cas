import { QUESTION_BANK } from "@/lib/mocksy/questions";
import type { InterviewQuestion, MockSession } from "@/lib/mocksy/types";

export const MOCKSY_SESSION_KEY = "mocksy:session:v1";
export const FIXED_DB_INTERVIEW_QUESTION_COUNT = 10;

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStringToSeed(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickQuestionCount(rng: () => number) {
  return 10 + Math.floor(rng() * 6); // 10-15 inclusive
}

export function shuffleWithRng<T>(items: T[], rng: () => number) {
  const arr = items.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function createMockSession(seedText: string): MockSession {
  const seed = hashStringToSeed(seedText);
  const rng = mulberry32(seed);
  const count = pickQuestionCount(rng);
  const picked = shuffleWithRng(QUESTION_BANK, rng).slice(0, count);

  return {
    sessionId: `sess_${seed.toString(16)}`,
    createdAt: Date.now(),
    questionIds: picked.map((q) => q.id),
  };
}

export function createMockSessionFromQuestions(seedText: string, questions: InterviewQuestion[]): MockSession {
  if (!questions.length) {
    return createMockSession(seedText);
  }

  const seed = hashStringToSeed(seedText);
  const rng = mulberry32(seed);
  const count = Math.min(FIXED_DB_INTERVIEW_QUESTION_COUNT, questions.length);
  const picked = shuffleWithRng(questions, rng).slice(0, count);

  return {
    sessionId: `sess_${seed.toString(16)}`,
    createdAt: Date.now(),
    questionIds: picked.map((q) => q.id),
  };
}

export function questionsForSession(session: MockSession, questionBank: InterviewQuestion[] = QUESTION_BANK): InterviewQuestion[] {
  const map = new Map(questionBank.map((q) => [q.id, q]));
  return session.questionIds.map((id) => map.get(id)).filter(Boolean) as InterviewQuestion[];
}

export function formatMmSs(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
