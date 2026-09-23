"use client";

import { InvoiceTable } from "@/components/invoice/invoice-table";
import { InvoiceToolbar } from "@/components/invoice/invoice-toolbar";
import { XmlDropzone } from "@/components/invoice/xml-dropzone";
import { useInvoiceTable } from "@/lib/use-invoice-table";

export function InvoiceWorkspace() {
  const table = useInvoiceTable();

  return (
    <div className="grid gap-5">
      <XmlDropzone onSubmitText={table.addFromText} />

      <InvoiceToolbar
        rows={table.displayed}
        totalCount={table.invoices.length}
        columns={table.columns}
        activeFilterCount={table.activeFilterCount}
        onToggleColumn={table.toggleColumn}
        onResetColumns={table.resetColumns}
        onClearFilters={table.clearFilters}
        onClearAll={table.clearAll}
      />

      <InvoiceTable
        rows={table.displayed}
        columns={table.columns}
        sort={table.sort}
        filters={table.filters}
        totalCount={table.invoices.length}
        onSort={table.toggleSort}
        onMoveColumn={table.moveColumn}
        onFilterChange={table.setColumnFilter}
      />
    </div>
  );
}
