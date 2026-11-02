"use client";

import { Fragment, type ReactNode } from "react";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { motion } from "framer-motion";
import {
  Baby, BadgeCheck, Ban, Bandage, Bot, BriefcaseBusiness, BriefcaseMedical, Cake, CalendarOff, CircleAlert, ClipboardCheck, Clock, CloudOff, Database, FileLock, FileText, Gavel, Gem, Gift,
  HardHat, HeartHandshake, Hospital, KeyRound, Laptop, LifeBuoy, Lock, LockKeyhole, MapPin, Megaphone, MessageCircle, MessageSquareWarning, Network, Package, PackageCheck,
  Flower2, Receipt, RefreshCw, Scale, ShieldAlert, ShieldCheck, Split, Target, Thermometer, TreePalm, TrendingUp, TriangleAlert, Upload, UserCheck, Users, Wallet, type LucideIcon,
} from "lucide-react";
import { CountUp, Reveal, useDeck, type DeckSlide } from "@/components/deck/Deck";
import { Beam, BlurText } from "@/components/deck/fx";
import { CERT, LOGO } from "@/decks/dtrax/data";
import { cn } from "@/lib/utils";
import { Sketch } from "@/components/deck/vectors";
import { DrawRule, StepLine } from "./fx";
import { WelcomeDesk } from "./welcome-art";
import {
  ABOUT, ACK_FIELDS, ACK_RETURN, ACKNOWLEDGEMENT, AI_TOOLS, ALLOWANCES, BEFORE_YOU_START, BIZSAFE, BUDDY, BUDDY_DUTIES, CHAPTERS, CLAIM_STEPS, CLAIMS_REJECTED,
  CLOSING_LINE, COMPANY, CONDUCT, CONDUCT_INTRO, DPO, EMERGENCY, FOUNDERS, FOUNDERS_QUOTE, INCIDENT_STEPS, INCIDENT_TYPES, IT_INTRO, IT_RULES, LEAVE,
  LEAVE_BENEFITS_NOTE, MISSION, MONITORING, PDPA, PHOTO, POLICIES_INTRO, SAFETY_DUTIES, SAFETY_FIRST_AID, SAFETY_INTRO, SAFETY_LEAD, SAFETY_SITE, TEAM_INTRO,
  TEAMS, VALUES, VALUES_INTRO, VALUES_STANDARD, VISION, WELCOME, WELCOME_ABOARD,
  type ChapterId, type LeaveRow, type Person, type Tone,
} from "./data";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const sans = DM_Sans({ subsets: ["latin"], display: "swap" });

/* ────────────────────────────────────────────────────────────────
   D'trax Employee Handbook 2026, on a portrait A4-proportion canvas
   (1240 × 1754). Same brand rules as the company profile: ink on
   white, pink / blue / lime as flat fields and small accents,
   medium display type, serif italic for emphasis, light body text,
   hairline rules. A handbook is read, so body text stays at a
   comfortable size and long policies run across several pages.
   ──────────────────────────────────────────────────────────────── */

export const PAGE_W = 1240;
export const PAGE_H = 1754;

const PINK = "#FFB6B6";
const BLUE = "#9DD6FF";
const LIME = "#DDFF97";
const TONE: Record<Tone, string> = { pink: PINK, blue: BLUE, lime: LIME };
const TONES: Tone[] = ["lime", "blue", "pink"];

const MUTED = "text-[#6E6E73]";
/** Bottom margin of the page body: content ends 130px above the page edge, clear of the footer. */
const BOTTOM = 130;
/** Reading measure for body copy (about 65 to 72 characters at 22 to 24px). */
const MEASURE = "max-w-[820px]";
const BODY = "font-light text-[#55555A]";
const BODY_DARK = "font-light text-white/65";
const RULE = "border-[#151515]/12";
const MIST = "bg-[#F4F4F2]";
/** The one small-caps label style, used for eyebrows, row labels and form fields alike. */
const LABEL = "text-[15px] font-medium uppercase tracking-[0.2em]";
const LABEL_INK = "text-[#151515]/55";
/** Icon chips: one size everywhere a row or tile carries an icon. */
const ICON_CHIP = "flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full";
/** Line icons: one size and one stroke across the handbook, in muted ink. */
const ICON = "h-[28px] w-[28px] shrink-0";
const STROKE = 1.5;

function Glyph({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon aria-hidden="true" className={cn(ICON, "text-[#151515]/70", className)} strokeWidth={STROKE} />;
}

const chapterOf = (id: ChapterId) => CHAPTERS.find((chapter) => chapter.id === id)!;

function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return <img src={LOGO.dark} alt="D'trax" draggable={false} className={cn("w-auto object-contain", className)} style={light ? { filter: "brightness(0) invert(1)" } : undefined} />;
}

/** Serif italic emphasis. */
function Em({ children, color }: { children: ReactNode; color?: string }) {
  return <span className={cn(serif.className, "font-normal italic tracking-[-0.01em]")} style={color ? { color } : undefined}>{children}</span>;
}

/** The client's own emphasis (**…**) set in medium-weight ink, never a highlighter. */
function Rich({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*)/).map((part, i) => (part.startsWith("**") ? <strong key={i} className="font-medium text-[#151515]">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>))}</>;
}

/** Every page shares this chrome: chapter label and logo at the top, company line and page number at the foot, always in the same place. */
function Frame({ page, chapter, dark = false, background, bare = false, children }: { page: number; chapter?: ChapterId; dark?: boolean; background?: string; bare?: boolean; children: ReactNode }) {
  const meta = chapter ? chapterOf(chapter) : null;
  return (
    <div className={cn(sans.className, "absolute inset-0 overflow-hidden", dark ? "bg-[#151515] text-white" : "bg-white text-[#151515]")} style={background ? { background } : undefined}>
      {children}
      {bare ? null : <>
        <header className="pointer-events-none absolute left-[110px] right-[110px] top-[60px] z-10 flex items-center justify-between">
          <span className={cn("flex items-center gap-4 text-[14px] font-medium uppercase tracking-[0.2em]", dark ? "text-white/60" : "text-[#151515]/55")}>
            {meta ? <><span className={dark ? "text-white" : "text-[#151515]"}>{meta.n}</span><span className="h-px w-[28px] bg-current" />{meta.label}</> : <span>Employee Handbook</span>}
          </span>
          <Logo light={dark} className="h-[32px]" />
        </header>
        <footer className={cn("pointer-events-none absolute bottom-[56px] left-[110px] right-[110px] z-10 flex items-center justify-between text-[14px] font-light", dark ? "text-white/45" : "text-[#151515]/45")}>
          <span>D&apos;trax Design Pte Ltd · Employee Handbook 2026</span>
          <span className="tabular-nums">{page}</span>
        </footer>
      </>}
    </div>
  );
}

