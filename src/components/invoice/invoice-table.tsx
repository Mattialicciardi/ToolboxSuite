"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, GripVertical } from "lucide-react";

import { ColumnFilterPopover } from "@/components/invoice/column-filter-popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EMPTY_LABEL, FIELD_MAP, formatValue, type Invoice } from "@/lib/fattura-pa";
import type { ColumnFilter, FilterState, SortState } from "@/lib/use-invoice-table";
import { cn } from "@/lib/utils";

interface InvoiceTableProps {
  rows: Invoice[];
  columns: string[];
  sort: SortState;
  filters: FilterState;
  totalCount: number;
  onSort: (id: string) => void;
  onMoveColumn: (from: number, to: number) => void;
  onFilterChange: (id: string, filter: ColumnFilter | null) => void;
}

export function InvoiceTable({
  rows,
  columns,
  sort,
  filters,
  totalCount,
  onSort,
  onMoveColumn,
  onFilterChange,
}: InvoiceTableProps) {
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);
  const [overIndex, setOverIndex] = React.useState<number | null>(null);
  // Un drop non deve essere interpretato anche come click sull'header (sort).
  const dragJustEnded = React.useRef(false);

  const emptyMessage =
    totalCount === 0
      ? "Nessuna fattura caricata. Incolla un XML o trascina i file qui sopra."
      : "Nessun risultato con i filtri attivi.";

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="max-h-[70vh] overflow-auto">
        <Table>
          <TableHeader className="bg-muted/60 sticky top-0 z-10 backdrop-blur-sm">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-muted-foreground w-12 text-right text-xs">#</TableHead>
              {columns.map((id, index) => {
                const field = FIELD_MAP[id];
                if (!field) return null;
                const isSorted = sort.id === id;
                return (
                  <TableHead
                    key={id}
                    draggable
                    onDragStart={(e) => {
                      setDragIndex(index);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", String(index));
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setOverIndex(index);
                    }}
                    onDragLeave={() => setOverIndex((cur) => (cur === index ? null : cur))}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (dragIndex !== null && dragIndex !== index) {
                        onMoveColumn(dragIndex, index);
                        dragJustEnded.current = true;
                        window.setTimeout(() => {
                          dragJustEnded.current = false;
                        }, 80);
                      }
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                    onDragEnd={() => {
                      setDragIndex(null);
                      setOverIndex(null);
                    }}
                    className={cn(
                      "group/th text-muted-foreground text-xs font-medium tracking-wide uppercase select-none",
                      dragIndex === index && "opacity-40",
                      overIndex === index && dragIndex !== index && "bg-primary/10",
                    )}
                  >
                    <div className="flex items-center gap-0.5">
                      <GripVertical className="text-muted-foreground/50 size-3.5 shrink-0 cursor-grab opacity-0 transition-opacity group-hover/th:opacity-100 active:cursor-grabbing" />
                      <button
                        type="button"
                        onClick={() => {
                          if (dragJustEnded.current) return;
                          onSort(id);
                        }}
                        className="hover:text-foreground flex items-center gap-1 whitespace-nowrap transition-colors"
                      >
                        {field.label}
                        {isSorted && sort.dir === "asc" ? (
                          <ArrowUp className="text-primary size-3" />
                        ) : isSorted && sort.dir === "desc" ? (
                          <ArrowDown className="text-primary size-3" />
                        ) : (
                          <ChevronsUpDown className="size-3 opacity-30" />
                        )}
                      </button>
                      <ColumnFilterPopover
                        field={field}
                        filter={filters[id]}
                        onChange={(filter) => onFilterChange(id, filter)}
                      />
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-muted-foreground h-40 text-center text-sm whitespace-normal"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((invoice, index) => (
                <TableRow key={`${invoice.numero}-${invoice.denominazione}-${index}`}>
                  <TableCell className="text-muted-foreground w-12 text-right font-mono text-xs">
                    {index + 1}
                  </TableCell>
                  {columns.map((id) => {
                    const field = FIELD_MAP[id];
                    const value = formatValue(id, invoice[id] ?? "");
                    return (
                      <TableCell
                        key={id}
                        className={cn(
                          "px-2 py-2.5",
                          field?.mono && "font-mono text-[0.8rem]",
                          field?.format === "currency" && "text-right tabular-nums",
                          value === EMPTY_LABEL && "text-muted-foreground/50",
                        )}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
