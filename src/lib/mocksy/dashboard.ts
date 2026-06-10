import type { PastInterview } from "@/lib/mocksy/types";

export const PAST_INTERVIEWS: PastInterview[] = [
  {
    id: "pv-1001",
    title: "UKVI credibility — funding & intent",
    track: "UKVI",
    completedAtLabel: "Today · 09:12",
    score: 86,
    durationMin: 28,
    status: "Completed",
  },
  {
    id: "pv-1002",
    title: "Pre-CAS — course & university rationale",
    track: "Pre-CAS",
    completedAtLabel: "Yesterday · 18:40",
    score: 81,
    durationMin: 34,
    status: "Completed",
  },
  {
    id: "pv-1003",
    title: "Mixed drill — timing + clarity",
    track: "Pre-CAS",
    completedAtLabel: "Mon · 20:05",
    score: 74,
    durationMin: 31,
    status: "Completed",
  },
  {
    id: "pv-1004",
    title: "UKVI — accommodation & travel plan",
    track: "UKVI",
    completedAtLabel: "Sun · 11:58",
    score: 79,
    durationMin: 22,
    status: "Completed",
  },
  {
    id: "pv-1005",
    title: "Pre-CAS — academic readiness",
    track: "Pre-CAS",
    completedAtLabel: "Sat · 16:22",
    score: 88,
    durationMin: 40,
    status: "Completed",
  },
  {
    id: "pv-1006",
    title: "UKVI — post-study intentions",
    track: "UKVI",
    completedAtLabel: "Fri · 08:47",
    score: 72,
    durationMin: 26,
    status: "Completed",
  },
  {
    id: "pv-1007",
    title: "Warm-up session",
    track: "Pre-CAS",
    completedAtLabel: "Thu · 19:10",
    score: 69,
    durationMin: 18,
    status: "Completed",
  },
  {
    id: "pv-1008",
    title: "In progress: credibility rebuild",
    track: "UKVI",
    completedAtLabel: "Started · 10:02",
    score: 0,
    durationMin: 9,
    status: "In progress",
  },
];

export function dashboardStats(interviews: PastInterview[]) {
  const completed = interviews.filter((i) => i.status === "Completed");
  const total = completed.length;
  const avg = total ? Math.round(completed.reduce((s, i) => s + i.score, 0) / total) : 0;

  const last3 = completed.slice(0, 3).map((i) => i.score);
  const baseline = completed.length >= 6 ? completed[5]?.score ?? avg : avg;
  const recent = last3.length ? Math.round(last3.reduce((s, n) => s + n, 0) / last3.length) : avg;
  const improvement = Math.max(-25, Math.min(25, recent - baseline));

  return {
    totalInterviews: interviews.length,
    averageScore: avg,
    improvementRate: improvement,
  };
}
