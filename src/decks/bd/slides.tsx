"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import { Award, Building2, Calculator, Camera, ClipboardCheck, HardHat, PenTool, Undo2, UserRound, Users, Wrench } from "lucide-react";
import { CountUp, Reveal, useDeck, type DeckSlide } from "@/components/deck/Deck";
import { Beam, BlurText, Float, Magnet } from "@/components/deck/fx";
import { cn } from "@/lib/utils";
import { Sketch, type SketchName } from "@/components/deck/vectors";
import { GrowRule, MaskReveal } from "./fx";
import {
  AFTERCARE, ALTERATIONS, CLIENTS, CONTACT, COVER, CREDENTIALS, EXPERIENCE, FITOUT, GROUP_IB, LOGO, MOVE, PATH, PHOTO, POOLS, QR, SONY, SUMITOMO, TEAM_PHOTO, WORKPLACE,
  type CaseStudy,
} from "./data";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], display: "swap" });

/* ────────────────────────────────────────────────────────────────
   D'trax BD deck. Same system as the company profile: ink on white,
   pink / blue / lime as flat fields and small accents, medium-weight
   display type, serif italic emphasis, light body, hairline rules.
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
  experience: { n: "01", label: "Built on experience", tone: "lime" },
  people: { n: "02", label: "Your people", tone: "blue" },
  newOffice: { n: "03", label: "Your new office", tone: "pink" },
  current: { n: "04", label: "Your current office", tone: "lime" },
  aftercare: { n: "05", label: "After move-in", tone: "blue" },
  clients: { n: "06", label: "Clients & credentials", tone: "pink" },
} as const satisfies Record<string, { n: string; label: string; tone: Tone }>;
type Section = keyof typeof SECTIONS;

function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return <img src={LOGO.dark} alt="D'trax" draggable={false} className={cn("w-auto object-contain", className)} style={light ? { filter: "brightness(0) invert(1)" } : undefined} />;
}

function Em({ children, color }: { children: ReactNode; color?: string }) {
  return <span className={cn(serif.className, "font-normal italic tracking-[-0.01em]")} style={color ? { color } : undefined}>{children}</span>;
}

/** Shared chrome: section label and logo at the top, company line and page number at the foot. */
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
          <span>D&apos;trax Design Pte Ltd · Imagine. Design. Inspire.</span>
          <span className="tabular-nums">{page}</span>
        </footer>
      </>}
    </div>
  );
}

function H({ children, size = 96, className, delay = 0 }: { children: ReactNode; size?: number; className?: string; delay?: number }) {
  return <h2 className={cn("font-medium tracking-[-0.045em] [text-wrap:balance]", className)} style={{ fontSize: size, lineHeight: 1.04 }}><BlurText delay={delay}>{children}</BlurText></h2>;
}

function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <p className={cn("text-[18px] font-medium uppercase tracking-[0.2em]", dark ? "text-white/55" : "text-[#151515]/50", className)}>{children}</p>;
}

function Photo({ src, alt, className, position }: { src: string; alt: string; className?: string; position?: string }) {
  return (
    <div className={cn("overflow-hidden", !className?.includes("absolute") && "relative", className)}>
      <img src={src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position ?? "50% 50%" }} />
    </div>
  );
}

/** Slow push-in on a photograph. Prints the resting frame. */
function Drift({ src, alt, position, className }: { src: string; alt: string; position?: string; className?: string }) {
  const { print } = useDeck();
  return (
    <div className={cn("overflow-hidden", !className?.includes("absolute") && "relative", className)}>
      <motion.img src={src} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position ?? "50% 50%" }} initial={print ? false : { scale: 1.08 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: [0.16, 1, 0.3, 1] }} />
    </div>
  );
}

/** A soft arc between two points on one line, bowing by `bend` pixels (negative bows upward). */
function arc(x1: number, y1: number, x2: number, y2: number, bend = -28) {
  return `M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + bend} ${x2} ${y2}`;
}

function Dot({ tone, size = 10 }: { tone: Tone; size?: number }) {
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: TONE[tone] }} />;
}

/** Optical corrections on top of area sizing: solid blocks read heavier, hairline marks lighter. */
const WEIGHT: Record<string, number> = { "Sony Pictures": 1.35, "Union Bancaire Privée": 0.72, "HDFC Bank": 0.75, "FIJI Water": 0.8, "Procter & Gamble": 0.8, "Singapore Pools": 0.85 };

/** A logo sized to a fixed visual area, so wide and tall marks carry the same weight. */
function LogoMark({ src, alt, area, maxHeight, maxWidth }: { src: string; alt: string; area: number; maxHeight: number; maxWidth: number }) {
  const ref = useRef<HTMLImageElement>(null);
  const [aspect, setAspect] = useState(3);
  const measure = (img: HTMLImageElement | null) => { if (img?.naturalWidth) setAspect(img.naturalWidth / img.naturalHeight); };
  useEffect(() => measure(ref.current), []);
  const height = Math.min(maxHeight, Math.sqrt(area / aspect), maxWidth / aspect);
  return <img ref={ref} src={src} alt={alt} draggable={false} onLoad={(event) => measure(event.currentTarget)} style={{ height, width: height * aspect }} className="object-contain" />;
}

