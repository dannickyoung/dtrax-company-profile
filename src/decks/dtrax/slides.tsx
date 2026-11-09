"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import { Award, Calculator, Eye, HardHat, Key, PenTool, Wrench, X, ZoomIn } from "lucide-react";
import { CountUp, Reveal, useDeck, type DeckSlide } from "@/components/deck/Deck";
import { Beam, BlurText, Float } from "@/components/deck/fx";
import { Sketch, type SketchName } from "@/components/deck/vectors";
import { cn } from "@/lib/utils";
import {
  BCA_LOGO, CARD_QR, CERT, CERTIFICATIONS, CLIENT_LOGO, FEATURED, FOCUS, HEADSHOT, IN_PROGRESS, JAYNE, LEADERS, LOGO, OFFICE, ORG_TEAMS, RECENT, RONALD, SERVICES, STAGES, TEAM_PHOTO, TESTIMONIALS, WABTEC,
  featured,
  type Leader, type Project,
} from "./data";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], display: "swap" });

/* ────────────────────────────────────────────────────────────────
   Brand: D'trax ink on white, with pink, blue and lime used as
   flat fields and small accents. Restraint over decoration:
   medium-weight display type, serif italic for emphasis, light
   body text, hairline rules, still photographs.
   ──────────────────────────────────────────────────────────────── */

const INK = "#151515";
const PINK = "#FFB6B6";
const BLUE = "#9DD6FF";
const LIME = "#DDFF97";
type Tone = "pink" | "blue" | "lime";
const TONE: Record<Tone, string> = { pink: PINK, blue: BLUE, lime: LIME };
const TONES: Tone[] = ["lime", "blue", "pink"];

const MUTED = "text-[#6E6E73]";
const BODY = "font-light text-[#55555A]";
const BODY_DARK = "font-light text-white/65";
const RULE = "border-[#151515]/12";
const MIST = "bg-[#F4F4F2]";

const SECTIONS = {
  about: { n: "01", label: "About D'trax", tone: "lime" },
  services: { n: "02", label: "Services & capabilities", tone: "blue" },
  approach: { n: "03", label: "Our delivery approach", tone: "pink" },
  team: { n: "04", label: "Our team", tone: "lime" },
  record: { n: "05", label: "Track record", tone: "blue" },
  projects: { n: "06", label: "Featured projects", tone: "lime" },
  testimonials: { n: "07", label: "Testimonials", tone: "pink" },
  certs: { n: "08", label: "Certifications & awards", tone: "blue" },
} as const satisfies Record<string, { n: string; label: string; tone: Tone }>;
type Section = keyof typeof SECTIONS;

function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return <img src={LOGO.dark} alt="D'trax" draggable={false} className={cn("w-auto object-contain", className)} style={light ? { filter: "brightness(0) invert(1)" } : undefined} />;
}

/** Serif italic emphasis. */
function Em({ children, color }: { children: ReactNode; color?: string }) {
  return <span className={cn(serif.className, "font-normal italic tracking-[-0.01em]")} style={color ? { color } : undefined}>{children}</span>;
}

/** Every slide shares this chrome: section label and logo at the top, company line and page number at the foot, always in the same place. */
function Frame({ page, section, dark = false, background, bare = false, children }: { page: number; section?: Section; dark?: boolean; background?: string; bare?: boolean; children: ReactNode }) {
  const meta = section ? SECTIONS[section] : null;
  return (
    <div className={cn(sans.className, "absolute inset-0 overflow-hidden", dark ? "bg-[#151515] text-white" : "bg-white text-[#151515]")} style={background ? { background } : undefined}>
      {children}
      {bare ? null : <>
      <header className="pointer-events-none absolute left-[160px] right-[160px] top-[64px] z-10 flex items-center justify-between">
        <span className={cn("flex items-center gap-4 text-[17px] font-medium uppercase tracking-[0.2em]", dark ? "text-white/60" : "text-[#151515]/55")}>
          {meta ? <><span className={dark ? "text-white" : "text-[#151515]"}>{meta.n}</span><span className="h-px w-[36px] bg-current" />{meta.label}</> : null}
        </span>
        <Logo light={dark} className="h-[42px]" />
      </header>
      <footer className={cn("pointer-events-none absolute bottom-[52px] left-[160px] right-[160px] z-10 flex items-center justify-between text-[16px] font-light", dark ? "text-white/45" : "text-[#151515]/45")}>
        <span>D&apos;trax Design Pte Ltd · Company Profile 2026</span>
        <span className="tabular-nums">{page}</span>
      </footer>
      </>}
    </div>
  );
}

function H({ children, size = 96, className }: { children: ReactNode; size?: number; className?: string }) {
  return <h2 className={cn("font-medium tracking-[-0.045em] [text-wrap:balance]", className)} style={{ fontSize: size, lineHeight: 1.04 }}><BlurText>{children}</BlurText></h2>;
}

function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <p className={cn("text-[18px] font-medium uppercase tracking-[0.2em]", dark ? "text-white/55" : "text-[#151515]/50", className)}>{children}</p>;
}

function Photo({ src, alt, className, position }: { src: string; alt: string; className?: string; position?: string }) {
  return (
    <div className={cn("overflow-hidden", !className?.includes("absolute") && "relative", className)}>
      <img src={src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position ?? FOCUS[src] ?? "50% 50%" }} />
    </div>
  );
}

/** Slow push-in on a photograph. Prints the resting frame. */
function Drift({ src, alt, position, className }: { src: string; alt: string; position?: string; className?: string }) {
  const { print } = useDeck();
  return (
    <div className={cn("overflow-hidden", !className?.includes("absolute") && "relative", className)}>
      <motion.img src={src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position ?? FOCUS[src] ?? "50% 50%" }} initial={print ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: [0.16, 1, 0.3, 1] }} />
    </div>
  );
}

function Initials({ name, size }: { name: string; size: number }) {
  return (
    <span className="flex items-center justify-center rounded-full bg-[#F4F4F2] font-medium text-[#151515]/70" style={{ width: size, height: size, fontSize: size * 0.3 }}>
      {name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
    </span>
  );
}

/** A client logo sized to a fixed visual area, so wide and tall marks carry the same weight. */
function LogoMark({ name, area, maxHeight = 130, maxWidth = Infinity }: { name: string; area: number; maxHeight?: number; maxWidth?: number }) {
  const ref = useRef<HTMLImageElement>(null);
  const [aspect, setAspect] = useState(3);
  const measure = (img: HTMLImageElement | null) => { if (img?.naturalWidth) setAspect(img.naturalWidth / img.naturalHeight); };
  useEffect(() => measure(ref.current), []);
  const height = Math.min(maxHeight, Math.sqrt(area / aspect), maxWidth / aspect);
  return (
    <img
      ref={ref}
      src={CLIENT_LOGO[name]}
      alt={name}
      draggable={false}
      onLoad={(event) => measure(event.currentTarget)}
      style={{ height, width: height * aspect }}
      className="object-contain"
    />
  );
}

function Dot({ tone, size = 10 }: { tone: Tone; size?: number }) {
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: TONE[tone] }} />;
}

/** A soft curved line from a to b, bowed sideways by `bend` (a fraction of its length). */
type Pt = { x: number; y: number };
const curve = (a: Pt, b: Pt, bend = 0.12) => {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
  return `M ${a.x} ${a.y} Q ${mx - dy * bend} ${my + dx * bend} ${b.x} ${b.y}`;
};

/* ────────────────────────────────────────────────────────────────
   Cover and section dividers
   ──────────────────────────────────────────────────────────────── */

