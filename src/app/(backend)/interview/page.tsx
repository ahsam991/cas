"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

import { InterviewRunner } from "@/components/mocksy/interview-runner";
import { Card } from "@/components/ui/card";
import { notifyMocksySessionUpdated } from "@/lib/mocksy/session-events";
import { MOCKSY_SESSION_KEY, createMockSessionFromQuestions } from "@/lib/mocksy/session";
import { useMocksySession } from "@/hooks/use-mocksy-session";
import type { InterviewQuestion } from "@/lib/mocksy/types";

function randomSeed() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/70 ${className}`} />;
}

function InterviewLoadingShell() {
  return (
    <div className="space-y-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pt-4 sm:px-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <SkeletonBlock className="h-8 w-72 sm:h-10 sm:w-96" />
          <SkeletonBlock className="h-4 w-56 sm:h-5 sm:w-72" />
        </div>
        <div className="flex items-center justify-end">
          <SkeletonBlock className="h-11 w-56 rounded-2xl" />
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-2 sm:px-6 sm:py-4">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
          <Card className="rounded-3xl lg:col-span-8">
            <div className="space-y-5 p-6 sm:p-7">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-44" />
                <SkeletonBlock className="h-4 w-72" />
              </div>

              <div className="rounded-3xl border bg-muted/20 p-5">
                <SkeletonBlock className="h-5 w-40" />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <SkeletonBlock className="h-4 w-20" />
                    <SkeletonBlock className="mt-3 h-5 w-28" />
                    <SkeletonBlock className="mt-3 h-4 w-full" />
                    <SkeletonBlock className="mt-2 h-4 w-5/6" />
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <SkeletonBlock className="h-4 w-16" />
                    <SkeletonBlock className="mt-3 h-5 w-24" />
                    <SkeletonBlock className="mt-3 h-4 w-full" />
                    <SkeletonBlock className="mt-2 h-4 w-4/5" />
                  </div>
                </div>
                <SkeletonBlock className="mt-4 h-4 w-72" />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-6 w-24" />
                  <SkeletonBlock className="h-10 w-16 rounded-full" />
                  <SkeletonBlock className="h-10 w-16 rounded-full" />
                  <SkeletonBlock className="h-10 w-16 rounded-full" />
                </div>
                <SkeletonBlock className="h-11 w-40 rounded-2xl" />
              </div>

              <SkeletonBlock className="h-4 w-64" />
            </div>
          </Card>

          <Card className="rounded-3xl lg:col-span-4">
            <div className="space-y-5 p-6 sm:p-7">
              <div className="space-y-2">
                <SkeletonBlock className="h-5 w-28" />
                <SkeletonBlock className="h-4 w-56" />
              </div>
              <SkeletonBlock className="h-64 rounded-3xl border" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function InterviewPage() {
  const { data: authSession } = useSession();
  const session = useMocksySession();
  const [questionBank, setQuestionBank] = React.useState<InterviewQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = React.useState(true);
  const [questionsError, setQuestionsError] = React.useState<string | null>(null);
  const [questionTypeFilter, setQuestionTypeFilter] = React.useState<string>("all");

  React.useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/admin/questions", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load interview questions.");
        }
        return response.json() as Promise<{
          questions: Array<{
            id: string;
            text: string;
            category: string;
            status?: "published" | "draft";
          }>;
        }>;
      })
      .then((payload) => {
        const mapped = (payload.questions ?? [])
          .filter((q) => (q.status ?? "published") === "published")
          .map((q) => ({ id: q.id, prompt: q.text, category: q.category }));

        setQuestionBank(mapped);
      })
      .catch((error) => {
        if ((error as { name?: string }).name === "AbortError") {
          return;
        }
        setQuestionsError(error instanceof Error ? error.message : "Unable to load interview questions.");
      })
      .finally(() => setLoadingQuestions(false));

    return () => controller.abort();
  }, []);

  const questionTypes = React.useMemo(() => {
    return Array.from(new Set(questionBank.map((question) => question.category))).sort((a, b) => a.localeCompare(b));
  }, [questionBank]);

  const filteredQuestionBank = React.useMemo(() => {
    if (questionTypeFilter === "all") return questionBank;
    return questionBank.filter((question) => question.category === questionTypeFilter);
  }, [questionBank, questionTypeFilter]);

  React.useEffect(() => {
    if (loadingQuestions) return;
    if (!filteredQuestionBank.length) return;

    const created = createMockSessionFromQuestions(randomSeed(), filteredQuestionBank);
    sessionStorage.setItem(MOCKSY_SESSION_KEY, JSON.stringify(created));
    notifyMocksySessionUpdated();
  }, [loadingQuestions, filteredQuestionBank, questionTypeFilter]);

  const formatTypeLabel = (value: string) =>
    value
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const questionTypeOptions = React.useMemo(
    () => [
      { value: "all", label: "All Categories" },
      ...questionTypes.map((type) => ({ value: type, label: formatTypeLabel(type) })),
    ],
    [questionTypes],
  );

  if (loadingQuestions) {
    return <InterviewLoadingShell />;
  }

  if (questionsError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-destructive sm:px-6">
        {questionsError}
      </div>
    );
  }

  if (!questionBank.length) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        No published questions found in database. Please seed or create questions first.
      </div>
    );
  }

  if (!filteredQuestionBank.length) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        No questions found for this type. Select another question type.
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 text-sm text-muted-foreground sm:px-6">
        Preparing a mock session…
      </div>
    );
  }

  return (
    <InterviewRunner
      key={`${session.sessionId}:${questionTypeFilter}`}
      session={session}
      questionBank={filteredQuestionBank}
      questionTypeFilter={questionTypeFilter}
      questionTypeOptions={questionTypeOptions}
      onQuestionTypeFilterChange={setQuestionTypeFilter}
      loggedInUserName={authSession?.user?.name ?? "student"}
    />
  );
}
