import Link from "next/link";
import { ArrowRight, Lock, Zap } from "lucide-react";

import { GithubIcon } from "@/components/brand-icons";
import { AsciiLogo } from "@/components/ascii-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TOOLS } from "@/lib/tools";

const PILLARS = [
  {
    icon: Lock,
    title: "Nessun dato in uscita",
    body: "Parsing ed export avvengono nel browser. Nessun upload, nessun cookie, nessun analytics.",
  },
  {
    icon: Zap,
    title: "Zero attesa",
    body: "Niente coda server: incolli il file e la tabella è già pronta per Excel o Sheets.",
  },
  {
    icon: GithubIcon,
    title: "Codice aperto",
    body: "Sorgente pubblico su GitHub, licenza MIT: ispezionabile e riutilizzabile.",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <AsciiLogo className="hidden pt-8 sm:block" />

      <section className="border-b py-10 sm:py-14">
        <Badge variant="secondary" className="mb-4">
          Open source · MIT
        </Badge>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Strumenti che fanno una cosa sola, e la fanno nel tuo browser.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">
          Utility per il lavoro quotidiano, senza registrazione e senza backend. I tuoi file
          restano sul tuo computer.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={TOOLS[0].href}>
              Apri {TOOLS[0].title}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/Mattialicciardi/ToolboxSuite"
              target="_blank"
              rel="noreferrer"
            >
              Vedi il codice
            </a>
          </Button>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <h2 className="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase">
          Strumenti
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Card key={tool.slug} className="group hover:border-foreground/20 transition-colors">
              <CardHeader>
                <div className="bg-muted text-foreground mb-3 flex size-9 items-center justify-center rounded-md border">
                  <tool.icon className="size-4" />
                </div>
                <CardTitle className="text-base">{tool.title}</CardTitle>
                <CardAction>
                  <Badge variant="outline" className="text-[0.7rem]">
                    {tool.tagline}
                  </Badge>
                </CardAction>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex-wrap gap-2">
                {tool.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[0.7rem] font-normal">
                    {tag}
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-muted-foreground group-hover:text-foreground ml-auto"
                >
                  <Link href={tool.href}>
                    Apri
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-6 border-t py-10 sm:grid-cols-3 sm:py-14">
        {PILLARS.map((p) => (
          <div key={p.title} className="flex gap-3">
            <p.icon className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-sm font-medium">{p.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{p.body}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
