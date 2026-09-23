# 🐧 ToolboxSuite

🔗 **Live:** https://mattialicciardi.github.io/ToolboxSuite/

Raccolta di strumenti web per velocizzare il lavoro quotidiano.
Tutto gira nel browser — nessun backend, nessun dato inviato a server.

Stack: **Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS v4 · [shadcn/ui](https://ui.shadcn.com)**, con tema chiaro/scuro.

---

## Strumenti disponibili

### 📄 Fatture XML → Tabella (`/fatture-xml`)

Parser per fatture elettroniche italiane in formato **FatturaPA** (standard Agenzia delle Entrate).

- Incolla XML, trascina file o carica con il selettore file (`.xml`, `.p7m`)
- Supporta più fatture in un unico blocco XML (multi-fattura e multi-body)
- **24 campi** estraibili, raggruppati per area (Anagrafica, Documento, Pagamento, Importi, Recapiti)
- 5 colonne attive di default, le altre si attivano dal menu **Colonne**
- **Riordino colonne** trascinando le intestazioni
- **Ordinamento** per colonna, tipizzato: testo, data, valuta
- **Filtri per colonna**: tag multipli sul testo, intervallo su date e importi
- **Esporta** in `.xlsx` o `.csv`, oppure **copia** la tabella (tab-separata, incollabile in Excel/Sheets)
- Export e copia rispettano colonne visibili e filtri attivi
- Elaborazione 100% client-side

**Campi estratti** (✓ = attivo di default):

| Campo | Gruppo | Default |
|-------|--------|---------|
| Denominazione Sociale | Anagrafica | ✓ |
| Partita IVA | Anagrafica | |
| Codice Fiscale | Anagrafica | |
| Numero Fattura | Documento | ✓ |
| Data Fattura | Documento | |
| Tipo Documento | Documento | |
| Divisa | Documento | |
| Causale | Documento | |
| Data Scadenza | Pagamento | ✓ |
| IBAN | Pagamento | ✓ |
| Modalità Pagamento | Pagamento | |
| Condizioni Pagamento | Pagamento | |
| Importo Pagamento | Pagamento | |
| Importo Fattura (totale) | Importi | ✓ |
| Imponibile | Importi | |
| IVA (Imposta) | Importi | |
| Aliquota IVA | Importi | |
| Codice Destinatario | Recapiti | |
| PEC Destinatario | Recapiti | |
| Indirizzo Sede | Recapiti | |
| CAP | Recapiti | |
| Comune | Recapiti | |
| Provincia | Recapiti | |
| Nazione | Recapiti | |

---

## Sviluppo locale

```bash
npm install
npm run dev     # http://localhost:3000
```

Build statico (come in produzione):

```bash
NEXT_PUBLIC_BASE_PATH=/ToolboxSuite npm run build   # genera ./out
```

In locale, senza `NEXT_PUBLIC_BASE_PATH`, il sito viene servito dalla root.

---

## Struttura del progetto

```
src/
├── app/
│   ├── layout.tsx             # shell: header, footer, tema, toaster
│   ├── page.tsx               # landing con l'elenco dei tool
│   └── fatture-xml/page.tsx   # pagina dello strumento
├── components/
│   ├── invoice/               # workspace, tabella, toolbar, filtri, dropzone
│   ├── ui/                    # componenti shadcn/ui
│   ├── site-chrome.tsx        # header e footer
│   └── theme-*.tsx            # provider e toggle chiaro/scuro
└── lib/
    ├── fattura-pa.ts          # campi, estrazione XML, formattazione
    ├── invoice-export.ts      # export xlsx/csv e copia negli appunti
    ├── use-invoice-table.ts   # stato: colonne, ordinamento, filtri
    └── tools.ts               # registro degli strumenti
```

Per aggiungere un tool: crea la pagina sotto `src/app/<slug>/` e registrala in `src/lib/tools.ts`.

---

## Deploy

Push su `main` → GitHub Actions (`.github/workflows/deploy.yml`) esegue il build statico
e pubblica `out/` su GitHub Pages. Su GitHub: **Settings → Pages → Source: GitHub Actions**.

La vecchia URL `invoice-xml.html` reindirizza a `/fatture-xml/`.

---

## Privacy

Tutti i dati vengono elaborati nel browser dell'utente. Nessun dato viene inviato a server esterni.
Non sono presenti cookie, analytics o tracciamento. L'unica preferenza salvata in locale è il tema.

---

## Licenza

MIT — vedi [LICENSE](LICENSE)

---

## Autore

**Mattia Licciardi** · [LinkedIn](https://www.linkedin.com/in/licciardimattia/)
