import { FileSpreadsheet, type LucideIcon } from "lucide-react";

export interface Tool {
  slug: string;
  href: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
  status: "stabile" | "beta";
}

export const TOOLS: Tool[] = [
  {
    slug: "fatture-xml",
    href: "/fatture-xml",
    title: "Fatture XML → Tabella",
    tagline: "Parser FatturaPA",
    description:
      "Incolla o carica XML di fatture elettroniche e ottieni una tabella filtrabile, ordinabile ed esportabile in Excel o CSV.",
    icon: FileSpreadsheet,
    tags: ["FatturaPA", "Excel", "CSV"],
    status: "stabile",
  },
];
