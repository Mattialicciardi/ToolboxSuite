import type * as React from "react";

// Logotipo "ToolboxSuite" in ASCII (stile FIGlet "Big Money-ne"), mostrato a
// tutta larghezza fra l'intestazione e il contenuto della home.
//
// Note di resa:
// - String.raw perché l'arte è piena di backslash;
// - niente tracking: presuppone celle monospace non spaziate;
// - leading 1: l'arte è disegnata a celle contigue, e con interlinea larga i
//   tratti verticali delle lettere non si saldano fra una riga e l'altra;
// - a ~105 colonne non entra su schermi stretti: si scala con clamp() invece di
//   mandare la pagina in overflow, e sotto sm si nasconde.
const LOGO = String.raw`
 /$$$$$$$$                  /$$ /$$                                               /$$   /$$
|__  $$__/                 | $$| $$                                              |__/  | $$
   | $$  /$$$$$$   /$$$$$$ | $$| $$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$$ /$$   /$$ /$$ /$$$$$$    /$$$$$$
   | $$ /$$__  $$ /$$__  $$| $$| $$__  $$ /$$__  $$|  $$ /$$/ /$$_____/| $$  | $$| $$|_  $$_/   /$$__  $$
   | $$| $$  \ $$| $$  \ $$| $$| $$  \ $$| $$  \ $$ \  $$$$/ |  $$$$$$ | $$  | $$| $$  | $$    | $$$$$$$$
   | $$| $$  | $$| $$  | $$| $$| $$  | $$| $$  | $$  >$$  $$  \____  $$| $$  | $$| $$  | $$ /$$| $$_____/
   | $$|  $$$$$$/|  $$$$$$/| $$| $$$$$$$/|  $$$$$$/ /$$/\  $$ /$$$$$$$/|  $$$$$$/| $$  |  $$$$/|  $$$$$$$
   |__/ \______/  \______/ |__/|_______/  \______/ |__/  \__/|_______/  \______/ |__/   \___/   \_______/
`;

export function AsciiLogo({ className = "", ...props }: React.ComponentProps<"pre">) {
  return (
    <pre
      aria-hidden
      className={`pointer-events-none overflow-hidden font-mono leading-[1] font-medium text-emerald-600/70 select-none dark:text-emerald-400/80 dark:[text-shadow:0_0_10px_color-mix(in_oklab,var(--color-emerald-400)_40%,transparent)] ${className}`}
      style={{ fontSize: "clamp(0.38rem, 1.02vw, 0.88rem)" }}
      {...props}
    >
      {LOGO.replace(/^\n/, "")}
    </pre>
  );
}
