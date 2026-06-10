import React from "react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Contact Us</h1>

        <p className="mt-3 text-sm text-muted-foreground">
          For support or partnership inquiries, contact Tuhin directly at <strong>tuhinalmamun71m@gmail.com</strong>.
        </p>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-background p-4">
            <h3 className="text-sm font-semibold">Office Hours</h3>
            <p className="mt-2 text-xs text-muted-foreground">Mon–Fri, 9:00 — 17:00 UTC</p>
            <p className="mt-2 text-xs text-muted-foreground">We aim to respond within 48 hours.</p>
          </div>

          <div className="rounded-xl border bg-background p-4">
            <h3 className="text-sm font-semibold">Partnerships</h3>
            <p className="mt-2 text-xs text-muted-foreground">
              Interested in integrating Mocksy with your platform? Email our partnerships team and include
              a short description of your use case.
            </p>
          </div>
        </section>

        <div className="mt-6">
          <h3 className="text-sm font-semibold">Quick message</h3>
          <p className="mt-2 text-xs text-muted-foreground">(Demo) Send us an email using the address above.</p>
          <div className="mt-3 flex gap-3">
            <Link href="mailto:tuhinalmamun71m@gmail.com" className="inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Email Tuhin
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:underline">
            Back to Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted-foreground hover:underline">
            About Mocksy
          </Link>
        </div>
      </div>
    </div>
  );
}