/** "In practice" line: area and location, separated by a hairline. */
function Meta({ study, dark = false }: { study: CaseStudy; dark?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-2 text-[21px]", dark ? "text-white/70" : MUTED)}>
      <span>{study.area}</span>
      <span className={cn("h-[18px] w-px", dark ? "bg-white/30" : "bg-[#151515]/20")} />
      <span>{study.location}</span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Cover and section dividers
   ──────────────────────────────────────────────────────────────── */

function Cover() {
  return (
    <Frame page={1} dark bare>
      <Drift src={TEAM_PHOTO.cover} alt="Ronald Goh and Jayne Ong reviewing material samples in the D'trax studio" position="50% 56%" className="absolute inset-y-0 left-[620px] right-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,21,21,1)_0%,rgba(21,21,21,1)_33%,rgba(21,21,21,0.82)_44%,rgba(21,21,21,0.4)_60%,rgba(21,21,21,0)_80%)]" />
      <div className="absolute left-[160px] top-[150px]"><Reveal from="fade"><Logo light className="h-[96px]" /></Reveal></div>
      <div className="absolute bottom-[150px] left-[160px] w-[1060px]">
        <Reveal delay={0.15}><Eyebrow dark>{COVER.title}</Eyebrow></Reveal>
        <h1 className="mt-8 font-medium tracking-[-0.045em] text-white" style={{ fontSize: 84, lineHeight: 1.04 }}>
          <BlurText delay={0.3} stagger={0.06}>Moving into a new office, refreshing your current space or <Em color={LIME}>preparing to move out?</Em></BlurText>
        </h1>
        <Reveal delay={1.1} className="mt-12 border-t border-white/20 pt-8">
          <p className={cn("max-w-[880px] text-[24px] leading-[1.5]", BODY_DARK)}>{COVER.answer}</p>
          <p className="mt-6 text-[26px] font-normal tracking-[-0.02em] text-white">Imagine. Design. <Em>Inspire.</Em></p>
        </Reveal>
      </div>
    </Frame>
  );
}

function Divider({ page, section, title, line, sketch, size = 112 }: { page: number; section: Section; title: ReactNode; line: ReactNode; sketch: SketchName; size?: number }) {
  const meta = SECTIONS[section];
  return (
    <Frame page={page} background={TONE[meta.tone]}>
      <Sketch name={sketch} className="absolute right-[160px] top-[200px] h-[640px] w-[640px]" />
      <div className="absolute bottom-[190px] left-[160px] w-[920px]">
        <Reveal from="fade"><p className={cn(serif.className, "italic leading-[1.2] text-[#151515]/35")} style={{ fontSize: 180 }}>{meta.n}</p></Reveal>
        <h2 className="-mt-2 font-medium tracking-[-0.05em] [text-wrap:balance]" style={{ fontSize: size, lineHeight: 1.02 }}><BlurText delay={0.15} stagger={0.08}>{title}</BlurText></h2>
        <Reveal delay={0.6} className="mt-10 border-t border-[#151515]/25 pt-7">
          <p className="text-[26px] font-light text-[#151515]/75">{line}</p>
        </Reveal>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   01 · Built on experience
   ──────────────────────────────────────────────────────────────── */

function ExperienceStats({ page }: { page: number }) {
  const stats: { node: ReactNode; eyebrow: string; label: string; tone: Tone }[] = [
    { node: <>2003</>, eyebrow: "Since", label: "Designing and building offices since 2003", tone: "lime" },
    { node: <CountUp value={100} suffix="+" delay={0.5} />, eyebrow: "Delivered", label: "Offices delivered", tone: "blue" },
    { node: <CountUp value={37} suffix="%" delay={0.7} />, eyebrow: "Returning clients", label: "of our projects in the last five years came from returning clients", tone: "pink" },
  ];
  return (
    <Frame page={page} section="experience">
      <div className="absolute left-[160px] top-[190px] w-[1240px]">
        <H size={70}>D’trax Design designs and builds <Em>commercial offices</Em> in Singapore.</H>
      </div>
      <div className="absolute left-[160px] right-[160px] top-[520px] grid grid-cols-3 gap-20">
        {stats.map((stat, index) => (
          <Reveal key={stat.eyebrow} delay={0.4 + index * 0.15} className={cn("border-t pt-9", RULE)}>
            <div className="flex items-center gap-4"><Dot tone={stat.tone} size={12} /><Eyebrow>{stat.eyebrow}</Eyebrow></div>
            <p className="mt-7 font-medium leading-none tracking-[-0.06em]" style={{ fontSize: 150 }}>{stat.node}</p>
            <p className={cn("mt-7 max-w-[440px] text-[22px] leading-[1.45]", BODY)}>{stat.label}</p>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

function Leadership({ page }: { page: number }) {
  return (
    <Frame page={page} section="experience">
      <div className="absolute left-[160px] top-[170px]">
        <H size={64}>Experienced <Em>leadership</Em></H>
      </div>
      <div className="absolute left-[160px] right-[160px] top-[340px] grid grid-cols-2 gap-20">
        {EXPERIENCE.leaders.map((leader, index) => (
          <div key={leader.name} className="grid grid-cols-[340px_1fr] gap-12">
            <MaskReveal delay={0.25 + index * 0.2} className="relative h-[500px] overflow-hidden rounded-[24px]">
              <Photo src={leader.photo} alt={leader.name} position={leader.position} className="absolute inset-0" />
            </MaskReveal>
            <Reveal delay={0.5 + index * 0.2} className="pt-2">
              <div className="flex items-center gap-4"><Dot tone={index ? "pink" : "lime"} size={12} /><Eyebrow>Co-founder</Eyebrow></div>
              <p className="mt-6 text-[46px] font-medium leading-[1.02] tracking-[-0.04em]">{leader.name}</p>
              <p className={cn("mt-4 text-[24px] leading-[1.3]", MUTED)}><Em>{leader.role}</Em></p>
              <p className={cn("mt-8 border-t pt-6 text-[21px] leading-[1.55]", RULE, BODY)}>{leader.body}</p>
            </Reveal>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/** Buddy system: each role is paired with a colleague who can step in. The pulses run both ways. */
function Buddy({ page }: { page: number }) {
  const rows = [
    { y: 440, role: "Designer", icon: PenTool, tone: "lime" as Tone, partner: "blue" as Tone },
    { y: 720, role: "Project manager", icon: HardHat, tone: "pink" as Tone, partner: "lime" as Tone },
  ];
  const ax = 1100, bx = 1620, r = 64;
  return (
    <Frame page={page} section="experience">
      <div className="absolute left-[160px] top-[300px] w-[700px]">
        <Reveal><Eyebrow>Our buddy system</Eyebrow></Reveal>
        <H size={72} className="mt-6" delay={0.1}>Your project <Em>keeps moving.</Em></H>
        <Reveal delay={0.6}><p className={cn("mt-10 border-t pt-8 text-[24px] leading-[1.55]", RULE, BODY)}>{EXPERIENCE.buddy}</p></Reveal>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        {rows.map((row, i) => (
          <Beam key={row.role} d={arc(ax + r + 14, row.y, bx - r - 14, row.y, -36)} color={INK} width={2} base="rgba(21,21,21,0.18)" delay={i * 0.9} appear={0.6 + i * 0.2} />
        ))}
      </svg>
      {rows.map((row, i) => (
        <div key={row.role}>
          {[{ x: ax, label: row.role, Icon: row.icon, tone: row.tone }, { x: bx, label: "Designated colleague", Icon: UserRound, tone: row.partner }].map((node, j) => (
            <Reveal key={node.label} from="scale" delay={0.5 + i * 0.2 + j * 0.1} className="absolute flex w-[260px] -translate-x-1/2 flex-col items-center text-center" style={{ left: node.x, top: row.y - r }}>
              <Magnet strength={0.25}>
                <span className="flex items-center justify-center rounded-full" style={{ width: r * 2, height: r * 2, background: TONE[node.tone] }}>
                  <node.Icon className="h-[40px] w-[40px]" strokeWidth={1.25} />
                </span>
              </Magnet>
              <span className="mt-5 text-[22px] font-medium tracking-[-0.02em]">{node.label}</span>
            </Reveal>
          ))}
        </div>
      ))}
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   02 · Your people
   ──────────────────────────────────────────────────────────────── */

function Workshop({ page }: { page: number }) {
  return (
    <Frame page={page} section="people">
      <div className="absolute left-[160px] top-[190px] w-[900px]">
        <H size={58}>The best starting point for an office is <Em>understanding how people use it.</Em></H>
        <Reveal delay={0.7}><p className={cn("mt-10 border-t pt-8 text-[23px] leading-[1.55]", RULE, BODY)}>{WORKPLACE.body}</p></Reveal>
        <Reveal delay={0.9}><p className={cn("mt-8 flex items-center gap-4 text-[19px] font-light", MUTED)}><Dot tone="blue" />{WORKPLACE.note}</p></Reveal>
      </div>
      {/* Placeholder: the client will supply workshop video and photos. */}
      <Reveal from="fade" delay={0.3} className={cn("absolute bottom-[150px] right-[160px] top-[170px] flex w-[600px] flex-col items-center justify-center rounded-[24px] border border-dashed text-center", RULE, MIST)}>
        <Camera className="h-[44px] w-[44px] text-[#151515]/35" strokeWidth={1.25} />
        <p className="mt-6 text-[22px] font-medium tracking-[-0.02em] text-[#151515]/60">Workshop snapshots</p>
        <p className={cn("mt-2 text-[18px] font-light", MUTED)}>Video and photos to be supplied</p>
      </Reveal>
    </Frame>
  );
}

/** Case study, split layout: story on the left, photo mosaic on the right. */
function CaseSplit({ page, section, study, tone, eyebrow = "In practice", children }: { page: number; section: Section; study: CaseStudy; tone: Tone; eyebrow?: string; children?: ReactNode }) {
  return (
    <Frame page={page} section={section}>
      <MaskReveal className="absolute bottom-[150px] right-[160px] top-[170px] w-[800px] overflow-hidden rounded-[24px]"><Drift src={study.photos[0]} alt={study.name} className="absolute inset-0" /></MaskReveal>
      <div className="absolute left-[160px] top-[190px] w-[700px]">
        <Reveal><div className="flex items-center gap-4"><Dot tone={tone} size={12} /><Eyebrow>{eyebrow}</Eyebrow></div></Reveal>
        <H size={study.name.length > 16 ? 58 : 76} className="mt-6" delay={0.1}>{study.name}</H>
        <Reveal delay={0.45} className="mt-6"><Meta study={study} /></Reveal>
        <Reveal delay={0.6} className="mt-8">
          {study.summary.map((line) => <p key={line} className={cn("border-t py-4 text-[24px] leading-[1.45]", RULE, BODY)}>{line}</p>)}
        </Reveal>
        {children}
      </div>
    </Frame>
  );
}

/** The photographs after a case study's hero, split into gallery slides: three, then up to two. */
const galleries = (study: CaseStudy) => {
  const rest = study.photos.slice(1);
  return rest.length > 3 ? [rest.slice(0, 3), rest.slice(3, 5)] : rest.length ? [rest] : [];
};

/** A gallery slide: large photographs only, with the project named quietly in the corner. */
function CasePhotos({ page, section, study, photos, part, parts }: { page: number; section: Section; study: CaseStudy; photos: string[]; part: number; parts: number }) {
  const grid = photos.length === 3 ? "grid-cols-[1.75fr_1fr] grid-rows-2" : photos.length === 2 ? "grid-cols-2 grid-rows-1" : "grid-cols-1 grid-rows-1";
  return (
    <Frame page={page} section={section}>
      <div className={cn("absolute bottom-[130px] left-[160px] right-[160px] top-[150px] grid gap-4", grid)}>
        {photos.map((src, i) => (
          <MaskReveal key={src} delay={0.1 + i * 0.12} className={cn("relative overflow-hidden rounded-[20px]", photos.length === 3 && i === 0 && "row-span-2")}>
            <Photo src={src} alt={`${study.name}, view ${i + 2}`} className="absolute inset-0" />
            {i === 0 ? (
              <>
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[160px] bg-gradient-to-t from-[#151515]/60 to-transparent" />
                <p className="absolute bottom-[26px] left-[30px] text-[20px] font-medium tracking-[-0.01em] text-white">
                  {study.name}{parts > 1 ? <span className="ml-3 font-light text-white/70">{part} / {parts}</span> : null}
                </p>
              </>
            ) : null}
          </MaskReveal>
        ))}
      </div>
    </Frame>
  );
}

function Outcomes({ study }: { study: CaseStudy }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-10">
      {study.outcomes?.map((item, i) => (
        <Reveal key={item.label} delay={0.8 + i * 0.15} className={cn("border-t pt-5", RULE)}>
          <p className="font-medium leading-none tracking-[-0.05em]" style={{ fontSize: 72 }}><CountUp value={item.value} suffix={item.suffix} delay={1 + i * 0.15} /></p>
          <p className={cn("mt-4 text-[21px] leading-[1.4]", BODY)}>{item.label}</p>
        </Reveal>
      ))}
    </div>
  );
}

/** One voice per slide: the quote leads, the speaker and a photograph sit to the left. */
function Quote({ page, section, study, tone }: { page: number; section: Section; study: CaseStudy; tone: Tone }) {
  const quote = study.quote!;
  return (
    <Frame page={page} section={section}>
      <MaskReveal from="left" className="absolute bottom-[150px] left-[160px] top-[170px] w-[480px] overflow-hidden rounded-[24px]">
        <Drift src={study.photos[1] ?? study.photos[0]} alt={study.name} className="absolute inset-0" />
      </MaskReveal>
      <div className="absolute bottom-[150px] left-[760px] right-[160px] top-[170px] flex flex-col justify-center">
        <Reveal from="fade"><span className={cn(serif.className, "block h-[110px] overflow-visible italic leading-[1.2]")} style={{ fontSize: 180, color: TONE[tone], WebkitTextStroke: "1px rgba(21,21,21,0.25)" }}>“</span></Reveal>
        <p className="mt-10 text-[40px] font-light leading-[1.4] tracking-[-0.02em] text-[#151515]">
          <BlurText delay={0.2} stagger={0.02}>{quote.text}</BlurText>
        </p>
        <Reveal delay={1} className={cn("mt-12 flex items-center gap-10 border-t pt-8", RULE)}>
          <div className="flex h-[100px] w-[190px] shrink-0 items-center"><LogoMark src={study.logo} alt={study.name} area={12000 * (WEIGHT[study.name] ?? 1)} maxHeight={96} maxWidth={190} /></div>
          <span className="h-[72px] w-px bg-[#151515]/12" />
          <div>
            <p className="text-[22px] font-medium tracking-[-0.02em]">{quote.name}</p>
            <p className={cn("mt-1 text-[18px] leading-[1.45]", BODY)}>{quote.role}</p>
          </div>
        </Reveal>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   03 · Your new office
   ──────────────────────────────────────────────────────────────── */

function OneTeam({ page }: { page: number }) {
  const nodes = [{ label: "Design", icon: PenTool }, { label: "Costing", icon: Calculator }, { label: "Construction", icon: HardHat }];
  const xs = [560, 960, 1360], y = 590;
  return (
    <Frame page={page} section="newOffice">
      <div className="absolute left-[260px] right-[260px] top-[200px] text-center">
        <H size={64}>Bring design, costing and construction together through <Em>one contract and one coordinated team.</Em></H>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        <Beam d={arc(xs[0] + 62, y, xs[1] - 62, y)} color={BLUE} width={2} base="rgba(21,21,21,0.15)" appear={0.9} />
        <Beam d={arc(xs[1] + 62, y, xs[2] - 62, y)} color={PINK} width={2} base="rgba(21,21,21,0.15)" appear={1.1} delay={1.2} />
      </svg>
      {nodes.map((node, index) => (
        <Reveal key={node.label} from="scale" delay={0.7 + index * 0.18} className="absolute flex w-[240px] -translate-x-1/2 flex-col items-center" style={{ left: xs[index], top: y - 48 }}>
          <span className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(21,21,21,0.15)]"><node.icon className="h-[36px] w-[36px]" strokeWidth={1.25} /></span>
          <span className="relative mt-5 text-[24px] font-medium tracking-[-0.02em]"><span className="absolute right-full top-1/2 mr-3 flex -translate-y-1/2"><Dot tone={TONES[index]} /></span>{node.label}</span>
        </Reveal>
      ))}
      <Reveal delay={1.3} className="absolute left-[460px] right-[460px] top-[790px] text-center">
        <GrowRule delay={1.3} className="mx-auto h-px w-full bg-[#151515]/12" />
        <p className={cn("mt-8 text-[22px] leading-[1.55]", BODY)}>{FITOUT.body}</p>
      </Reveal>
    </Frame>
  );
}

/** Immersive case study: one photograph fills the right, the story sits on ink at the left. */
function CaseImmersive({ page, section, study, tone }: { page: number; section: Section; study: CaseStudy; tone: Tone }) {
  const hero = study.photos[0];
  return (
    <Frame page={page} section={section} dark>
      <Drift src={hero} alt={study.name} className="absolute inset-y-0 left-[640px] right-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,21,21,1)_0%,rgba(21,21,21,1)_33%,rgba(21,21,21,0.5)_52%,rgba(21,21,21,0)_70%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[260px] bg-gradient-to-t from-[#151515]/70 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-[220px] bg-gradient-to-b from-[#151515]/70 to-transparent" />
      <div className="absolute left-[160px] top-[220px] w-[620px]">
        <Reveal><div className="flex items-center gap-4"><Dot tone={tone} size={12} /><Eyebrow dark>In practice</Eyebrow></div></Reveal>
        <H size={88} className="mt-6" delay={0.1}>{study.name}</H>
        <Reveal delay={0.45} className="mt-6"><Meta study={study} dark /></Reveal>
        <Reveal delay={0.6} className="mt-8">
          {study.summary.map((line) => <p key={line} className="border-t border-white/15 py-5 text-[27px] leading-[1.4] text-white/85"><Em>{line}</Em></p>)}
        </Reveal>
        {study.award ? (
          <Reveal delay={0.8} className="mt-4 flex items-center gap-4 border-t border-white/15 pt-6 text-[20px] text-white">
            <Award className="h-[26px] w-[26px] shrink-0" strokeWidth={1.4} />{study.award}
          </Reveal>
        ) : null}
      </div>
    </Frame>
  );
}

const PATH_ICONS = [Users, PenTool, Calculator, HardHat, Building2, Wrench];

/** Three steps per slide; the presenter clicks each in. The PDF shows all three. */
function PathSteps({ page, from }: { page: number; from: number }) {
  const items = PATH.slice(from, from + 3);
  return (
    <Frame page={page} section="newOffice">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <div className="flex items-end justify-between">
          <H size={64}>A clear path from brief to <Em>handover</Em></H>
          <div className="flex gap-2 pb-4">
            {PATH.map((_, i) => {
              const on = i < from + 3;
              return <span key={i} className="h-[4px] w-[56px] rounded-full transition-colors duration-500" style={{ background: on ? INK : "rgba(21,21,21,0.1)" }} />;
            })}
          </div>
        </div>
        <div className="mt-14 grid grid-cols-3 gap-6">
          {items.map((item, i) => {
            const index = from + i;
            const Icon = PATH_ICONS[index];
            return (
              <div key={item.title} className="relative h-[560px]">
                <div className={cn("absolute inset-0 rounded-[28px] border border-dashed", RULE)} />
                <Reveal step={i + 1} className={cn("absolute inset-0 flex flex-col rounded-[28px] p-12", MIST)}>
                  <div className="flex items-start justify-between">
                    <span className={cn(serif.className, "italic leading-none text-[#151515]")} style={{ fontSize: 96 }}>0{index + 1}</span>
                    <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-white"><Icon className="h-[26px] w-[26px]" strokeWidth={1.3} /></span>
                  </div>
                  <div className="mt-auto flex items-center gap-3"><Dot tone={TONES[index % 3]} size={12} /></div>
                  <p className="mt-5 text-[36px] font-medium leading-[1.08] tracking-[-0.035em]">{item.title}</p>
                  <p className={cn("mt-5 min-h-[124px] text-[21px] leading-[1.5]", BODY)}>{item.body}</p>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   04 · Your current office
   ──────────────────────────────────────────────────────────────── */

function Alterations({ page }: { page: number }) {
  return (
    <Frame page={page} section="current">
      <MaskReveal from="left" className="absolute bottom-[150px] left-[160px] top-[170px] w-[620px] overflow-hidden rounded-[24px]">
        <Drift src={PHOTO.edelmanReception} alt="An office reworked by D'trax" className="absolute inset-0" />
      </MaskReveal>
      <div className="absolute left-[880px] right-[160px] top-[190px]">
        <H size={64}>Make more of the office <Em>you have</Em></H>
        <Reveal delay={0.5}><p className={cn("mt-6 text-[24px] leading-[1.5]", BODY)}>{ALTERATIONS.lead}</p></Reveal>
        <Reveal delay={0.7}><Eyebrow className="mt-12">Our additions and alterations services include</Eyebrow></Reveal>
        <ul className="mt-5">
          {ALTERATIONS.services.map((item, i) => (
            <Reveal key={item} delay={0.85 + i * 0.12} className={cn("flex items-center gap-6 border-t py-5", RULE)}>
              <span className={cn(serif.className, "w-[44px] text-[28px] italic leading-none text-[#151515]/45")}>0{i + 1}</span>
              <span className="text-[28px] font-medium tracking-[-0.025em]">{item}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal delay={1.3}><p className={cn("border-t pt-6 text-[20px] leading-[1.55]", RULE, BODY)}>{ALTERATIONS.close}</p></Reveal>
      </div>
    </Frame>
  );
}

function Move({ page }: { page: number }) {
  const left = { x: 560, label: "Your new office", sub: "Office fit-out", Icon: Building2, tone: "lime" as Tone };
  const right = { x: 1360, label: "The space you are leaving", sub: "Reinstatement", Icon: Undo2, tone: "pink" as Tone };
  const hub = { x: 960, y: 560 };
  return (
    <Frame page={page} section="current">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <H size={64}>Bring your move <Em>together</Em></H>
        <Reveal delay={0.4}><p className={cn("mt-5 max-w-[1100px] text-[24px] leading-[1.5]", BODY)}>{MOVE.lead}</p></Reveal>
      </div>
      <svg className="absolute inset-0" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true">
        <Beam d={arc(hub.x - 96, hub.y, left.x + 70, hub.y)} color={LIME} width={2} base="rgba(21,21,21,0.15)" appear={1} />
        <Beam d={arc(hub.x + 96, hub.y, right.x - 70, hub.y)} color={PINK} width={2} base="rgba(21,21,21,0.15)" appear={1.2} delay={1.4} />
      </svg>
      <Reveal from="scale" delay={0.6} className="absolute flex h-[184px] w-[184px] items-center justify-center rounded-full bg-[#151515]" style={{ left: hub.x - 92, top: hub.y - 92 }}>
        <div className="text-center">
          <Logo light className="mx-auto h-[30px]" />
          <p className="mt-3 text-[16px] text-white/70"><Em>One team</Em></p>
        </div>
      </Reveal>
      {[left, right].map((node, i) => (
        <Reveal key={node.label} from="scale" delay={1 + i * 0.2} className="absolute flex w-[320px] -translate-x-1/2 flex-col items-center text-center" style={{ left: node.x, top: hub.y - 64 }}>
          <span className="flex h-[128px] w-[128px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(21,21,21,0.15)]"><node.Icon className="h-[42px] w-[42px]" strokeWidth={1.25} /></span>
          <span className="mt-5 text-[24px] font-medium tracking-[-0.02em]">{node.label}</span>
          <span className={cn("relative mt-1 text-[19px]", MUTED)}><span className="absolute right-full top-1/2 mr-3 flex -translate-y-1/2"><Dot tone={node.tone} /></span><Em>{node.sub}</Em></span>
        </Reveal>
      ))}
      <div className="absolute left-[160px] right-[160px] top-[790px] grid grid-cols-2 gap-20">
        {[MOVE.body, MOVE.close].map((text, i) => (
          <Reveal key={text} delay={1.4 + i * 0.15}><p className={cn("border-t pt-6 text-[21px] leading-[1.55]", RULE, BODY)}>{text}</p></Reveal>
        ))}
      </div>
    </Frame>
  );
}

/** Gallery case study: photographs across the top, the story below. */
function CaseGallery({ page, section, study, tone }: { page: number; section: Section; study: CaseStudy; tone: Tone }) {
  return (
    <Frame page={page} section={section}>
      <MaskReveal className="absolute left-[160px] right-[160px] top-[170px] h-[540px] overflow-hidden rounded-[24px]"><Drift src={study.photos[0]} alt={study.name} className="absolute inset-0" /></MaskReveal>
      <div className="absolute left-[160px] right-[160px] top-[770px] grid grid-cols-2 gap-20">
        <div>
          <Reveal><div className="flex items-center gap-4"><Dot tone={tone} size={12} /><Eyebrow>Relevant experience</Eyebrow></div></Reveal>
          <H size={60} className="mt-5" delay={0.1}>{study.name}</H>
        </div>
        <div className="pt-1">
          <Reveal delay={0.5}><Meta study={study} /></Reveal>
          <Reveal delay={0.65} className="mt-5">
            {study.summary.map((line) => <p key={line} className={cn("border-t pt-5 text-[30px] leading-[1.3] text-[#151515]/80", RULE)}><Em>{line}</Em></p>)}
          </Reveal>
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   05 · After move-in
   ──────────────────────────────────────────────────────────────── */

function Aftercare({ page }: { page: number }) {
  const icons = [ClipboardCheck, Users, Wrench];
  return (
    <Frame page={page} section="aftercare">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <H size={64}>Support that continues <Em>after move‑in</Em></H>
        <Reveal delay={0.4}><p className={cn("mt-6 max-w-[1150px] text-[24px] leading-[1.5]", BODY)}>{AFTERCARE.lead}</p></Reveal>
      </div>
      <div className="absolute left-[160px] right-[160px] top-[480px] grid grid-cols-3 gap-6">
        {AFTERCARE.items.map((item, i) => {
          const Icon = icons[i];
          return (
            <Reveal key={item} delay={0.6 + i * 0.15} className="h-[380px] rounded-[28px] p-12" style={{ background: TONE[TONES[i]] }}>
              <span className={cn(serif.className, "text-[44px] italic leading-none text-[#151515]/55")}>0{i + 1}</span>
              <Icon className="mt-12 h-[40px] w-[40px]" strokeWidth={1.2} />
              <p className="mt-8 text-[28px] font-medium leading-[1.25] tracking-[-0.025em]">{item}</p>
            </Reveal>
          );
        })}
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   06 · Clients & credentials
   ──────────────────────────────────────────────────────────────── */

function Clients({ page }: { page: number }) {
  return (
    <Frame page={page} section="clients">
      <div className="absolute left-[160px] right-[160px] top-[170px] flex items-end justify-between">
        <H size={64}>Experience across <Em>industries</Em></H>
        <Reveal delay={0.3}><Eyebrow className="pb-3">Our clients include</Eyebrow></Reveal>
      </div>
      <div className={cn("absolute left-[160px] right-[160px] top-[320px] border-t", RULE)}>
        {[CLIENTS.slice(0, 6), CLIENTS.slice(6, 12), CLIENTS.slice(12)].map((row, r) => (
          <div key={r} className={cn("flex justify-center border-b", RULE)}>
            {row.map((client, i) => (
              <Reveal key={client.name} from="fade" delay={0.3 + (r * 6 + i) * 0.05} className={cn("flex h-[128px] w-[266.67px] items-center justify-center px-9", i ? cn("border-l", RULE) : "")}>
                <Float index={r * 6 + i}><LogoMark src={client.logo} alt={client.name} area={11000 * (WEIGHT[client.name] ?? 1)} maxHeight={84} maxWidth={196} /></Float>
              </Reveal>
            ))}
          </div>
        ))}
      </div>
      <Reveal delay={1.3} className="absolute left-[160px] right-[160px] top-[760px] flex items-center gap-12">
        <p className="font-medium leading-none tracking-[-0.06em]" style={{ fontSize: 120 }}><CountUp value={37} suffix="%" delay={1.4} /></p>
        <span className="h-[90px] w-px bg-[#151515]/15" />
        <p className="max-w-[1100px] text-[30px] leading-[1.3] tracking-[-0.02em]">of projects over the last five years came from <Em>returning clients.</Em></p>
      </Reveal>
    </Frame>
  );
}

function Credentials({ page }: { page: number }) {
  const card = (key: string, image: string | undefined, delay: number, title: string, body: string, tone: Tone) => (
    <Reveal key={key} delay={delay} className="border-l border-[#151515]/12 px-8 first:border-l-0 first:pl-0">
      <div className={cn("flex h-[320px] items-center justify-center rounded-[20px] p-8", MIST)}>
        {image ? (
          <img src={image} alt={title} draggable={false} className="max-h-full max-w-full object-contain shadow-[0_10px_30px_rgba(0,0,0,0.08)]" />
        ) : (
          <div className="flex h-full w-[220px] flex-col items-center justify-center bg-white text-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
            <span className="text-[18px] font-medium uppercase tracking-[0.2em] text-[#151515]/50">BCA</span>
            <span className="mt-3 text-[54px] font-medium leading-none tracking-[-0.04em]">CR06</span>
            <span className={cn("mt-3 text-[19px]", MUTED)}><Em>Grade L3</Em></span>
          </div>
        )}
      </div>
      <div className="mt-7 flex items-start gap-3"><span className="mt-[11px] flex"><Dot tone={tone} /></span><p className="text-[23px] font-medium leading-tight tracking-[-0.025em]">{title}</p></div>
      {body ? <p className={cn("mt-3 text-[19px] leading-[1.5]", BODY)}>{body}</p> : null}
    </Reveal>
  );
  return (
    <Frame page={page} section="clients">
      <div className="absolute left-[160px] right-[160px] top-[170px]">
        <H size={64}>Credentials behind <Em>our work</Em></H>
        <div className="mt-14 grid grid-cols-[3fr_1fr] gap-8">
          <div>
            <Reveal delay={0.3}><Eyebrow>Safety and contractor credentials</Eyebrow></Reveal>
            <div className="mt-6 grid grid-cols-3">
              {CREDENTIALS.safety.map((cert, i) => card(cert.title, cert.image, 0.4 + i * 0.12, cert.title, cert.body, TONES[i]))}
            </div>
          </div>
          <div className="border-l border-[#151515]/12 pl-8">
            <Reveal delay={0.3}><Eyebrow>Design recognition</Eyebrow></Reveal>
            <div className="mt-6 grid grid-cols-1">
              {card("sida", CREDENTIALS.award.image, 0.8, CREDENTIALS.award.title, CREDENTIALS.award.body, "pink")}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function Closing({ page }: { page: number }) {
  return (
    <Frame page={page} dark bare>
      <Drift src={TEAM_PHOTO.foundersBar} alt="The D'trax studio" position="50% 45%" className="absolute inset-0" />
      <div aria-hidden="true" className="absolute inset-0 bg-[#151515]/86" />
      <div className="absolute left-[160px] top-[150px]"><Reveal from="fade"><Logo light className="h-[64px]" /></Reveal></div>
      <div className="absolute left-[160px] top-[340px] w-[900px]">
        <h2 className="font-medium tracking-[-0.05em]" style={{ fontSize: 112, lineHeight: 1.0 }}><BlurText delay={0.2} stagger={0.1}>Let’s plan your<br /><Em color={LIME}>next office.</Em></BlurText></h2>
        <Reveal delay={0.7}><p className="mt-10 border-t border-white/20 pt-8 text-[26px] font-light leading-[1.5] text-white/80">{CONTACT.lead}</p></Reveal>
        <Reveal delay={0.85}><p className="mt-5 text-[22px] font-light leading-[1.5] text-white/60">{CONTACT.next}</p></Reveal>
      </div>
      <Reveal delay={1} className="absolute bottom-[150px] right-[160px] top-[340px] flex w-[520px] flex-col border-l border-white/15 pl-16">
        <Magnet strength={0.15} className="w-fit">
          <div className="rounded-[20px] bg-white p-5"><img src={QR} alt="QR code to contact Ronald Goh" draggable={false} className="h-[220px] w-[220px] [image-rendering:pixelated]" /></div>
        </Magnet>
        <p className="mt-10 text-[36px] font-medium tracking-[-0.03em]">{CONTACT.name}</p>
        <p className="mt-1 text-[20px] text-white/60"><Em>{CONTACT.company}</Em></p>
        <div className="mt-8 border-t border-white/15 pt-6 text-[19px] font-light leading-[1.6] text-white/80">
          <p>{CONTACT.web}</p>
          {CONTACT.address.map((line) => <p key={line}>{line}</p>)}
        </div>
      </Reveal>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   Running order
   ──────────────────────────────────────────────────────────────── */

/** Gallery slides that follow a case study. */
const photoDefs = (id: string, section: Section, study: CaseStudy): Def[] => {
  const sets = galleries(study);
  return sets.map((photos, part) => ({ id: `${id}-photos-${part + 1}`, render: (page) => <CasePhotos page={page} section={section} study={study} photos={photos} part={part + 1} parts={sets.length} /> }));
};

type Def = { id: string; steps?: number; dark?: boolean; render: (page: number) => ReactNode };

const defs: Def[] = [
  { id: "cover", dark: true, render: () => <Cover /> },

  { id: "experience-divider", render: (page) => <Divider page={page} section="experience" sketch="timeline" title={<>Built on <Em>experience</Em></>} line="Designing and building offices in Singapore since 2003." /> },
  { id: "experience", render: (page) => <ExperienceStats page={page} /> },
  { id: "leadership", render: (page) => <Leadership page={page} /> },
  { id: "buddy", render: (page) => <Buddy page={page} /> },

  { id: "people-divider", render: (page) => <Divider page={page} section="people" sketch="people" size={100} title={<>A workplace shaped around <Em>your people</Em></>} line="Understanding how people use an office, before design begins." /> },
  { id: "workshop", render: (page) => <Workshop page={page} /> },
  { id: "singapore-pools", render: (page) => <CaseSplit page={page} section="people" study={POOLS} tone="blue"><Outcomes study={POOLS} /></CaseSplit> },
  ...photoDefs("singapore-pools", "people", POOLS),
  { id: "singapore-pools-quote", render: (page) => <Quote page={page} section="people" study={POOLS} tone="blue" /> },

  { id: "new-office-divider", render: (page) => <Divider page={page} section="newOffice" sketch="plan" size={100} title={<>Your new office,<br /><Em>coordinated from<br />start to finish</Em></>} line="One contract and one coordinated team." /> },
  { id: "one-team", render: (page) => <OneTeam page={page} /> },
  { id: "group-ib", dark: true, render: (page) => <CaseImmersive page={page} section="newOffice" study={GROUP_IB} tone="pink" /> },
  ...photoDefs("group-ib", "newOffice", GROUP_IB),
  { id: "group-ib-quote", render: (page) => <Quote page={page} section="newOffice" study={GROUP_IB} tone="pink" /> },
  { id: "path-1", render: (page) => <PathSteps page={page} from={0} /> },
  { id: "path-2", render: (page) => <PathSteps page={page} from={3} /> },

  { id: "current-divider", render: (page) => <Divider page={page} section="current" sketch="room" title={<>Your current <Em>office</Em></>} line="Adapt the space you have, or reinstate it as you move." /> },
  { id: "alterations", render: (page) => <Alterations page={page} /> },
  { id: "move", render: (page) => <Move page={page} /> },
  { id: "sumitomo", render: (page) => <CaseGallery page={page} section="current" study={SUMITOMO} tone="lime" /> },
  ...photoDefs("sumitomo", "current", SUMITOMO),

  { id: "aftercare-divider", render: (page) => <Divider page={page} section="aftercare" sketch="checklist" size={104} title={<>Support that continues <Em>after move‑in</Em></>} line="Covered defects, warranty claims and adjustments." /> },
  { id: "aftercare", render: (page) => <Aftercare page={page} /> },
  { id: "sony-pictures", render: (page) => <CaseSplit page={page} section="aftercare" study={SONY} tone="blue" /> },
  ...photoDefs("sony-pictures", "aftercare", SONY),
  { id: "sony-pictures-quote", render: (page) => <Quote page={page} section="aftercare" study={SONY} tone="blue" /> },

  { id: "clients-divider", render: (page) => <Divider page={page} section="clients" sketch="seal" title={<>Clients &amp; <Em>credentials</Em></>} line="Experience across industries, with the credentials behind it." /> },
  { id: "clients", render: (page) => <Clients page={page} /> },
  { id: "credentials", render: (page) => <Credentials page={page} /> },
  { id: "closing", dark: true, render: (page) => <Closing page={page} /> },
];

export const slides: DeckSlide[] = defs.map((def, index) => ({ id: def.id, steps: def.steps, dark: def.dark, render: () => def.render(index + 1) }));
