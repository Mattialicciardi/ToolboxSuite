import type * as React from "react";

// Pingu in ASCII per l'hero della home, convertito dalla fotografia del
// pupazzo con scripts/pingu2ascii.py.
//
// I passaggi non ovvi della conversione:
// 1. SAGOMA con flood fill dai bordi sui pixel chiari e neutri. Qui funziona
//    (a differenza di una foto naturalistica) perché Pingu ha un contorno nero
//    CHIUSO: il riempimento non tracima nella pancia bianca.
// 2. DUE REGIMI invece di una rampa unica: le zone scure (dorso, testa, ali)
//    usano la parte densa della rampa, la pancia un tono leggero. Con una gamma
//    sola o si annega la pancia nel nero o si svuota la testa.
// 3. OCCHI e BECCO scavati a parte: sono isole chiare dentro la testa nera, il
//    flood fill non le raggiunge e la rampa li appiattisce. Sono il dettaglio
//    che rende Pingu riconoscibile, quindi vanno forzati.
// 4. NIENTE smoothing nel ridimensionamento: cancella occhi e becco.
//
// Niente tracking: l'arte presuppone celle monospace non spaziate.

/** A — 56 colonne: compatta. */
const SMALL = String.raw`
 o***+o
 %%%%%%#
 #####%%%
 *###%%%%*
 o%#%%%##*       o========
 o%%%%###*     +***+++==++*+
 o%#####**    +#**++*#.=++*##
 *%####*#o   #*-------#######*
 #####***    *#------*#######+
+#####**      +*###########*o
*####*#o       +%@@@@@@@@@@%*o
 ##**#%o   o+#%%#*****+oo=+*#%#*o
  o***##**#%%#=..         ..-+%%#*
     o=+*##%*.               --#@%#o
          *+.                 .-*@%#
         =*.                    -#@%*
         *.                      -%@%*
         +.                      .+@%%o
        ==                        .%@%#
        +.                        .*%%%#
        +.                        .+%%%%*
        =.                        .+#@%%%#
        =.                        .- *@%%%%o
         .       .                .=  *@%##%#o
         =. ..................    .    o#%%###*
          . ....................          *####%
            ..----..........-....            oo
             .+-----....-----==.
         ..-------*+====++***-----.
     .-------------+*++*+------------.
     --------------     --------------.
      ..=====....        .-----------.
`;

/** B — 70 colonne: equilibrio fra dettaglio e ingombro. */
const MEDIUM = String.raw`
   oooo
 o#%%%%%*o
 *%####%%%*
 +####%%%%%*
 o#####%%%#%o
  *##%%%%###*            ===
  *%%%%%####*       =++++++++++++=
  +%#%%#####+     o+#*****++=.=+***+
  *%######*#o     *#********.=*o***#*
  ########*#    o#*--------##**######o
 +%######**+    o%---------*%%#######=
 #######***      ###******#########*+
o%#####**#        o**#############*o
o######*#+         o#%@@@@@@@@@@@%%*+o
 ##*##*#%o     o+*%%%%######*****##%##*+o
  *****###o o+###%#+....      ...--=#%%##*
    ++*+*####%%%%=-.               .--#@%#*o
       o=+**##%*-.                   --*@%##+
             #*-                      .-+@@##+
            +*-                         -+@%##o
            #-                           -#@%#*
           ++.                           .-%@%#*
           *-                             -+@%%#o
           *.                              -%@%%#
           +.                              .#@%%%*
          =+.                              .*%%%%#+
          ==                               .-%%@%%%+
          ==                               .-##%%%%%*
           =                               .-+ @%%%%%#o
           +.                              .-= o@%%%%%%*
           +.   ........... ......         .=   o%%%#####*
            .  ........................    .      *%%%#####+
             . ..........................           o*#####%+
              ...........................              o+**+
                .-------........-------..
                .=***++---....-----++*+.
           ..----------*+++++++++**--------..
       .----------------+******---------------.
      .-----------------.     .-----------------.
       ---------------.        -----------------.
                                 .....----.....
`;

/** C — 84 colonne: massimo dettaglio. */
const LARGE = String.raw`
  *#####*o
 #%%%%%%%%#o
o#####%%%%%%o
 ######%%%%%%o
 *#####%%%%%##
 o###%%%%%%%##o
  ##%%%%%#####+          ==============
  #%%%%%%###*#+       =**++++++++++++++++
  #%%%%%####*#o      ++*#*******+..==+***#+
  ##########*#     o #%##******#*.=#+=***##o
 o%########***     ***+-o------*##****#####*
 *%#######**#o     ##-----------*%%#########
o%#######****      *#*---------*#########***
*########***        *%###################*+
########**#          o+*###########%%%%#*o
########*#*           o*%@@@@@@@@@@@@@@%%#*+o
*########%+       o+*#%@@%%%%%%%%######%%##***o
 *#*****###     +*##%%#*+oo+ooooo....---=*#%%##*+
  o****+*###++*###%%#--..              ..--+%@%%#*o
    o++++*######%%%+-.                    ---*%@%##+
        ==++**##%#-.                        --+%@%##*
               ##-.                          .--%@%#**
              +#-.                             --%@%##+
              %-.                               -+@%%##o
             *+.                                .-*@%%#*
             #-                                  .-%@%%#+
            +*.                                   -+@%%%#o
            *+.                                   .-%@%%%#
            *-                                     -#@%%%#*
            *-                                     .*%%@%%#+
            *-                                     .-%%@%%##o
            *.                                     .-#%%%%%#%o
            *.                                     .-#*@%%%%%%*
            *.                                     .-# #@%%%%%%#o
            *.                                     .-*  %%%%%%%##*
            +.            .           ..           .-=   %%%%%%%###+
             +.   ....................... .        .=     *%%########o
             =.  .............................     .       o#%%#######*
              .. ...............................              +#########
               ..................................                o*###*+
                 ...-------.............---.....
                   .=--------.......----------.
                 ...=*##***+===....=--++***##+...
           ..--------------*+++++++++++*------------.
        .-------------------+*******+------------------.
       ---------------------=o     =---------------------
       --------------------.        ---------------------.
        .==-----------=..            .------------------.
                                           .........
`;

const VARIANTS = { small: SMALL, medium: MEDIUM, large: LARGE } as const;

export type PenguinVariant = keyof typeof VARIANTS;

export function AsciiPenguin({
  variant = "medium",
  className = "",
  ...props
}: {
  variant?: PenguinVariant;
  className?: string;
} & React.ComponentProps<"pre">) {
  return (
    <pre
      aria-hidden
      className={`pointer-events-none font-mono leading-[1.05] font-medium text-emerald-600/80 select-none dark:text-emerald-400/85 dark:[text-shadow:0_0_10px_color-mix(in_oklab,var(--color-emerald-400)_45%,transparent)] ${className}`}
      {...props}
    >
      {VARIANTS[variant].replace(/^\n/, "")}
    </pre>
  );
}
