import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { InvoiceWorkspace } from "@/components/invoice/invoice-workspace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Fatture XML → Tabella",
  description:
    "Parser per fatture elettroniche FatturaPA: incolla o carica gli XML e ottieni una tabella filtrabile, ordinabile ed esportabile in Excel o CSV. Tutto nel browser.",
};

export default function FattureXmlPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground -ml-2 mb-4">
        <Link href="/">
          <ChevronLeft className="size-4" />
          ToolboxSuite
        </Link>
      </Button>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Fatture XML → Tabella</h1>
          <Badge variant="outline">FatturaPA</Badge>
        </div>
        <p className="text-muted-foreground mt-2 max-w-2xl text-sm">
          Incolla uno o più XML di fatture elettroniche, scegli le colonne, filtra e ordina, poi
          esporta in Excel o CSV. Le colonne si riordinano trascinando le intestazioni.
        </p>
      </div>

      <InvoiceWorkspace />
    </div>
  );
}
