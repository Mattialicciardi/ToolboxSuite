#!/usr/bin/env python3
"""Converte una foto in arte ASCII, per l'illustrazione dell'hero.

Uso:
    python3 scripts/foto2ascii.py immagine.png [colonne...]

Stampa una variante per ogni larghezza richiesta (default 56, 70, 84), pronta
da incollare in src/components/ascii-penguin.tsx.

Richiede Pillow:  pip install Pillow

---------------------------------------------------------------------------
Perché il codice è fatto così (lezioni pagate a caro prezzo):

1. SAGOMA con flood fill dai bordi sui pixel chiari e neutri.
   Funziona bene con soggetti dal contorno scuro CHIUSO su fondo chiaro
   uniforme: il riempimento non tracima all'interno. Su una foto naturalistica
   (pinguino vero sulla neve) NON funziona, perché sfondo e ventre bianco si
   toccano e il ventre sparisce: lì serve separare per CALORE del colore
   (r - b), dato che la neve è neutra e il soggetto è caldo.

2. DUE REGIMI DI DENSITÀ, non una gamma sola. Le zone scure (dorso, testa, ali)
   usano la parte densa della rampa; le zone chiare (pancia) un tono leggero.
   Con un'unica curva, o si annega la pancia nel nero o si svuota la testa.

3. OCCHI E BECCO SCAVATI A PARTE. Sono isole chiare dentro una massa scura: il
   flood fill non le raggiunge e la rampa tonale le appiattisce. Sono il
   dettaglio che rende il soggetto riconoscibile, quindi vanno forzati.

4. NIENTE SMOOTHING nel ridimensionamento: cancella proprio occhi e becco.

5. SERVE RISOLUZIONE: sotto ~50 colonne un volto non si legge più.

6. Le celle monospace sono alte circa il doppio della loro larghezza: le righe
   vanno dimezzate, altrimenti il soggetto esce schiacciato.
---------------------------------------------------------------------------
"""

from __future__ import annotations

import sys
from collections import deque

try:
    from PIL import Image
except ImportError:  # pragma: no cover
    sys.exit("Serve Pillow:  pip install Pillow")

RAMPA = " .:-=+*#%@"  # dal vuoto al pieno


def celle(src: str, cols: int):
    """Riduce l'immagine a celle di testo: (luminanza, calore) per cella.

    Niente filtro di smoothing: appiattisce i dettagli piccoli (occhi, becco).
    """
    im = Image.open(src).convert("RGB")
    w, h = im.size
    rows = max(1, round(cols * (h / w) / 2))  # la cella è alta ~2x la larghezza
    px = im.resize((cols, rows), Image.LANCZOS).load()
    dati = [
        [
            (
                (px[x, y][0] * 299 + px[x, y][1] * 587 + px[x, y][2] * 114) // 1000,
                px[x, y][0] - px[x, y][2],
            )
            for x in range(cols)
        ]
        for y in range(rows)
    ]
    return dati, cols, rows


def trova_sfondo(dati, cols, rows, lum_min=150, calore_max=28):
    """Flood fill dai bordi: True dove c'è sfondo."""
    sfondo = [[False] * cols for _ in range(rows)]
    coda: deque = deque()

    def semina(y: int, x: int) -> None:
        if not sfondo[y][x] and dati[y][x][0] >= lum_min and dati[y][x][1] <= calore_max:
            sfondo[y][x] = True
            coda.append((y, x))

    for x in range(cols):
        semina(0, x)
        semina(rows - 1, x)
    for y in range(rows):
        semina(y, 0)
        semina(y, cols - 1)

    while coda:
        y, x = coda.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < rows and 0 <= nx < cols:
                semina(ny, nx)
    return sfondo


def rendi(src: str, cols: int = 70, soglia_pancia: int = 150) -> str:
    dati, cols, rows = celle(src, cols)
    sfondo = trova_sfondo(dati, cols, rows)

    scuri = [
        dati[y][x][0]
        for y in range(rows)
        for x in range(cols)
        if not sfondo[y][x] and dati[y][x][0] < soglia_pancia
    ]
    if not scuri:
        sys.exit("Nessuna zona scura trovata: soggetto e sfondo non sono separabili così.")
    lo, hi = min(scuri), max(scuri)

    griglia = []
    for y in range(rows):
        riga = []
        for x in range(cols):
            if sfondo[y][x]:
                riga.append(" ")
                continue
            lum = dati[y][x][0]
            if lum < soglia_pancia:  # dorso, testa, ali: densi
                t = (lum - lo) / max(1, hi - lo)
                riga.append(RAMPA[4 + int((1 - t) * 5)])
            else:  # pancia: leggera
                riga.append(".")
        griglia.append(riga)

    # Occhi e becco: isole chiare/calde dentro la massa scura.
    for y in range(rows):
        for x in range(cols):
            if sfondo[y][x]:
                continue
            lum, calore = dati[y][x]
            vicini = [
                dati[y + dy][x + dx][0]
                for dy in (-1, 0, 1)
                for dx in (-1, 0, 1)
                if (dy or dx)
                and 0 <= y + dy < rows
                and 0 <= x + dx < cols
                and not sfondo[y + dy][x + dx]
            ]
            if not vicini:
                continue
            media = sum(vicini) / len(vicini)
            if lum > media + 45 and 110 < lum < soglia_pancia:
                griglia[y][x] = "o"  # occhio
            elif calore > 80:
                griglia[y][x] = "-"  # becco, piedi

    righe = ["".join(r).rstrip() for r in griglia]
    while righe and not righe[0].strip():
        righe.pop(0)
    while righe and not righe[-1].strip():
        righe.pop()
    margine = min((len(r) - len(r.lstrip()) for r in righe if r.strip()), default=0)
    return "\n".join(r[margine:] for r in righe)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sorgente = sys.argv[1]
    larghezze = [int(a) for a in sys.argv[2:]] or [56, 70, 84]
    for larghezza in larghezze:
        print(f"{'=' * 60}\n{larghezza} colonne\n{'=' * 60}")
        print(rendi(sorgente, larghezza))
