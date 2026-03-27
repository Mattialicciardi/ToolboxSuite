# 🐧 ToolboxSuite.work

Raccolta di strumenti web per velocizzare il lavoro quotidiano.
Tutto gira nel browser — nessun backend, nessun dato inviato a server.

---

## Strumenti disponibili

### 📄 Fatture XML → Tabella (`invoice-xml.html`)

Parser per fatture elettroniche italiane in formato **FatturaPA** (standard Agenzia delle Entrate).

**Funzionalità:**
- Incolla XML, trascina file o carica con il selettore file
- Supporta più fatture in un unico blocco XML (multi-fattura)
- Estrae e mostra i dati in tabella con **24 campi** disponibili
- 5 colonne attive di default, altre 19 attivabili con un click
- **Riordina le colonne** trascinando le intestazioni
- **Copia la tabella** negli appunti (formato tab-separato → incolla direttamente in Excel/Google Sheets)
- **Esporta in `.xlsx`** (Excel) o **`.csv`**
- Celle vuote mostrate come `vuoto`
- Elaborazione 100% client-side — i tuoi dati non lasciano mai il browser

**Campi estratti (default ✓):**

| Campo | Default |
|-------|---------|
| Denominazione Sociale | ✓ |
| Numero Fattura | ✓ |
| Importo Fattura (totale) | ✓ |
| Data Scadenza | ✓ |
| IBAN | ✓ |
| Partita IVA | |
| Codice Fiscale | |
| Data Fattura | |
| Tipo Documento | |
| Divisa | |
| Causale | |
| Modalità Pagamento | |
| Condizioni Pagamento | |
| Importo Pagamento | |
| Codice Destinatario | |
| PEC Destinatario | |
| Indirizzo Sede | |
| CAP | |
| Comune | |
| Provincia | |
| Nazione | |
| Imponibile | |
| IVA (Imposta) | |
| Aliquota IVA | |

---

## Struttura del progetto

```
ToolboxSuite/
├── index.html          # Landing page – ToolboxSuite.work
├── invoice-xml.html    # Strumento: parser fatture XML FatturaPA
├── README.md           # Questo file
└── LICENSE             # Licenza MIT
```

---

## Utilizzo locale

Nessuna dipendenza da installare. Apri direttamente nel browser:

```bash
open index.html
# oppure
open invoice-xml.html
```

Le uniche dipendenze esterne sono caricate via CDN:
- [Inter](https://fonts.google.com/specimen/Inter) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Google Fonts
- [SheetJS (xlsx 0.20.3)](https://sheetjs.com/) — export Excel/CSV

---

## Formato supportato

**FatturaPA** — il formato XML standard italiano per la fatturazione elettronica obbligatoria (B2B e PA), definito dall'Agenzia delle Entrate.

Il parser usa `localName` matching per gestire in modo robusto le varianti di namespace presenti nei file reali.

---

## Privacy

Tutti i dati vengono elaborati interamente nel browser dell'utente. Nessun dato viene inviato a server esterni. Non sono presenti cookie, analytics o tracciamento.

---

## Licenza

MIT — vedi [LICENSE](LICENSE)

---

## Autore

**Mattia Licciardi** · [LinkedIn](https://www.linkedin.com/in/MattiaLicciardi)
