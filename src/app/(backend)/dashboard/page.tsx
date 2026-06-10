"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { Activity, Users, HelpCircle, TrendingUp, BarChart3, RefreshCw, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { QuestionCategory, QuestionDifficulty } from "@/lib/mocksy/question-store";

type DashboardData = {
  totalUsers: number;
  activeSessions: number;
  totalQuestions: number;
  totalUsersWithDetails: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    lastSignInAt: string;
    avatar: string;
  }>;
  recentActivities: Array<{
    id: string;
    title: string;
    actor: string;
    timeLabel: string;
    kind: "user" | "question";
  }>;
};

type DashboardResponse = {
  dashboard: DashboardData;
  userName: string;
};

type QuestionFormState = {
  text: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
};

const QUESTION_INITIAL_STATE: QuestionFormState = {
  text: "",
  category: "about_yourself",
  difficulty: "medium",
};

const QUESTION_CATEGORY_OPTIONS: Array<{ value: QuestionCategory; label: string }> = [
  { value: "about_yourself", label: "About Yourself" },
  { value: "course_university", label: "Course & University" },
  { value: "uk_country", label: "UK Country" },
  { value: "previous_study", label: "Previous Study" },
  { value: "finance", label: "Finance" },
  { value: "future_plan", label: "Future Plan" },
  { value: "research_preparation", label: "Research Preparation" },
  { value: "personal_lifestyle", label: "Personal Lifestyle" },
];

