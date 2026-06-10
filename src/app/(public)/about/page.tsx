import Link from "next/link";
import { ArrowRight, BadgeCheck, Brain, LayoutGrid, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const FEATURES = [
  {
    title: "Realistic Practice",
    desc: "Timed mock interviews with structured prompts that feel closer to a real session.",
    icon: Brain,
  },
  {
    title: "Progress Tracking",
    desc: "Track scores and revisit feedback so improvement is visible across sessions.",
    icon: LayoutGrid,
  },
  {
    title: "Simple Access",
    desc: "Fast sign-in and a focused experience that keeps users moving instead of clicking around.",
    icon: ShieldCheck,
  },
];

const VALUES = [
  "Calm, high-trust UI",
  "Clear feedback after each session",
  "Designed for focus, not distraction",
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-32 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent_72%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.14),transparent_72%)]" />
        <div className="absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.12),transparent_72%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(34,197,94,0.08),transparent_72%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px] uppercase tracking-[0.2em]">
                About
              </Badge>
              <span>Mocksy is built for interview practice that feels intentional.</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                A focused mock interview experience for serious practice
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Mocksy helps users rehearse interview scenarios, stay organized, and understand where they need
                more practice. The product is designed to feel calm, clear, and useful from the first question to
                the final result.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-2xl px-6">
                <Link href="/interview" className="inline-flex items-center gap-2">
                  Start a session
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-2xl px-6">
                <Link href="/contact">Contact support</Link>
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {VALUES.map((value) => (
                <div key={value} className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm shadow-sm">
                  <BadgeCheck className="size-4 text-foreground/80" />
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(99,102,241,0.16),transparent_72%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent_72%)]" />
            <Card className="overflow-hidden rounded-[2rem] border-border/60 shadow-sm">
              <CardHeader className="space-y-3 border-b bg-muted/20 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">Why Mocksy exists</CardTitle>
                  <Badge variant="secondary" className="rounded-full">
                    Product focus
                  </Badge>
                </div>
                <CardDescription className="text-sm leading-6">
                  A practice-first product that removes clutter and keeps attention on the interview itself.
                </CardDescription>
              </CardHeader>

              <div className="grid gap-4 p-6 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Sparkles className="size-4 text-foreground/80" />
                      Clear sessions
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Each interview is structured to reduce friction and keep users moving through the flow.
                    </p>
                  </div>
                  <div className="rounded-2xl border bg-background p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ShieldCheck className="size-4 text-foreground/80" />
                      Trust by design
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      The interface is simple and readable so the experience feels safe and professional.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border bg-background p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mission</div>
                  <p className="mt-3 text-sm leading-7 text-foreground">
                    Make interview practice accessible and actionable without unnecessary clutter. Mocksy aims to
                    give users a focused space to practice, reflect, and improve.
                  </p>
                </div>
              </div>
            </Card>
          </section>
        </div>

        <Separator className="my-10 sm:my-12" />

        <section className="space-y-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">What the product focuses on</h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              The product is intentionally compact. It is meant to support practice, feedback, and repeat usage
              without turning the experience into a complicated dashboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="rounded-3xl border-border/60">
                <CardHeader className="space-y-3">
                  <div className="inline-flex size-11 items-center justify-center rounded-2xl border bg-background">
                    <feature.icon className="size-5" />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-6">{feature.desc}</CardDescription>
                  </div>
                  <Badge variant="outline" className="w-fit rounded-full text-xs">
                    Core value
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
            Back to home
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Contact support
          </Link>
        </div>
      </div>
    </div>
  );
}
