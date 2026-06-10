import Link from "next/link";
import { BrandMark } from "@/components/mocksy/brand-mark";

function GithubLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.5v-1.77c-2.78.62-3.37-1.37-3.37-1.37-.46-1.2-1.12-1.52-1.12-1.52-.92-.64.07-.63.07-.63 1.02.07 1.56 1.08 1.56 1.08.9 1.58 2.37 1.13 2.95.86.09-.67.35-1.13.63-1.39-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.26 9.26 0 0 1 12 6.84c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.42.2 2.46.1 2.72.64.72 1.02 1.64 1.02 2.76 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9v2.82c0 .28.18.61.69.5A10.26 10.26 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="#0A66C2" />
      <path
        fill="#ffffff"
        d="M7.1 10.07H5.2V17h1.9v-6.93Zm-.95-1.02a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm12.22 8.95h-1.9v-3.79c0-1.06-.39-1.78-1.34-1.78-.73 0-1.16.49-1.35.96-.07.17-.08.41-.08.65V17h-1.9v-6.93h1.9v.96c.27-.47.87-1.13 2.12-1.13 1.55 0 2.55 1.02 2.55 3.22V17Zm-8.65 0h-1.9V10.07h1.9V17Z"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-linear-to-b from-background to-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BrandMark className="size-6" />
                <div className="font-semibold text-base tracking-tight">Mocksy</div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                Practice realistic Pre-CAS and UKVI-style interviews with a modern, calm experience.
              </p>
            </div>
            <div className="text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} Mocksy. All rights reserved.</div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-sm mb-2">Quick Links</div>
            <nav className="flex flex-col gap-2">
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/">
                Home
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/interview">
                Interview
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/about">
                About
              </Link>
              <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/contact">
                Contact
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col gap-3">
            <div className="font-medium text-sm mb-2">Connect</div>
            <div className="flex items-center gap-3">
              <a
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-foreground transition-all hover:bg-muted hover:border-border/80 hover:scale-110"
                href="https://github.com/tuhin9w"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                title="GitHub profile"
              >
                <GithubLogo className="size-5" />
              </a>
              <a
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-foreground transition-all hover:border-[#0A66C2]/50 hover:bg-muted hover:scale-110"
                href="https://www.linkedin.com/in/tuhin92/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                title="LinkedIn profile"
              >
                <LinkedinLogo className="size-5" />
              </a>
            </div>
            <Link
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              href="/profile"
            >
              Profile
            </Link>
          </div>
        </div>

        {/* Bottom Divider */}
        <div className="mt-8 pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>Built with ❤️ for practice and improvement</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
