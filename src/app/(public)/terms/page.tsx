import Link from "next/link";

const terms = [
  {
    title: "Use of the service",
    body:
      "Mocksy is intended for interview practice and personal learning. You agree not to use it in ways that break the law or harm the service for others.",
  },
  {
    title: "Your account",
    body:
      "If you create an account or sign in with a provider, you are responsible for keeping that access secure and for any activity under your account.",
  },
  {
    title: "Content and feedback",
    body:
      "You keep ownership of the content you enter. We may process it to run sessions, generate results, and improve the experience.",
  },
  {
    title: "Service changes",
    body:
      "We may update or change Mocksy over time. We may also suspend access if needed to maintain security or reliability.",
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Terms and Conditions</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          These terms describe the basic rules for using Mocksy. Keep it simple: use the app responsibly and respect other users.
        </p>

        <div className="mt-8 space-y-4">
          {terms.map((term) => (
            <section key={term.title} className="rounded-2xl border bg-background p-4 sm:p-5">
              <h2 className="text-base font-semibold">{term.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{term.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
          <p>
            Questions about these terms? Reach out on the <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">Contact</Link> page.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
            Back to home
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            View privacy policy
          </Link>
        </div>
      </div>
    </div>
  );
}