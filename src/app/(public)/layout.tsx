import { SiteFooter } from "@/components/mocksy/site-footer";
import { SiteHeader } from "@/components/mocksy/site-header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
