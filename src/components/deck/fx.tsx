"use client";

import { Children, isValidElement, type CSSProperties, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useDeck } from "./Deck";

/* ────────────────────────────────────────────────────────────────
   Effects in the spirit of React Bits and 21st.dev, each with a
   still print version. Live: motion and pointer response. Print:
   the resting frame, fully shown.
   ──────────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;

/** React Bits "BlurText": words arrive one by one out of a blur. Elements (e.g. highlights) arrive as one unit. */
export function BlurText({ children, className, style, delay = 0, stagger = 0.05 }: { children: ReactNode; className?: string; style?: CSSProperties; delay?: number; stagger?: number }) {
  const { print } = useDeck();
  if (print) return <span className={className} style={style}>{children}</span>;
  let index = 0;
  const unit = (node: ReactNode, key: string) => {
    const i = index++;
    return (
      <motion.span key={key} className="inline-block" initial={{ opacity: 0, filter: "blur(14px)", y: "0.25em" }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.8, delay: delay + i * stagger, ease }}>
        {node}
      </motion.span>
    );
  };
  return (
    <span className={className} style={style}>
      {Children.toArray(children).flatMap((child, c) => {
        if (typeof child === "string" || typeof child === "number") {
          return String(child).split(/(\s+)/).map((token, t) => (/^\s+$/.test(token) || token === "" ? token : unit(token, `${c}-${t}`)));
        }
        if (isValidElement(child) && child.type === "br") return [child];
        return [unit(child, `${c}`)];
      })}
    </span>
  );
}

/** React Bits "Magnet": the element leans toward the pointer. */
export function Magnet({ children, className, strength = 0.35 }: { children: ReactNode; className?: string; strength?: number }) {
  const { print } = useDeck();
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 });
  if (print) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onMouseMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - box.left - box.width / 2) * strength);
        y.set((event.clientY - box.top - box.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/**
 * 21st.dev "AnimatedBeam": a light pulse travels along a path. With `appear`, the line first
 * draws itself in at that moment (seconds). Prints as the plain path.
 */
export function Beam({ d, color, width = 3, delay = 0, appear, base = "rgba(21,21,21,0.10)" }: { d: string; color: string; width?: number; delay?: number; appear?: number; base?: string }) {
  const { print } = useDeck();
  if (print) return <path d={d} fill="none" stroke={base} strokeWidth={width} strokeLinecap="round" />;
  const drawn = appear === undefined ? {} : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.5, delay: appear, ease } };
  const pulseStart = (appear ?? 0) + delay + (appear === undefined ? 0 : 0.5);
  return (
    <g>
      <motion.path d={d} fill="none" stroke={base} strokeWidth={width} strokeLinecap="round" {...drawn} />
      <path d={d} fill="none" stroke={color} strokeWidth={width + 1} strokeLinecap="round" pathLength={100} strokeDasharray="14 86" strokeDashoffset={100} style={{ opacity: 0, animation: `deck-appear 0.01s linear ${pulseStart}s forwards, deck-dash 2.8s linear ${pulseStart}s infinite` }} />
    </g>
  );
}

/** A gentle, endless bob up and down, offset per item so a grid never moves in step. Prints still. */
export function Float({ children, index = 0, className }: { children: ReactNode; index?: number; className?: string }) {
  const { print } = useDeck();
  if (print) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} animate={{ y: [0, -5, 0] }} transition={{ duration: 4.5 + (index % 3) * 0.6, delay: (index * 0.37) % 2.4, repeat: Infinity, ease: "easeInOut" }}>
      {children}
    </motion.div>
  );
}
