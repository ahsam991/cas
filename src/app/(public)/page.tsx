"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Clapperboard, ShieldCheck, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/mocksy/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-[48px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.35),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.22),transparent_70%)]" />
        <div className="absolute -bottom-48 left-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.18),transparent_70%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(34,197,94,0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_35%,transparent_65%,rgba(0,0,0,0.03))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%,transparent_65%,rgba(255,255,255,0.05))]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
        <motion.div
          className="flex flex-col gap-10"
          initial="initial"
          animate="animate"
          transition={{ staggerChildren: 0.08 }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3">
                <BrandMark />
                <div className="text-sm text-muted-foreground">Mocksy</div>
              </div>

              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Practice Real UKVI &amp; Pre-CAS Interviews with AI
              </h1>

              <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                A calm, high-trust mock interview studio — structured prompts, timed practice, and a results view that
                feels like a real SaaS product.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="rounded-2xl px-6">
                  <Link href="/interview" className="inline-flex items-center gap-2">
                    Start Mock Interview
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-2xl px-6">
                  <Link href="/profile">View profile</Link>
                </Button>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4 text-foreground/80" />
                  Interview-grade pacing
                </div>
                <div className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-foreground/80" />
                  Smooth, animated flow
                </div>
              </div>
            </div>

            <motion.div variants={fadeUp} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <div className="absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.25),transparent_68%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent_68%)]" />
              <Card className="overflow-hidden rounded-3xl shadow-sm">
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">A focused interview studio</CardTitle>
                    <Badge variant="secondary" className="rounded-full">
                      Full-screen UI
                    </Badge>
                  </div>
                  <CardDescription>Clean prompts, calm pacing, and an intentional results layout.</CardDescription>
                </CardHeader>
                <div className="border-t bg-muted/20">
                  <div className="grid gap-3 p-5 sm:p-6">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border bg-background p-4">
                        <div className="text-xs text-muted-foreground">Question sets</div>
                        <div className="mt-2 text-lg font-semibold">10–15</div>
                        <div className="mt-1 text-xs text-muted-foreground">Randomized per session</div>
                      </div>
                      <div className="rounded-2xl border bg-background p-4">
                        <div className="text-xs text-muted-foreground">Motion</div>
                        <div className="mt-2 text-lg font-semibold">Smooth</div>
                        <div className="mt-1 text-xs text-muted-foreground">Transitions between prompts</div>
                      </div>
                      <div className="rounded-2xl border bg-background p-4">
                        <div className="text-xs text-muted-foreground">Results</div>
                        <div className="mt-2 text-lg font-semibold">Breakdown</div>
                        <div className="mt-1 text-xs text-muted-foreground">Timeline + per-question cards</div>
                      </div>
                    </div>
                    <div className="rounded-3xl border bg-background p-4">
                      <div className="text-xs text-muted-foreground">Example prompt</div>
                      <div className="mt-2 text-sm leading-7 text-foreground">
                        “Why this course, and how does it connect to your previous studies?”
                      </div>
                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Button asChild className="rounded-2xl">
                          <Link href="/interview">Try the interview flow</Link>
                        </Button>
                        <Button asChild variant="outline" className="rounded-2xl">
                          <Link href="/profile">Open profile</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <Separator className="my-2" />

          <motion.div variants={fadeUp} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="space-y-6">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Built for serious practice</h2>
              <p className="max-w-2xl text-muted-foreground">
                A modern SaaS layout with crisp cards, soft elevation, and motion that makes the experience feel
                intentional — not like a template.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "AI-powered feedback",
                  desc: "A results breakdown UI designed for clarity — strengths, gaps, and next steps.",
                  icon: Brain,
                },
                {
                  title: "Real interview simulation",
                  desc: "Timed prompts and a focused full-screen flow to reduce anxiety on exam day.",
                  icon: Clapperboard,
                },
                {
                  title: "Video recording practice",
                  desc: "A camera panel and recording controls — UI only in this phase, no uploads.",
                  icon: Sparkles,
                },
              ].map((f) => (
                <motion.div key={f.title} whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 320, damping: 26 }}>
                  <Card className="h-full rounded-3xl">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex size-10 items-center justify-center rounded-2xl border bg-background">
                          <f.icon className="size-5" />
                        </div>
                        <CardTitle className="text-base">{f.title}</CardTitle>
                      </div>
                      <CardDescription className="text-sm leading-6">{f.desc}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
