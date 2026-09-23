"use client";

import * as React from "react";
import {
  Columns3,
  Copy,
  Download,
  FileSpreadsheet,
  FileText,
  FilterX,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FIELD_GROUPS, FIELDS, type Invoice } from "@/lib/fattura-pa";
import { exportCSV, exportXLSX, toClipboardText } from "@/lib/invoice-export";

interface InvoiceToolbarProps {
  rows: Invoice[];
  totalCount: number;
  columns: string[];
  activeFilterCount: number;
  onToggleColumn: (id: string) => void;
  onResetColumns: () => void;
  onClearFilters: () => void;
  onClearAll: () => void;
}

export function InvoiceToolbar({
  rows,
  totalCount,
  columns,
  activeFilterCount,
  onToggleColumn,
  onResetColumns,
  onClearFilters,
  onClearAll,
}: InvoiceToolbarProps) {
  const hasRows = rows.length > 0;
  const filtered = rows.length !== totalCount;

  const guard = React.useCallback(
    (action: () => void) => () => {
      if (!hasRows) {
        toast.error("Nessuna fattura da esportare.");
        return;
      }
      action();
    },
    [hasRows],
  );

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(toClipboardText(rows, columns));
      toast.success("Tabella copiata.", { description: "Incollala in Excel o Google Sheets." });
    } catch {
      toast.error("Copia non riuscita.", { description: "Il browser ha negato l'accesso." });
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={!hasRows}>
            <Download className="size-4" />
            Esporta
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Colonne visibili, righe filtrate</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={guard(() => exportXLSX(rows, columns))}>
            <FileSpreadsheet className="size-4" />
            Excel (.xlsx)
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={guard(() => exportCSV(rows, columns))}>
            <FileText className="size-4" />
            CSV (.csv)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={guard(() => void copyToClipboard())}>
            <Copy className="size-4" />
            Copia negli appunti
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Columns3 className="size-4" />
            Colonne
            <Badge variant="secondary" className="ml-0.5 h-5 px-1.5 text-[0.7rem] font-normal">
              {columns.length}
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-h-96 w-60 overflow-y-auto">
          {FIELD_GROUPS.map((group, groupIndex) => {
            const fields = FIELDS.filter((f) => f.group === group);
            if (fields.length === 0) return null;
            return (
              <React.Fragment key={group}>
                {groupIndex > 0 && <DropdownMenuSeparator />}
                <DropdownMenuLabel className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
                  {group}
                </DropdownMenuLabel>
                {fields.map((field) => (
                  <DropdownMenuCheckboxItem
                    key={field.id}
                    checked={columns.includes(field.id)}
                    onCheckedChange={() => onToggleColumn(field.id)}
                    onSelect={(e) => e.preventDefault()}
                  >
                    {field.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </React.Fragment>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onResetColumns}>
            <RotateCcw className="size-4" />
            Ripristina predefinite
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <FilterX className="size-4" />
          Azzera {activeFilterCount} filtr{activeFilterCount === 1 ? "o" : "i"}
        </Button>
      )}

      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={totalCount === 0}
                aria-label="Svuota la tabella"
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Svuota la tabella</TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Svuotare la tabella?</AlertDialogTitle>
            <AlertDialogDescription>
              Le {totalCount} fatture caricate verranno rimosse. L&apos;operazione non è
              reversibile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={onClearAll}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Svuota
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <Badge variant={filtered ? "default" : "secondary"} className="font-normal">
        {filtered
          ? `${rows.length} di ${totalCount} fatture`
          : `${totalCount} fattur${totalCount === 1 ? "a" : "e"}`}
      </Badge>
    </div>
  );
}
