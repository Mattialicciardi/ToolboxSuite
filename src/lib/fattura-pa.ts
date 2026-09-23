// Dominio FatturaPA: definizione campi + estrazione, portata dal tool vanilla.
// Tutto client-side: nessun dato lascia il browser.

export type FieldFormat = "text" | "currency" | "date";

export type FieldGroup = "Anagrafica" | "Documento" | "Pagamento" | "Importi" | "Recapiti";

export interface InvoiceField {
  id: string;
  label: string;
  group: FieldGroup;
  mono: boolean;
  defaultOn: boolean;
  format: FieldFormat;
  extract: (doc: Element | Document, body: Element | null) => string;
}

export type Invoice = Record<string, string>;

/* ----------------------------- XML helpers ----------------------------- */

function getTagText(el: Element | Document, tag: string): string {
  const nodes = el.getElementsByTagName("*");
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].localName === tag) return (nodes[i].textContent || "").trim();
  }
  return "";
}

function getAllByLocalName(el: Element | Document, tag: string): Element[] {
  const out: Element[] = [];
  const nodes = el.getElementsByTagName("*");
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].localName === tag) out.push(nodes[i]);
  }
  return out;
}

function sumRiepilogo(scope: Element | Document, tag: string): string {
  const rows = getAllByLocalName(scope, "DatiRiepilogo");
  let total = 0;
  let found = false;
  for (const row of rows) {
    total += parseFloat(getTagText(row, tag) || "0");
    found = true;
  }
  return found ? total.toFixed(2) : "";
}

function imponibilePiuIva(scope: Element | Document): string {
  const rows = getAllByLocalName(scope, "DatiRiepilogo");
  let total = 0;
  let found = false;
  for (const row of rows) {
    total +=
      parseFloat(getTagText(row, "ImponibileImporto") || "0") +
      parseFloat(getTagText(row, "Imposta") || "0");
    found = true;
  }
  return found ? total.toFixed(2) : "";
}

function cedente(doc: Element | Document): Element | null {
  return getAllByLocalName(doc, "CedentePrestatore")[0] ?? null;
}

function sede(doc: Element | Document): Element | null {
  const c = cedente(doc);
  if (!c) return null;
  return getAllByLocalName(c, "Sede")[0] ?? null;
}

function sedeField(doc: Element | Document, tag: string): string {
  const s = sede(doc);
  return s ? getTagText(s, tag) : "";
}

/* ------------------------------- FIELDS -------------------------------- */

export const FIELDS: InvoiceField[] = [
  {
    id: "denominazione",
    label: "Denominazione Sociale",
    group: "Anagrafica",
    mono: false,
    defaultOn: true,
    format: "text",
    extract: (doc) => {
      const c = cedente(doc);
      if (!c) return "";
      const d = getTagText(c, "Denominazione");
      if (d) return d;
      return [getTagText(c, "Nome"), getTagText(c, "Cognome")].filter(Boolean).join(" ");
    },
  },
  {
    id: "numero",
    label: "Numero Fattura",
    group: "Documento",
    mono: true,
    defaultOn: true,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "Numero"),
  },
  {
    id: "importo",
    label: "Importo Fattura",
    group: "Importi",
    mono: true,
    defaultOn: true,
    format: "currency",
    extract: (doc, body) => {
      const s = body || doc;
      return getTagText(s, "ImportoTotaleDocumento") || imponibilePiuIva(s);
    },
  },
  {
    id: "dataScadenza",
    label: "Data Scadenza",
    group: "Pagamento",
    mono: true,
    defaultOn: true,
    format: "date",
    extract: (doc, body) => getTagText(body || doc, "DataScadenzaPagamento"),
  },
  {
    id: "iban",
    label: "IBAN",
    group: "Pagamento",
    mono: true,
    defaultOn: true,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "IBAN"),
  },
  {
    id: "partitaIva",
    label: "Partita IVA",
    group: "Anagrafica",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc) => {
      const c = cedente(doc);
      return c ? getTagText(c, "IdCodice") : "";
    },
  },
  {
    id: "codiceFiscale",
    label: "Codice Fiscale",
    group: "Anagrafica",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc) => {
      const c = cedente(doc);
      return c ? getTagText(c, "CodiceFiscale") : "";
    },
  },
  {
    id: "dataFattura",
    label: "Data Fattura",
    group: "Documento",
    mono: true,
    defaultOn: false,
    format: "date",
    extract: (doc, body) => getTagText(body || doc, "Data"),
  },
  {
    id: "tipoDocumento",
    label: "Tipo Documento",
    group: "Documento",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "TipoDocumento"),
  },
  {
    id: "divisa",
    label: "Divisa",
    group: "Documento",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "Divisa"),
  },
  {
    id: "causale",
    label: "Causale",
    group: "Documento",
    mono: false,
    defaultOn: false,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "Causale"),
  },
  {
    id: "modalitaPagamento",
    label: "Modalità Pagamento",
    group: "Pagamento",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "ModalitaPagamento"),
  },
  {
    id: "condizioniPagamento",
    label: "Condizioni Pagamento",
    group: "Pagamento",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc, body) => getTagText(body || doc, "CondizioniPagamento"),
  },
  {
    id: "importoPagamento",
    label: "Importo Pagamento",
    group: "Pagamento",
    mono: true,
    defaultOn: false,
    format: "currency",
    extract: (doc, body) => getTagText(body || doc, "ImportoPagamento"),
  },
  {
    id: "codiceDestinatario",
    label: "Codice Destinatario",
    group: "Recapiti",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc) => getTagText(doc, "CodiceDestinatario"),
  },
  {
    id: "pecDestinatario",
    label: "PEC Destinatario",
    group: "Recapiti",
    mono: false,
    defaultOn: false,
    format: "text",
    extract: (doc) => getTagText(doc, "PECDestinatario"),
  },
  {
    id: "indirizzo",
    label: "Indirizzo Sede",
    group: "Recapiti",
    mono: false,
    defaultOn: false,
    format: "text",
    extract: (doc) =>
      [sedeField(doc, "Indirizzo"), sedeField(doc, "NumeroCivico")].filter(Boolean).join(" "),
  },
  {
    id: "cap",
    label: "CAP",
    group: "Recapiti",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc) => sedeField(doc, "CAP"),
  },
  {
    id: "comune",
    label: "Comune",
    group: "Recapiti",
    mono: false,
    defaultOn: false,
    format: "text",
    extract: (doc) => sedeField(doc, "Comune"),
  },
  {
    id: "provincia",
    label: "Provincia",
    group: "Recapiti",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc) => sedeField(doc, "Provincia"),
  },
  {
    id: "nazione",
    label: "Nazione",
    group: "Recapiti",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc) => sedeField(doc, "Nazione"),
  },
  {
    id: "imponibile",
    label: "Imponibile",
    group: "Importi",
    mono: true,
    defaultOn: false,
    format: "currency",
    extract: (doc, body) => sumRiepilogo(body || doc, "ImponibileImporto"),
  },
  {
    id: "imposta",
    label: "IVA (Imposta)",
    group: "Importi",
    mono: true,
    defaultOn: false,
    format: "currency",
    extract: (doc, body) => sumRiepilogo(body || doc, "Imposta"),
  },
  {
    id: "aliquotaIva",
    label: "Aliquota IVA",
    group: "Importi",
    mono: true,
    defaultOn: false,
    format: "text",
    extract: (doc, body) => {
      const r = getAllByLocalName(body || doc, "DatiRiepilogo")[0];
      return r ? getTagText(r, "AliquotaIVA") : "";
    },
  },
];

