"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export default function ProfileContent({ user }: { user?: User | null }) {
  const userInitials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Demo tests (same as page file)
  const DEMO_TESTS = [
    {
      id: "test-001",
      date: new Date("2026-05-01T00:12:00Z"),
      duration: "12 min",
      score: 78,
      category: "Pre-CAS",
      status: "Completed",
      color: "from-blue-500/20 to-blue-600/20",
      badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      scoreColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "test-002",
      date: new Date("2026-04-28T00:12:00Z"),
      duration: "14 min",
      score: 72,
      category: "UKVI",
      status: "Completed",
      color: "from-purple-500/20 to-purple-600/20",
      badgeColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      scoreColor: "text-purple-600 dark:text-purple-400",
    },
    {
      id: "test-003",
      date: new Date("2026-04-26T00:12:00Z"),
      duration: "11 min",
      score: 68,
      category: "General",
      status: "Completed",
      color: "from-emerald-500/20 to-emerald-600/20",
      badgeColor: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
      scoreColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "test-004",
      date: new Date("2026-04-19T00:12:00Z"),
      duration: "13 min",
      score: 75,
      category: "Pre-CAS",
      status: "Completed",
      color: "from-blue-500/20 to-blue-600/20",
      badgeColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      scoreColor: "text-blue-600 dark:text-blue-400",
    },
  ];

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 left-1/2 h-115 w-245 -translate-x-1/2 rounded-[52px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015),transparent_35%,transparent_65%,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%,transparent_65%,rgba(255,255,255,0.035))]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-3 py-6 sm:px-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 sm:space-y-8">
          <Card className="rounded-2xl sm:rounded-3xl border-0 bg-gradient-to-br from-background via-background to-indigo-500/5 shadow-lg">
            <CardContent className="pt-6 sm:pt-8">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-10 blur-xl" />
                    <div className="relative flex size-24 sm:size-32 items-center justify-center overflow-hidden rounded-full border-4 border-indigo-200/20 bg-gradient-to-br from-indigo-50 to-purple-50 dark:border-indigo-900/20 dark:from-indigo-950 dark:to-purple-950 shadow-xl">
                      {user?.image ? (
                        <Image src={user.image} alt={user.name ?? "User avatar"} width={128} height={128} className="size-full object-cover" />
                      ) : (
                        <span className="text-3xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400">{userInitials ?? "U"}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-center justify-center gap-1 sm:gap-2 sm:justify-start">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight line-clamp-2">{user?.name ?? "Signed in user"}</h1>
                    <Zap className="size-4 sm:size-5 flex-shrink-0 text-amber-500" />
                  </div>
                  <p className="text-sm sm:text-lg text-muted-foreground mb-4 truncate">{user?.email ?? "Google account"}</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <Badge className="rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 px-3 py-0.5 sm:px-4 sm:py-1 text-xs">
                      ✓ Google Verified
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-0.5 sm:px-4 sm:py-1 text-xs">
                      Active Member
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Practice History</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Your recent interview sessions</p>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {DEMO_TESTS.map((test, index) => (
                <motion.div key={test.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <Card className={`rounded-xl sm:rounded-2xl border-0 bg-gradient-to-br ${test.color} shadow-md hover:shadow-lg transition-all hover:scale-[1.01] cursor-default overflow-hidden`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-start gap-2.5 sm:gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-white/70 dark:bg-black/20 shadow-sm">
                            <CheckCircle className="size-4.5 sm:size-5 text-green-600 dark:text-green-400" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                              <h3 className="font-semibold text-xs sm:text-base">{test.category} Interview</h3>
                              <Badge className={`rounded-full text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-0.5 ${test.badgeColor} border-0`}>{test.status}</Badge>
                            </div>
                            <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="font-medium">{formatDate(test.date)}</span>
                                <div className="flex items-center gap-0.5">
                                  <Clock className="size-2.5 sm:size-3.5" />
                                  <span>{formatTime(test.date)}</span>
                                </div>
                              </div>
                              <span>{test.duration}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 sm:flex-col sm:items-end sm:justify-center sm:gap-0.5 flex-shrink-0">
                            <span className="text-xs text-muted-foreground sm:hidden">Score:</span>
                            <div className="flex items-baseline gap-0.5">
                              <div className={`text-xl sm:text-3xl font-bold ${test.scoreColor} font-mono`}>{test.score}</div>
                              <div className="text-xs text-muted-foreground">/100</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
