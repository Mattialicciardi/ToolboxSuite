"use client";

import * as React from "react";
import { Filter, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { InvoiceField } from "@/lib/fattura-pa";
import { isFilterActive, type ColumnFilter } from "@/lib/use-invoice-table";

interface ColumnFilterPopoverProps {
  field: InvoiceField;
  filter: ColumnFilter | undefined;
  onChange: (filter: ColumnFilter | null) => void;
}

export function ColumnFilterPopover({ field, filter, onChange }: ColumnFilterPopoverProps) {
  const [draft, setDraft] = React.useState("");
  const fromId = React.useId();
  const toId = React.useId();
  const isRange = field.format === "date" || field.format === "currency";
  const active = isFilterActive(filter);

  const tags = filter?.kind === "text" ? filter.tags : [];
  const from = filter?.kind === "range" ? filter.from : "";
  const to = filter?.kind === "range" ? filter.to : "";

  function addTag() {
    const value = draft.trim();
    if (!value) return;
    if (tags.includes(value)) {
      setDraft("");
      return;
    }
    onChange({ kind: "text", tags: [...tags, value] });
    setDraft("");
  }

  function removeTag(tag: string) {
    const next = tags.filter((t) => t !== tag);
    onChange(next.length ? { kind: "text", tags: next } : null);
  }

  function updateRange(key: "from" | "to", value: string) {
    const next: ColumnFilter = { kind: "range", from, to, [key]: value } as ColumnFilter;
    onChange(next);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Filtra per ${field.label}`}
          className={cn(
            "size-6 shrink-0 transition-opacity",
            active
              ? "text-primary opacity-100"
              : "opacity-0 group-hover/th:opacity-60 focus-visible:opacity-100 data-[state=open]:opacity-100",
          )}
        >
          <Filter className={cn("size-3.5", active && "fill-current")} />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-[0.7rem] font-medium tracking-wider uppercase">
            Filtra
          </p>
          {active && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-xs"
              onClick={() => onChange(null)}
            >
              Azzera
            </Button>
          )}
        </div>
        <p className="mb-2.5 truncate text-sm font-medium">{field.label}</p>
        <Separator className="mb-3" />

        {isRange ? (
          <div className="grid gap-2">
            <div className="grid gap-1.5">
              <Label htmlFor={fromId} className="text-muted-foreground text-xs">
                {field.format === "date" ? "Da" : "Minimo €"}
              </Label>
              <Input
                id={fromId}
                type={field.format === "date" ? "date" : "number"}
                step={field.format === "currency" ? "0.01" : undefined}
                min={field.format === "currency" ? "0" : undefined}
                value={from}
                onChange={(e) => updateRange("from", e.target.value)}
                className="h-8"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor={toId} className="text-muted-foreground text-xs">
                {field.format === "date" ? "A" : "Massimo €"}
              </Label>
              <Input
                id={toId}
                type={field.format === "date" ? "date" : "number"}
                step={field.format === "currency" ? "0.01" : undefined}
                min={field.format === "currency" ? "0" : undefined}
                value={to}
                onChange={(e) => updateRange("to", e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        ) : (
          <>
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              placeholder="Digita e premi Invio…"
              className="h-8"
              autoComplete="off"
            />
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1 font-normal">
                    <span className="max-w-32 truncate">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      aria-label={`Rimuovi ${tag}`}
                      className="hover:text-foreground text-muted-foreground"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-muted-foreground mt-2 text-xs">
              Più valori = corrispondenza su almeno uno.
            </p>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
