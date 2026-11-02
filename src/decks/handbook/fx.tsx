"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useDeck } from "@/components/deck/Deck";

/* ────────────────────────────────────────────────────────────────
   Handbook effects. Each one has a still print version: in the PDF
   every effect shows its resting frame, fully drawn.
   ──────────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

/** A hairline that draws itself from the left on arrival (21st.dev-style line reveal). Prints as a plain rule. */
export function DrawRule({ delay = 0, className, style, color = "rgba(21,21,21,0.12)" }: { delay?: number; className?: string; style?: CSSProperties; color?: string }) {
  const { print } = useDeck();
  const base: CSSProperties = { height: 1, background: color, transformOrigin: "0 50%", ...style };
  if (print) return <div aria-hidden="true" className={className} style={base} />;
  return <motion.div aria-hidden="true" className={className} style={base} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.1, delay, ease }} />;
}

/**
 * A vertical connector between two steps of a procedure: the line draws down, then a
 * light pulse travels along it (in the spirit of 21st.dev's AnimatedBeam). Prints as the plain line.
 */
export function StepLine({ height, color, delay = 0, x = 1 }: { height: number; color: string; delay?: number; x?: number }) {
  const { print } = useDeck();
  const d = `M ${x} 0 L ${x} ${height}`;
  return (
    <svg aria-hidden="true" width={x * 2} height={height} viewBox={`0 0 ${x * 2} ${height}`} className="block overflow-visible">
      {print ? (
        <path d={d} fill="none" stroke="rgba(21,21,21,0.18)" strokeWidth={2} strokeLinecap="round" />
      ) : (
        <>
          <motion.path d={d} fill="none" stroke="rgba(21,21,21,0.18)" strokeWidth={2} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay, ease }} />
          <path d={d} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" pathLength={100} strokeDasharray="18 82" strokeDashoffset={100} style={{ animation: `deck-dash 2.4s linear ${delay + 0.6}s infinite` }} />
        </>
      )}
    </svg>
  );
}
