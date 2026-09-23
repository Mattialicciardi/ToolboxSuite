// Tux in ASCII "denso": silhouette piena a blocchi, con pancia e viso lasciati
// VUOTI — è il contrasto pieno/vuoto a rendere riconoscibile il pinguino.
// Un riempimento tratteggiato (░) resterebbe dello stesso verde e leggerebbe
// come rumore, non come ventre chiaro.
// Decorativo, ancorato a destra sotto la barra social, fuori dal flusso
// (absolute) così non sposta nulla, nascosto sotto lg dove lo spazio serve al
// contenuto. Niente tracking: l'arte presuppone celle monospace non spaziate.
// Nessuna riga separata per il becco: a questa scala si fonde con gli occhi e
// legge come una "H".
const TUX = String.raw`
   ▄█████▄
  ███▀█▀███
  ████▄████
 ▄███▀ ▀███▄
████     ████
████     ████
████     ████
▀███▄   ▄███▀
 ▀████▄████▀
  ▄▀▀▀ ▀▀▀▄
`.replace(/^\n/, "");

export function AsciiPenguin() {
  return (
    <pre
      aria-hidden
      className="pointer-events-none absolute top-5 right-4 z-0 hidden font-mono text-[0.72rem] leading-[1.02] font-medium text-emerald-600/70 select-none sm:right-6 lg:block dark:text-emerald-400/80 dark:[text-shadow:0_0_10px_color-mix(in_oklab,var(--color-emerald-400)_55%,transparent)]"
    >
      {TUX}
    </pre>
  );
}
