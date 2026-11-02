"use client";

import type { CSSProperties, ReactNode } from "react";
import { motion } from "framer-motion";
import { useDeck } from "@/components/deck/Deck";

/* ────────────────────────────────────────────────────────────────
   Extra effects for the BD deck, in the spirit of React Bits and
   21st.dev. Each one prints as its resting frame: fully shown, still.
   ──────────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

type Edge = "bottom" | "left" | "right" | "top";
const closed: Record<Edge, string> = {
  bottom: "inset(100% 0% 0% 0%)",
  top: "inset(0% 0% 100% 0%)",
  left: "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

/** React Bits-style image reveal: the frame wipes open from one edge. Print shows it open. */
export function MaskReveal({ children, className, style, delay = 0, from = "bottom", duration = 1.1 }: { children: ReactNode; className?: string; style?: CSSProperties; delay?: number; from?: Edge; duration?: number }) {
  const { print } = useDeck();
  if (print) return <div className={className} style={style}>{children}</div>;
  return (
    <motion.div className={className} style={style} initial={{ clipPath: closed[from] }} animate={{ clipPath: "inset(0% 0% 0% 0%)" }} transition={{ duration, delay, ease }}>
      {children}
    </motion.div>
  );
}

/** A hairline that draws itself in (21st.dev line draw). Prints as the full line. */
export function DrawPath({ d, delay = 0, duration = 1, stroke = "rgba(21,21,21,0.18)", width = 1.5 }: { d: string; delay?: number; duration?: number; stroke?: string; width?: number }) {
  const { print } = useDeck();
  if (print) return <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" />;
  return <motion.path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration, delay, ease }} />;
}

/** A horizontal hairline rule that grows from the left. Prints full width. */
export function GrowRule({ className, delay = 0 }: { className?: string; delay?: number }) {
  const { print } = useDeck();
  if (print) return <div className={className} />;
  return <motion.div className={className} style={{ transformOrigin: "0 50%" }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, delay, ease }} />;
}