export const FIELD_MAP: Record<string, InvoiceField> = Object.fromEntries(
  FIELDS.map((f) => [f.id, f]),
);

export const DEFAULT_COLUMNS = FIELDS.filter((f) => f.defaultOn).map((f) => f.id);

export const FIELD_GROUPS: FieldGroup[] = [
  "Anagrafica",
  "Documento",
  "Pagamento",
  "Importi",
  "Recapiti",
];

/* ------------------------------ FORMATTING ----------------------------- */

export const EMPTY_LABEL = "—";

export function formatDate(value: string): string {
  if (!value) return EMPTY_LABEL;
  const parts = value.split("T")[0].split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
}

// it-IT ometterebbe il punto sotto le 5 cifre (minimumGroupingDigits: 2):
// in una colonna di importi il separatore è sempre preferibile.
const CURRENCY_FORMAT = new Intl.NumberFormat("it-IT", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: "always",
});

export function formatCurrency(value: string): string {
  if (!value) return EMPTY_LABEL;
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value;
  return `${CURRENCY_FORMAT.format(n)} €`;
}

export function formatValue(fieldId: string, raw: string): string {
  if (!raw) return EMPTY_LABEL;
  const f = FIELD_MAP[fieldId];
  if (!f) return raw;
  if (f.format === "currency") return formatCurrency(raw);
  if (f.format === "date") return formatDate(raw);
  return raw;
}

/* ------------------------------- PARSING ------------------------------- */

/** Divide un blob di testo in più documenti XML (multi-fattura incollata). */
export function splitXMLs(text: string): string[] {
  const byDecl = text
    .split(/(?=<\?xml\s)/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (byDecl.length > 1) return byDecl;

  const byRoot = text
    .split(/(?=<(?:\w+:)?FatturaElettronica[\s>])/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (byRoot.length > 1) return byRoot;

  const trimmed = text.trim();
  return trimmed ? [trimmed] : [];
}

function parseOne(doc: Document, body: Element | null): Invoice {
  const inv: Invoice = {};
  for (const f of FIELDS) inv[f.id] = f.extract(doc, body) || "";
  return inv;
}

/** Estrae tutte le fatture presenti nel testo. Ignora i blocchi non validi. */
export function parseInvoices(text: string): Invoice[] {
  const out: Invoice[] = [];
  for (const chunk of splitXMLs(text)) {
    try {
      const doc = new DOMParser().parseFromString(chunk, "text/xml");
      if (doc.querySelector("parsererror")) continue;
      const bodies = getAllByLocalName(doc, "FatturaElettronicaBody");
      if (bodies.length <= 1) {
        const inv = parseOne(doc, bodies[0] ?? null);
        if (inv.numero || inv.denominazione) out.push(inv);
      } else {
        for (const body of bodies) out.push(parseOne(doc, body));
      }
    } catch {
      // blocco illeggibile: si salta, gli altri restano validi
    }
  }
  return out;
}
