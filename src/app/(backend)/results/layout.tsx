import { SiteHeader } from "@/components/mocksy/site-header";
import { SiteFooter } from "@/components/mocksy/site-footer";

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