function Cover() {
  return (
    <Frame page={1} dark bare>
      <Drift src={TEAM_PHOTO.cover} alt="Ronald Goh and Jayne Ong reviewing material samples in the D'trax studio" position="50% 56%" className="absolute inset-y-0 left-[560px] right-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,21,21,1)_0%,rgba(21,21,21,1)_29%,rgba(21,21,21,0.82)_40%,rgba(21,21,21,0.45)_55%,rgba(21,21,21,0)_78%)]" />
      <div className="absolute bottom-[150px] left-[160px] w-[1100px]">
        <Reveal from="fade"><Logo light className="h-[110px]" /></Reveal>
        <Reveal delay={0.15}><Eyebrow dark className="mt-16">D&apos;trax Design Pte Ltd</Eyebrow></Reveal>
        <h1 className="mt-6 font-medium tracking-[-0.05em] text-white" style={{ fontSize: 160, lineHeight: 0.98 }}>
          <BlurText delay={0.3} stagger={0.14}>Company<br />Profile <Em color={LIME}>2026</Em></BlurText>
        </h1>
        <Reveal delay={0.9} className="mt-12 flex items-center gap-8 border-t border-white/20 pt-8">
          <p className="text-[27px] font-normal tracking-[-0.02em] text-white">Imagine. Design. <Em>Inspire.</Em></p>
          <span className="h-[28px] w-px bg-white/25" />
          <p className={cn("text-[19px]", BODY_DARK)}>Commercial offices, designed and built in Singapore since 2003.</p>
        </Reveal>
      </div>
    </Frame>
  );
}

