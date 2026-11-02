"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useDeck } from "@/components/deck/Deck";

/* ────────────────────────────────────────────────────────────────
   A welcome drawing for the handbook's send-off card: a desk made
   ready for a new joiner, with laptop, lamp, plant, mug and a badge
   on its lanyard. Same hand as the divider sketches in
   components/deck/vectors.tsx (ink hairlines, white planes, dashed
   guides); the few primitives it needs are copied here so that file
   stays untouched.
   Live: strokes draw themselves in. Print: the finished drawing.
   ──────────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;
const INK = "#151515";

type P = [number, number];
const n = (v: number) => Math.round(v * 10) / 10;
const poly = (pts: P[], close = false) => pts.map(([x, y], i) => `${i ? "L" : "M"} ${n(x)} ${n(y)}`).join(" ") + (close ? " Z" : "");
const rect = (x1: number, y1: number, x2: number, y2: number) => poly([[x1, y1], [x2, y1], [x2, y2], [x1, y2]], true);

const Offset = createContext(0);

function Line({ d, t = 0, w = 2, o = 0.85, dur = 0.8 }: { d: string; t?: number; w?: number; o?: number; dur?: number }) {
  const { print } = useDeck();
  const at = useContext(Offset) + t;
  const props = { d, fill: "none", stroke: INK, strokeOpacity: o, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (print) return <path {...props} />;
  return <motion.path {...props} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ pathLength: { duration: dur, delay: at, ease }, opacity: { duration: 0.15, delay: at } }} />;
}

function Fade({ t = 0, children }: { t?: number; children: ReactNode }) {
  const { print } = useDeck();
  const at = useContext(Offset) + t;
  if (print) return <g>{children}</g>;
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: at, ease }}>{children}</motion.g>;
}

function Plane({ d, t = 0, o = 0.6 }: { d: string; t?: number; o?: number }) {
  return <Fade t={t}><path d={d} fill="#ffffff" fillOpacity={o} /></Fade>;
}

function Guide({ d, t = 0, o = 0.4 }: { d: string; t?: number; o?: number }) {
  return <Fade t={t}><path d={d} fill="none" stroke={INK} strokeOpacity={o} strokeWidth={1.2} strokeDasharray="4 6" strokeLinecap="round" /></Fade>;
}

function Label({ x, y, t = 0, size = 13, o = 0.55, children }: { x: number; y: number; t?: number; size?: number; o?: number; children: ReactNode }) {
  return (
    <Fade t={t}>
      <text x={x} y={y} textAnchor="middle" fontSize={size} fontWeight={500} letterSpacing="0.16em" fill={INK} fillOpacity={o} style={{ textTransform: "uppercase" }}>{children}</text>
    </Fade>
  );
}

function Shape({ d, t = 0, w = 2, o = 0.7, dur = 0.8 }: { d: string; t?: number; w?: number; o?: number; dur?: number }) {
  return <><Plane d={d} t={t + dur * 0.6} o={o} /><Line d={d} t={t} w={w} dur={dur} /></>;
}

/** Front elevation, drawn in a 900 × 360 box. The desk top sits at y 200, the floor at y 322. */
function Desk() {
  return (
    <>
      {/* Floor and the dimension line beneath it. */}
      <Line d="M 60 322 L 840 322" w={1.6} dur={1} />
      <Guide d="M 230 346 L 670 346 M 230 338 L 230 354 M 670 338 L 670 354" t={1.6} o={0.35} />
      <Label x={450} y={341} t={1.8}>Your desk</Label>

      {/* Pendant lamp, with its light falling on the desk. */}
      <Line d="M 450 0 L 450 44" w={1.2} o={0.6} t={0.1} dur={0.4} />
      <Shape d="M 418 66 L 482 66 L 470 44 L 430 44 Z" t={0.3} w={1.8} o={0.9} dur={0.5} />
      <Plane d="M 418 66 L 482 66 L 560 200 L 340 200 Z" t={1.2} o={0.28} />
      <Guide d="M 418 66 L 340 200 M 482 66 L 560 200" t={1.3} o={0.28} />

      {/* Desk: top, legs and a drawer pedestal. */}
      <Shape d={rect(230, 200, 670, 214)} t={0.2} w={2} o={0.95} dur={0.8} />
      <Line d="M 248 214 L 248 322" w={2} t={0.6} dur={0.4} />
      <Shape d={rect(560, 214, 652, 322)} t={0.7} w={1.8} o={0.6} dur={0.6} />
      <Line d="M 560 250 L 652 250 M 560 286 L 652 286 M 596 232 L 616 232 M 596 268 L 616 268 M 596 304 L 616 304" w={1.2} o={0.55} t={1.1} dur={0.5} />

      {/* Laptop, open, with a hello on the screen. */}
      <Shape d={rect(352, 108, 500, 194)} t={0.5} w={2} o={0.95} dur={0.7} />
      <Line d={rect(362, 118, 490, 184)} w={1} o={0.35} t={0.9} dur={0.5} />
      <Line d="M 336 200 L 516 200" w={3.2} t={0.8} dur={0.4} />
      <Label x={426} y={156} t={1.5} size={12} o={0.6}>Welcome</Label>

      {/* Mug. */}
      <Shape d={rect(520, 166, 544, 200)} t={1} w={1.8} o={0.95} dur={0.4} />
      <Line d="M 544 174 C 556 174, 556 192, 544 192" w={1.6} t={1.2} dur={0.3} />

      {/* Plant in its pot. */}
      <Shape d="M 598 160 L 636 160 L 630 200 L 604 200 Z" t={1} w={1.8} o={0.95} dur={0.4} />
      <Line d="M 617 160 C 614 140, 600 120, 584 108 M 617 160 C 618 132, 622 108, 616 86 M 617 160 C 624 140, 640 124, 656 116" w={1.6} t={1.2} dur={0.7} />
      <Shape d="M 584 108 C 588 96, 602 98, 604 112 C 596 116, 588 114, 584 108 Z" t={1.6} w={1.2} o={0.8} dur={0.3} />
      <Shape d="M 616 86 C 610 74, 622 64, 628 76 C 626 84, 620 88, 616 86 Z" t={1.7} w={1.2} o={0.8} dur={0.3} />
      <Shape d="M 656 116 C 664 104, 678 110, 672 122 C 666 126, 658 124, 656 116 Z" t={1.8} w={1.2} o={0.8} dur={0.3} />

      {/* Name badge hanging from the desk edge on its lanyard. */}
      <Line d="M 276 214 C 278 240, 290 256, 300 262 M 324 214 C 322 240, 310 256, 300 262" w={1.4} o={0.7} t={1.3} dur={0.5} />
      <Shape d={rect(282, 262, 318, 306)} t={1.5} w={1.6} o={0.95} dur={0.4} />
      <Line d={`${rect(291, 270, 309, 286)} M 290 294 L 310 294 M 294 300 L 306 300`} w={1} o={0.55} t={1.8} dur={0.4} />

      {/* Chair tucked in at the left. */}
      <Shape d={rect(146, 248, 214, 258)} t={0.9} w={1.8} o={0.95} dur={0.5} />
      <Line d="M 154 258 L 150 322 M 206 258 L 210 322" w={1.8} t={1.1} dur={0.4} />
      <Shape d="M 146 248 L 140 160 L 152 160 L 158 248 Z" t={1.2} w={1.6} o={0.95} dur={0.5} />
    </>
  );
}

/** The send-off drawing, fitted to its box. `delay` holds the whole drawing back. */
export function WelcomeDesk({ delay = 0.9, className }: { delay?: number; className?: string }) {
  return (
    <svg viewBox="0 0 900 360" className={className} overflow="visible" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <Offset.Provider value={delay}><Desk /></Offset.Provider>
    </svg>
  );
}
