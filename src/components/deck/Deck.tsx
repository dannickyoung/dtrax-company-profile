"use client";

import { createContext, useContext, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { animate, motion } from "framer-motion";

/* ────────────────────────────────────────────────────────────────
   Deck engine. Every slide is drawn on a fixed 1920 × 1080 canvas,
   so the live deck and the PDF share one layout.

   Live mode: content arrives with entrance motion, and <Reveal step>
   blocks wait for the presenter's click.
   Print mode: every block is shown at once, nothing moves. Anything
   animated must therefore have a sensible resting frame.
   ──────────────────────────────────────────────────────────────── */

export const STAGE_W = 1920;
export const STAGE_H = 1080;

export interface DeckSlide {
  id: string;
  /** Number of click reveals on this slide. 0 means the slide is complete on arrival. */
  steps?: number;
  /** Dark slides switch the player chrome to light controls. */
  dark?: boolean;
  render: () => ReactNode;
}

interface DeckState {
  step: number;
  print: boolean;
}

const DeckContext = createContext<DeckState>({ step: Infinity, print: false });

export const useDeck = () => useContext(DeckContext);

export function DeckProvider({ step, print, children }: DeckState & { children: ReactNode }) {
  return <DeckContext.Provider value={{ step, print }}>{children}</DeckContext.Provider>;
}

const ease = [0.22, 1, 0.36, 1] as const;

type From = "up" | "down" | "left" | "right" | "fade" | "scale";
const offsets: Record<From, { x?: number; y?: number; scale?: number }> = {
  up: { y: 36 },
  down: { y: -36 },
  left: { x: -48 },
  right: { x: 48 },
  fade: {},
  scale: { scale: 0.94 },
};

/**
 * A block that appears on arrival, after `delay` seconds. Numbered `step`s follow one
 * another automatically. In print it is always visible and static.
 */
export function Reveal({ children, step = 0, delay = 0, from = "up", className, style }: { children?: ReactNode; step?: number; delay?: number; from?: From; className?: string; style?: CSSProperties }) {
  const deck = useDeck();
  if (deck.print) return <div className={className} style={style}>{children}</div>;
  // Numbered steps play in automatically, one after another; nothing waits for a click.
  const shown = true;
  const at = step > 0 ? delay + 0.5 + (step - 1) * 0.4 : delay;
  const hidden = { opacity: 0, x: 0, y: 0, scale: 1, ...offsets[from] };
  return (
    <motion.div
      className={className}
      style={style}
      initial={hidden}
      animate={shown ? { opacity: 1, x: 0, y: 0, scale: 1 } : hidden}
      transition={{ duration: 0.7, ease, delay: at }}
    >
      {children}
    </motion.div>
  );
}

/** Counts up to `value` on arrival. Prints the final figure. */
export function CountUp({ value, suffix = "", delay = 0, duration = 1.6 }: { value: number; suffix?: string; delay?: number; duration?: number }) {
  const { print } = useDeck();
  const [shown, setShown] = useState(print ? value : 0);
  useEffect(() => {
    if (print) return;
    const controls = animate(0, value, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (latest) => setShown(Math.round(latest)) });
    return () => controls.stop();
  }, [delay, duration, print, value]);
  return <span className="tabular-nums">{shown}{suffix}</span>;
}

/** Scales the canvas (1920 × 1080 unless `width`/`height` say otherwise) to fit the window, letterboxed, leaving `reserveBottom` pixels free below it for controls. */
export function Stage({ children, background = "#ffffff", reserveBottom = 0, width = STAGE_W, height = STAGE_H }: { children: ReactNode; background?: string; reserveBottom?: number; width?: number; height?: number }) {
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / width, (window.innerHeight - reserveBottom) / height));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [reserveBottom, width, height]);
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden" style={{ bottom: reserveBottom }}>
      <div style={{ width: width * scale, height: height * scale, opacity: scale ? 1 : 0 }} className="relative overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "0 0", background }} className="absolute left-0 top-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