/** Section break: a flat field of brand colour, one big line, and a line drawing for the section. */
function Divider({ page, section, title, line, sketch }: { page: number; section: Section; title: ReactNode; line: ReactNode; sketch: SketchName }) {
  const meta = SECTIONS[section];
  return (
    <Frame page={page} background={TONE[meta.tone]}>
      <Sketch name={sketch} className="absolute right-[160px] top-[200px] h-[640px] w-[640px]" />
      <div className="absolute bottom-[190px] left-[160px] w-[900px]">
        <Reveal from="fade"><p className={cn(serif.className, "italic leading-none text-[#151515]/35")} style={{ fontSize: 200 }}>{meta.n}</p></Reveal>
        <h2 className="mt-4 font-medium tracking-[-0.05em] [text-wrap:balance]" style={{ fontSize: 120, lineHeight: 1.02 }}><BlurText delay={0.15} stagger={0.08}>{title}</BlurText></h2>
        <Reveal delay={0.6} className="mt-10 border-t border-[#151515]/25 pt-7">
          <p className="text-[28px] font-light text-[#151515]/75">{line}</p>
        </Reveal>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   01 · About
   ──────────────────────────────────────────────────────────────── */

function AboutStatement({ page }: { page: number }) {
  return (
    <Frame page={page} section="about">
      <Reveal from="fade" delay={0.2} className="absolute bottom-[150px] right-[160px] top-[170px] w-[600px]">
        <Drift src={OFFICE.meeting} alt="D'trax meeting room" position="40% 50%" className="h-full w-full rounded-[28px]" />
      </Reveal>
      <div className="absolute left-[160px] top-[250px] w-[1000px]">
        <Reveal><p className={cn("text-[31px]", MUTED)}><Em>Imagine. Design. Inspire.</Em></p></Reveal>
        <H size={71} className="mt-8">Since 2003, D’trax Design has designed and built <Em>commercial offices</Em> in Singapore.</H>
        <Reveal delay={0.8}><p className={cn("mt-12 max-w-[820px] border-t pt-8 text-[24px] leading-[1.55]", RULE, BODY)}>One team designs, costs and builds every project, from the first brief to the day you move in.</p></Reveal>
      </div>
    </Frame>
  );
}

function AboutStats({ page }: { page: number }) {
  const stats = [
    { value: 100, suffix: "+", label: "offices delivered since 2003", tone: "lime" as Tone },
    { value: 37, suffix: "%", label: "of our projects in the last 5 years came from returning clients", tone: "pink" as Tone },
  ];
  return (
    <Frame page={page} section="about">
      <div className="absolute left-[160px] right-[160px] top-[180px]">
        <H size={54}>In <Em>numbers</Em></H>
        <div className="mt-24 grid grid-cols-2 gap-24">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={0.2 + index * 0.15} className={cn("border-t pt-10", RULE)}>
              <div className="flex items-center gap-4"><Dot tone={stat.tone} size={14} /><Eyebrow>{index ? "Returning clients" : "Track record"}</Eyebrow></div>
              <p className="mt-8 font-medium leading-none tracking-[-0.06em]" style={{ fontSize: 238 }}><CountUp value={stat.value} suffix={stat.suffix} delay={0.4 + index * 0.2} /></p>
              <p className={cn("mt-8 max-w-[640px] text-[26px] leading-[1.4]", BODY)}>{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function WhyDtrax({ page }: { page: number }) {
  const pillars: { tone: Tone; title: string; body: string; media: ReactNode }[] = [
    {
      tone: "lime", title: "One team, from brief to handover.", body: "In-house design, costing and construction, with buddy-system continuity.",
      media: <Drift src={TEAM_PHOTO.foundersPortrait} alt="The D'trax team at work" position="50% 40%" className="absolute inset-0" />,
    },
    {
      tone: "blue", title: "Certified and compliant.", body: "ISO 45001:2018 · bizSAFE Star · BCA-registered, CR06 Interior Decoration & Finishing Works (L3).",
      media: (
        <div className={cn("absolute inset-0 flex items-center justify-center gap-6 px-10", MIST)}>
          {[CERT.iso, CERT.bizsafe].map((src, i) => <img key={src} src={src} alt={i ? "bizSAFE Star certificate" : "ISO 45001 certificate"} draggable={false} className="h-[270px] w-auto bg-white object-contain shadow-[0_14px_36px_rgba(21,21,21,0.12)]" />)}
        </div>
      ),
    },
    {
      tone: "pink", title: "Award-winning.", body: "SIDA 2023 Bronze, Best in Workplace Design, for the Group-IB (Innovis) office.",
      media: (
        <>
          <Drift src={featured("Group-IB (Innovis)").photos[2]} alt="Group-IB (Innovis) office" className="absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/70 to-transparent" />
          <span className="absolute bottom-6 left-7 flex items-center gap-3 text-[18px] font-medium uppercase tracking-[0.18em] text-white"><Award className="h-[22px] w-[22px]" strokeWidth={1.5} />SIDA 2023 Bronze</span>
        </>
      ),
    },
  ];
  return (
    <Frame page={page} section="about">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <H size={65}>Why clients choose <Em>D&apos;trax</Em></H>
        <div className="mt-14 grid grid-cols-3 gap-10">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={0.3 + index * 0.15}>
              <div className="relative h-[340px] overflow-hidden rounded-[24px]">{pillar.media}</div>
              <div className="mt-8 flex items-center gap-4">
                <span className={cn(serif.className, "text-[29px] italic leading-none text-[#151515]/45")}>0{index + 1}</span>
                <span className="h-px flex-1 bg-[#151515]/12" />
                <Dot tone={pillar.tone} size={12} />
              </div>
              <p className="mt-6 text-[34px] font-medium leading-[1.1] tracking-[-0.035em]">{pillar.title}</p>
              <p className={cn("mt-4 text-[19px] leading-[1.55]", BODY)}>{pillar.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** Singapore at the centre, Hong Kong on the orbit: a wireframe in the brand gradient. The orbit's motion is decoration only. */
/** A circle drawn with a soft, blurred brand-gradient stroke. */
function GlowRing({ id, size, width = 2 }: { id: string; size: number; width?: number }) {
  const pad = 24, r = size / 2;
  return (
    <svg className="absolute" style={{ left: -pad, top: -pad }} width={size + pad * 2} height={size + pad * 2} viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={LIME} />
          <stop offset="50%" stopColor={BLUE} />
          <stop offset="100%" stopColor={PINK} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7" /></filter>
      </defs>
      <circle cx={r} cy={r} r={r} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth={width * 5} strokeOpacity={0.55} filter={`url(#${id}-blur)`} />
      <circle cx={r} cy={r} r={r} fill="none" stroke={`url(#${id}-stroke)`} strokeWidth={width} strokeOpacity={0.9} />
    </svg>
  );
}

function Associates({ page }: { page: number }) {
  const { print } = useDeck();
  const cx = 1330, cy = 590;
  const hk = { angle: -38, r: 280, size: 160 };
  const sg = 220;
  /* Live, Hong Kong travels round Singapore while its label stays upright. In print it rests at its starting angle. */
  const spin = print ? {} : { animate: { rotate: hk.angle + 360 }, transition: { duration: 48, repeat: Infinity, ease: "linear" as const } };
  const counter = print ? {} : { animate: { rotate: -(hk.angle + 360) }, transition: { duration: 48, repeat: Infinity, ease: "linear" as const } };
  return (
    <Frame page={page} section="about" dark>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        {[160, hk.r, 400].map((r) => <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke="#ffffff" strokeOpacity={r === hk.r ? 0.22 : 0.1} strokeWidth={1} />)}
      </svg>
      <Reveal from="scale" delay={0.2} className="absolute flex flex-col items-center justify-center" style={{ left: cx - sg / 2, top: cy - sg / 2, width: sg, height: sg }}>
        <GlowRing id="ring-sg" size={sg} />
        <span className="relative text-[30px] font-medium leading-none tracking-[-0.03em]">Singapore</span>
        <span className="relative mt-3 text-[20px] text-white/60"><Em>Headquarters</Em></span>
      </Reveal>
      <motion.div className="absolute" style={{ left: cx, top: cy, width: 0, height: 0, rotate: hk.angle }} initial={{ rotate: hk.angle }} {...spin}>
        <motion.div className="absolute" style={{ left: hk.r - hk.size / 2, top: -hk.size / 2, width: hk.size, height: hk.size, rotate: -hk.angle }} initial={{ rotate: -hk.angle }} {...counter}>
          <Reveal from="scale" delay={0.9} className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-[#151515]">
            <GlowRing id="ring-hk" size={hk.size} width={1.5} />
            <span className="relative text-[24px] font-medium leading-none tracking-[-0.03em]">Hong Kong</span>
            <span className="relative mt-2 text-[18px] text-white/60"><Em>Associate</Em></span>
          </Reveal>
        </motion.div>
      </motion.div>
      <div className="absolute left-[160px] top-[330px] w-[620px]">
        <H size={88}>Our <Em>associates</Em></H>
        <Reveal delay={0.6}><p className={cn("mt-8 border-t border-white/15 pt-7 text-[26px] leading-[1.5]", BODY_DARK)}>Headquartered in Singapore, with an associate in Hong Kong.</p></Reveal>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   02 · Services
   ──────────────────────────────────────────────────────────────── */

function ServicesStatement({ page }: { page: number }) {
  const nodes = [{ label: "Design", icon: PenTool }, { label: "Cost", icon: Calculator }, { label: "Build", icon: HardHat }];
  const xs = [460, 960, 1460], y = 690;
  return (
    <Frame page={page} section="services">
      <div className="absolute left-[160px] right-[160px] top-[270px] text-center">
        <H size={85}>We design, cost and build your office.</H>
        <Reveal delay={0.7}><p className="mt-6 text-[51px] tracking-[-0.02em] text-[#151515]/70"><Em>All in-house, all one team.</Em></p></Reveal>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        <Beam d={curve({ x: xs[0] + 66, y: y - 8 }, { x: xs[1] - 66, y: y - 8 }, -0.08)} color={BLUE} width={1.75} base="rgba(21,21,21,0.18)" appear={1.1} />
        <Beam d={curve({ x: xs[1] + 66, y: y - 8 }, { x: xs[2] - 66, y: y - 8 }, -0.08)} color={PINK} width={1.75} base="rgba(21,21,21,0.18)" appear={1.3} />
      </svg>
      {nodes.map((node, index) => (
        <Reveal key={node.label} from="scale" delay={0.9 + index * 0.2} className="absolute flex w-[220px] -translate-x-1/2 flex-col items-center" style={{ left: xs[index], top: y - 48 }}>
          <span className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-white" style={{ boxShadow: `0 0 0 1px rgba(21,21,21,0.08), 0 0 36px 10px ${TONE[TONES[index]]}` }}><node.icon className="h-[36px] w-[36px]" strokeWidth={1.25} /></span>
          <span className="mt-6 text-[29px] font-medium tracking-[-0.03em]">{node.label}</span>
        </Reveal>
      ))}
    </Frame>
  );
}

/** Services & capabilities: text only, as the client asked (no pictures). */
function ServicesDetail({ page }: { page: number }) {
  return (
    <Frame page={page} section="services">
      <div className="absolute left-[160px] right-[160px] top-[190px]">
        <H size={65}>Services &amp; <Em>capabilities</Em></H>
        <div className="mt-24 grid grid-cols-3">
          {SERVICES.map((service, index) => (
            <Reveal key={service.title} delay={0.3 + index * 0.15} className={cn("min-h-[520px] border-l px-12 first:border-l-0 first:pl-0 last:pr-0", RULE)}>
              <div className="flex items-center gap-4"><Dot tone={TONES[index]} size={12} /><span className={cn(serif.className, "text-[34px] italic leading-none text-[#151515]/45")}>0{index + 1}</span></div>
              <p className="mt-10 text-[41px] font-medium leading-[1.05] tracking-[-0.035em]">{service.title}</p>
              <ul className="mt-10">
                {service.items.map((item) => <li key={item} className={cn("border-t py-5 text-[22px] leading-snug", RULE, BODY)}>{item}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   03 · Delivery approach
   ──────────────────────────────────────────────────────────────── */

const STAGE_ICONS = [Eye, PenTool, Calculator, HardHat, Key, Wrench];

function ApproachOverview({ page }: { page: number }) {
  const xs = STAGES.map((_, i) => 290 + i * 268), y = 660;
  return (
    <Frame page={page} section="approach">
      <div className="absolute left-[160px] right-[160px] top-[190px]">
        <H size={75}>Six stages, <Em>one point of contact.</Em></H>
        <Reveal delay={0.6}><p className={cn("mt-8 max-w-[1300px] text-[24px] leading-[1.5]", BODY)}>At every stage, our buddy-system keeps your project moving, from brief to handover.</p></Reveal>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        {xs.slice(0, -1).map((x, i) => <Beam key={x} d={curve({ x: x + 58, y: y - 6 }, { x: xs[i + 1] - 58, y: y - 6 }, -0.1)} color={TONE[TONES[(i + 1) % 3]]} width={1.75} base="rgba(21,21,21,0.18)" appear={0.75 + i * 0.12} />)}
      </svg>
      {STAGES.map((stage, index) => {
        const Icon = STAGE_ICONS[index];
        return (
          <Reveal key={stage.title} from="scale" delay={0.6 + index * 0.12} className="absolute flex w-[230px] -translate-x-1/2 flex-col items-center text-center" style={{ left: xs[index], top: y - 48 }}>
            <span className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(21,21,21,0.15)]"><Icon className="h-[36px] w-[36px]" strokeWidth={1.25} /></span>
            <span className={cn(serif.className, "mt-6 text-[26px] italic leading-none text-[#151515]/45")}>0{index + 1}</span>
            <span className="mt-3 text-[22px] font-medium leading-tight tracking-[-0.02em]">{stage.title}</span>
          </Reveal>
        );
      })}
    </Frame>
  );
}

/** Three stages per slide. The presenter clicks each one in; the PDF shows all three. */
function ApproachDetail({ page, from }: { page: number; from: number }) {
  const stages = STAGES.slice(from, from + 3);
  return (
    <Frame page={page} section="approach">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <div className="flex items-end justify-between">
          <H size={68}>Stages <Em>{from + 1} to {from + 3}</Em></H>
          <div className="flex gap-2 pb-4">
            {STAGES.map((_, i) => {
              const on = i < from + 3;
              return <span key={i} className="h-[4px] w-[64px] rounded-full transition-colors duration-500" style={{ background: on ? INK : "rgba(21,21,21,0.1)" }} />;
            })}
          </div>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6">
          {stages.map((stage, i) => {
            const index = from + i;
            const tone = TONES[index % 3];
            return (
              <div key={stage.title} className="relative h-[600px]">
                <div className={cn("absolute inset-0 rounded-[28px] border border-dashed", RULE)} />
                <Reveal step={i + 1} className={cn("absolute inset-0 flex flex-col rounded-[28px] p-12", MIST)}>
                  <div className="flex items-start justify-between">
                    <span className={cn(serif.className, "italic leading-none text-[#151515]")} style={{ fontSize: 102 }}>0{index + 1}</span>
                    <Dot tone={tone} size={16} />
                  </div>
                  <div className="mt-auto h-[300px]">
                    <p className="flex h-[80px] items-end text-[37px] font-medium leading-[1.08] tracking-[-0.035em] [text-wrap:balance]">{stage.title}</p>
                    <p className={cn("mt-6 text-[20px] leading-[1.55]", BODY)}>{stage.body}</p>
                    {stage.note ? <p className="mt-5 text-[26px] leading-[1.25]"><Em>{stage.note}</Em></p> : null}
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

function RealityCapture({ page }: { page: number }) {
  const shots = [
    { src: WABTEC.early, label: "Early works" },
    { src: WABTEC.finishing, label: "Finishing works" },
  ];
  return (
    <Frame page={page} section="approach">
      <div className="absolute bottom-[150px] left-[160px] top-[170px] flex w-[1000px] flex-col gap-3">
        {shots.map((shot, i) => (
          <Reveal key={shot.label} from="fade" delay={0.2 + i * 0.3} className="relative flex-1 overflow-hidden rounded-[24px]">
            <Drift src={shot.src} alt={`Wabtec site, ${shot.label.toLowerCase()}, from a 360° capture`} className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/55 to-transparent" />
            <span className="absolute bottom-6 left-8 text-[18px] font-medium uppercase tracking-[0.2em] text-white">{shot.label}</span>
          </Reveal>
        ))}
      </div>
      <div className="absolute left-[1220px] right-[160px] top-[230px]">
        <H size={61}>See progress <Em>without being on site.</Em></H>
        <Reveal delay={0.7}><p className={cn("mt-10 border-t pt-8 text-[22px] leading-[1.55]", RULE, BODY)}>Reality-capture technology gives you virtual walkthroughs and visual updates throughout the build.</p></Reveal>
        <Reveal delay={0.9} className="mt-8">
          {["Virtual walkthroughs", "Visual progress updates"].map((item, i) => (
            <p key={item} className={cn("flex items-center gap-4 border-t py-5 text-[20px]", RULE)}><Dot tone={TONES[i + 1]} />{item}</p>
          ))}
        </Reveal>
        <Reveal delay={1}><p className={cn("mt-6 text-[18px] font-light", MUTED)}>Wabtec: 360° site captures, from early works to finishing.</p></Reveal>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   04 · Team: founders, key leaders, then the chart
   ──────────────────────────────────────────────────────────────── */

function Founders({ page }: { page: number }) {
  return (
    <Frame page={page} section="team">
      <Reveal from="fade" delay={0.2} className="absolute bottom-[150px] left-[160px] top-[170px] w-[1080px]">
        <Drift src={TEAM_PHOTO.foundersMeeting} alt="Ronald Goh and Jayne Ong" position="38% 50%" className="h-full w-full rounded-[28px]" />
      </Reveal>
      <div className="absolute left-[1290px] right-[160px] top-[230px]">
        <H size={82}>Our <Em>founders</Em></H>
        <Reveal delay={0.6}><p className={cn("mt-6 text-[22px] leading-[1.5]", BODY)}>Leading D’trax together since 2003.</p></Reveal>
        <div className="mt-16">
          {([[RONALD.name, RONALD.role, "lime"], [JAYNE.name, JAYNE.role, "pink"]] as const).map(([name, role, tone], index) => (
            <Reveal key={name} delay={0.8 + index * 0.15} className={cn("border-t py-7", RULE)}>
              <div className="flex items-center gap-4"><Dot tone={tone} /><p className="text-[36px] font-medium leading-none tracking-[-0.035em]">{name}</p></div>
              <p className={cn("mt-3 pl-[26px] text-[19px]", BODY)}>{role}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Frame>
  );
}

const factsOf = (leader: Leader) => ([["Experience", leader.experience], ["Qualifications", leader.qualifications], ["Specialism", leader.specialism]] as [string, string | undefined][]).filter((fact): fact is [string, string] => Boolean(fact[1]));

function LogoStrip({ names, delay }: { names: string[]; delay: number }) {
  if (!names.length) return null;
  return (
    <Reveal delay={delay}>
      <Eyebrow>Featured projects</Eyebrow>
      {/* Five to a row; longer lists wrap onto a second row. */}
      <div className={cn("mt-5 grid grid-cols-5 border-y", RULE)}>
        {names.map((name, i) => (
          <span key={name} className={cn("flex items-center justify-center px-5", names.length > 5 ? "h-[84px]" : "h-[96px]", RULE, i % 5 !== 0 && "border-l", i >= 5 && "border-t")}><LogoMark name={name} area={5200} maxHeight={66} maxWidth={150} /></span>
        ))}
      </div>
    </Reveal>
  );
}

/** Founder profile: tall portrait on the left, facts listed beside it. */
function FounderProfile({ page, leader, tone }: { page: number; leader: Leader; tone: Tone }) {
  return (
    <Frame page={page} section="team">
      <Reveal from="fade" delay={0.1} className="absolute bottom-[150px] left-[160px] top-[170px] w-[600px]">
        <Photo src={leader.photo} alt={leader.name} position={leader.photoPosition ?? "50% 20%"} className="h-full w-full rounded-[28px]" />
      </Reveal>
      <div className="absolute left-[840px] right-[160px] top-[200px]">
        <Reveal><div className="flex items-center gap-4"><Dot tone={tone} size={14} /><Eyebrow>Co-founder</Eyebrow></div></Reveal>
        <H size={95} className="mt-6">{leader.name}</H>
        <Reveal delay={0.4}><p className={cn("mt-4 text-[32px]", MUTED)}><Em>{leader.role}</Em></p></Reveal>
        <div className="mt-12">
          {factsOf(leader).map(([term, value], index) => (
            <Reveal key={term} delay={0.5 + index * 0.12} className={cn("grid grid-cols-[220px_1fr] gap-8 border-t py-6", RULE)}>
              <span className="text-[18px] font-medium uppercase tracking-[0.16em] text-[#151515]/55">{term}</span>
              <span className={cn("text-[22px] leading-[1.5]", BODY)}>{value}</span>
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><LogoStrip names={leader.projects} delay={0.9} /></div>
      </div>
    </Frame>
  );
}

/** Key leader: name leads on the left, facts in three columns, portrait in an arch on the right. */
function KeyLeader({ page, leader, tone }: { page: number; leader: Leader; tone: Tone }) {
  return (
    <Frame page={page} section="team">
      <Reveal from="fade" delay={0.1} className="absolute right-[160px] top-[170px] h-[800px] w-[540px] overflow-hidden rounded-b-[28px] rounded-t-[270px] bg-[#F4F4F2]">
        <img src={leader.photo} alt={leader.name} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: leader.photoPosition ?? "50% 20%" }} />
      </Reveal>
      <div className="absolute left-[160px] top-[200px] w-[1000px]">
        <Reveal><div className="flex items-center gap-4"><Dot tone={tone} size={14} /><Eyebrow>Key leader</Eyebrow></div></Reveal>
        <H size={102} className="mt-6">{leader.name}</H>
        <Reveal delay={0.4}><p className={cn("mt-4 text-[32px]", MUTED)}><Em>{leader.role}</Em></p></Reveal>
        <div className="mt-14 grid grid-cols-3">
          {factsOf(leader).map(([term, value], index) => (
            <Reveal key={term} delay={0.5 + index * 0.12} className={cn("border-l px-8 first:border-l-0 first:pl-0", leader.projects.length > 5 ? "h-[220px]" : "h-[270px]", RULE)}>
              <p className="text-[18px] font-medium uppercase tracking-[0.16em] text-[#151515]/55">{term}</p>
              <p className={cn("mt-5 text-[19px] leading-[1.55]", BODY)}>{value}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-8"><LogoStrip names={leader.projects} delay={0.9} /></div>
      </div>
    </Frame>
  );
}

/** Top-down chart: founders at the top, teams below, people fanned out beneath, joined by curved lines. */
function OrgChart({ page }: { page: number }) {
  const { print } = useDeck();
  const hub = { x: 960, y: 215 }, r1 = 300, r2 = 620;
  // The people's ring is slightly narrower than it is deep, so the outward labels on its sides stay inside the margins.
  const at = (r: number, deg: number) => ({ x: hub.x + r * (r === r2 ? 0.9 : 1) * Math.cos((deg * Math.PI) / 180), y: hub.y + r * Math.sin((deg * Math.PI) / 180) });
  const people = ORG_TEAMS.flatMap((team, teamIndex) => team.members.map((member) => ({ ...member, teamIndex })));
  // The fan opens wider as the team grows, so neighbours along the bottom keep about 15° between them.
  const spread = Math.min(84, 76 + (people.length - 11) * 8), from = 90 + spread, to = 90 - spread, stepDeg = (from - to) / (people.length - 1);
  const placed = people.map((person, index) => ({ ...person, angle: from - index * stepDeg }));
  const teams = ORG_TEAMS.map((team, teamIndex) => {
    const angles = placed.filter((person) => person.teamIndex === teamIndex).map((person) => person.angle);
    return { ...team, tone: TONES[teamIndex % 3], angle: angles.reduce((sum, a) => sum + a, 0) / angles.length };
  });
  const draw = (delay: number) => (print ? {} : { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const } });
  return (
    <Frame page={page} section="team">
      <div className="absolute left-[160px] top-[170px] w-[440px]">
        <H size={58}>Organisation <Em>chart</Em></H>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        {teams.map((team, i) => <Beam key={team.name} d={curve(hub, at(r1, team.angle), team.angle > 90 ? 0.18 : -0.18)} color={TONE[team.tone]} base="rgba(21,21,21,0.22)" width={1.75} appear={0.4 + i * 0.07} />)}
        {placed.map((person, i) => <motion.path key={person.name} d={curve(at(r1, teams[person.teamIndex].angle), at(r2, person.angle), person.angle > teams[person.teamIndex].angle ? 0.16 : -0.16)} fill="none" stroke={INK} strokeOpacity={0.16} strokeWidth={1.5} strokeLinecap="round" {...draw(0.8 + i * 0.05)} />)}
      </svg>
      <Reveal from="scale" delay={0.1} className="absolute flex flex-col items-center" style={{ left: hub.x - 160, top: hub.y - 75, width: 320 }}>
        <div className="flex">
          {[TEAM_PHOTO.ronald, TEAM_PHOTO.jayne].map((src, i) => (
            <span key={src} className={cn("h-[112px] w-[112px] overflow-hidden rounded-full border-[4px] border-white bg-[#E8E8E6] shadow-[0_0_0_1px_rgba(21,21,21,0.12)]", i === 1 && "-ml-5")}>
              <img src={src} alt="" draggable={false} className="h-full w-full object-cover" style={{ objectPosition: "50% 18%" }} />
            </span>
          ))}
        </div>
        <span className="mt-3 rounded-full bg-white px-5 py-1 text-[19px] font-medium tracking-[-0.01em]">Ronald Goh · Jayne Ong</span>
        <span className={cn("rounded-full bg-white px-4 text-[18px]", MUTED)}><Em>Founders</Em></span>
      </Reveal>
      {teams.map((team, i) => {
        const p = at(r1, team.angle);
        return (
          <Reveal key={team.name} from="scale" delay={0.4 + i * 0.07} className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[19px] font-medium tracking-[-0.01em] shadow-[0_0_0_1px_rgba(21,21,21,0.15)]" style={{ left: p.x, top: p.y }}>
            <Dot tone={team.tone} />{team.name}
          </Reveal>
        );
      })}
      {placed.map((person, i) => {
        const p = at(r2, person.angle);
        const photo = HEADSHOT[person.name];
        // On the steep sides of the fan, people sit close together vertically, so their label goes beside the avatar, facing outward.
        const side = person.angle > 128 ? "left" : person.angle < 52 ? "right" : null;
        const face = (
          <span className="shrink-0 overflow-hidden rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(21,21,21,0.12)] transition-transform duration-500 group-hover:scale-[1.5]">
            {photo ? <img src={photo} alt={person.name} draggable={false} className="h-[84px] w-[84px] object-cover" style={{ objectPosition: "50% 15%" }} /> : <Initials name={person.name} size={84} />}
          </span>
        );
        const label = (
          <>
            <span className="bg-white px-2 text-[18px] font-medium leading-tight tracking-[-0.01em]">{person.name}</span>
            {/* Beside the avatar a role stays on one line; under it, a long role wraps so neighbours along the bottom don't collide. */}
            <span className={cn("bg-white px-2 text-[16px] font-light leading-tight", side ? "whitespace-nowrap" : "max-w-[190px] [text-wrap:balance]", MUTED)}>{person.role}</span>
          </>
        );
        if (side) {
          return (
            <Reveal key={person.name} from="scale" delay={0.8 + i * 0.05} className={cn("group absolute flex items-center gap-2", side === "left" && "flex-row-reverse")} style={side === "left" ? { right: 1920 - p.x - 45, top: p.y - 45 } : { left: p.x - 45, top: p.y - 45 }}>
              {face}
              <span className={cn("flex flex-col", side === "left" ? "items-end text-right" : "items-start")}>{label}</span>
            </Reveal>
          );
        }
        return (
          <Reveal key={person.name} from="scale" delay={0.8 + i * 0.05} className="group absolute flex w-[260px] -translate-x-1/2 flex-col items-center text-center" style={{ left: p.x, top: p.y - 42 }}>
            {face}
            <span className="mt-3 flex flex-col items-center">{label}</span>
          </Reveal>
        );
      })}
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   05 · Track record
   ──────────────────────────────────────────────────────────────── */

/** A still wall of work: one photograph per featured project, fading in one by one. */
function TrackRecord({ page }: { page: number }) {
  const tiles = FEATURED.map((project) => ({ src: project.photos[0], name: project.name }));
  return (
    <Frame page={page} section="record" dark>
      <div className="absolute left-[160px] right-[160px] top-[160px] flex items-end justify-between">
        <H size={61}>A selection from <Em color={LIME}>100+</Em> offices</H>
        <Reveal delay={0.5}><p className={cn("pb-3 text-[22px]", BODY_DARK)}><Em>delivered since 2003</Em></p></Reveal>
      </div>
      <div className="absolute bottom-[150px] left-[160px] right-[160px] top-[340px] grid grid-cols-6 grid-rows-2 gap-3">
        {tiles.map((tile, i) => (
          <Reveal key={tile.name} from="fade" delay={0.4 + i * 0.06} className="relative overflow-hidden rounded-[16px]">
            <Photo src={tile.src} alt={tile.name} className="absolute inset-0" />
            <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/70 to-transparent" />
            <span className="absolute bottom-4 left-5 text-[17px] font-medium text-white">{tile.name}</span>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

/** Recent clients: logos only, each joined to a D'trax hub by a curved line. */
function RecentProjects({ page }: { page: number }) {
  const hub = { x: 960, y: 604 }, rx = 680, ry = 300;
  const n = RECENT.length;
  const point = (i: number) => {
    const angle = ((-90 + (360 / n) * (i + 0.5)) * Math.PI) / 180;
    return { x: hub.x + rx * Math.cos(angle), y: hub.y + ry * Math.sin(angle) };
  };
  return (
    <Frame page={page} section="record">
      <div className="absolute left-[160px] top-[170px]">
        <H size={61}>Recent <Em>projects</Em></H>
        <Reveal delay={0.4}><p className={cn("mt-3 text-[20px]", BODY)}>2024 to 2026</p></Reveal>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        {RECENT.map((name, i) => <Beam key={name} d={curve(hub, point(i), 0.08)} color={TONE[TONES[i % 3]]} base="rgba(21,21,21,0.14)" width={1.5} appear={0.5 + i * 0.14} />)}
      </svg>
      <Reveal from="scale" delay={0.2} className="absolute flex h-[180px] w-[180px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(21,21,21,0.08),0_0_60px_20px_rgba(221,255,151,0.75)]" style={{ left: hub.x - 90, top: hub.y - 90 }}>
        <Logo className="h-[44px]" />
      </Reveal>
      {RECENT.map((name, i) => {
        const p = point(i);
        return (
          <Reveal key={name} from="scale" delay={0.85 + i * 0.14} className="absolute flex h-[96px] w-[200px] items-center justify-center rounded-[20px] bg-white px-6 shadow-[0_0_0_1px_rgba(21,21,21,0.1)]" style={{ left: p.x - 100, top: p.y - 48 }}>
            <Float index={i}><LogoMark name={name} area={7000} maxHeight={60} maxWidth={150} /></Float>
          </Reveal>
        );
      })}
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   06 · Featured projects. Each project opens on a story slide (three
   layouts, in rotation) and is followed by one or two slides given
   over to large photographs. Every photo is still, so the live slide
   and the PDF page are the same.
   ──────────────────────────────────────────────────────────────── */

function ProjectMeta({ project, dark = false }: { project: Project; dark?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 text-[20px]", dark ? "text-white/70" : MUTED)}>
      <span>{project.area}</span>
      <span className={cn("h-[20px] w-px", dark ? "bg-white/30" : "bg-[#151515]/20")} />
      <span>{project.type}</span>
      {project.award ? <span className={cn("inline-flex basis-full items-center gap-2", dark ? "text-white" : "text-[#151515]")}><Award className="h-[22px] w-[22px]" strokeWidth={1.5} />{project.award}</span> : null}
    </div>
  );
}

function ProjectPoints({ project, dark = false, size = 24 }: { project: Project; dark?: boolean; size?: number }) {
  return (
    <ul>
      {project.points.map((point) => (
        <li key={point} className={cn("border-t py-4 font-light leading-[1.45]", dark ? "border-white/15 text-white/80" : "border-[#151515]/12 text-[#55555A]")} style={{ fontSize: size }}>{point}</li>
      ))}
    </ul>
  );
}

/** Immersive heroes whose key detail would sit under the logo or off the edge. */
const HERO_POSITION: Record<string, string> = {};

const projectCounter = (number: number, total: number, dark = false) => (
  <div className="flex items-center gap-4"><Dot tone={TONES[(number - 1) % 3]} size={10} /><Eyebrow dark={dark}>{String(number).padStart(2, "0")} / {total}</Eyebrow></div>
);

/** The story slide: name, line, facts and the three points, beside one photograph. */
function ProjectSlide({ page, project, number, total }: { page: number; project: Project; number: number; total: number }) {
  const hero = project.photos[0];
  const layout = (number - 1) % 3;
  const long = project.name.length > 16;

  /* A · Immersive: the photograph fills the right of the slide, the story on ink. */
  if (layout === 0) {
    return (
      <Frame page={page} section="projects" dark>
        <Drift src={hero} alt={project.name} position={HERO_POSITION[project.name]} className="absolute bottom-0 left-[820px] right-0 top-0" />
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,21,21,1)_0%,rgba(21,21,21,1)_44%,rgba(21,21,21,0.4)_56%,rgba(21,21,21,0)_68%)]" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-[#151515]/80 to-transparent" />
        <div className="absolute left-[160px] top-[180px] w-[680px]">
          <Reveal>{projectCounter(number, total, true)}</Reveal>
          <H size={long ? 64 : 80} className="mt-7">{project.name}</H>
          <Reveal delay={0.5}><p className="mt-5 text-[32px] leading-[1.25] text-white/90"><Em>{project.tagline}</Em></p></Reveal>
          <Reveal delay={0.65} className="mt-8"><ProjectMeta project={project} dark /></Reveal>
          <Reveal delay={0.8} className="mt-6"><ProjectPoints project={project} dark /></Reveal>
          <Reveal delay={0.9}><p className="mt-3 text-[19px] font-light text-white/55">{project.sector} · {project.location}</p></Reveal>
        </div>
      </Frame>
    );
  }

  /* B · Split: the story on the left, one tall photograph on the right. */
  if (layout === 1) {
    return (
      <Frame page={page} section="projects">
        <Reveal from="fade" className="absolute bottom-[150px] right-[160px] top-[170px] w-[800px] overflow-hidden rounded-[24px]"><Drift src={hero} alt={project.name} className="absolute inset-0" /></Reveal>
        <div className="absolute left-[160px] top-[190px] w-[700px]">
          <Reveal>{projectCounter(number, total)}</Reveal>
          <H size={long ? 60 : 76} className="mt-7">{project.name}</H>
          <Reveal delay={0.5}><p className="mt-5 text-[30px] leading-[1.3] text-[#151515]/80"><Em>{project.tagline}</Em></p></Reveal>
          <Reveal delay={0.65} className="mt-8"><ProjectMeta project={project} /></Reveal>
          <Reveal delay={0.8} className="mt-6"><ProjectPoints project={project} /></Reveal>
          <Reveal delay={0.9}><p className={cn("mt-3 text-[19px] font-light", MUTED)}>{project.sector} · {project.location}</p></Reveal>
        </div>
      </Frame>
    );
  }

  /* C · Banner: a wide photograph across the top, the story in two columns below. */
  return (
    <Frame page={page} section="projects">
      <Reveal from="fade" className="absolute left-[160px] right-[160px] top-[150px] h-[400px] overflow-hidden rounded-[24px]"><Drift src={hero} alt={project.name} className="absolute inset-0" /></Reveal>
      <div className="absolute left-[160px] right-[160px] top-[600px] grid grid-cols-[1fr_1.15fr] gap-20">
        <div>
          <Reveal>{projectCounter(number, total)}</Reveal>
          <H size={long ? 54 : 64} className="mt-5">{project.name}</H>
          <Reveal delay={0.5}><p className="mt-4 text-[28px] leading-[1.3] text-[#151515]/80"><Em>{project.tagline}</Em></p></Reveal>
          <Reveal delay={0.6}><p className={cn("mt-5 text-[19px] font-light", MUTED)}>{project.sector} · {project.location}</p></Reveal>
        </div>
        <div>
          <Reveal delay={0.6}><ProjectMeta project={project} /></Reveal>
          <Reveal delay={0.75} className="mt-4"><ProjectPoints project={project} size={22} /></Reveal>
        </div>
      </div>
    </Frame>
  );
}

/** The photographs after the hero, split into gallery slides: three, then up to two. */
const galleries = (project: Project) => {
  const rest = project.photos.slice(1);
  return rest.length > 3 ? [rest.slice(0, 3), rest.slice(3, 5)] : rest.length ? [rest] : [];
};

/** A gallery slide: large photographs only, with the project named quietly in the corner. */
function ProjectPhotos({ page, project, photos, part, parts, dark }: { page: number; project: Project; photos: string[]; part: number; parts: number; dark: boolean }) {
  const grid = photos.length === 3 ? "grid-cols-[1.75fr_1fr] grid-rows-2" : photos.length === 2 ? "grid-cols-2 grid-rows-1" : "grid-cols-1 grid-rows-1";
  return (
    <Frame page={page} section="projects" dark={dark}>
      <div className={cn("absolute bottom-[130px] left-[160px] right-[160px] top-[150px] grid gap-4", grid)}>
        {photos.map((src, i) => (
          <Reveal key={src} from="fade" delay={0.1 + i * 0.12} className={cn("relative overflow-hidden rounded-[20px]", photos.length === 3 && i === 0 && "row-span-2")}>
            <Photo src={src} alt={`${project.name}, view ${i + 2}`} className="absolute inset-0" />
            {i === 0 ? (
              <>
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-[#151515]/60 to-transparent" />
                <p className="absolute bottom-[26px] left-[30px] text-[20px] font-medium tracking-[-0.01em] text-white">
                  {project.name}{parts > 1 ? <span className="ml-3 font-light text-white/70">{part} / {parts}</span> : null}
                </p>
              </>
            ) : null}
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

function InProgress({ page }: { page: number }) {
  return (
    <Frame page={page} section="projects" dark>
      <Reveal from="fade" delay={0.1} className="absolute bottom-[150px] right-[160px] top-[170px] w-[620px] overflow-hidden rounded-[28px]">
        <Drift src={WABTEC.progress} alt="Wabtec, workstations being fitted out" position="50% 80%" className="absolute inset-0" />
        <span className="absolute bottom-6 left-7 text-[18px] font-medium uppercase tracking-[0.18em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">Wabtec, on site</span>
      </Reveal>
      <div className="absolute left-[160px] top-[190px] w-[860px]">
        <H size={80}>Now in <Em color={LIME}>progress</Em></H>
        <Reveal delay={0.5}><p className={cn("mt-5 text-[24px]", BODY_DARK)}>Projects we are designing and building today.</p></Reveal>
        <div className="mt-16">
          {IN_PROGRESS.map((project, index) => (
            <Reveal key={project.name} delay={0.6 + index * 0.15} className="border-t border-white/15 py-9">
              <div className="flex items-center gap-4"><span className="h-[10px] w-[10px] rounded-full" style={{ background: index ? BLUE : LIME }} /><Eyebrow dark>In progress</Eyebrow></div>
              <p className="mt-5 text-[54px] font-medium leading-[1.04] tracking-[-0.045em] [text-wrap:balance]">{project.name}</p>
              <p className={cn("mt-4 text-[22px]", BODY_DARK)}>{project.sector} · {project.type}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   07 · Testimonials: one voice per slide
   ──────────────────────────────────────────────────────────────── */

function Testimonial({ page, item, tone, number }: { page: number; item: (typeof TESTIMONIALS)[number]; tone: Tone; number: number }) {
  const long = item.quote.length > 260;
  return (
    <Frame page={page} section="testimonials">
      <div className="absolute left-[160px] right-[160px] top-[190px] grid grid-cols-[440px_1fr] gap-24">
        <Reveal from="fade" className="flex h-[720px] flex-col justify-between border-r border-[#151515]/12 pr-16">
          <span className={cn(serif.className, "italic leading-[0.6]")} style={{ fontSize: 221, color: TONE[tone], WebkitTextStroke: "1px rgba(21,21,21,0.25)" }}>“</span>
          <div>
            <div className="flex h-[130px] items-center"><LogoMark name={item.client} area={22000} /></div>
            <p className="mt-10 text-[24px] font-medium tracking-[-0.02em]">{item.name}</p>
            <p className={cn("mt-2 text-[19px] leading-[1.45]", BODY)}>{item.role}</p>
          </div>
        </Reveal>
        <div className="flex h-[720px] flex-col justify-center">
          <Reveal><Eyebrow>{number} of {TESTIMONIALS.length}</Eyebrow></Reveal>
          <p className={cn("mt-10 font-light leading-[1.42] tracking-[-0.02em] text-[#151515]", long ? "text-[36px]" : "text-[46px]")}>
            <BlurText delay={0.2} stagger={0.018}>{item.quote}</BlurText>
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   08 · Certifications · Close
   ──────────────────────────────────────────────────────────────── */

/**
 * Certificates open full size in a pop-up when clicked (live only; the PDF shows them as plain images).
 * Clicks are kept from reaching the player, so opening or closing never turns the slide; any key closes it.
 */
function Certifications({ page }: { page: number }) {
  const { print } = useDeck();
  const [open, setOpen] = useState<{ src: string; title: string } | null>(null);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { event.preventDefault(); event.stopImmediatePropagation(); setOpen(null); };
    window.addEventListener("keydown", close, true);
    return () => window.removeEventListener("keydown", close, true);
  }, [open]);
  return (
    <Frame page={page} section="certs">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <H size={65}>Certified for safety. <Em>Recognised for design.</Em></H>
        <div className="mt-16 grid grid-cols-4">
          {CERTIFICATIONS.map((cert, index) => (
            <Reveal key={cert.title} delay={0.4 + index * 0.12} className="border-l border-[#151515]/12 px-8 first:border-l-0 first:pl-0">
              <div className={cn("relative flex h-[340px] items-center justify-center rounded-[20px] p-8", MIST)}>
                {cert.image ? (
                  print ? (
                    <img src={cert.image} alt={cert.title} draggable={false} className="max-h-full max-w-full object-contain shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
                  ) : (
                    <button type="button" aria-label={`Enlarge the ${cert.title} certificate`} onClick={(event) => { event.stopPropagation(); setOpen({ src: cert.image!, title: cert.title }); }} className="group flex h-full max-w-full cursor-zoom-in items-center justify-center">
                      <img src={cert.image} alt={cert.title} draggable={false} className="max-h-full max-w-full object-contain shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-500 group-hover:scale-[1.04]" />
                      <span className="pointer-events-none absolute bottom-4 right-4 flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white/90 text-[#151515] opacity-0 shadow-[0_0_0_1px_rgba(21,21,21,0.1)] transition-opacity duration-300 group-hover:opacity-100"><ZoomIn className="h-[20px] w-[20px]" strokeWidth={1.5} /></span>
                    </button>
                  )
                ) : (
                  <div className="flex h-full w-[220px] flex-col items-center justify-center bg-white px-6 text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <img src={BCA_LOGO} alt="BCA" draggable={false} className="w-[150px] object-contain" />
                    <span className="mt-6 text-[48px] font-medium leading-none tracking-[-0.04em]">CR06</span>
                    <span className={cn("mt-3 text-[19px]", MUTED)}><Em>Grade L3</Em></span>
                  </div>
                )}
              </div>
              <div className="mt-8 flex items-center gap-3"><Dot tone={TONES[index % 3]} /><p className="text-[24px] font-medium leading-tight tracking-[-0.025em]">{cert.title}</p></div>
              <p className={cn("mt-4 text-[19px] leading-[1.55]", BODY)}>{cert.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${open.title} certificate`}
          className="absolute inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-[#151515]/85 p-[60px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          onClick={(event) => { event.stopPropagation(); setOpen(null); }}
        >
          <motion.img src={open.src} alt={open.title} draggable={false} className="max-h-full max-w-full object-contain shadow-[0_30px_80px_rgba(0,0,0,0.45)]" initial={{ scale: 0.94 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
          <span className="absolute right-[48px] top-[40px] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white/10 text-white"><X className="h-[24px] w-[24px]" strokeWidth={1.5} /></span>
        </motion.div>
      ) : null}
    </Frame>
  );
}

/** The close: the founders in the studio, the line we leave them with, and how to reach us. */
function Closing({ page }: { page: number }) {
  return (
    <Frame page={page} dark bare>
      <Drift src={TEAM_PHOTO.foundersBar} alt="Ronald Goh and Jayne Ong in the D'trax studio" position="50% 45%" className="absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[#151515]/78" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[520px] bg-gradient-to-t from-[#151515] to-transparent" />
      <div className="absolute inset-x-[160px] top-[170px] flex flex-col items-center text-center">
        <Reveal from="fade"><Logo light className="h-[72px]" /></Reveal>
        <h2 className="mt-12 font-medium tracking-[-0.05em]" style={{ fontSize: 112, lineHeight: 1.0 }}><BlurText delay={0.2} stagger={0.1}>Let’s build your <Em color={LIME}>workplace.</Em></BlurText></h2>
        <Reveal delay={0.7}><p className="mt-6 text-[28px] font-light text-white/70">Talk to us about your project.</p></Reveal>
      </div>
      <div className="absolute inset-x-[160px] top-[560px] flex justify-center gap-[120px]">
        {[{ person: RONALD, qr: CARD_QR.ronald }, { person: JAYNE, qr: CARD_QR.jayne }].map(({ person, qr }, i) => (
          <Reveal key={person.name} delay={0.85 + i * 0.12} className="flex items-center gap-8 text-left">
            <div className="rounded-[14px] bg-white p-[12px]">
              <img src={qr} alt={`QR code for ${person.name}'s digital business card`} draggable={false} className="h-[150px] w-[150px] [image-rendering:pixelated]" />
            </div>
            <div>
              <Eyebrow dark className="text-[15px]">Scan for digital card</Eyebrow>
              <p className="mt-4 text-[30px] font-medium leading-none tracking-[-0.03em]">{person.name}</p>
              <p className="mt-3 text-[20px] font-light text-white/65">{person.role}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={1} className="absolute bottom-[150px] left-[160px] right-[160px] grid grid-cols-3 border-t border-white/20 pt-8 text-center text-[19px] leading-[1.6]">
        <div><Eyebrow dark>Visit</Eyebrow><p className="mt-3 font-light text-white/80">10 Anson Road, #30-13 International Plaza<br />Singapore 079903</p></div>
        <div className="border-x border-white/15"><Eyebrow dark>Call</Eyebrow><p className="mt-3 font-light text-white/80">+65 6224 9242</p></div>
        <div><Eyebrow dark>Online</Eyebrow><p className="mt-3 font-light text-white/80">www.dtrax.com.sg</p></div>
      </Reveal>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   Running order
   ──────────────────────────────────────────────────────────────── */

type Def = { id: string; steps?: number; dark?: boolean; render: (page: number) => ReactNode };

const defs: Def[] = [
  { id: "cover", dark: true, render: () => <Cover /> },

  { id: "about-divider", render: (page) => <Divider page={page} section="about" sketch="plan" title={<>About <Em>D&apos;trax</Em></>} line="Imagine. Design. Inspire." /> },
  { id: "about", render: (page) => <AboutStatement page={page} /> },
  { id: "about-numbers", render: (page) => <AboutStats page={page} /> },
  { id: "why-dtrax", render: (page) => <WhyDtrax page={page} /> },
  { id: "associates", dark: true, render: (page) => <Associates page={page} /> },

  { id: "services-divider", render: (page) => <Divider page={page} section="services" sketch="layers" title={<>Services &amp; <Em>capabilities</Em></>} line="Design, costing and construction, under one roof." /> },
  { id: "services", render: (page) => <ServicesStatement page={page} /> },
  { id: "services-detail", render: (page) => <ServicesDetail page={page} /> },

  { id: "approach-divider", render: (page) => <Divider page={page} section="approach" sketch="route" title={<>Our delivery <Em>approach</Em></>} line="From brief to handover, and after." /> },
  { id: "approach", render: (page) => <ApproachOverview page={page} /> },
  { id: "approach-1", render: (page) => <ApproachDetail page={page} from={0} /> },
  { id: "approach-2", render: (page) => <ApproachDetail page={page} from={3} /> },
  { id: "reality-capture", render: (page) => <RealityCapture page={page} /> },

  { id: "team-divider", render: (page) => <Divider page={page} section="team" sketch="people" title={<>Our <Em>team</Em></>} line="The people who start your project finish it." /> },
  { id: "founders", render: (page) => <Founders page={page} /> },
  { id: "founder-ronald", render: (page) => <FounderProfile page={page} leader={RONALD} tone="lime" /> },
  { id: "founder-jayne", render: (page) => <FounderProfile page={page} leader={JAYNE} tone="pink" /> },
  ...LEADERS.map((leader, index): Def => ({ id: `leader-${index + 1}`, render: (page) => <KeyLeader page={page} leader={leader} tone={index ? "pink" : "blue"} /> })),
  { id: "org-chart", render: (page) => <OrgChart page={page} /> },

  { id: "record-divider", render: (page) => <Divider page={page} section="record" sketch="timeline" title={<>Track <Em>record</Em></>} line="100+ offices delivered since 2003." /> },
  { id: "track-record", dark: true, render: (page) => <TrackRecord page={page} /> },
  { id: "recent-projects", render: (page) => <RecentProjects page={page} /> },

  { id: "projects-divider", render: (page) => <Divider page={page} section="projects" sketch="room" title={<>Featured <Em>projects</Em></>} line={`${FEATURED.length} workplaces we have designed and built.`} /> },
  ...FEATURED.flatMap((project, index): Def[] => {
    const dark = index % 3 === 0;
    const sets = galleries(project);
    return [
      { id: `project-${index + 1}`, dark, render: (page) => <ProjectSlide page={page} project={project} number={index + 1} total={FEATURED.length} /> },
      ...sets.map((photos, part): Def => ({ id: `project-${index + 1}-photos-${part + 1}`, dark, render: (page) => <ProjectPhotos page={page} project={project} photos={photos} part={part + 1} parts={sets.length} dark={dark} /> })),
    ];
  }),
  { id: "in-progress", dark: true, render: (page) => <InProgress page={page} /> },

  { id: "testimonials-divider", render: (page) => <Divider page={page} section="testimonials" sketch="quote" title={<>What our <Em>clients</Em> say</>} line="In their own words." /> },
  ...TESTIMONIALS.map((item, index): Def => ({ id: `testimonial-${index + 1}`, render: (page) => <Testimonial page={page} item={item} tone={TONES[index % 3]} number={index + 1} /> })),

  { id: "certs-divider", render: (page) => <Divider page={page} section="certs" sketch="seal" title={<>Certifications &amp; <Em>awards</Em></>} line="Independently certified, and recognised for design." /> },
  { id: "certifications", render: (page) => <Certifications page={page} /> },
  { id: "closing", dark: true, render: (page) => <Closing page={page} /> },
];

export const slides: DeckSlide[] = defs.map((def, index) => ({ id: def.id, steps: def.steps, dark: def.dark, render: () => def.render(index + 1) }));
