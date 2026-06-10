"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { ArrowRight, Check, Globe, ShieldCheck } from "lucide-react";

import { BrandMark } from "@/components/mocksy/brand-mark";
import { SiteHeader } from "@/components/mocksy/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M21.805 10.23H21V10h-9v4h5.651A6.002 6.002 0 0 1 6 12a6 6 0 0 1 9.428-4.907l2.829-2.829A9.951 9.951 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10c0-.672-.069-1.328-.195-1.77Z" />
      <path fill="#34A853" d="M3.153 7.76 6.44 10.16A6 6 0 0 1 12 6c1.472 0 2.828.537 3.869 1.424l2.905-2.906A9.96 9.96 0 0 0 12 2C8.18 2 4.885 4.16 3.153 7.76Z" />
      <path fill="#FBBC05" d="M12 22c2.578 0 4.935-.986 6.708-2.594l-3.097-2.542A5.992 5.992 0 0 1 12 18a6 6 0 0 1-5.56-3.84l-3.25 2.502A9.987 9.987 0 0 0 12 22Z" />
      <path fill="#EA4335" d="M21.805 10.23H21V10h-9v4h5.651a6.01 6.01 0 0 1-2.04 3.864l3.097 2.542C18.947 18.976 22 15.83 22 12c0-.672-.069-1.328-.195-1.77Z" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <SiteHeader />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-140 w-230 -translate-x-1/2 rounded-[48px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.28),transparent_72%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.18),transparent_72%)]" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.16),transparent_72%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(34,197,94,0.1),transparent_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),transparent_35%,transparent_70%,rgba(0,0,0,0.03))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_35%,transparent_70%,rgba(255,255,255,0.05))]" />
      </div>

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-16">
        <div className="flex flex-col gap-8 pb-8 lg:pb-0">
          <div className="inline-flex items-center gap-3">
            <BrandMark />
            <div>
              <div className="text-sm font-semibold tracking-tight">Mocksy</div>
              <div className="text-xs text-muted-foreground">Google-only sign in</div>
            </div>
          </div>

          <div className="max-w-xl space-y-5">
            <Badge className="rounded-full px-3">Secure access</Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              Sign in to keep your mock interview progress in one place.
            </h1>
            <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
              This page is designed for a simple Google-only login flow. The auth wiring can come later; for now, the
              experience is clean, focused, and easy to extend.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Check, title: "One click access", desc: "Use Google to enter the app without extra forms." },
              { icon: ShieldCheck, title: "Trust-first layout", desc: "Clear copy and calm spacing for a low-friction flow." },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border bg-card/80 p-4 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="inline-flex size-10 items-center justify-center rounded-2xl border bg-background">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-sm leading-6 text-muted-foreground">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(closest-side,rgba(99,102,241,0.2),transparent_72%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(99,102,241,0.12),transparent_72%)]" />
          <Card className="overflow-hidden rounded-[2rem] shadow-[0_22px_70px_-36px_rgba(0,0,0,0.45)]">
            <CardHeader className="space-y-3 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-xl">Continue with Google</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  Only provider
                </Badge>
              </div>
              <CardDescription className="text-sm leading-6">
                A single provider keeps the sign-in experience simple and intentional.
              </CardDescription>

              <div className="space-y-4 pt-2">
                <Button
                  type="button"
                  size="lg"
                  className="h-12 w-full cursor-pointer rounded-2xl px-5 text-[15px] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                  <span className="inline-flex items-center justify-center gap-3">
                    <GoogleMark />
                    Sign in with Google
                  </span>
                </Button>

                <div className="grid gap-2 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                  <div className="inline-flex items-center gap-2 text-foreground">
                    <Globe className="size-4" />
                    Designed for a global student flow
                  </div>
                  <div>Fast access to interview practice, dashboard progress, and results history.</div>
                </div>
              </div>
            </CardHeader>

            <div className="border-t bg-muted/20 p-6 sm:p-8">
              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>Need to explore first?</span>
                <Button asChild variant="ghost" className="rounded-xl px-2 text-sm">
                  <Link href="/" className="inline-flex items-center gap-2">
                    Back to home
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}