"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useDeck } from "./Deck";

/* ────────────────────────────────────────────────────────────────
   Line drawings for section dividers, in the manner of an
   architect's sheet: ink hairlines, white planes, dashed
   construction lines and the odd dimension. Each drawing sits in
   a 600 × 600 box on the divider's colour field.
   Live: strokes draw themselves in. Print: the finished drawing.
   ──────────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;
const INK = "#151515";

type P = [number, number];
const n = (v: number) => Math.round(v * 10) / 10;
const poly = (pts: P[], close = false) => pts.map(([x, y], i) => `${i ? "L" : "M"} ${n(x)} ${n(y)}`).join(" ") + (close ? " Z" : "");
const rect = (x1: number, y1: number, x2: number, y2: number) => poly([[x1, y1], [x2, y1], [x2, y2], [x1, y2]], true);
const ellipse = (cx: number, cy: number, rx: number, ry: number) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;
const circle = (cx: number, cy: number, r: number) => ellipse(cx, cy, r, r);
/** Isometric projection of (x, y, z) about an origin. */
const iso = (x: number, y: number, z: number, ox = 300, oy = 300): P => [ox + (x - y) * 0.866, oy + (x + y) * 0.5 - z];
/** A smooth line through every point (Catmull-Rom). */
const smooth = (pts: P[]) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C ${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)}, ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(p2[1] - (p3[1] - p1[1]) / 6)}, ${p2[0]} ${p2[1]}`;
  }
  return d;
};
/** Vertical S-curve from a to b. */
const drop = (a: P, b: P) => `M ${a[0]} ${a[1]} C ${a[0]} ${(a[1] + b[1]) / 2}, ${b[0]} ${(a[1] + b[1]) / 2}, ${b[0]} ${b[1]}`;

const Offset = createContext(0);

/** An ink stroke that draws itself in. */
function Line({ d, t = 0, w = 2, o = 0.85, dur = 0.8 }: { d: string; t?: number; w?: number; o?: number; dur?: number }) {
  const { print } = useDeck();
  const at = useContext(Offset) + t;
  const props = { d, fill: "none", stroke: INK, strokeOpacity: o, strokeWidth: w, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (print) return <path {...props} />;
  return <motion.path {...props} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ pathLength: { duration: dur, delay: at, ease }, opacity: { duration: 0.15, delay: at } }} />;
}

/** Anything that fades in rather than draws: planes, guides, labels. */
function Fade({ t = 0, children }: { t?: number; children: ReactNode }) {
  const { print } = useDeck();
  const at = useContext(Offset) + t;
  if (print) return <g>{children}</g>;
  return <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: at, ease }}>{children}</motion.g>;
}

function Plane({ d, t = 0, o = 0.6, color = "#ffffff" }: { d: string; t?: number; o?: number; color?: string }) {
  return <Fade t={t}><path d={d} fill={color} fillOpacity={o} /></Fade>;
}

/** Dashed construction line. */
function Guide({ d, t = 0, o = 0.4 }: { d: string; t?: number; o?: number }) {
  return <Fade t={t}><path d={d} fill="none" stroke={INK} strokeOpacity={o} strokeWidth={1.2} strokeDasharray="4 6" strokeLinecap="round" /></Fade>;
}

function Label({ x, y, t = 0, anchor = "start", rotate, size = 15, color = INK, o = 0.6, weight = 500, spacing = "0.14em", children }: { x: number; y: number; t?: number; anchor?: "start" | "middle" | "end"; rotate?: number; size?: number; color?: string; o?: number; weight?: number; spacing?: string; children: ReactNode }) {
  return (
    <Fade t={t}>
      <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={weight} letterSpacing={spacing} fill={color} fillOpacity={o} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined} style={{ textTransform: "uppercase" }}>{children}</text>
    </Fade>
  );
}

/** A white plane with an ink outline. */
function Shape({ d, t = 0, w = 2, o = 0.7, dur = 0.8 }: { d: string; t?: number; w?: number; o?: number; dur?: number }) {
  return <><Plane d={d} t={t + dur * 0.6} o={o} /><Line d={d} t={t} w={w} dur={dur} /></>;
}

/* ── Drawings ─────────────────────────────────────────────────── */

/** Office floor plan with dimensions and a scale bar. */
function Plan() {
  const chairs: P[] = [[120, 152], [160, 147], [200, 152], [120, 238], [160, 243], [200, 238]];
  const desk = (y: number) => rect(300, y, 500, y + 60) + ` M 300 ${y + 30} L 500 ${y + 30}` + [350, 400, 450].map((x) => ` M ${x} ${y} L ${x} ${y + 60}`).join("");
  const deskChairs = [325, 375, 425, 475].flatMap((x) => [126, 214, 236, 324].map((y) => [x, y] as P));
  return (
    <>
      <Plane d={rect(70, 100, 250, 290)} t={0.6} o={0.45} />
      <Line d="M 380 510 L 60 510 L 60 90 L 540 90 L 540 510 L 440 510" w={2.6} dur={1.4} />
      <Line d="M 380 500 L 70 500 L 70 100 L 530 100 L 530 500 L 440 500" w={1.3} dur={1.4} t={0.1} />
      <Line d="M 380 500 L 380 510 M 440 500 L 440 510" w={1.3} t={1} dur={0.3} />
      <Line d="M 250 100 L 250 290 L 240 290 M 190 290 L 70 290" w={1.8} t={0.5} />
      <Line d="M 440 500 L 440 440" w={1.6} t={1.2} dur={0.3} />
      <Guide d="M 440 440 A 60 60 0 0 0 380 500" t={1.3} />
      <Line d="M 240 290 L 240 340" w={1.6} t={1.2} dur={0.3} />
      <Guide d="M 240 340 A 50 50 0 0 1 190 290" t={1.3} />
      <Shape d={ellipse(160, 195, 55, 30)} w={1.4} t={0.8} o={0.9} />
      {chairs.map(([x, y], i) => <Line key={i} d={circle(x, y, 7)} w={1.2} t={1 + i * 0.04} dur={0.4} />)}
      <Shape d={desk(140)} w={1.3} t={0.9} o={0.85} />
      <Shape d={desk(250)} w={1.3} t={1} o={0.85} />
      {deskChairs.map(([x, y], i) => <Line key={i} d={circle(x, y, 8)} w={1.1} t={1.1 + i * 0.02} dur={0.4} />)}
      <Shape d="M 90 380 L 120 380 L 120 450 L 230 450 L 230 480 L 90 480 Z" w={1.4} t={1.2} />
      <Line d={circle(175, 405, 18)} w={1.2} t={1.3} dur={0.5} />
      <Line d={circle(495, 455, 16) + " " + circle(495, 455, 6)} w={1.1} t={1.4} dur={0.5} />
      <Line d="M 60 84 L 60 44 M 540 84 L 540 44 M 60 54 L 540 54 M 53 61 L 67 47 M 533 61 L 547 47" w={1} o={0.55} t={1.5} />
      <Label x={300} y={40} anchor="middle" t={1.8}>12 000</Label>
      <Line d="M 54 90 L 20 90 M 54 510 L 20 510 M 30 90 L 30 510 M 23 97 L 37 83 M 23 517 L 37 503" w={1} o={0.55} t={1.5} />
      <Label x={22} y={300} anchor="middle" rotate={-90} t={1.8}>9 600</Label>
      <Fade t={1.7}><path d={rect(60, 552, 100, 560) + rect(140, 552, 180, 560)} fill={INK} fillOpacity={0.75} /></Fade>
      <Line d={rect(60, 552, 180, 560)} w={1} o={0.7} t={1.6} dur={0.4} />
      <Label x={60} y={584} t={1.8} size={13}>0</Label>
      <Label x={180} y={584} anchor="middle" t={1.8} size={13}>5 m</Label>
      <Label x={540} y={562} anchor="end" t={1.8}>Floor plan · 1:200</Label>
    </>
  );
}

/** Three stacked planes: design, cost, build. */
function Layers() {
  const a = 220;
  const plane = (z: number) => poly([iso(0, 0, z), iso(a, 0, z), iso(a, a, z), iso(0, a, z)], true);
  const edge = (z: number) => poly([iso(0, a, z), iso(0, a, z - 8), iso(a, a, z - 8), iso(a, 0, z - 8), iso(a, 0, z)]) + " " + poly([iso(a, a, z), iso(a, a, z - 8)]);
  const posts = (z0: number, z1: number) => ([[0, 0], [a, 0], [0, a], [a, a]] as P[]).map(([x, y]) => poly([iso(x, y, z0), iso(x, y, z1)])).join(" ");
  const grid = [1, 2, 3].map((i) => poly([iso((a * i) / 4, 0, 110), iso((a * i) / 4, a, 110)]) + " " + poly([iso(0, (a * i) / 4, 110), iso(a, (a * i) / 4, 110)])).join(" ");
  const sketch = poly(Array.from({ length: 41 }, (_, i) => { const u = i / 40; return iso(30 + 160 * u, 110 + 55 * Math.sin(u * Math.PI * 2), 220); }));
  const box = (x0: number, y0: number, w: number, d: number, h: number) => [
    poly([iso(x0, y0, h), iso(x0 + w, y0, h), iso(x0 + w, y0 + d, h), iso(x0, y0 + d, h)], true),
    poly([iso(x0, y0 + d, 0), iso(x0 + w, y0 + d, 0), iso(x0 + w, y0 + d, h), iso(x0, y0 + d, h)], true),
    poly([iso(x0 + w, y0, 0), iso(x0 + w, y0 + d, 0), iso(x0 + w, y0 + d, h), iso(x0 + w, y0, h)], true),
  ].join(" ");
  const label = (z: number, text: string, t: number) => {
    const [x, y] = iso(a, 0, z);
    return <><Line d={`M ${n(x + 8)} ${n(y)} L ${n(x + 34)} ${n(y)}`} w={1} o={0.6} t={t} dur={0.3} /><Label x={x + 44} y={y + 6} t={t + 0.1} size={18} o={0.8}>{text}</Label></>;
  };
  return (
    <>
      <Shape d={plane(0)} t={0.1} o={0.85} />
      <Line d={edge(0)} w={1.4} t={0.4} />
      <Shape d={box(120, 130, 60, 60, 50) + " " + box(40, 150, 50, 50, 30)} w={1.3} t={0.5} o={0.95} />
      <Guide d={posts(0, 110)} t={0.6} />
      <Shape d={plane(110)} t={0.6} o={0.88} />
      <Line d={edge(110)} w={1.4} t={0.9} />
      <Line d={grid} w={1} o={0.4} t={1} dur={0.9} />
      <Guide d={posts(110, 220)} t={1.1} />
      <Shape d={plane(220)} t={1.1} o={0.92} />
      <Line d={edge(220)} w={1.4} t={1.4} />
      <Line d={sketch} w={2} t={1.5} dur={1} />
      {label(220, "Design", 1.7)}
      {label(110, "Cost", 1.8)}
      {label(0, "Build", 1.9)}
    </>
  );
}

/** A winding route from brief to handover, with numbered stages. */
function Route({ stages = 6 }: { stages?: number }) {
  const all: P[] = [[90, 480], [250, 470], [310, 350], [190, 250], [330, 150], [510, 120]];
  const pts = all.slice(0, Math.max(2, stages));
  return (
    <>
      <Guide d={smooth(pts.map(([x, y]) => [x + 14, y + 16] as P))} t={1.3} o={0.3} />
      <Line d={smooth(pts)} w={2.4} dur={1.6} t={0.1} />
      {pts.map(([x, y], i) => {
        const last = i === pts.length - 1;
        return (
          <Fade key={i} t={0.25 + i * 0.25}>
            <path d={circle(x, y, 20)} fill={last ? INK : "#ffffff"} fillOpacity={last ? 0.9 : 0.95} stroke={INK} strokeOpacity={0.85} strokeWidth={2} />
            <text x={x} y={y + 6} textAnchor="middle" fontSize={17} fontWeight={500} fill={last ? "#ffffff" : INK}>{i + 1}</text>
          </Fade>
        );
      })}
      <Label x={pts[0][0]} y={pts[0][1] + 52} anchor="middle" t={0.4}>Brief</Label>
      <Label x={pts[pts.length - 1][0]} y={pts[pts.length - 1][1] - 38} anchor="middle" t={1.8}>Handover</Label>
    </>
  );
}

function avatar(x: number, y: number, s: number) {
  return [
    circle(x, y, s),
    circle(x, y - s * 0.25, s * 0.32),
    `M ${n(x - s * 0.62)} ${n(y + s * 0.78)} C ${n(x - s * 0.55)} ${n(y + s * 0.2)}, ${n(x + s * 0.55)} ${n(y + s * 0.2)}, ${n(x + s * 0.62)} ${n(y + s * 0.78)}`,
  ];
}

/** Founders, leaders and the wider team, joined by soft lines. */
function People() {
  const founders: P[] = [[240, 120], [360, 120]];
  const leaders: P[] = [[130, 300], [300, 300], [470, 300]];
  const team: P[] = [[70, 470], [185, 470], [300, 470], [415, 470], [530, 470]];
  const reports: [number, number][] = [[0, 0], [0, 1], [1, 2], [2, 3], [2, 4]];
  const person = ([x, y]: P, s: number, t: number, key: string) => {
    const [ring, head, shoulders] = avatar(x, y, s);
    return <g key={key}><Shape d={ring} t={t} w={1.8} o={0.95} dur={0.6} /><Line d={head + " " + shoulders} w={1.4} t={t + 0.25} dur={0.5} /></g>;
  };
  return (
    <>
      <Line d="M 280 120 L 320 120 M 300 120 L 300 160" w={1.4} t={0.4} dur={0.4} />
      {leaders.map((p, i) => <Line key={i} d={drop([300, 160], [p[0], p[1] - 34])} w={1.4} o={0.6} t={0.6 + i * 0.08} />)}
      {reports.map(([l, m], i) => <Line key={i} d={drop([leaders[l][0], leaders[l][1] + 34], [team[m][0], team[m][1] - 28])} w={1.2} o={0.5} t={1.1 + i * 0.06} />)}
      {founders.map((p, i) => person(p, 40, 0.1 + i * 0.1, `f${i}`))}
      {leaders.map((p, i) => person(p, 34, 0.7 + i * 0.1, `l${i}`))}
      {team.map((p, i) => person(p, 28, 1.2 + i * 0.08, `t${i}`))}
    </>
  );
}

/** Buildings rising along a 2003–2026 axis, the last still under the crane. */
function Timeline() {
  const ground = 440;
  const blocks = [{ x: 60, w: 62, h: 80 }, { x: 135, w: 56, h: 120 }, { x: 205, w: 70, h: 100 }, { x: 290, w: 64, h: 170 }, { x: 368, w: 62, h: 210 }, { x: 445, w: 74, h: 250 }];
  const floors = (b: (typeof blocks)[number], top: number) => {
    let d = `M ${b.x + b.w / 2} ${ground} L ${b.x + b.w / 2} ${ground - top + 12}`;
    for (let y = ground - 24; y > ground - top + 6; y -= 24) d += ` M ${b.x + 8} ${y} L ${b.x + b.w - 8} ${y}`;
    return d;
  };
  const years = Array.from({ length: 24 }, (_, i) => 60 + (i * 480) / 23);
  let mast = "M 548 440 L 548 120 M 562 440 L 562 120";
  for (let y = 440, i = 0; y > 130; y -= 20, i++) mast += ` M ${i % 2 ? 562 : 548} ${y} L ${i % 2 ? 548 : 562} ${y - 20}`;
  return (
    <>
      <Line d={`M 30 ${ground} L 590 ${ground}`} w={1.8} dur={1} />
      {blocks.map((b, i) => {
        const last = i === blocks.length - 1;
        const solid = last ? b.h - 50 : b.h;
        return (
          <g key={i}>
            <Shape d={rect(b.x, ground - solid, b.x + b.w, ground)} t={0.2 + i * 0.12} w={1.8} o={last ? 0.95 : 0.7} />
            <Line d={floors(b, solid)} w={1} o={0.45} t={0.5 + i * 0.12} dur={0.6} />
            {last ? <Guide d={poly([[b.x, ground - solid], [b.x, ground - b.h], [b.x + b.w, ground - b.h], [b.x + b.w, ground - solid]])} t={1.2} o={0.55} /> : null}
          </g>
        );
      })}
      <Line d={mast} w={1.2} o={0.7} t={1} dur={1} />
      <Line d="M 400 130 L 600 130 M 555 92 L 400 130 M 555 92 L 600 130 M 555 92 L 555 120" w={1.4} t={1.3} dur={0.7} />
      <Fade t={1.6}><path d={rect(578, 130, 600, 146)} fill={INK} fillOpacity={0.75} /></Fade>
      <Line d="M 470 130 L 470 172 M 470 172 C 470 180, 462 180, 462 174" w={1.2} t={1.6} dur={0.5} />
      <Shape d={rect(448, 180, 492, 186)} w={1.2} t={1.8} dur={0.3} o={0.95} />
      <Line d={`M 60 488 L 540 488` + years.map((x, i) => ` M ${n(x)} 488 L ${n(x)} ${i % 7 === 0 || i === 23 ? 476 : 482}`).join("")} w={1} o={0.6} t={1.4} dur={0.8} />
      {[0, 7, 14, 23].map((i) => <Label key={i} x={years[i]} y={516} anchor="middle" t={1.8} size={14}>{2003 + i}</Label>)}
    </>
  );
}

/** One-point perspective of an office interior. */
function Room() {
  const vp: P = [300, 300], k = 0.38;
  const at = (x: number, y: number, s: number): P => [vp[0] + (x - vp[0]) * s, vp[1] + (y - vp[1]) * s];
  const [bx1, by1] = at(60, 80, k), [bx2, by2] = at(540, 520, k);
  const tiles = [140, 220, 300, 380, 460].map((x) => poly([at(x, 520, k), [x, 520]])).join(" ") + " " + [0.5, 0.68].map((s) => poly([at(60, 520, s), at(540, 520, s)])).join(" ");
  const strips = [220, 380].map((x) => poly([[x, 80], at(x, 80, k)])).join(" ");
  const wall = (side: -1 | 1, s: number, f: number): P => [vp[0] + side * 240 * s, vp[1] + 220 * f * s];
  const art = poly([wall(-1, 0.85, -0.5), wall(-1, 0.6, -0.5), wall(-1, 0.6, 0.1), wall(-1, 0.85, 0.1)], true);
  const door = poly([wall(1, 0.78, -0.35), wall(1, 0.56, -0.35), wall(1, 0.56, 1), wall(1, 0.78, 1)], true);
  const glazing = rect(bx1 + 14, by1 + 14, bx2 - 14, by2 - 30);
  const mullions = [1, 2].map((i) => { const x = bx1 + 14 + ((bx2 - bx1 - 28) * i) / 3; return `M ${n(x)} ${n(by1 + 14)} L ${n(x)} ${n(by2 - 30)}`; }).join(" ") + ` M ${n(bx1 + 14)} ${n(by1 + 70)} L ${n(bx2 - 14)} ${n(by1 + 70)}`;
  const slope = (y: number, side: -1 | 1) => 300 + side * 100 * ((y - 300) / 155);
  const top = poly([[slope(420, -1), 420], [slope(420, 1), 420], [slope(455, 1), 455], [slope(455, -1), 455]], true);
  return (
    <>
      <Line d={rect(60, 80, 540, 520)} w={1.2} o={0.5} dur={1.2} />
      <Line d={[[60, 80], [540, 80], [540, 520], [60, 520]].map(([x, y]) => poly([[x, y], at(x, y, k)])).join(" ")} w={1.6} t={0.2} />
      <Shape d={rect(bx1, by1, bx2, by2)} t={0.4} w={1.8} o={0.35} />
      <Plane d={glazing} t={0.9} o={0.75} />
      <Line d={glazing + " " + mullions} w={1.2} t={0.8} />
      <Line d={tiles} w={1} o={0.4} t={0.9} dur={1} />
      <Line d={strips} w={2} o={0.5} t={1} />
      <Shape d={art} w={1.4} t={1.1} o={0.6} />
      <Line d={door + " " + poly([wall(1, 0.6, 0.3), wall(1, 0.6, 0.38)])} w={1.4} t={1.2} />
      <Line d="M 255 120 L 255 228 M 345 120 L 345 228" w={1} o={0.6} t={1.2} dur={0.4} />
      <Shape d="M 236 250 C 238 232, 272 232, 274 250 Z M 326 250 C 328 232, 362 232, 364 250 Z" w={1.4} t={1.4} dur={0.5} o={0.95} />
      <Shape d={top} w={1.6} t={1.4} o={0.95} />
      <Line d={`M ${n(slope(455, -1))} 461 L ${n(slope(455, 1))} 461 M ${n(slope(455, -1) + 8)} 461 L ${n(slope(455, -1) + 8)} 505 M ${n(slope(455, 1) - 8)} 461 L ${n(slope(455, 1) - 8)} 505`} w={1.4} t={1.6} dur={0.5} />
      <Shape d="M 98 470 L 142 470 L 136 505 L 104 505 Z" w={1.3} t={1.5} dur={0.4} />
      <Line d="M 120 470 C 110 440, 95 430, 82 425 M 120 470 C 120 440, 125 425, 132 405 M 120 470 C 135 445, 150 440, 162 436" w={1.3} t={1.7} dur={0.6} />
    </>
  );
}

/** Two quotation marks set out with construction lines. */
function Quote() {
  const marks: P[] = [[215, 330], [385, 330]];
  return (
    <>
      <Guide d="M 90 388 L 510 388 M 90 182 L 510 182" t={0.1} />
      {marks.map(([x, y], i) => (
        <g key={i}>
          <Guide d={circle(x, y, 82) + ` M ${x} 160 L ${x} 420`} t={0.2 + i * 0.1} o={0.3} />
          <Shape d={circle(x, y, 58)} t={0.4 + i * 0.2} w={2} o={0.92} />
          <Line d={`M ${x - 58} ${y} C ${x - 58} ${y - 80}, ${x - 20} ${y - 132}, ${x + 40} ${y - 148}`} w={2} t={0.8 + i * 0.2} />
        </g>
      ))}
      <Line d="M 385 330 L 426 289" w={1} o={0.55} t={1.5} dur={0.4} />
      <Label x={432} y={284} t={1.7} size={14}>R 58</Label>
    </>
  );
}

/** A certification seal: ringed, ticked, ribboned. */
function Seal() {
  const cx = 300, cy = 270;
  let ticks = "";
  for (let i = 0; i < 72; i++) {
    const a = (i / 72) * Math.PI * 2, r2 = i % 6 === 0 ? 164 : 156;
    ticks += ` M ${n(cx + Math.cos(a) * 146)} ${n(cy + Math.sin(a) * 146)} L ${n(cx + Math.cos(a) * r2)} ${n(cy + Math.sin(a) * r2)}`;
  }
  return (
    <>
      <Shape d="M 255 434 L 222 556 L 248 540 L 268 562 L 296 446 Z M 345 434 L 378 556 L 352 540 L 332 562 L 304 446 Z" w={1.6} t={1.2} o={0.9} />
      <Shape d={circle(cx, cy, 175)} w={2.2} dur={1.2} o={0.95} />
      <Line d={circle(cx, cy, 136)} w={1.3} t={0.3} dur={1.2} />
      <Line d={ticks} w={1} o={0.55} t={0.6} dur={1} />
      <Guide d={circle(cx, cy, 105)} t={0.9} o={0.3} />
      <Line d="M 236 276 L 284 322 L 372 218" w={3.2} t={1} dur={0.7} />
    </>
  );
}

/** A clipboard checklist, three items done. */
function Checklist() {
  const rows = [205, 270, 335, 400, 465];
  return (
    <>
      <Shape d="M 168 110 L 432 110 Q 450 110 450 128 L 450 512 Q 450 530 432 530 L 168 530 Q 150 530 150 512 L 150 128 Q 150 110 168 110 Z" w={2.2} dur={1.2} o={0.5} />
      <Shape d={rect(176, 152, 424, 506)} w={1.2} t={0.3} o={0.95} />
      <Shape d="M 252 88 L 348 88 Q 360 88 360 100 L 360 140 L 240 140 L 240 100 Q 240 88 252 88 Z" w={1.8} t={0.4} o={0.95} />
      <Line d={circle(300, 104, 8)} w={1.4} t={0.6} dur={0.4} />
      {rows.map((y, i) => (
        <g key={i}>
          <Line d={rect(198, y - 14, 226, y + 14)} w={1.6} t={0.6 + i * 0.12} dur={0.4} />
          <Line d={`M 246 ${y - 4} L ${400 - (i % 2) * 40} ${y - 4} M 246 ${y + 10} L ${330 - (i % 3) * 20} ${y + 10}`} w={1.2} o={0.45} t={0.7 + i * 0.12} dur={0.5} />
          {i < 3 ? <Line d={`M 203 ${y} L 211 ${y + 8} L 230 ${y - 16}`} w={2.6} t={1.3 + i * 0.15} dur={0.35} /> : null}
        </g>
      ))}
    </>
  );
}

/** An open door with light spilling in. */
function Door() {
  return (
    <>
      <Line d="M 40 500 L 560 500" w={1.6} dur={1} />
      <Plane d="M 220 500 L 380 500 L 480 590 L 170 590 Z" t={1} o={0.55} />
      <Guide d="M 220 500 L 170 590 M 380 500 L 480 590" t={1.1} o={0.3} />
      <Shape d={rect(220, 110, 380, 500)} t={0.2} w={1.4} o={0.8} />
      <Line d="M 205 500 L 205 95 L 395 95 L 395 500" w={2.2} t={0.1} dur={1} />
      <Shape d="M 220 110 L 140 86 L 140 528 L 220 500 Z" t={0.7} w={2} o={0.35} />
      <Line d="M 150 300 L 150 330" w={2.6} t={1.3} dur={0.3} />
      <Line d="M 180 140 L 180 470" w={1} o={0.35} t={1.2} dur={0.6} />
    </>
  );
}

/** An open book with ruled pages. */
function Book() {
  const lines = [240, 268, 296, 324, 352, 380].map((y) => `M 120 ${y} C 170 ${y - 14}, 235 ${y - 14}, 278 ${y + 4} M 480 ${y} C 430 ${y - 14}, 365 ${y - 14}, 322 ${y + 4}`).join(" ");
  return (
    <>
      <Line d="M 90 466 C 150 446, 250 446, 300 476 C 350 446, 450 446, 510 466 M 90 458 C 150 438, 250 438, 300 468 C 350 438, 450 438, 510 458" w={1.1} o={0.5} t={0.8} />
      <Shape d="M 300 200 C 250 170, 150 170, 90 190 L 90 450 C 150 430, 250 430, 300 460 Z" w={2} dur={1} o={0.92} />
      <Shape d="M 300 200 C 350 170, 450 170, 510 190 L 510 450 C 450 430, 350 430, 300 460 Z" w={2} t={0.15} dur={1} o={0.92} />
      <Line d="M 300 200 L 300 460" w={1.4} t={0.6} dur={0.5} />
      <Line d={lines} w={1.1} o={0.4} t={0.9} dur={1} />
      <Fade t={1.4}><path d="M 400 180 L 400 268 L 412 256 L 424 268 L 424 176" fill={INK} fillOpacity={0.8} /></Fade>
    </>
  );
}

/** A drafting compass mid-arc. */
function Compass() {
  return (
    <>
      <Guide d="M 110 490 L 500 490 M 198 490 L 404 490" t={0.1} />
      <Line d="M 404 490 A 206 206 0 0 0 366.7 371.8" w={2.4} t={1.4} dur={0.6} />
      <Label x={300} y={518} anchor="middle" t={1.7} size={14}>R 206</Label>
      <Line d="M 293 124 L 200 470 M 200 470 L 198 490" w={3} t={0.3} dur={0.8} />
      <Line d="M 307 124 L 392 420" w={3} t={0.4} dur={0.8} />
      <Shape d="M 385 420 L 403 415 L 412 460 L 396 465 Z" w={1.6} t={0.9} dur={0.4} o={0.95} />
      <Line d="M 404 462 L 404 490" w={2} t={1.1} dur={0.3} />
      <Line d="M 251 280 L 352 280" w={1.6} t={1} dur={0.4} />
      <Shape d={circle(301, 280, 9)} w={1.4} t={1.1} dur={0.4} o={0.95} />
      <Shape d={circle(300, 110, 18)} w={2} t={0.1} dur={0.6} o={0.95} />
      <Line d="M 300 92 L 300 52" w={3} t={0.2} dur={0.4} />
    </>
  );
}

/** Balance scales, level. */
function Scales() {
  const pan = (x: number, t: number) => (
    <>
      <Line d={`M ${x} 178 L ${x - 52} 330 M ${x} 178 L ${x + 52} 330`} w={1.2} o={0.6} t={t} dur={0.5} />
      <Shape d={`M ${x - 62} 330 C ${x - 50} 378, ${x + 50} 378, ${x + 62} 330 Z`} w={1.8} t={t + 0.3} o={0.92} />
    </>
  );
  return (
    <>
      <Line d="M 300 140 L 300 470" w={2.6} dur={0.8} />
      <Shape d="M 220 500 L 380 500 L 350 470 L 250 470 Z" w={2} t={0.3} o={0.92} />
      <Line d="M 140 178 L 460 178" w={2.6} t={0.5} dur={0.7} />
      <Shape d={circle(300, 178, 8)} w={1.6} t={0.8} dur={0.3} o={0.95} />
      <Shape d={circle(300, 128, 11)} w={1.6} t={0.2} dur={0.4} o={0.95} />
      {pan(150, 0.9)}
      {pan(450, 1)}
      <Guide d="M 80 178 L 520 178" t={1.5} o={0.25} />
    </>
  );
}

/** A month on the wall planner, with leave marked. */
function Calendar() {
  const x0 = 110, x1 = 490, col = (x1 - x0) / 7;
  const rows = [200, 260, 320, 380, 440, 500];
  const grid = rows.slice(1, -1).map((y) => `M ${x0} ${y} L ${x1} ${y}`).join(" ") + " " + [1, 2, 3, 4, 5, 6].map((i) => `M ${n(x0 + col * i)} 200 L ${n(x0 + col * i)} 500`).join(" ");
  const cell = (r: number, c: number): P => [x0 + col * (c + 0.5), rows[r] + 30];
  return (
    <>
      <Shape d="M 130 130 L 470 130 Q 490 130 490 150 L 490 480 Q 490 500 470 500 L 130 500 Q 110 500 110 480 L 110 150 Q 110 130 130 130 Z" w={2.2} dur={1.2} o={0.92} />
      <Plane d={rect(x0 + col * 5, 200, x1 - 0.5, 499)} t={0.9} o={0.5} color={INK} />
      <Line d={`M ${x0} 200 L ${x1} 200`} w={1.8} t={0.4} dur={0.6} />
      <Line d={grid} w={1} o={0.35} t={0.6} dur={1} />
      <Line d="M 200 108 L 200 152 M 400 108 L 400 152" w={5} t={0.3} dur={0.4} />
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <Label key={i} x={x0 + col * (i + 0.5)} y={178} anchor="middle" t={0.8} size={14}>{d}</Label>)}
      {[[1, 1], [1, 2], [1, 3]].map(([r, c], i) => { const [x, y] = cell(r, c); return <Fade key={i} t={1.2 + i * 0.1}><path d={circle(x, y, 13)} fill={INK} fillOpacity={0.85} /></Fade>; })}
      {(() => { const [x, y] = cell(3, 4); return <Line d={circle(x, y, 14)} w={1.8} t={1.6} dur={0.5} />; })()}
    </>
  );
}

/** A safety helmet in profile. */
function Helmet() {
  return (
    <>
      <Guide d="M 90 430 L 530 430" t={0.1} o={0.3} />
      <Shape d="M 150 380 C 150 236, 250 178, 320 176 C 420 178, 470 262, 470 380 Z" w={2.2} dur={1.2} o={0.92} />
      <Shape d="M 110 380 L 520 380 C 528 394, 518 404, 500 404 L 124 404 C 106 404, 100 392, 110 380 Z" w={2} t={0.6} o={0.95} />
      <Line d="M 255 380 C 248 300, 268 216, 312 178 M 365 380 C 372 300, 364 216, 330 177" w={1.4} o={0.6} t={1} />
      <Line d="M 160 352 L 462 352" w={1.2} o={0.5} t={1.2} dur={0.6} />
      <Shape d={rect(186, 302, 236, 336)} w={1.3} t={1.4} dur={0.4} o={0.95} />
    </>
  );
}

/** A shield with a keyhole. */
function Shield() {
  const outline = (s: number) => {
    const pts: P[] = [[300, 110], [470, 170], [470, 300]];
    const f = ([x, y]: P): P => [300 + (x - 300) * s, 315 + (y - 315) * s];
    const [a, b, c] = pts.map(f), [l1, l2] = ([[130, 170], [130, 300]] as P[]).map(f);
    const q1 = f([470, 410]), q2 = f([390, 480]), e = f([300, 520]), q3 = f([210, 480]), q4 = f([130, 410]);
    return `M ${n(a[0])} ${n(a[1])} L ${n(b[0])} ${n(b[1])} L ${n(c[0])} ${n(c[1])} C ${n(q1[0])} ${n(q1[1])}, ${n(q2[0])} ${n(q2[1])}, ${n(e[0])} ${n(e[1])} C ${n(q3[0])} ${n(q3[1])}, ${n(q4[0])} ${n(q4[1])}, ${n(l2[0])} ${n(l2[1])} L ${n(l1[0])} ${n(l1[1])} Z`;
  };
  return (
    <>
      <Shape d={outline(1)} w={2.4} dur={1.4} o={0.92} />
      <Guide d={outline(0.84)} t={0.8} o={0.4} />
      <Fade t={1.2}><path d={circle(300, 285, 32) + " M 284 306 L 274 386 L 326 386 L 316 306 Z"} fill={INK} fillOpacity={0.85} /></Fade>
    </>
  );
}

/** An open laptop in isometric. */
function Laptop() {
  const o = (x: number, y: number, z: number) => iso(x, y, z, 260, 280);
  const S = (u: number, h: number) => o(u, (-35 * h) / 200, h);
  const base = poly([o(0, 0, 0), o(300, 0, 0), o(300, 200, 0), o(0, 200, 0)], true);
  const edge = poly([o(0, 200, 0), o(0, 200, -10), o(300, 200, -10), o(300, 0, -10), o(300, 0, 0)]) + " " + poly([o(300, 200, 0), o(300, 200, -10)]);
  const screen = poly([S(0, 0), S(300, 0), S(300, 200), S(0, 200)], true);
  const glass = poly([S(16, 16), S(284, 16), S(284, 188), S(16, 188)], true);
  let keys = "";
  for (let x = 30; x <= 270; x += 24) keys += " " + poly([o(x, 30, 0), o(x, 120, 0)]);
  for (let y = 30; y <= 120; y += 18) keys += " " + poly([o(30, y, 0), o(270, y, 0)]);
  const code = [[40, 160, 150], [40, 136, 210], [64, 112, 120], [64, 88, 180], [40, 64, 90]].map(([u, h, len]) => poly([S(u, h), S(u + len, h)])).join(" ");
  return (
    <>
      <Shape d={base} w={2} dur={1} o={0.9} />
      <Line d={edge} w={1.4} t={0.5} />
      <Line d={keys} w={0.9} o={0.35} t={0.8} dur={1} />
      <Shape d={poly([o(110, 140, 0), o(190, 140, 0), o(190, 185, 0), o(110, 185, 0)], true)} w={1.2} t={1} dur={0.4} o={0.95} />
      <Shape d={screen} w={2} t={0.3} dur={1} o={0.5} />
      <Plane d={glass} t={0.9} o={0.95} />
      <Line d={glass} w={1.2} t={0.8} />
      <Line d={code} w={2.2} o={0.5} t={1.3} dur={0.8} />
    </>
  );
}

/** The way out: an exit sign over a door. */
function Exit() {
  return (
    <>
      <Line d="M 40 510 L 560 510" w={1.6} dur={1} />
      <Fade t={0.2}><path d="M 198 80 L 402 80 Q 410 80 410 88 L 410 142 Q 410 150 402 150 L 198 150 Q 190 150 190 142 L 190 88 Q 190 80 198 80 Z" fill={INK} fillOpacity={0.88} /></Fade>
      <Label x={282} y={128} anchor="middle" t={0.5} size={34} color="#ffffff" o={1} weight={600} spacing="0.18em">Exit</Label>
      <Fade t={0.6}><path d="M 352 115 L 384 115 M 372 103 L 384 115 L 372 127" fill="none" stroke="#ffffff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" /></Fade>
      <Line d="M 205 510 L 205 180 L 395 180 L 395 510" w={2.2} t={0.3} />
      <Shape d={rect(220, 195, 380, 510)} w={1.4} t={0.5} o={0.6} />
      <Shape d={rect(248, 222, 352, 320)} w={1.3} t={0.9} dur={0.5} o={0.95} />
      <Line d="M 236 372 L 364 372" w={4} t={1.1} dur={0.4} />
      <Guide d="M 40 590 C 120 570, 200 548, 268 520" t={1.3} o={0.55} />
      <Line d="M 248 512 L 270 519 L 254 536" w={2} t={1.5} dur={0.3} />
    </>
  );
}

/** A key, drawn to its centreline. */
function Key() {
  return (
    <>
      <Guide d="M 70 300 L 560 300 M 190 170 L 190 430" t={0.1} o={0.3} />
      <Guide d={circle(190, 300, 110)} t={0.2} o={0.25} />
      <Shape d={circle(190, 300, 80)} w={2.4} dur={1} o={0.92} />
      <Line d={circle(190, 300, 30)} w={1.8} t={0.5} dur={0.6} />
      <Shape d="M 268 285 L 520 285 L 520 315 L 482 315 L 482 345 L 456 345 L 456 315 L 432 315 L 432 335 L 408 335 L 408 315 L 268 315" w={2.2} t={0.6} dur={1} o={0.92} />
      <Line d="M 300 285 L 300 315 M 312 285 L 312 315" w={1.2} o={0.6} t={1.3} dur={0.3} />
    </>
  );
}

const SKETCHES = {
  plan: Plan,
  layers: Layers,
  route: Route,
  people: People,
  timeline: Timeline,
  room: Room,
  quote: Quote,
  seal: Seal,
  checklist: Checklist,
  door: Door,
  book: Book,
  compass: Compass,
  scales: Scales,
  calendar: Calendar,
  helmet: Helmet,
  shield: Shield,
  laptop: Laptop,
  exit: Exit,
  key: Key,
};

export type SketchName = keyof typeof SKETCHES;

/** One divider drawing, fitted to its box. `delay` holds the whole drawing back. */
export function Sketch({ name, delay = 0.3, className }: { name: SketchName; delay?: number; className?: string }) {
  const Drawing = SKETCHES[name];
  return (
    <svg viewBox="0 0 600 600" className={className} overflow="visible" aria-hidden="true">
      <Offset.Provider value={delay}><Drawing /></Offset.Provider>
    </svg>
  );
}
