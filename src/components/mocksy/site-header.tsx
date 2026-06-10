"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Moon, Sun } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import { BrandMark } from "@/components/mocksy/brand-mark";
import { ThemeToggle } from "@/components/mocksy/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PRIMARY_NAV, isNavActive } from "@/lib/mocksy/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isSessionLoading = status === "loading";
  const user = session?.user;
  const { theme, setTheme } = useTheme();
  const userInitials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-10 rounded-xl" aria-label="Open navigation menu">
                  <Menu className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 sm:w-56 rounded-2xl p-2 max-h-[75vh] overflow-y-auto">
                <DropdownMenuLabel>Navigate</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PRIMARY_NAV.map((item) => (
                  <DropdownMenuItem key={item.href} asChild className="rounded-xl px-3 py-2">
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-xl px-3 py-2"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 rounded-xl px-1 py-1">
            <BrandMark className="size-8 rounded-lg" />
            <span className="text-sm font-semibold tracking-tight">Mocksy</span>
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {PRIMARY_NAV.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className={cn(
                "rounded-xl",
                isNavActive(pathname, item.href, item.startsWith)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user && (
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="size-10 rounded-xl" disabled={isSessionLoading} aria-label={isSessionLoading ? "Checking session" : "Open user menu"}>
                    {isSessionLoading ? (
                      <div className="flex size-8 items-center justify-center">
                        <svg className="animate-spin text-muted-foreground" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted">
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
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-48 sm:w-56 rounded-2xl p-2 max-h-[75vh] overflow-y-auto">
                  <DropdownMenuLabel className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 py-2 text-xs sm:text-sm font-normal text-foreground">
                    <div className="flex size-8 sm:size-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name ?? "User avatar"}
                          width={36}
                          height={36}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold">{userInitials ?? "U"}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs sm:text-sm font-medium">{user.name ?? "Signed in user"}</div>
                      <div className="truncate text-xs text-muted-foreground">{user.email ?? "Google account"}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="rounded-xl px-3 py-2"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {!user && (
            isSessionLoading ? (
              <Button variant="outline" size="icon" className="md:hidden rounded-xl size-10" aria-label="Checking session" disabled>
                <svg className="animate-spin text-muted-foreground" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
              </Button>
            ) : (
              <Button asChild className="md:hidden rounded-xl">
                <Link href="/login">Sign in</Link>
              </Button>
            )
          )}
          <ThemeToggle className="hidden md:inline-flex" />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden h-11 rounded-xl px-3 md:inline-flex" disabled={isSessionLoading} aria-label={isSessionLoading ? "Checking session" : "Open user menu"}>
                  {isSessionLoading ? (
                    <div className="inline-flex items-center gap-3">
                      <svg className="animate-spin text-muted-foreground" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                      <span className="text-sm text-muted-foreground">Checking…</span>
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-muted">
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
                      <span className="flex max-w-40 flex-col items-start leading-tight">
                        <span className="truncate text-sm font-semibold text-foreground">{user.name ?? "Signed in"}</span>
                        <span className="truncate text-xs text-muted-foreground">Google account</span>
                      </span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56 sm:w-64 rounded-2xl p-2 max-h-[80vh] overflow-y-auto">
                <DropdownMenuLabel className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-normal text-foreground">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? "User avatar"}
                        width={40}
                        height={40}
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold">{userInitials ?? "U"}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium">{user.name ?? "Signed in user"}</div>
                    <div className="truncate text-xs text-muted-foreground">{user.email ?? "Google account"}</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                  <Link href="/dashboard">
                    <LayoutDashboard className="mr-2 size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl px-3 py-2" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            isSessionLoading ? (
              <Button variant="outline" className="hidden h-11 rounded-xl px-3 md:inline-flex" disabled aria-label="Checking session">
                <div className="inline-flex items-center gap-2">
                  <svg className="animate-spin text-muted-foreground" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span className="text-sm text-muted-foreground">Checking…</span>
                </div>
              </Button>
            ) : (
              <Button asChild className="hidden rounded-xl md:inline-flex">
                <Link href="/login">Sign in</Link>
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
