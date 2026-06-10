import Link from "next/link";

const sections = [
  {
    title: "Information we collect",
    body:
      "Mocksy may collect basic account details, session activity, and feedback you enter while using the app. If you sign in, we may also store profile information provided by your login provider.",
  },
  {
    title: "How we use information",
    body:
      "We use this information to run your mock interview session, show progress, improve the product, and keep the app working reliably.",
  },
  {
    title: "Sharing",
    body:
      "We do not sell your personal information. We only share data with services needed to operate Mocksy or when required by law.",
  },
  {
    title: "Your choices",
    body:
      "You can stop using the app at any time. If you need help with your data, contact us and we will review your request.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
        <p className="text-sm font-medium text-muted-foreground">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          This is a simple privacy policy for Mocksy. It explains what we collect and how we use it in plain language.
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border bg-background p-4 sm:p-5">
              <h2 className="text-base font-semibold">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-muted/40 p-4 text-sm leading-7 text-muted-foreground">
          <p>
            If you have any privacy questions, please visit the <Link href="/contact" className="font-medium text-foreground underline-offset-4 hover:underline">Contact</Link> page.
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Link href="/" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
            Back to home
          </Link>
          <Link href="/terms" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            View terms
          </Link>
        </div>
      </div>
    </div>
  );
}