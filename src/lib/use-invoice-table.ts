"use client";

import * as React from "react";
import { toast } from "sonner";

import {
  DEFAULT_COLUMNS,
  FIELD_MAP,
  formatValue,
  parseInvoices,
  type Invoice,
} from "@/lib/fattura-pa";

export type TextFilter = { kind: "text"; tags: string[] };
export type RangeFilter = { kind: "range"; from: string; to: string };
export type ColumnFilter = TextFilter | RangeFilter;
export type FilterState = Record<string, ColumnFilter>;
export type SortState = { id: string | null; dir: "asc" | "desc" | null };

export function isFilterActive(filter: ColumnFilter | undefined): boolean {
  if (!filter) return false;
  if (filter.kind === "text") return filter.tags.length > 0;
  return Boolean(filter.from || filter.to);
}

function matchesFilter(invoice: Invoice, fieldId: string, filter: ColumnFilter): boolean {
  const field = FIELD_MAP[fieldId];
  const raw = invoice[fieldId] ?? "";

  if (filter.kind === "range" && field?.format === "date") {
    if ((filter.from || filter.to) && !raw) return false;
    if (filter.from && raw < filter.from) return false;
    if (filter.to && raw > filter.to) return false;
    return true;
  }

  if (filter.kind === "range") {
    const amount = parseFloat(raw) || 0;
    const min = parseFloat(filter.from);
    const max = parseFloat(filter.to);
    if (!Number.isNaN(min) && amount < min) return false;
    if (!Number.isNaN(max) && amount > max) return false;
    return true;
  }

  const lowerRaw = raw.toLowerCase();
  const lowerFormatted = formatValue(fieldId, raw).toLowerCase();
  return filter.tags.some((tag) => {
    const q = tag.toLowerCase();
    return lowerRaw.includes(q) || lowerFormatted.includes(q);
  });
}

export function useInvoiceTable() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([]);
  const [columns, setColumns] = React.useState<string[]>(DEFAULT_COLUMNS);
  const [sort, setSort] = React.useState<SortState>({ id: null, dir: null });
  const [filters, setFilters] = React.useState<FilterState>({});

  const displayed = React.useMemo(() => {
    const activeIds = Object.keys(filters).filter((id) => isFilterActive(filters[id]));
    let rows = invoices;

    if (activeIds.length > 0) {
      rows = rows.filter((inv) => activeIds.every((id) => matchesFilter(inv, id, filters[id])));
    }

    if (sort.id && sort.dir) {
      const { id, dir } = sort;
      const field = FIELD_MAP[id];
      rows = [...rows].sort((a, b) => {
        const av = a[id] ?? "";
        const bv = b[id] ?? "";
        let cmp: number;
        if (field?.format === "currency") cmp = (parseFloat(av) || 0) - (parseFloat(bv) || 0);
        else if (field?.format === "date") cmp = av.localeCompare(bv);
        else cmp = av.localeCompare(bv, "it", { numeric: true, sensitivity: "base" });
        return dir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [invoices, filters, sort]);

  const addFromText = React.useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast.error("Incolla prima un XML.");
      return 0;
    }
    const parsed = parseInvoices(trimmed);
    if (parsed.length === 0) {
      toast.error("Nessuna fattura trovata.", {
        description: "Verifica che l'XML sia in formato FatturaPA.",
      });
      return 0;
    }
    setInvoices((prev) => [...prev, ...parsed]);
    toast.success(
      parsed.length === 1 ? "1 fattura aggiunta." : `${parsed.length} fatture aggiunte.`,
    );
    return parsed.length;
  }, []);

  const toggleSort = React.useCallback((id: string) => {
    setSort((prev) => {
      if (prev.id !== id) return { id, dir: "asc" };
      if (prev.dir === "asc") return { id, dir: "desc" };
      return { id: null, dir: null };
    });
  }, []);

  const moveColumn = React.useCallback((from: number, to: number) => {
    setColumns((prev) => {
      if (from === to || from < 0 || to < 0 || from >= prev.length || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const toggleColumn = React.useCallback((id: string) => {
    setColumns((prev) => {
      if (!prev.includes(id)) return [...prev, id];
      if (prev.length <= 1) {
        toast.error("Deve restare almeno una colonna.");
        return prev;
      }
      return prev.filter((c) => c !== id);
    });
    setFilters((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setSort((prev) => (prev.id === id ? { id: null, dir: null } : prev));
  }, []);

  const setColumnFilter = React.useCallback((id: string, filter: ColumnFilter | null) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (!filter || !isFilterActive(filter)) delete next[id];
      else next[id] = filter;
      return next;
    });
  }, []);

  const resetColumns = React.useCallback(() => {
    setColumns(DEFAULT_COLUMNS);
    setFilters({});
    setSort({ id: null, dir: null });
  }, []);

  const clearAll = React.useCallback(() => {
    setInvoices([]);
    setFilters({});
    setSort({ id: null, dir: null });
    toast.success("Tabella svuotata.");
  }, []);

  const clearFilters = React.useCallback(() => setFilters({}), []);

  const activeFilterCount = Object.keys(filters).filter((id) => isFilterActive(filters[id])).length;

  return {
    invoices,
    displayed,
    columns,
    sort,
    filters,
    activeFilterCount,
    addFromText,
    toggleSort,
    moveColumn,
    toggleColumn,
    setColumnFilter,
    resetColumns,
    clearAll,
    clearFilters,
  };
}
