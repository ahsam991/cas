import type { InterviewQuestion } from "@/lib/mocksy/types";
import { hashStringToSeed, mulberry32 } from "@/lib/mocksy/session";

export type QuestionResult = {
  id: string;
  prompt: string;
  category: InterviewQuestion["category"];
  score: number; // 0-100
  verdict: "Strong" | "Solid" | "Needs work";
  tips: string[];
};

export type TimelineEvent = {
  id: string;
  timeLabel: string;
  title: string;
  detail?: string;
};

function verdictForScore(score: number): QuestionResult["verdict"] {
  if (score >= 82) return "Strong";
  if (score >= 68) return "Solid";
  return "Needs work";
}

function tipsFor(category: InterviewQuestion["category"], rng: () => number) {
  const pools: Record<InterviewQuestion["category"], string[]> = {
    "pre-cas": [
      "Tie each answer back to the course map and learning outcomes.",
      "Name one module + one skill you’ll strengthen with a concrete example.",
      "Keep a crisp ‘why UK / why now’ sentence ready as an anchor.",
    ],
    ukvi: [
      "State numbers calmly: tuition, paid-to-date, living costs, funding source.",
      "Keep post-study plans realistic and consistent with your story.",
      "Practice a 20-second summary of accommodation + arrival logistics.",
    ],
    general: [
      "Use STAR for stories: situation, task, action, result.",
      "End answers with what you learned or how you’ll apply it.",
      "Slow down on transitions — breathe between sections.",
    ],
  };

  const pool = pools[category];
  const a = pool[Math.floor(rng() * pool.length)]!;
  let b = pool[Math.floor(rng() * pool.length)]!;
  let guard = 0;
  while (b === a && guard++ < 6) b = pool[Math.floor(rng() * pool.length)]!;
  return [a, b];
}

export function buildMockResults(sessionId: string, questions: InterviewQuestion[]) {
  const rng = mulberry32(hashStringToSeed(`${sessionId}:results`));

  const questionResults: QuestionResult[] = questions.map((q) => {
    const score = 58 + Math.floor(rng() * 38); // 58-95
    return {
      id: q.id,
      prompt: q.prompt,
      category: q.category,
      score,
      verdict: verdictForScore(score),
      tips: tipsFor(q.category, rng),
    };
  });

  const overall = Math.round(questionResults.reduce((s, r) => s + r.score, 0) / questionResults.length);

  const timeline: TimelineEvent[] = [
    { id: "t1", timeLabel: "00:00", title: "Session started", detail: "Calibration + mic check (UI)" },
    { id: "t2", timeLabel: "00:18", title: "Question 1 delivered", detail: "Timer reset" },
    { id: "t3", timeLabel: "06:40", title: "Recording segment saved (local placeholder)", detail: "No upload in this phase" },
    { id: "t4", timeLabel: "12:10", title: "Mid-session checkpoint", detail: "Pacing reminder" },
    { id: "t5", timeLabel: "26:55", title: "Final answer wrap-up", detail: "Confidence cues" },
    { id: "t6", timeLabel: "31:20", title: "Session complete", detail: "Results generated (mock)" },
  ];

  return { overall, questionResults, timeline };
}