const QUESTION_DIFFICULTY_OPTIONS: Array<{ value: QuestionDifficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const statsConfig = [
  {
    label: "Total Users",
    key: "totalUsers" as const,
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    trend: "+12%",
  },
  {
    label: "Active Sessions",
    key: "activeSessions" as const,
    icon: Activity,
    color: "bg-green-500/10 text-green-600 dark:text-green-400",
    trend: "+5%",
  },
  {
    label: "Total Questions",
    key: "totalQuestions" as const,
    icon: HelpCircle,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    trend: "+8%",
  },
  {
    label: "Loaded Profiles",
    key: "loadedProfiles" as const,
    icon: BarChart3,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    trend: "+3%",
  },
];

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted/70 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1 sm:space-y-3">
          <SkeletonBlock className="h-8 sm:h-10 w-40 sm:w-56" />
          <SkeletonBlock className="h-4 sm:h-5 w-48 sm:w-80" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg" />
          <SkeletonBlock className="h-9 sm:h-10 w-24 sm:w-36 rounded-lg" />
        </div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-3 sm:p-4 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 sm:space-y-3 flex-1">
                <SkeletonBlock className="h-3 sm:h-4 w-20 sm:w-24" />
                <SkeletonBlock className="h-6 sm:h-8 w-12 sm:w-16" />
              </div>
              <SkeletonBlock className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 auto-rows-max">
        <Card className="lg:col-span-2 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1 sm:space-y-2">
              <SkeletonBlock className="h-5 sm:h-6 w-40 sm:w-44" />
              <SkeletonBlock className="h-3 sm:h-4 w-48 sm:w-56" />
            </div>
            <SkeletonBlock className="h-8 sm:h-9 w-20 sm:w-24 rounded-lg" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between rounded-lg px-3 xs:px-4 py-2 xs:py-3">
                <div className="space-y-1 xs:space-y-2 flex-1">
                  <SkeletonBlock className="h-3 xs:h-4 w-32 xs:w-36" />
                  <SkeletonBlock className="h-2 xs:h-3 w-20 xs:w-24" />
                </div>
                <SkeletonBlock className="h-2 xs:h-3 w-16 xs:w-20" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <SkeletonBlock className="h-5 sm:h-6 w-28 sm:w-32" />
          <div className="space-y-2 grid grid-cols-2 sm:grid-cols-1 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-8 sm:h-9 w-full rounded-lg" />
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="mb-2 sm:mb-4 flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between">
          <div className="space-y-1 xs:space-y-2">
            <SkeletonBlock className="h-5 sm:h-6 w-28 sm:w-32" />
            <SkeletonBlock className="h-3 sm:h-4 w-36 sm:w-40" />
          </div>
          <SkeletonBlock className="h-8 sm:h-9 w-20 sm:w-28 rounded-lg" />
        </div>
        <div className="grid gap-2 sm:gap-3 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-32 sm:h-36 rounded-lg xs:rounded-xl sm:rounded-2xl" />
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1 xs:space-y-2 flex-1">
            <SkeletonBlock className="h-5 sm:h-6 w-28 sm:w-32" />
            <SkeletonBlock className="h-3 sm:h-4 w-40 sm:w-48" />
          </div>
          <SkeletonBlock className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg shrink-0" />
        </div>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [questionSaving, setQuestionSaving] = useState(false);
  const [questionError, setQuestionError] = useState<string | null>(null);
  const [questionSuccess, setQuestionSuccess] = useState<string | null>(null);
  const [questionFormState, setQuestionFormState] = useState<QuestionFormState>(QUESTION_INITIAL_STATE);

  async function loadDashboard() {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/admin/dashboard", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load dashboard.");
      }

      const data = (await response.json()) as DashboardResponse;
      setDashboard(data.dashboard);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();

    void fetch("/api/admin/dashboard", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to load dashboard.");
        }

        return response.json() as Promise<DashboardResponse>;
      })
      .then((data) => setDashboard(data.dashboard))
      .catch((error) => {
        if ((error as { name?: string }).name === "AbortError") {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : "Unable to load dashboard.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handler = () => {
      void loadDashboard();
    };
    window.addEventListener("mocksy:refresh-dashboard", handler as EventListener);
    return () => window.removeEventListener("mocksy:refresh-dashboard", handler as EventListener);
  }, []);

  const refreshDashboard = async () => {
    await loadDashboard();
  };

  const openQuestionModal = () => {
    setQuestionFormState(QUESTION_INITIAL_STATE);
    setQuestionError(null);
    setQuestionSuccess(null);
    setQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setQuestionModalOpen(false);
    setQuestionSaving(false);
    setQuestionError(null);
  };

  const handleQuestionSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQuestionSaving(true);
    setQuestionError(null);
    setQuestionSuccess(null);

    try {
      const response = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questionFormState),
      });

      if (!response.ok) {
        throw new Error("Unable to create question.");
      }

      setQuestionFormState(QUESTION_INITIAL_STATE);
      setQuestionSuccess("Question saved successfully.");
      await loadDashboard();
    } catch (error) {
      setQuestionError(error instanceof Error ? error.message : "Unable to save question.");
    } finally {
      setQuestionSaving(false);
    }
  };

  const stats = useMemo(() => {
    if (!dashboard) return null;

    return [
      {
        label: "Total Users",
        value: dashboard.totalUsers.toLocaleString(),
        icon: Users,
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        trend: "+12%",
      },
      {
        label: "Active Sessions",
        value: dashboard.activeSessions.toLocaleString(),
        icon: Activity,
        color: "bg-green-500/10 text-green-600 dark:text-green-400",
        trend: "+5%",
      },
      {
        label: "Total Questions",
        value: dashboard.totalQuestions.toLocaleString(),
        icon: HelpCircle,
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
        trend: "+8%",
      },
      {
        label: "Loaded Profiles",
        value: dashboard.totalUsersWithDetails.length.toLocaleString(),
        icon: BarChart3,
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        trend: "+3%",
      },
    ];
  }, [dashboard]);

  if (loading || !dashboard) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground truncate sm:truncate">
            Welcome back, {session?.user?.name?.split(" ")[0] ?? "Admin"}! Here's your admin overview.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-9 w-9 sm:h-10 sm:w-10 shadow-sm"
            onClick={() => void refreshDashboard()}
            aria-label="Refresh dashboard"
          >
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {errorMessage && (
        <Card className="border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          {errorMessage}
        </Card>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {stats?.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{stat.label}</p>
                  <div className="mt-1 sm:mt-2 flex items-end gap-1 sm:gap-2">
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold">{stat.value}</p>
                    <p className="text-xs sm:text-sm font-semibold text-green-600 dark:text-green-400 whitespace-nowrap">{stat.trend}</p>
                  </div>
                </div>
                <div className={`rounded-lg p-2 sm:p-3 shrink-0 ${stat.color}`}>
                  <Icon className="size-4 sm:size-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 auto-rows-max">
        <Card className="lg:col-span-2 p-4 sm:p-6">
          <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Recent Activities</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">Latest system activities</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-lg w-fit">
              View All
            </Button>
          </div>

          <div className="space-y-1">
            {dashboard.recentActivities.map((activity, idx) => (
              <div key={activity.id}>
                <div className="flex flex-col gap-2 xs:flex-row xs:items-center xs:justify-between rounded-lg px-3 xs:px-4 py-2 xs:py-3 hover:bg-muted transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs xs:text-sm truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">By {activity.actor}</p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">{activity.timeLabel}</p>
                </div>
                {idx < dashboard.recentActivities.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h3 className="mb-3 sm:mb-4 font-semibold text-sm sm:text-base">Quick Actions</h3>
          <div className="space-y-2 grid grid-cols-2 sm:grid-cols-1 gap-2">
            <Button variant="outline" className="w-full justify-start rounded-lg text-xs sm:text-sm py-2 sm:py-2 px-3" size="sm">
              <Users className="mr-2 size-4 shrink-0" />
              <span className="truncate">Manage Users</span>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-lg text-xs sm:text-sm py-2 sm:py-2 px-3" size="sm" onClick={openQuestionModal}>
              <Plus className="mr-2 size-4 shrink-0" />
              <span className="truncate">Add Question</span>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-lg text-xs sm:text-sm py-2 sm:py-2 px-3" size="sm">
              <Activity className="mr-2 size-4 shrink-0" />
              <span className="truncate">View Reports</span>
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-lg text-xs sm:text-sm py-2 sm:py-2 px-3" size="sm">
              <TrendingUp className="mr-2 size-4 shrink-0" />
              <span className="truncate">Analytics</span>
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-2 xs:gap-3 xs:flex-row xs:items-center xs:justify-between">
          <div>
            <h3 className="font-semibold text-sm sm:text-base">Latest users</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Recent user profiles.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-lg text-xs sm:text-sm w-fit">
            <Link href="/dashboard/users">View all users</Link>
          </Button>
        </div>
        <div className="grid gap-2 sm:gap-3 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3">
          {dashboard.totalUsersWithDetails.map((user) => (
            <div key={user.id} className="rounded-lg xs:rounded-xl sm:rounded-2xl border bg-background p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <img src={user.avatar} alt={user.name} width="36" height="36" className="size-8 sm:size-10 rounded-full object-cover shrink-0" />
                <div className="min-w-0">
                  <div className="truncate font-medium text-xs sm:text-sm">{user.name}</div>
                  <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 grid gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                <div>
                  Role: <span className="text-foreground">{user.role}</span>
                </div>
                <div>
                  Created: <span className="text-foreground">{user.createdAt}</span>
                </div>
                <div>
                  Last sign in: <span className="text-foreground">{user.lastSignInAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold text-sm sm:text-base">System Status</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">All systems operational</p>
          </div>
          <div className="flex size-10 sm:size-12 items-center justify-center rounded-lg bg-green-500/10 shrink-0">
            <span className="flex size-3 rounded-full bg-green-600 dark:bg-green-400 animate-pulse" />
          </div>
        </div>
      </Card>

      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-4 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-xl sm:max-w-2xl border-primary/50 bg-background p-4 sm:p-6 shadow-2xl my-auto">
            <div className="mb-4 sm:mb-6 flex items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold">Add New Question</h2>
              <button onClick={closeQuestionModal} className="text-muted-foreground hover:text-foreground text-xl sm:text-2xl shrink-0" aria-label="Close add question modal">
                ✕
              </button>
            </div>

            <form className="space-y-3 sm:space-y-4" onSubmit={handleQuestionSubmit}>
              <div>
                <label className="text-xs sm:text-sm font-medium">Question Title</label>
                <Input
                  value={questionFormState.text}
                  onChange={(event) => setQuestionFormState((current) => ({ ...current, text: event.target.value }))}
                  placeholder="Enter question title"
                  className="mt-1 sm:mt-1.5 rounded-lg text-sm"
                  required
                />
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div>
                  <label className="text-xs sm:text-sm font-medium">Category</label>
                  <select
                    value={questionFormState.category}
                    onChange={(event) => setQuestionFormState((current) => ({ ...current, category: event.target.value as QuestionCategory }))}
                    className="mt-1 sm:mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  >
                    {QUESTION_CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium">Difficulty Level</label>
                  <select
                    value={questionFormState.difficulty}
                    onChange={(event) => setQuestionFormState((current) => ({ ...current, difficulty: event.target.value as QuestionDifficulty }))}
                    className="mt-1 sm:mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  >
                    {QUESTION_DIFFICULTY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {questionError && <p className="text-xs sm:text-sm text-destructive">{questionError}</p>}
              {questionSuccess && <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">{questionSuccess}</p>}

              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 pt-2 sm:pt-4">
                <Button type="submit" className="rounded-lg text-xs sm:text-sm" disabled={questionSaving}>
                  {questionSaving ? "Saving..." : "Save Question"}
                </Button>
                <Button variant="outline" onClick={closeQuestionModal} className="rounded-lg text-xs sm:text-sm" type="button">
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