/** Page body: inside the side margins, below the header. */
/** With `fill`, the body runs down to the bottom margin as a column, so a closing block can sit on the baseline (mt-auto). */
function Body({ children, top = 180, fill = false, className }: { children: ReactNode; top?: number; fill?: boolean; className?: string }) {
  return <div className={cn("absolute left-[110px] right-[110px]", fill && "flex flex-col", className)} style={fill ? { top, bottom: BOTTOM } : { top }}>{children}</div>;
}

function H({ children, size = 64, className }: { children: ReactNode; size?: number; className?: string }) {
  return <h2 className={cn("font-medium tracking-[-0.045em] [text-wrap:balance]", className)} style={{ fontSize: size, lineHeight: 1.05 }}><BlurText>{children}</BlurText></h2>;
}

function Eyebrow({ children, dark = false, className }: { children: ReactNode; dark?: boolean; className?: string }) {
  return <p className={cn(LABEL, dark ? "text-white/55" : LABEL_INK, className)}>{children}</p>;
}

function Dot({ tone, size = 10 }: { tone: Tone; size?: number }) {
  return <span className="inline-block shrink-0 rounded-full" style={{ width: size, height: size, background: TONE[tone] }} />;
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

function Avatar({ person, size }: { person: Person; size: number }) {
  return (
    <span className="block overflow-hidden rounded-full border-[3px] border-white bg-[#F4F4F2] shadow-[0_0_0_1px_rgba(21,21,21,0.12)]" style={{ width: size, height: size }}>
      {person.photo ? (
        <img src={person.photo} alt={person.name} draggable={false} className="h-full w-full object-cover" style={{ objectPosition: "50% 15%" }} />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-medium text-[#151515]/60" style={{ fontSize: size * 0.3 }}>{person.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
      )}
    </span>
  );
}

/** A short run of bars showing where this page sits within a multi-page chapter. */
function Progress({ total, from, count }: { total: number; from: number; count: number }) {
  return (
    <div className="flex gap-[6px]" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => <span key={i} className="h-[3px] w-[30px] rounded-full" style={{ background: i >= from && i < from + count ? "#151515" : "rgba(21,21,21,0.1)" }} />)}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Cover, contents and chapter dividers
   ──────────────────────────────────────────────────────────────── */

function Cover() {
  return (
    <Frame page={1} dark bare>
      <Drift src={PHOTO.reception} alt="The D'trax studio reception" position="58% 50%" className="absolute inset-x-0 top-0 h-[1080px]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-[520px] h-[580px] bg-gradient-to-b from-[#151515]/0 to-[#151515]" />
      <div className="absolute bottom-[130px] left-[110px] right-[110px]">
        <Reveal from="fade"><Logo light className="h-[72px]" /></Reveal>
        <Reveal delay={0.15}><Eyebrow dark className="mt-14">D&apos;trax Design Pte Ltd</Eyebrow></Reveal>
        <h1 className="mt-6 font-medium tracking-[-0.05em] text-white" style={{ fontSize: 136, lineHeight: 0.98 }}>
          <BlurText delay={0.3} stagger={0.14}>Employee<br />Handbook <Em color={LIME}>2026</Em></BlurText>
        </h1>
        <Reveal delay={0.9} className="mt-12 border-t border-white/20 pt-8">
          <p className="text-[27px] font-normal tracking-[-0.02em] text-white"><Em>{CLOSING_LINE}</Em></p>
          <p className={cn("mt-3 text-[18px]", BODY_DARK)}>Issued by Management</p>
        </Reveal>
      </div>
    </Frame>
  );
}

/** Jumps the presenter to a page: the player follows hash changes. */
function jumpTo(page: number) {
  window.location.hash = `${page}`;
}

function Contents({ page }: { page: number }) {
  const { print } = useDeck();
  return (
    <Frame page={page}>
      <Body>
        <H size={72}>Contents</H>
        <Reveal delay={0.3}><p className={cn("mt-5 text-[22px]", BODY)}>{print ? "Each chapter opens on a coloured page." : <>Each chapter opens on a coloured page. <Em>Click a chapter to go straight to it.</Em></>}</p></Reveal>
        <div className="mt-14">
          {CHAPTERS.map((chapter, index) => {
            const target = CHAPTER_PAGE[chapter.id];
            const row = (
              <>
                <span className={cn(serif.className, "w-[64px] shrink-0 text-[32px] italic leading-none text-[#151515]/45")}>{chapter.n}</span>
                <Dot tone={chapter.tone} />
                <span className="ml-5 text-[30px] font-medium leading-[1.15] tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-2">{chapter.label}</span>
                <span className="mx-6 h-px min-w-[40px] flex-1 bg-[#151515]/12 transition-colors duration-500 group-hover:bg-[#151515]/40" />
                <span className={cn("w-[44px] shrink-0 text-right text-[22px] tabular-nums", MUTED)}>{target}</span>
              </>
            );
            const rowClass = cn("group flex items-center border-t py-[32px]", RULE, index === CHAPTERS.length - 1 && "border-b");
            return (
              <Reveal key={chapter.id} delay={0.35 + index * 0.05}>
                {print ? (
                  <a href={`#page-${target}`} className={rowClass}>{row}</a>
                ) : (
                  <div role="link" tabIndex={0} className={cn(rowClass, "cursor-pointer")} onClick={(event) => { event.stopPropagation(); jumpTo(target); }}>{row}</div>
                )}
              </Reveal>
            );
          })}
        </div>
      </Body>
    </Frame>
  );
}

/** Chapter break: a flat field of brand colour, a line drawing, the chapter number and one line. */
function Divider({ page, chapter }: { page: number; chapter: ChapterId }) {
  const meta = chapterOf(chapter);
  return (
    <Frame page={page} chapter={chapter} background={TONE[meta.tone]}>
      <div className="absolute bottom-[160px] left-[110px] right-[110px] top-[150px] flex flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Sketch name={meta.sketch} className="h-full max-h-[720px] w-full" />
        </div>
        <div className="mt-12">
          <Reveal from="fade"><p className={cn(serif.className, "italic leading-none text-[#151515]/35")} style={{ fontSize: 150 }}>{meta.n}</p></Reveal>
          <h2 className="mt-11 font-medium tracking-[-0.05em] [text-wrap:balance]" style={{ fontSize: meta.label.length > 30 ? 76 : 92, lineHeight: 1.02 }}><BlurText delay={0.15} stagger={0.07}>{meta.label}</BlurText></h2>
          <Reveal delay={0.6} className="mt-9 border-t border-[#151515]/25 pt-6">
            <p className="text-[26px] font-light leading-[1.4] text-[#151515]/75">{meta.line}</p>
          </Reveal>
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   01 · Welcome
   ──────────────────────────────────────────────────────────────── */

/** The Managing Director's letter on one page: portrait and opening line, the letter in two columns, then the sign-off. */
function WelcomeLetter({ page }: { page: number }) {
  const [lead, ...letter] = WELCOME.paragraphs;
  return (
    <Frame page={page} chapter="welcome">
      <Body fill>
        <div className="grid grid-cols-[1fr_340px] gap-14">
          <div className="flex flex-col">
            <Eyebrow>A letter from the Managing Director</Eyebrow>
            <H size={64} className="mt-5">We&apos;re glad to have you <Em>here.</Em></H>
            <Reveal delay={0.5} className="mt-auto">
              <p className="text-[32px] font-normal leading-[1.35] tracking-[-0.02em]">{lead}</p>
            </Reveal>
          </div>
          <Reveal from="fade" delay={0.1}>
            <Drift src={PHOTO.ronaldPortrait} alt="Ronald Goh, Managing Director" position="50% 30%" className="h-[400px] w-full rounded-[24px]" />
          </Reveal>
        </div>
        <Reveal delay={0.7} className={cn("mt-12 columns-2 gap-14 border-t pt-10", RULE)}>
          {letter.map((paragraph, index) => (
            <p key={index} className={cn("text-[26px] leading-[1.58]", index ? "mt-7" : "", BODY)}><Rich text={paragraph} /></p>
          ))}
        </Reveal>
        <div className="mt-auto">
          <DrawRule delay={0.9} />
          <div className="mt-10 flex items-end justify-between gap-12">
            <h2 className="pb-2 font-medium tracking-[-0.045em]" style={{ fontSize: 60, lineHeight: 1.05 }}><BlurText delay={1}>Welcome to <Em>D&apos;trax.</Em></BlurText></h2>
            <Reveal delay={1.2} className="w-[340px] shrink-0">
              {/* Signature above the line: the image once supplied (WELCOME.signature), a blank space for it until then. */}
              <div className="flex h-[96px] items-end">
                {WELCOME.signature ? <img src={WELCOME.signature} alt={`${WELCOME.name}'s signature`} draggable={false} className="max-h-full max-w-full object-contain object-left-bottom" /> : null}
              </div>
              <div className="mt-2 h-px bg-[#151515]/35" />
              <p className="mt-5 text-[28px] font-medium leading-none tracking-[-0.03em]">{WELCOME.name}</p>
              <p className={cn("mt-2 text-[22px]", MUTED)}><Em>{WELCOME.role}</Em></p>
            </Reveal>
          </div>
        </div>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   02 · About this handbook
   ──────────────────────────────────────────────────────────────── */

const ABOUT_ICONS: LucideIcon[] = [Target, Users, FileText, Network, RefreshCw];

function AboutHandbook({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="about">
      <Body fill>
        <H>About this <Em>handbook</Em></H>
        <div className="mt-12">
          {ABOUT.paragraphs.map((item, index) => (
            <Reveal key={item.label} delay={0.3 + index * 0.1} className={cn("grid grid-cols-[250px_1fr] gap-10 border-t py-8", RULE)}>
              <div className="flex items-center gap-4 self-start"><Glyph icon={ABOUT_ICONS[index]} /><span className={cn(LABEL, LABEL_INK)}>{item.label}</span></div>
              <p className={cn("text-[23px] leading-[1.6]", BODY)}>{item.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.9} className={cn("mt-auto border-t pt-7", RULE)}>
          <p className="text-[22px] font-medium tracking-[-0.02em]">{ABOUT.issuedBy}</p>
          <p className={cn("mt-1 text-[20px]", MUTED)}><Em>{ABOUT.company}</Em></p>
        </Reveal>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   03 · Mission, vision and values
   ──────────────────────────────────────────────────────────────── */

function FoundersQuote({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="mission">
      <Reveal from="fade" delay={0.1} className="absolute left-[110px] right-[110px] top-[150px] h-[900px]">
        <Drift src={PHOTO.foundersMeeting} alt="Ronald Goh and Jayne Ong" position="40% 50%" className="h-full w-full rounded-[24px]" />
      </Reveal>
      <Body top={1130}>
        <p className={cn(serif.className, "text-[120px] italic leading-[0.6] text-[#151515]/25")} aria-hidden="true">“</p>
        <h2 className="mt-12 font-medium tracking-[-0.045em]" style={{ fontSize: 64, lineHeight: 1.1 }}>
          <BlurText delay={0.3} stagger={0.06}><Em>Good work is simple.</Em> Think clearly, speak plainly, and finish what you start.</BlurText>
        </h2>
        <Reveal delay={1} className={cn("mt-10 flex items-center gap-4 border-t pt-6", RULE)}>
          <Dot tone="pink" /><p className="text-[22px] font-medium tracking-[-0.02em]">{FOUNDERS_QUOTE.by}</p>
        </Reveal>
      </Body>
    </Frame>
  );
}

function MissionVision({ page }: { page: number }) {
  const blocks = [{ label: "Our mission", text: MISSION, tone: "lime" as Tone }, { label: "Our vision", text: VISION, tone: "blue" as Tone }];
  return (
    <Frame page={page} chapter="mission">
      <Body fill>
        <H>Mission and <Em>vision</Em></H>
        <div className="mt-20 flex flex-1 flex-col">
          {blocks.map((block, index) => (
            <Reveal key={block.label} delay={0.4 + index * 0.25} className={cn("flex-1 border-t pt-12", RULE)}>
              <div className="flex items-center gap-4"><Dot tone={block.tone} size={14} /><Eyebrow>{block.label}</Eyebrow></div>
              <p className="mt-12 text-[64px] font-medium leading-[1.12] tracking-[-0.04em]">{block.text}</p>
            </Reveal>
          ))}
        </div>
      </Body>
    </Frame>
  );
}

function Values({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="mission">
      <Body fill>
        <H>Our <Em>values</Em></H>
        <Reveal delay={0.3}><p className={cn("mt-5 text-[24px]", BODY)}>{VALUES_INTRO}</p></Reveal>
        <div className="mt-12 flex flex-1 flex-col pb-12">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={0.45 + index * 0.18} className={cn("group grid flex-1 grid-cols-[130px_1fr] border-t pt-12", RULE)}>
              <span className={cn(serif.className, "text-[80px] italic leading-[0.85] text-[#151515]/30 transition-colors duration-500 group-hover:text-[#151515]")}>0{index + 1}</span>
              <div>
                <div className="flex items-center gap-4"><p className="text-[52px] font-medium leading-none tracking-[-0.04em]">{value.title}</p><Dot tone={TONES[index]} size={14} /></div>
                <p className={cn("mt-6 text-[27px] leading-[1.6]", MEASURE, BODY)}>{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={1.1} className={cn("rounded-[24px] px-12 py-12", MIST)}>
          <p className={cn("text-[22px]", BODY)}>{VALUES_STANDARD.lead}</p>
          <p className="mt-4 text-[38px] font-medium leading-[1.2] tracking-[-0.03em]">{VALUES_STANDARD.strong}</p>
        </Reveal>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   04 · Code of conduct: twelve items, four to a page
   ──────────────────────────────────────────────────────────────── */

const PER_CONDUCT_PAGE = 4;
/** One icon per conduct item, in CONDUCT order. */
const CONDUCT_ICONS: LucideIcon[] = [BadgeCheck, Scale, Lock, Split, Gift, BriefcaseBusiness, Package, HeartHandshake, Clock, TrendingUp, Gavel, MessageSquareWarning];

function Conduct({ page, from }: { page: number; from: number }) {
  const items = CONDUCT.slice(from, from + PER_CONDUCT_PAGE);
  const first = from === 0;
  return (
    <Frame page={page} chapter="conduct">
      <Body fill>
        <div className="flex items-end justify-between">
          {first ? <H>Code of <Em>conduct</Em></H> : <H size={48}>Code of conduct, <Em>{from + 1} to {from + items.length}</Em></H>}
          <Reveal delay={0.3} className="pb-3"><Progress total={CONDUCT.length} from={from} count={items.length} /></Reveal>
        </div>
        {first ? <Reveal delay={0.3}><p className="mt-8 max-w-[960px] text-[26px] font-normal leading-[1.45] tracking-[-0.015em]">{CONDUCT_INTRO}</p></Reveal> : null}
        <div className={first ? "mt-10" : "mt-12"}>
          {items.map((item, i) => (
            <Reveal key={item.title} delay={0.4 + i * 0.15} className={cn("group grid grid-cols-[110px_1fr] border-t py-10", RULE)}>
              <span className={cn(serif.className, "text-[52px] italic leading-[0.9] text-[#151515]/35 transition-colors duration-500 group-hover:text-[#151515]")}>{String(from + i + 1).padStart(2, "0")}</span>
              <div>
                <div className="flex items-center justify-between gap-8"><p className="text-[36px] font-medium leading-[1.1] tracking-[-0.03em]">{item.title}</p><Glyph icon={CONDUCT_ICONS[from + i]} /></div>
                {item.body.map((paragraph, p) => <p key={p} className={cn("mt-5 text-[24px] leading-[1.62]", MEASURE, BODY)}>{paragraph}</p>)}
              </div>
            </Reveal>
          ))}
        </div>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   05 · Workplace policies: leave, then claims
   ──────────────────────────────────────────────────────────────── */

/** One icon per leave type, in LEAVE order. */
const LEAVE_ICONS: LucideIcon[] = [TreePalm, Thermometer, Hospital, Baby, Flower2, Gem, Cake, CalendarOff];

const BASIS_TONE: Record<string, Tone> = { "Contract": "lime", "Employment Act": "blue", "Singapore law": "blue", "Company benefit": "pink", "Management approval": "lime" };

function LeaveRows({ rows, delay, offset = 0 }: { rows: LeaveRow[]; delay: number; offset?: number }) {
  return (
    <div>
      {rows.map((row, index) => (
        <Reveal key={row.type} delay={delay + index * 0.12} className={cn("grid grid-cols-[1fr_210px] gap-10 border-t py-11", RULE)}>
          <div>
            <div className="flex items-center gap-4">
              <Glyph icon={LEAVE_ICONS[offset + index]} />
              <p className="text-[32px] font-medium leading-[1.1] tracking-[-0.03em]">{row.type}</p>
            </div>
            <p className={cn("mt-3 flex items-center gap-3", LABEL, LABEL_INK)}><Dot tone={BASIS_TONE[row.basis] ?? "lime"} size={8} />{row.basis}</p>
            <p className={cn("mt-5 text-[24px] leading-[1.58]", BODY)}>{row.notes}</p>
          </div>
          <div className="text-right">
            {row.figure ? (
              <>
                <p className="font-medium leading-none tracking-[-0.06em]" style={{ fontSize: 96 }}><CountUp value={row.figure.value} delay={delay + 0.2 + index * 0.12} /></p>
                <p className={cn("mt-6 text-[18px]", MUTED)}><Em>{row.figure.unit}</Em></p>
              </>
            ) : null}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function LeaveOne({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="policies">
      <Body>
        <H>Leave <Em>entitlements</Em></H>
        <Reveal delay={0.3}><p className={cn("mt-7 text-[24px] leading-[1.6]", MEASURE, BODY)}>{POLICIES_INTRO}</p></Reveal>
        <div className="mt-12"><LeaveRows rows={LEAVE.slice(0, 4)} delay={0.45} /></div>
      </Body>
    </Frame>
  );
}

function LeaveTwo({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="policies">
      <Body>
        <H size={48}>Leave entitlements, <Em>continued</Em></H>
        <div className="mt-14"><LeaveRows rows={LEAVE.slice(4)} delay={0.3} offset={4} /></div>
        <Reveal delay={0.9} className={cn("mt-10 rounded-[24px] px-12 py-12", MIST)}>
          <div className="flex items-center gap-3"><Dot tone="pink" size={8} /><Eyebrow>Company benefits</Eyebrow></div>
          <p className={cn("mt-5 text-[24px] font-normal leading-[1.58] text-[#151515]/80", MEASURE)}>{LEAVE_BENEFITS_NOTE}</p>
        </Reveal>
      </Body>
    </Frame>
  );
}

/** A procedure whose steps arrive one after another; the PDF shows every step. */
function Procedure({ steps, rowHeight, tones, icons }: { steps: { title: string; body: string }[]; rowHeight: number; tones: Tone[]; icons?: LucideIcon[] }) {
  const node = 72;
  return (
    <div className="relative">
      {steps.map((step, index) => (
        <div key={step.title} className="relative" style={{ height: index === steps.length - 1 ? undefined : rowHeight }}>
          <Reveal step={index + 1} className="relative grid grid-cols-[72px_1fr] gap-9">
            <div className="relative flex flex-col items-center">
              {/* The connector from the previous step arrives with this step, so a line never points at an empty slot. */}
              {index > 0 ? <div className="absolute left-1/2 -translate-x-1/2" style={{ top: -(rowHeight - node - 12) }}><StepLine height={rowHeight - node - 24} color={TONE[tones[(index - 1) % tones.length]]} /></div> : null}
              <span className="flex items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_rgba(21,21,21,0.16)]" style={{ width: node, height: node }}>
                <span className={cn(serif.className, "text-[32px] italic leading-none")}>{index + 1}</span>
              </span>
            </div>
            <div className="pt-[14px]">
              <div className="flex items-center gap-4">
                {icons ? <Glyph icon={icons[index]} /> : null}
                <p className="text-[32px] font-medium leading-[1.1] tracking-[-0.03em]">{step.title}</p>
              </div>
              <p className={cn("mt-3 text-[24px] leading-[1.58]", MEASURE, BODY)}>{step.body}</p>
            </div>
          </Reveal>
        </div>
      ))}
    </div>
  );
}

const CLAIM_ICONS: LucideIcon[] = [Upload, Receipt, UserCheck, Wallet];

/**
 * How a claim travels, as four cards in reading order. Live, the cards arrive one after another;
 * in print all four show at once.
 */
function Claims({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="policies">
      <Body fill>
        <H>Reimbursement and <Em>claims</Em></H>
        <Reveal delay={0.3}><p className={cn("mt-6 text-[22px]", MUTED)}>How a claim travels, from submission to payment.</p></Reveal>
        <div className="mt-12 grid flex-1 grid-cols-2 grid-rows-2 gap-5">
          {CLAIM_STEPS.map((item, index) => (
            <div key={item.title} className="relative">
              <Reveal step={index + 1} from="scale" className={cn("relative flex h-full flex-col rounded-[24px] border bg-white p-10", RULE)}>
                <div className="flex items-start justify-between">
                  <span className={cn(serif.className, "text-[56px] italic leading-[0.9] text-[#151515]/35")}>{index + 1}</span>
                  <Glyph icon={CLAIM_ICONS[index]} />
                </div>
                <p className="mt-12 text-[32px] font-medium leading-[1.1] tracking-[-0.03em]">{item.title}</p>
                <p className={cn("mt-4 text-[24px] leading-[1.55]", BODY)}>{item.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal delay={0.5} className={cn("mt-12 border-t pt-9", RULE)}>
          <p className={cn("text-[24px] font-normal leading-[1.55] text-[#151515]/80", MEASURE)}>{CLAIMS_REJECTED}</p>
          <p className={cn("mt-5 text-[22px] leading-[1.6]", MEASURE, BODY)}>{ALLOWANCES}</p>
        </Reveal>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   06 · Workplace safety & health
   ──────────────────────────────────────────────────────────────── */

function SafetyOne({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="safety">
      <Body>
        <H>Workplace safety <Em>&amp; health</Em></H>
        <Reveal delay={0.3}><p className="mt-9 max-w-[980px] text-[30px] font-normal leading-[1.5] tracking-[-0.015em]">{SAFETY_INTRO}</p></Reveal>
        <Reveal delay={0.6} className={cn("mt-16 grid grid-cols-[440px_1fr] items-center gap-14 rounded-[24px] p-14", MIST)}>
          <img src={CERT.bizsafe} alt="bizSAFE Star certificate" draggable={false} className="h-[660px] w-full bg-white object-contain shadow-[0_14px_36px_rgba(21,21,21,0.12)]" />
          <div>
            <div className="flex items-center gap-3"><Dot tone="pink" /><Eyebrow>Certified</Eyebrow></div>
            <p className="mt-6 text-[52px] font-medium leading-none tracking-[-0.045em]">bizSAFE <Em>Star</Em></p>
            <p className={cn("mt-7 text-[24px] leading-[1.6]", BODY)}>{BIZSAFE}</p>
          </div>
        </Reveal>
      </Body>
    </Frame>
  );
}

const DUTY_ICONS: LucideIcon[] = [HardHat, ClipboardCheck, ShieldCheck, TriangleAlert];

function SafetyTwo({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="safety">
      <Body>
        <H>Safety <Em>expectations</Em></H>
        <Reveal delay={0.3}><p className={cn("mt-7 text-[24px] leading-[1.6]", MEASURE, BODY)}>{SAFETY_LEAD}</p></Reveal>
        <div className="mt-12 grid grid-cols-2 gap-5">
          {SAFETY_DUTIES.map((duty, index) => {
            const Icon = DUTY_ICONS[index];
            return (
              <Reveal key={duty} from="scale" delay={0.45 + index * 0.12} className="group flex h-[340px] flex-col rounded-[24px] p-10 text-[#151515]" style={{ background: TONE[TONES[index % 3]] }}>
                <Icon aria-hidden="true" className={cn(ICON, "text-[#151515] transition-transform duration-500 group-hover:scale-110")} strokeWidth={STROKE} />
                <p className="mt-auto text-[30px] font-medium leading-[1.15] tracking-[-0.03em]">{duty}</p>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-14">
          {([["On site", SAFETY_SITE, MapPin], ["First aid", SAFETY_FIRST_AID, BriefcaseMedical]] as const).map(([label, text, icon], index) => (
            <Reveal key={label} delay={0.9 + index * 0.12} className={cn("grid grid-cols-[200px_1fr] gap-8 border-t py-7", RULE)}>
              <span className={cn("flex items-center gap-4 self-start", LABEL, LABEL_INK)}><Glyph icon={icon} />{label}</span>
              <p className={cn("text-[23px] leading-[1.6]", BODY)}>{text}</p>
            </Reveal>
          ))}
        </div>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   07 · Personal data and PDPA
   ──────────────────────────────────────────────────────────────── */

const PDPA_ICONS: LucideIcon[] = [Database, ShieldCheck, FileLock];

function Pdpa({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="pdpa">
      <Body>
        <H>Personal data <Em>and PDPA</Em></H>
        <div className="mt-14">
          {PDPA.map((paragraph, index) => (
            <Reveal key={index} delay={0.3 + index * 0.15} className={cn("grid grid-cols-[90px_1fr] border-t py-12", RULE)}>
              <div className="flex flex-col items-start gap-6">
                <span className={cn(serif.className, "text-[40px] italic leading-[0.9] text-[#151515]/35")}>0{index + 1}</span>
                <Glyph icon={PDPA_ICONS[index]} />
              </div>
              <p className={cn("max-w-[880px] leading-[1.55]", index === 0 ? "text-[32px] font-normal tracking-[-0.015em] text-[#151515]" : cn("text-[28px]", BODY))}>{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.9} className={cn("mt-12 flex items-center gap-10 rounded-[24px] px-14 py-14", MIST)}>
          <Avatar person={{ name: DPO.name, role: DPO.role }} size={140} />
          <div>
            <div className="flex items-center gap-3"><Dot tone="lime" /><Eyebrow>{DPO.role}</Eyebrow></div>
            <p className="mt-4 text-[56px] font-medium leading-none tracking-[-0.045em]">{DPO.name}</p>
            <p className={cn("mt-4 text-[22px]", BODY)}>Report any suspected data breach to the DPO immediately.</p>
          </div>
        </Reveal>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   08 · IT, email, device and acceptable use
   ──────────────────────────────────────────────────────────────── */

const IT_ICONS: LucideIcon[] = [KeyRound, ShieldCheck, Laptop, Ban, CloudOff, TriangleAlert];

function ItRules({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="it">
      <Body fill>
        <H>IT, email, device <Em>and acceptable use</Em></H>
        <Reveal delay={0.3}><p className="mt-8 text-[27px] font-normal leading-[1.45] tracking-[-0.015em]">{IT_INTRO}</p></Reveal>
        <Reveal delay={0.4}><Eyebrow className="mt-14">Your responsibilities</Eyebrow></Reveal>
        <div className="mt-6">
          {IT_RULES.map((rule, index) => {
            const Icon = IT_ICONS[index];
            return (
              <Reveal key={rule} delay={0.5 + index * 0.1} className={cn("group flex items-center gap-8 border-t py-9", RULE, index === IT_RULES.length - 1 && "border-b")}>
                <span className={cn(ICON_CHIP, MIST, "transition-transform duration-500 group-hover:scale-110")}><Icon className="h-[28px] w-[28px]" strokeWidth={STROKE} /></span>
                <p className="text-[26px] font-normal leading-[1.4] tracking-[-0.01em] text-[#151515]/85">{rule}</p>
              </Reveal>
            );
          })}
        </div>
      </Body>
    </Frame>
  );
}

function ItMore({ page }: { page: number }) {
  const blocks: { icon: LucideIcon; title: ReactNode; body: string; tone: Tone }[] = [
    { icon: Bot, title: <>Use of <Em>AI tools</Em></>, body: AI_TOOLS, tone: "blue" },
    { icon: PackageCheck, title: <>Monitoring and <Em>return of property</Em></>, body: MONITORING, tone: "pink" },
  ];
  return (
    <Frame page={page} chapter="it">
      <Body fill>
        {blocks.map((block, index) => (
          <Reveal key={index} delay={0.2 + index * 0.3} className={cn("flex-1", index ? "border-t pt-20" : "pt-6", RULE)}>
            <div className="flex items-center justify-between">
              <span className={cn(ICON_CHIP, MIST)}><block.icon className="h-[28px] w-[28px]" strokeWidth={STROKE} /></span>
              <Dot tone={block.tone} size={14} />
            </div>
            <p className="mt-10 text-[60px] font-medium leading-[1.05] tracking-[-0.045em]">{block.title}</p>
            <p className="mt-10 max-w-[920px] text-[32px] font-light leading-[1.5] text-[#151515]/80">{block.body}</p>
          </Reveal>
        ))}
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   09 · Team and organisation
   ──────────────────────────────────────────────────────────────── */

const BUDDY_ICONS: LucideIcon[] = [Users, MessageCircle, FileText];

function TeamIntro({ page }: { page: number }) {
  const left = 200, right = 820, cy = 150, r = 112, dy = 40, dx = Math.sqrt(r * r - dy * dy) + 10;
  return (
    <Frame page={page} chapter="team">
      <Body fill>
        <H>Team and <Em>organisation</Em></H>
        <Reveal delay={0.3}><p className="mt-8 text-[27px] font-normal leading-[1.45] tracking-[-0.015em]">{TEAM_INTRO}</p></Reveal>
        <Reveal delay={0.45} className={cn("mt-14 border-t pt-10", RULE)}>
          <Eyebrow>How we cover work</Eyebrow>
          <p className="mt-6 text-[38px] font-medium leading-[1.12] tracking-[-0.035em]">A <Em>buddy system</Em>, so no job depends on one person.</p>
          <p className={cn("mt-7 text-[24px] leading-[1.6]", MEASURE, BODY)}>{BUDDY}</p>
        </Reveal>
        <div className="flex min-h-[300px] flex-1 items-center">
        <div className="relative h-[300px] w-full">
          <svg className="absolute inset-0" width="1020" height="300" viewBox="0 0 1020 300" aria-hidden="true">
            {/* Two soft arcs: updates go one way over the top, cover comes back underneath. */}
            <Beam d={`M ${left + dx} ${cy - dy} Q ${(left + right) / 2} ${cy - 140} ${right - dx} ${cy - dy}`} color={PINK} width={2} base="rgba(21,21,21,0.18)" appear={1.1} />
            <Beam d={`M ${right - dx} ${cy + dy} Q ${(left + right) / 2} ${cy + 140} ${left + dx} ${cy + dy}`} color={BLUE} width={2} base="rgba(21,21,21,0.18)" appear={1.3} delay={1.4} />
          </svg>
          {[{ x: left, label: "You", tone: "lime" as Tone }, { x: right, label: "Your buddy", tone: "blue" as Tone }].map((node, index) => (
            <Reveal key={node.label} from="scale" delay={0.7 + index * 0.2} className="absolute flex flex-col items-center justify-center rounded-full" style={{ left: node.x - r, top: cy - r, width: r * 2, height: r * 2, background: TONE[node.tone] }}>
              <span className="text-[34px] leading-none"><Em>{node.label}</Em></span>
            </Reveal>
          ))}
        </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {BUDDY_DUTIES.map((duty, index) => (
            <Reveal key={duty} delay={1 + index * 0.12} className={cn("border-t pt-6", RULE)}>
              <div className="flex items-center justify-between"><span className={cn(serif.className, "text-[34px] italic leading-none text-[#151515]/40")}>0{index + 1}</span><Glyph icon={BUDDY_ICONS[index]} /></div>
              <p className="mt-4 text-[24px] font-normal leading-[1.4] text-[#151515]/85">{duty}</p>
            </Reveal>
          ))}
        </div>
      </Body>
    </Frame>
  );
}

function OrgChart({ page }: { page: number }) {
  const { print } = useDeck();
  const col = 1020 / TEAMS.length;
  const xs = TEAMS.map((_, i) => 110 + col / 2 + col * i);
  const busY = 640, headY = 690, foundersBottom = 560;
  return (
    <Frame page={page} chapter="team">
      <Body>
        <div className="flex items-end justify-between">
          <H>Organisation <Em>chart</Em></H>
          {print ? null : <Reveal delay={0.4} className="pb-3"><p className={cn("text-[18px]", MUTED)}><Em>Hover a face to look closer.</Em></p></Reveal>}
        </div>
      </Body>
      <svg className="absolute inset-0" width={PAGE_W} height={PAGE_H} viewBox={`0 0 ${PAGE_W} ${PAGE_H}`} aria-hidden="true">
        {/* One soft curve from management to each team, drawn in as the team heading arrives. */}
        {xs.map((x, i) => <Beam key={x} d={`M 620 ${foundersBottom} C 620 ${busY}, ${x} ${foundersBottom + 20}, ${x} ${headY - 10}`} color={TONE[TEAMS[i].tone]} base="rgba(21,21,21,0.2)" width={1.5} appear={0.5 + i * 0.08} delay={i * 0.35} />)}
      </svg>
      <Reveal from="scale" delay={0.15} className="absolute flex flex-col items-center" style={{ left: 320, width: 600, top: 330 }}>
        <Eyebrow>Management</Eyebrow>
        <div className="mt-5 flex gap-16">
          {FOUNDERS.map((person) => (
            <div key={person.name} className="group flex w-[230px] flex-col items-center text-center">
              <span className="transition-transform duration-500 group-hover:scale-[1.35]"><Avatar person={person} size={104} /></span>
              <span className="mt-4 text-[22px] font-medium leading-tight tracking-[-0.02em]">{person.name}</span>
              <span className={cn("mt-1 text-[17px] font-light leading-tight", MUTED)}>{person.role}</span>
            </div>
          ))}
        </div>
      </Reveal>
      {TEAMS.map((team, i) => (
        <div key={team.name} className="absolute flex flex-col items-center" style={{ left: xs[i] - col / 2 + 6, width: col - 12, top: headY }}>
          <Reveal from="scale" delay={0.6 + i * 0.08} className="flex h-[64px] flex-col items-center justify-start text-center">
            <Dot tone={team.tone} size={10} />
            <span className="mt-2 text-[18px] font-medium leading-[1.2] tracking-[-0.01em] [text-wrap:balance]">{team.name}</span>
          </Reveal>
          <div className="mt-8 flex flex-col items-center gap-7">
            {team.members.map((person, m) => (
              <Reveal key={person.name} from="scale" delay={0.9 + i * 0.08 + m * 0.06} className="group flex w-full flex-col items-center text-center">
                <span className="relative z-0 transition-transform duration-500 group-hover:z-10 group-hover:scale-[1.5]"><Avatar person={person} size={68} /></span>
                <span className="mt-3 text-[19px] font-medium leading-tight tracking-[-0.01em]">{person.name}</span>
                <span className={cn("mt-1 text-[16px] font-light leading-tight [text-wrap:balance]", MUTED)}>{person.role}</span>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   10 · Emergency contacts and incident escalation
   ──────────────────────────────────────────────────────────────── */

const INCIDENT_TYPE_ICONS: LucideIcon[] = [Bandage, CircleAlert, ShieldAlert, LockKeyhole, HardHat];
const INCIDENT_STEP_ICONS: LucideIcon[] = [LifeBuoy, Megaphone, ClipboardCheck];

function Emergency({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="emergency">
      <Body>
        <H size={58}>Emergency contacts and <Em>incident escalation</Em></H>
        <Reveal delay={0.3}><p className={cn("mt-8 text-[24px] leading-[1.6]", MEASURE, BODY)}>{EMERGENCY}</p></Reveal>
        <Reveal delay={0.45} className={cn("mt-12 border-t pt-8", RULE)}>
          <div className="flex items-center justify-between"><Eyebrow>Incident reporting</Eyebrow><span className={cn("text-[20px]", MUTED)}><Em>Report all of these, promptly</Em></span></div>
          <div className="mt-6 grid grid-cols-5">
            {INCIDENT_TYPES.map((type, index) => (
              <div key={type} className={cn("flex flex-col gap-3 border-l px-5 first:border-l-0 first:pl-0", RULE)}>
                <Glyph icon={INCIDENT_TYPE_ICONS[index]} />
                <span className="text-[20px] font-medium leading-[1.25] tracking-[-0.01em]">{type}</span>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="mt-16"><Procedure steps={INCIDENT_STEPS} rowHeight={285} tones={["pink", "lime"]} icons={INCIDENT_STEP_ICONS} /></div>
      </Body>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   11 · Close
   ──────────────────────────────────────────────────────────────── */

function BeforeYouStart({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="close">
      <Body top={200} fill>
        <H size={80}>Before you <Em>start</Em></H>
        <div className="mt-12">
          {BEFORE_YOU_START.map((paragraph, index) => (
            <Reveal key={index} delay={0.3 + index * 0.15}><p className={cn("max-w-[960px] text-[31px] leading-[1.58]", index ? "mt-10" : "", BODY)}>{paragraph}</p></Reveal>
          ))}
        </div>
        {/* The send-off sits on a flat field of the chapter colour that takes the rest of the page. */}
        <Reveal delay={0.8} from="fade" className="mt-16 flex min-h-[420px] flex-1 flex-col justify-end rounded-[24px] p-14" style={{ background: TONE[chapterOf("close").tone] }}>
          {/* A desk made ready for the new joiner fills the top of the card; the words stay on the baseline. */}
          <div className="mb-10 flex min-h-0 flex-1 items-center justify-center"><WelcomeDesk delay={1} className="h-full max-h-[360px] w-full" /></div>
          <p className="text-[46px] leading-[1.15] tracking-[-0.02em]"><Em>{CLOSING_LINE}</Em></p>
          <h2 className="mt-8 font-medium tracking-[-0.05em]" style={{ fontSize: 96, lineHeight: 1.1 }}><BlurText delay={1.2}>{WELCOME_ABOARD}</BlurText></h2>
        </Reveal>
      </Body>
    </Frame>
  );
}

function Acknowledgement({ page }: { page: number }) {
  return (
    <Frame page={page} chapter="close">
      <Body>
        <H>Acknowledgement <Em>of receipt</Em></H>
        <Reveal delay={0.3}><p className="mt-10 text-[27px] font-normal leading-[1.6] text-[#151515]/85">{ACKNOWLEDGEMENT}</p></Reveal>
        <Reveal delay={0.5} className="mt-16">
          <Eyebrow>To be completed by the employee</Eyebrow>
          <div className="mt-4">
            {ACK_FIELDS.map((field) => (
              <div key={field} className="flex h-[150px] items-end gap-8 pb-4">
                <span className={cn("w-[200px] shrink-0", LABEL, LABEL_INK)}>{field}</span>
                <span className="mb-[6px] h-px flex-1 bg-[#151515]/35" />
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.7} className={cn("mt-16 rounded-[24px] px-12 py-12", MIST)}>
          <p className={cn("text-[22px] leading-[1.55]", BODY)}>{ACK_RETURN.lead} <strong className="font-medium text-[#151515]">{ACK_RETURN.to}</strong>{ACK_RETURN.tail}</p>
        </Reveal>
      </Body>
    </Frame>
  );
}

function BackCover({ page }: { page: number }) {
  return (
    <Frame page={page} dark bare>
      <div className="absolute inset-x-[110px] top-[600px] flex flex-col items-center text-center">
        <Reveal from="fade"><Logo light className="h-[84px]" /></Reveal>
        <Reveal delay={0.3}><p className="mt-12 text-[30px] font-light text-white/75">Employee Handbook <Em color={LIME}>2026</Em></p></Reveal>
      </div>
      <Reveal delay={0.6} className="absolute bottom-[130px] left-[110px] right-[110px] border-t border-white/20 pt-8 text-center">
        <Eyebrow dark>D&apos;trax Design Pte Ltd</Eyebrow>
        <p className="mt-4 text-[19px] font-light leading-[1.7] text-white/75">{COMPANY.address}<br />{COMPANY.phone} · {COMPANY.web}</p>
      </Reveal>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────
   Running order
   ──────────────────────────────────────────────────────────────── */

type Def = { id: string; steps?: number; dark?: boolean; render: (page: number) => ReactNode };

const divider = (chapter: ChapterId): Def => ({ id: `${chapter}-divider`, render: (page) => <Divider page={page} chapter={chapter} /> });

const defs: Def[] = [
  { id: "cover", dark: true, render: () => <Cover /> },
  { id: "contents", render: (page) => <Contents page={page} /> },

  divider("welcome"),
  { id: "welcome", render: (page) => <WelcomeLetter page={page} /> },

  divider("about"),
  { id: "about", render: (page) => <AboutHandbook page={page} /> },

  divider("mission"),
  { id: "founders-quote", render: (page) => <FoundersQuote page={page} /> },
  { id: "mission-vision", render: (page) => <MissionVision page={page} /> },
  { id: "values", render: (page) => <Values page={page} /> },

  divider("conduct"),
  ...[0, 4, 8].map((from): Def => ({ id: `conduct-${from / PER_CONDUCT_PAGE + 1}`, render: (page) => <Conduct page={page} from={from} /> })),

  divider("policies"),
  { id: "leave-1", render: (page) => <LeaveOne page={page} /> },
  { id: "leave-2", render: (page) => <LeaveTwo page={page} /> },
  { id: "claims", render: (page) => <Claims page={page} /> },

  divider("safety"),
  { id: "safety", render: (page) => <SafetyOne page={page} /> },
  { id: "safety-expectations", render: (page) => <SafetyTwo page={page} /> },

  divider("pdpa"),
  { id: "pdpa", render: (page) => <Pdpa page={page} /> },

  divider("it"),
  { id: "it", render: (page) => <ItRules page={page} /> },
  { id: "it-ai", render: (page) => <ItMore page={page} /> },

  divider("team"),
  { id: "team", render: (page) => <TeamIntro page={page} /> },
  { id: "org-chart", render: (page) => <OrgChart page={page} /> },

  divider("emergency"),
  { id: "emergency", render: (page) => <Emergency page={page} /> },

  divider("close"),
  { id: "before-you-start", render: (page) => <BeforeYouStart page={page} /> },
  { id: "acknowledgement", render: (page) => <Acknowledgement page={page} /> },
  { id: "back-cover", dark: true, render: (page) => <BackCover page={page} /> },
];

/** Page number of each chapter's divider, for the contents page. */
const CHAPTER_PAGE = Object.fromEntries(CHAPTERS.map((chapter) => [chapter.id, defs.findIndex((def) => def.id === `${chapter.id}-divider`) + 1])) as Record<ChapterId, number>;

export const slides: DeckSlide[] = defs.map((def, index) => ({ id: def.id, steps: def.steps, dark: def.dark, render: () => def.render(index + 1) }));
