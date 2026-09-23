import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function SiteHeader() {
  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span aria-hidden className="text-lg leading-none">
            🐧
          </span>
          ToolboxSuite
        </Link>

        <span className="text-muted-foreground ml-auto hidden items-center gap-1.5 text-xs sm:flex">
          <ShieldCheck className="size-3.5" />
          100% nel browser
        </span>

        <Separator orientation="vertical" className="mx-1 hidden h-5 sm:block" />

        <Button variant="ghost" size="icon" asChild aria-label="Repository GitHub">
          <a
            href="https://github.com/Mattialicciardi/ToolboxSuite"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="size-4" />
          </a>
        </Button>
        <Button variant="ghost" size="icon" asChild aria-label="Profilo LinkedIn">
          <a href="https://www.linkedin.com/in/licciardimattia/" target="_blank" rel="noreferrer">
            <LinkedinIcon className="size-4" />
          </a>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Tutti gli strumenti girano nel browser. Nessun dato viene inviato a server esterni.</p>
        <a
          href="https://www.linkedin.com/in/licciardimattia/"
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground transition-colors"
        >
          @MattiaLicciardi
        </a>
      </div>
    </footer>
  );
}
