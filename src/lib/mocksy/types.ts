export type InterviewQuestion = {
  id: string;
  category: string;
  prompt: string;
};

export type PastInterview = {
  id: string;
  title: string;
  track: "Pre-CAS" | "UKVI";
  completedAtLabel: string;
  score: number; // 0-100
  durationMin: number;
  status: "Completed" | "In progress";
};

export type MockSession = {
  sessionId: string;
  createdAt: number;
  questionIds: string[];
};
