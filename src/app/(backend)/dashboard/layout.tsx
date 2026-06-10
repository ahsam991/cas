"use client";

import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, HelpCircle, Menu, X, LogOut, UserCircle2, ChevronDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandMark } from "@/components/mocksy/brand-mark";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userInitials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin text-primary"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const sidebarItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: Users,
      exact: false,
    },
    {
      href: "/dashboard/question",
      label: "Question",
      icon: HelpCircle,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r bg-muted/95 shadow-lg shadow-black/10 lg:bg-muted/30 transition-transform duration-300 lg:static lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="size-5" />
            </button>
            <BrandMark className="size-8" />
            <h1 className="whitespace-nowrap text-base font-bold leading-none sm:text-lg">Admin Panel</h1>
          </div>
        </div>

        <nav className="space-y-2 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t p-4 space-y-3">
          <Button asChild variant="outline" className="w-full justify-start rounded-xl">
            <Link href="/" onClick={() => setSidebarOpen(false)}>
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto w-full justify-start gap-3 rounded-2xl px-3 py-3 text-left hover:bg-muted/80">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-background ring-1 ring-border">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? "User avatar"}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">{userInitials ?? "U"}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">{user.name ?? "Signed in user"}</div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{user.email ?? "Account"}</span>
                      <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground ring-1 ring-border">
                        {userRole}
                      </span>
                    </div>
                  </div>

                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" sideOffset={8} className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-normal text-foreground">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? "User avatar"}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">{userInitials ?? "U"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{user.name ?? "Signed in user"}</div>
                    <div className="truncate text-xs text-muted-foreground">{user.email ?? "Account"}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                  <Link href="/profile">
                    <UserCircle2 className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl px-3 py-2" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/95 backdrop-blur px-6 lg:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="whitespace-nowrap text-sm font-semibold leading-none">Admin Panel</h1>
          </div>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 rounded-full px-2.5 hover:bg-muted/70" aria-label="Open account menu">
                  <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted ring-1 ring-border">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? "User avatar"}
                        width={32}
                        height={32}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">{userInitials ?? "U"}</span>
                    )}
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-2xl p-2">
                <DropdownMenuLabel className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-normal text-foreground">
                  <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? "User avatar"}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">{userInitials ?? "U"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{user.name ?? "Signed in user"}</div>
                    <div className="truncate text-xs text-muted-foreground">{user.email ?? "Account"}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                  <Link href="/profile">
                    <UserCircle2 className="mr-2 size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl px-3 py-2" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
