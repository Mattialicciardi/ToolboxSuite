import * as XLSX from "xlsx";

import { FIELD_MAP, formatDate, type Invoice } from "@/lib/fattura-pa";

function timestamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Righe pronte per l'export: numeri restano numeri, date in formato italiano. */
function toRows(invoices: Invoice[], columns: string[]) {
  return invoices.map((inv) => {
    const row: Record<string, string | number> = {};
    for (const id of columns) {
      const field = FIELD_MAP[id];
      const value = inv[id] ?? "";
      if (!field) {
        row[id] = value;
      } else if (field.format === "currency" && value) {
        row[field.label] = parseFloat(value) || value;
      } else if (field.format === "date" && value) {
        row[field.label] = formatDate(value);
      } else {
        row[field.label] = value;
      }
    }
    return row;
  });
}

export function exportXLSX(invoices: Invoice[], columns: string[]) {
  const sheet = XLSX.utils.json_to_sheet(toRows(invoices, columns));
  sheet["!cols"] = columns.map(() => ({ wch: 22 }));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, "Fatture");
  XLSX.writeFile(book, `fatture_${timestamp()}.xlsx`);
}

export function exportCSV(invoices: Invoice[], columns: string[]) {
  const sheet = XLSX.utils.json_to_sheet(toRows(invoices, columns));
  const csv = XLSX.utils.sheet_to_csv(sheet, { FS: ";" });
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fatture_${timestamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Testo tab-separato: si incolla direttamente in Excel o Google Sheets. */
export function toClipboardText(invoices: Invoice[], columns: string[]): string {
  const header = columns.map((id) => FIELD_MAP[id]?.label ?? id).join("\t");
  const body = invoices.map((inv) => columns.map((id) => inv[id] ?? "").join("\t"));
  return [header, ...body].join("\n");
}
