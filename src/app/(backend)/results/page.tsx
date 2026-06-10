"  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default function ResultsPage() {
  const session = useMocksySession();

  React.useEffect(() => {
    if (session) return;
    const created = createMockSession(randomSeed());
    sessionStorage.setItem(MOCKSY_SESSION_KEY, JSON.stringify(created));
    notifyMocksySessionUpdated();
  }, [session]);

  const model = React.useMemo(() => {
    if (!session) return null;
    const qs = questionsForSession(session);
    return buildMockResults(session.sessionId, qs);
  }, [session]);

  const breakdown = React.useMemo(() => {
    if (!model) return null;
    const by = { "pre-cas": [] as number[], ukvi: [] as number[], general: [] as number[] };
    for (const q of model.questionResults) by[q.category].push(q.score);
    const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((s, n) => s + n, 0) / arr.length) : 0);
    return {
      preCasAvg: avg(by["pre-cas"]),
      ukviAvg: avg(by.ukvi),
      generalAvg: avg(by.general),
    };
  }, [model]);

  const scoreRing = React.useMemo(() => {
    const score = model?.overall ?? 0;
    const clamped = Math.max(0, Math.min(100, score));
    return { value: clamped, style: { ["--p" as never]: `${clamped}%` } };
  }, [model]);

  const onFakeDownload = () => {
    const blob = new Blob(
      [
        "Mocksy sample export\n\nThis is a placeholder file for the video download button UI.\nNo real media is attached in this phase.\n",
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mocksy-session-placeholder.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-36 left-1/2 h-[460px] w-[980px] -translate-x-1/2 rounded-[52px] bg-[radial-gradient(closest-side,rgba(34,197,94,0.16),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(34,197,94,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015),transparent_35%,transparent_65%,rgba(0,0,0,0.02))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_35%,transparent_65%,rgba(255,255,255,0.035))]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Results</h1>
              <Badge variant="secondary" className="rounded-full">
                Mock scoring
              </Badge>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              A credible breakdown UI: overall performance, per-question cards, and a session timeline — generated from local mock logic.
            </p>
            <div className="text-xs text-muted-foreground">
              Session{" "}
              <span className="font-mono text-[11px] text-foreground/80">{session?.sessionId ?? "…"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="button" variant="outline" className="rounded-2xl" onClick={onFakeDownload}>
              <span className="inline-flex items-center gap-2">
                <Download className="size-4" />
                Download session (fake)
              </span>
            </Button>
            <Button asChild className="rounded-2xl">
              <Link href="/interview">Practice again</Link>
            </Button>
          </div>
        </div>

        {!model ? (
          <div className="text-sm text-muted-foreground">Loading mock results…</div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
            <Card className="rounded-3xl lg:col-span-5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overall score</CardTitle>
                <CardDescription>Weighted mock average across the sampled question set.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-center">
                  <div className="flex items-center justify-center">
                    <div
                      className="relative grid size-40 place-items-center rounded-full border bg-background shadow-sm"
                      style={scoreRing.style}
                    >
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "conic-gradient(oklch(0.65 0.2 264) var(--p), oklch(0.92 0 0) 0)",
                        }}
                      />
                      <div className="relative grid size-[132px] place-items-center rounded-full bg-background">
                        <div className="text-center">
                          <div className="text-4xl font-semibold tabular-nums tracking-tight">{model.overall}</div>
                          <div className="text-xs text-muted-foreground">overall score</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      A clean report layout designed to feel like a real product. Scores are mocked for now.
                    </div>
                    <Progress value={model.overall} />
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1">
                        <Sparkles className="size-3" />
                        Coaching snippets (mock)
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1">
                        <Timer className="size-3" />
                        Session length simulated
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-background px-3 py-1">
                        <CheckCircle2 className="size-3" />
                        No AI judging yet
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <div className="text-xs text-muted-foreground">Clarity</div>
                    <div className="mt-2 text-sm font-medium">Strong structure</div>
                  </div>
                  <div className="rounded-2xl border bg-muted/30 p-4">
                    <div className="text-xs text-muted-foreground">Credibility</div>
                    <div className="mt-2 text-sm font-medium">Consistent story</div>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="text-xs text-muted-foreground">Pre-CAS avg</div>
                    <div className="mt-2 text-lg font-semibold tabular-nums">{breakdown?.preCasAvg ?? 0}</div>
                    <Progress className="mt-3" value={breakdown?.preCasAvg ?? 0} />
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="text-xs text-muted-foreground">UKVI avg</div>
                    <div className="mt-2 text-lg font-semibold tabular-nums">{breakdown?.ukviAvg ?? 0}</div>
                    <Progress className="mt-3" value={breakdown?.ukviAvg ?? 0} />
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="text-xs text-muted-foreground">General avg</div>
                    <div className="mt-2 text-lg font-semibold tabular-nums">{breakdown?.generalAvg ?? 0}</div>
                    <Progress className="mt-3" value={breakdown?.generalAvg ?? 0} />
                  </div>
                </div>

                <Separator />
                <div className="rounded-3xl border bg-muted/25 p-4">
                  <div className="text-xs text-muted-foreground">Next practice focus</div>
                  <div className="mt-2 text-sm leading-6">
                    Keep funding answers number-first, and end each course-motivation answer with a clear link to your career plan.
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4 lg:col-span-7">
              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <CardTitle className="text-base">Question-wise breakdown</CardTitle>
                      <CardDescription>Scores + quick coaching snippets (mock).</CardDescription>
                    </div>
                    <Badge className="w-fit rounded-full" variant="outline">
                      {model.questionResults.length} prompts
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-2 rounded-2xl sm:grid-cols-4">
                      <TabsTrigger className="rounded-xl" value="all">
                        All
                      </TabsTrigger>
                      <TabsTrigger className="rounded-xl" value="pre-cas">
                        Pre-CAS
                      </TabsTrigger>
                      <TabsTrigger className="rounded-xl" value="ukvi">
                        UKVI
                      </TabsTrigger>
                      <TabsTrigger className="rounded-xl" value="general">
                        General
                      </TabsTrigger>
                    </TabsList>

                    {(["all", "pre-cas", "ukvi", "general"] as const).map((key) => (
                      <TabsContent key={key} value={key} className="mt-4">
                        <ScrollArea className="h-[460px] pr-3">
                          <div className="space-y-3">
                            {model.questionResults
                              .filter((q) => (key === "all" ? true : q.category === key))
                              .map((q) => (
                                <motion.div
                                  key={q.id}
                                  layout
                                  className="rounded-3xl border bg-card p-4 shadow-sm"
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="space-y-2">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge variant="secondary" className="rounded-full">
                                          {q.category === "pre-cas" ? "Pre-CAS" : q.category === "ukvi" ? "UKVI" : "General"}
                                        </Badge>
                                        <Badge className="rounded-full" variant="outline">
                                          {q.verdict}
                                        </Badge>
                                      </div>
                                      <div className="text-sm leading-6 text-foreground">{q.prompt}</div>
                                    </div>
                                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                                      <div className="text-3xl font-semibold tabular-nums">{q.score}</div>
                                      <Progress className="w-40 sm:w-44" value={q.score} />
                                    </div>
                                  </div>
                                  <Separator className="my-4" />
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {q.tips.map((t) => (
                                      <div key={t} className="rounded-2xl bg-muted/30 p-3 text-sm text-muted-foreground">
                                        {t}
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>

              <Card className="rounded-3xl">
                <CardHeader className="pb-3">
                  <CardTitle className="inline-flex items-center gap-2 text-base">
                    <ListChecks className="size-4" />
                    Interview timeline
                  </CardTitle>
                  <CardDescription>A simple event ledger for the session (mock timestamps).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
                    <div className="space-y-4">
                      {model.timeline.map((ev) => (
                        <div key={ev.id} className="relative pl-8">
                          <div className="absolute left-1.5 top-2 size-3 rounded-full border bg-background" />
                          <div className="flex flex-col gap-1 rounded-2xl border bg-background p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="text-sm font-medium">{ev.title}</div>
                              <div className="font-mono text-xs text-muted-foreground">{ev.timeLabel}</div>
                            </div>
                            {ev.detail ? <div className="text-sm text-muted-foreground">{ev.detail}</div> : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </motion.div>
    </div>
    </div>
  );
}
