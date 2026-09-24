"use client";

import { useEffect, useRef } from "react";

/**
 * Sfondo decorativo per la HOME: griglia di punti che si illumina attorno al
 * cursore.
 *
 * Sta nella home e non nel layout globale di proposito: nella pagina dello
 * strumento l'alone traspariva dentro la textarea e sotto la tabella (quei
 * contenitori non hanno sfondo opaco), e in un'area di lavoro distrae.
 *
 * Scelte importanti:
 * - la posizione passa da CUSTOM PROPERTIES CSS aggiornate fuori da React.
 *   Tenere le coordinate in uno stato React significherebbe un re-render a ogni
 *   pixel di movimento del mouse: qui invece React monta l'elemento una volta
 *   sola e poi non fa più nulla;
 * - aggiornamento agganciato a requestAnimationFrame: `pointermove` spara molto
 *   più spesso di quanto lo schermo possa disegnare, e scrivere sullo stile a
 *   ogni evento fa lavoro inutile;
 * - niente effetto su touch (`pointer: coarse`) e con `prefers-reduced-motion`:
 *   senza cursore lo spot resterebbe fermo in un angolo, e per chi ha chiesto
 *   meno animazioni è esattamente il tipo di movimento da evitare;
 * - `fixed inset-0 -z-10` + `pointer-events-none`: sta sotto al contenuto e non
 *   intercetta mai click o selezione del testo.
 */
export function InteractiveBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (noMotion.matches || coarse.matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;

    const draw = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      // un solo aggiornamento per frame, non uno per evento
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const onEnter = () => el.style.setProperty("--spot-opacity", "1");
    const onLeave = () => el.style.setProperty("--spot-opacity", "0");

    draw();
    onEnter();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerenter", onEnter);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerenter", onEnter);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10" />
  );
}
