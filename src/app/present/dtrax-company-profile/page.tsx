"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Award, Briefcase, Calculator, Check, ClipboardList, Eye, GitFork, HardHat, Key, MapPin, PenTool, Phone, ShieldCheck, Sparkles, Users } from "lucide-react";
import { SlideShell } from "@/components/slides/SlideShell";
import AnimatedGlowingSearchBar from "@/components/ui/animated-glowing-search-bar";
import { AnimatedTestimonials, type AnimatedTestimonial } from "@/components/ui/animated-testimonials";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { AvatarGroup } from "@/components/ui/avatar-group";
import DisplayCards from "@/components/ui/display-cards";
import { DestinationCard } from "@/components/ui/card-21";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { GlareCard } from "@/components/ui/glare-card";
import { OrbitingCircles, Ripple } from "@/components/ui/orbiting-circles";
import { Compare } from "@/components/ui/compare";
import { ExpandingProfileCards, type ProfileCardItem } from "@/components/ui/expanding-profile-cards";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { asset } from "@/lib/base-path";
import { cn } from "@/lib/utils";
import type { PresentationSlide } from "@/types";

const serif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], display: "swap" });
const sans = DM_Sans({ weight: ["400", "500", "600", "700"], subsets: ["latin"], display: "swap" });

/* ────────────────────────────────────────────────────────────────
   Brand system: flat blocks only. Ink, off-white, pink, blue, lime.
   ──────────────────────────────────────────────────────────────── */

const ease = [0.22, 1, 0.36, 1] as const;
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } };
const scaleIn = { hidden: { opacity: 0, y: 26, scale: 0.985 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease } } };

const INK = "#151515";
const PINK = "#FFB6B6";
const BLUE = "#9DD6FF";
const LIME = "#DDFF97";

type Fill = "pink" | "blue" | "lime" | "ink" | "white";
type Tone = Exclude<Fill, "ink" | "white">;
const hex: Record<Fill, string> = { pink: PINK, blue: BLUE, lime: LIME, ink: INK, white: "#ffffff" };
const fillClass: Record<Fill, string> = {
  pink: "bg-[#FFB6B6] text-[#151515]",
  blue: "bg-[#9DD6FF] text-[#151515]",
  lime: "bg-[#DDFF97] text-[#151515]",
  ink: "bg-[#151515] text-white",
  white: "bg-white text-[#151515]",
};

const SLIDE = "min-h-[calc(100dvh-7.5rem)]";

/** Slide frame with the corner micro-labels of the reference deck. */
function Sheet({ children, className, label }: { children: ReactNode; className?: string; label?: string }) {
  return (
    <motion.div initial="hidden" animate="show" variants={stagger} className={cn(sans.className, "relative flex min-h-full w-full flex-col", className)}>
      {label ? (
        <motion.span variants={fadeUp} className="absolute left-20 top-3 z-30 text-[11px] font-medium tracking-[0.04em] text-[#151515]/55">
          {label}
        </motion.span>
      ) : null}
      {children}
    </motion.div>
  );
}

function Display({ children, className, as: Tag = "h2", size = "lg", caps = false }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "h3" | "p"; size?: "xl" | "lg" | "md" | "sm"; caps?: boolean }) {
  const sizes = {
    xl: "text-6xl sm:text-7xl md:text-[7rem] leading-[0.92]",
    lg: "text-5xl sm:text-6xl md:text-[5.5rem] leading-[0.95]",
    md: "text-4xl sm:text-5xl md:text-6xl leading-[0.98]",
    sm: "text-3xl sm:text-4xl md:text-5xl leading-[1.02]",
  };
  return (
    <Tag className={cn("font-normal tracking-[-0.02em] text-current", caps && "uppercase tracking-[0.02em]", sizes[size], className)}>{children}</Tag>
  );
}

function Em({ children, tone = "lime" }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={cn(serif.className, "rounded-[0.18em] px-[0.18em] font-normal italic tracking-normal text-[#151515]")} style={{ backgroundColor: hex[tone], boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
      {children}
    </span>
  );
}

function Rule({ className }: { className?: string }) {
  return <motion.div variants={fadeUp} className={cn("h-px w-full bg-current opacity-25", className)} />;
}




function Pill({ children, href, className, solid = false }: { children: ReactNode; href?: string; className?: string; solid?: boolean }) {
  const classes = cn(
    "inline-flex items-center gap-2 rounded-full border border-current px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-70",
    solid && "bg-[#151515] text-white border-[#151515]",
    className
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" className={classes}>{children}</a> : <span className={classes}>{children}</span>;
}

/** Flat colour block with a faint dot grain. Text colour follows the fill. */
function Panel({ fill, className, children, grain = true }: { fill: Fill; className?: string; children?: ReactNode; grain?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden", fillClass[fill], className)}>
      {grain ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{ backgroundImage: `radial-gradient(${fill === "ink" ? "rgba(255,255,255,0.7)" : "rgba(21,21,21,0.7)"} 1px, transparent 1px)`, backgroundSize: "14px 14px" }}
        />
      ) : null}
      {children}
    </div>
  );
}

/** Image slot: flat tile, labelled for the photo still to come. */


/** Floating white UI card, the "Go Live" pills from the reference. */

/** Real assets, resized for the web under public/assets. */
const PH = (project: string, files: string[]) => files.map((file) => asset(`/assets/projects/${project}/${file}`));
const SHOTS: Record<string, string[]> = {
  "Group-IB": PH("group-ib", ["g-1.jpg", "g-2.jpg", "g-3.jpg", "g-4.jpg", "g-5.jpg", "g-6.jpg", "g-7.jpg", "g-8.jpg", "g-9.jpg", "g-10.jpg", "g-11.jpg", "g-12.jpg", "g-13.jpg", "g-14.jpg"]),
  "Singapore Pools": PH("singapore-pools", ["s-1.jpg", "s-2.jpg", "s-3.jpg", "s-4.jpg", "s-5.jpg", "s-6.jpg", "s-7.jpg", "s-8.jpg", "s-10.jpg", "s-12.jpg", "s-13.jpg"]),
  "OMS ROC": PH("oms-group", ["-dsf0008.jpg", "-dsf0057.jpg", "-dsf0144.jpg", "-dsf0174.jpg", "-dsf0183.jpg", "-dsf0208.jpg", "-dsf0291.jpg", "-dsf0330.jpg", "-dsf0358.jpg", "-dsf0383.jpg", "-dsf0390.jpg", "-dsf0397.jpg"]),
  "Sumitomo Chemical Asia": PH("sumitomo-chemical", ["s-1.jpg", "s-2.jpg", "s-3.jpg", "s-4.jpg", "s-5.jpg", "s-6.jpg", "s-7.jpg", "s-8.jpg", "s-9.jpg"]),
  "Digital Edge": PH("digital-edge", ["d-1.jpg", "d-2.jpg", "d-3.jpg", "d-4.jpg", "d-5.jpg", "d-6.jpg", "d-7.jpg", "d-8.jpg"]),
  "FIJI Water": PH("fiji-water", ["f-1.jpg", "f-2.jpg", "f-3.jpg", "f-4.jpg", "f-5.jpg", "f-6.jpg", "f-7.jpg"]),
};
const RENDER = { sumitomoA: asset("/assets/projects/sumitomo-chemical/a.jpg"), sumitomoB: asset("/assets/projects/sumitomo-chemical/b.jpg") };
const OFFICE = [asset("/assets/office/office-1.jpg"), asset("/assets/office/office-2.jpg"), asset("/assets/office/office-3.jpg")];
const TEAM = { ronald: asset("/assets/team/ronald-head.jpg"), jayne: asset("/assets/team/jayne.jpg"), founders: [asset("/assets/team/founders-1.jpg"), asset("/assets/team/founders-2.jpg"), asset("/assets/team/founders-3.jpg")] };
const HEADSHOT: Record<string, string> = {
  "Adrian Yen": asset("/assets/headshots/adrian-yen.jpg"), "Danny Chua": asset("/assets/headshots/danny-chua.jpg"), "Esther Choo": asset("/assets/headshots/esther-choo.jpg"),
  "Lim Fu Liang": asset("/assets/headshots/lim-fu-liang.jpg"), "Mi Mi Nay Win": asset("/assets/headshots/mi-mi-nay-win.jpg"), "Sandrey Lim": asset("/assets/headshots/sandrey-lim.jpg"),
  "Sapp Cheng": asset("/assets/headshots/sapp-cheng.jpg"), "Tan Swee Lan": asset("/assets/headshots/tan-swee-lan.jpg"), "Yong Yee Yee": asset("/assets/headshots/yong-yee-yee.jpg"),
};
const CERT = { sida: asset("/assets/certs/cert-a.png"), iso: asset("/assets/certs/cert-iso.png"), bizsafe: asset("/assets/certs/cert-bizsafe.png") };
const LOGO: Record<string, string> = {
  "Alibaba": asset("/assets/logos/alibaba.png"), "Aramco Trading": asset("/assets/logos/aramco.png"), "Digital Edge": asset("/assets/logos/digital-edge.webp"), "Edelman": asset("/assets/logos/edelman.png"),
  "Embecta": asset("/assets/logos/embecta.png"), "Extreme Networks": asset("/assets/logos/extreme-networks.png"), "FIJI Water": asset("/assets/logos/fiji-water.webp"), "Grohe": asset("/assets/logos/grohe.png"),
  "Group-IB": asset("/assets/logos/group-ib.png"), "HDFC Bank": asset("/assets/logos/hdfc-bank.png"), "Mitsui Chemicals": asset("/assets/logos/mitsui-chemicals.webp"), "Nirmala": asset("/assets/logos/nirmala.jpg"),
  "OCP": asset("/assets/logos/ocp.png"), "Olam": asset("/assets/logos/olam.png"), "OMS Group": asset("/assets/logos/oms-group.png"), "P&G": asset("/assets/logos/procter-gamble.webp"),
  "SeaLead": asset("/assets/logos/sealead.png"), "Shiseido": asset("/assets/logos/shiseido.png"), "Singapore Kindness Movement": asset("/assets/logos/singapore-kindness-movement.png"), "Singapore Pools": asset("/assets/logos/singapore-pools.png"),
  "Singtel": asset("/assets/logos/singtel.webp"), "Sony Pictures": asset("/assets/logos/sony-pictures.png"), "SOTA": asset("/assets/logos/sota.webp"), "Spotify": asset("/assets/logos/spotify.png"),
  "Standard Chartered": asset("/assets/logos/standard-chartered.webp"), "Sumitomo Chemical": asset("/assets/logos/sumitomo-chemical.webp"), "Tech-Component Resources": asset("/assets/logos/tech-component-resources.png"),
  "The World Bank": asset("/assets/logos/the-world-bank.webp"), "Traveloka": asset("/assets/logos/traveloka.webp"), "UBP": asset("/assets/logos/union-bancaire-priv-e.webp"),
};
const RECENT_LOGO: Record<string, string> = {
  "Traveloka L10": LOGO["Traveloka"], "OMS Geometra": LOGO["OMS Group"], "Singapore Kindness Movement": LOGO["Singapore Kindness Movement"], "OCP Singapore": LOGO["OCP"],
  "Tech-Component Resources": LOGO["Tech-Component Resources"], "Traveloka L11": LOGO["Traveloka"], "Procter & Gamble (P&G)": LOGO["P&G"], "Union Bancaire Privée (UBP)": LOGO["UBP"],
  "Nirmala": LOGO["Nirmala"], "Olam Food Ingredients": LOGO["Olam"], "Aramco Trading Singapore": LOGO["Aramco Trading"], "HDFC Bank Limited": LOGO["HDFC Bank"],
  "SeaLead Shipping": LOGO["SeaLead"], "Extreme Networks": LOGO["Extreme Networks"], "Embecta Singapore": LOGO["Embecta"], "Edelman Singapore": LOGO["Edelman"],
};

function Photo({ src, alt, className, position = "50% 50%", caption, placeholder = false, zoom = 1 }: { src: string; alt: string; className?: string; position?: string; caption?: ReactNode; placeholder?: boolean; zoom?: number }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#e6e6e2]", className)}>
      <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: position, transform: zoom === 1 ? undefined : `scale(${zoom})` }} draggable={false} />
      {caption ? <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium text-[#151515]">{caption}</span> : null}
      {placeholder ? <span className="absolute right-3 top-3 rounded-full bg-[#151515]/75 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.12em] text-white">Placeholder</span> : null}
    </div>
  );
}

/** JS-driven looping belt: measures its content and scrolls it seamlessly, left or right. */
function Belt({ children, reverse = false, speed = 40, className }: { children: ReactNode; reverse?: boolean; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const measure = () => setWidth(ref.current?.scrollWidth ?? 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  const distance = width + 12;
  return (
    <div className={cn("flex w-full overflow-hidden", className)}>
      <motion.div
        className="flex shrink-0 gap-3 pr-3"
        animate={width ? { x: reverse ? [-distance, 0] : [0, -distance] } : undefined}
        transition={{ duration: Math.max(20, distance / speed), repeat: Infinity, ease: "linear" }}
      >
        <div ref={ref} className="flex shrink-0 gap-3">{children}</div>
        {Array.from({ length: 4 }).map((_, copy) => <div key={copy} className="flex shrink-0 gap-3" aria-hidden="true">{children}</div>)}
      </motion.div>
    </div>
  );
}

/** Crossfading slideshow for project photography. */
function Slideshow({ images, alt, className, caption, intervalMs = 3400 }: { images: string[]; alt: string; className?: string; caption?: ReactNode; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % images.length), intervalMs);
    return () => window.clearInterval(timer);
  }, [images.length, intervalMs]);
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-[#e6e6e2]", className)}>
      <AnimatePresence initial={false}>
        <motion.img
          key={images[index]}
          src={images[index]}
          alt={alt}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      </AnimatePresence>
      {caption ? <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium text-[#151515]">{caption}</span> : null}
      {images.length > 1 ? (
        <span className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((image, i) => <span key={image} className={cn("h-1.5 rounded-full bg-white transition-all duration-300", i === index ? "w-6" : "w-1.5 opacity-60")} />)}
        </span>
      ) : null}
    </div>
  );
}

/** Ink tile for projects whose photography is still pending. */
function Pending({ label, className }: { label: string; className?: string }) {
  return (
    <Panel fill="ink" className={cn("rounded-2xl", className)}>
      <span className="absolute bottom-4 left-4 text-[11px] font-medium opacity-60">{label}</span>
    </Panel>
  );
}

function Stat({ value, suffix = "", label, delay = 0 }: { value: number; suffix?: string; label: string; delay?: number }) {
  return (
    <div className="flex flex-col gap-1.5 border-t border-[#151515]/15 pt-4">
      <span className="text-4xl font-bold leading-none tracking-tight text-[#151515] sm:text-5xl"><NumberTicker value={value} suffix={suffix} delay={delay} /></span>
      <span className="text-[12px] leading-snug text-[#151515]/60">{label}</span>
    </div>
  );
}

/** Rotated pastel sticker label. */
function Sticker({ children, tone = "pink", rotate = -4, className }: { children: ReactNode; tone?: Fill; rotate?: number; className?: string }) {
  return (
    <motion.span
      variants={scaleIn}
      className={cn("inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-semibold shadow-[0_8px_24px_rgba(21,21,21,0.12)]", fillClass[tone], className)}
      style={{ rotate: `${rotate}deg` }}
    >
      {children}
    </motion.span>
  );
}

/** Circular rotating text badge. */
function RotatingBadge({ text, className, size = 128, dark = false }: { text: string; className?: string; size?: number; dark?: boolean }) {
  const id = `badge-${text.length}-${size}`;
  return (
    <motion.div variants={scaleIn} className={cn("pointer-events-none", className)} style={{ width: size, height: size }}>
      <motion.svg viewBox="0 0 100 100" className="h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}>
        <defs><path id={id} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" /></defs>
        <circle cx="50" cy="50" r="18" fill={dark ? "#DDFF97" : INK} />
        <text fill={dark ? "#ffffff" : INK} fontSize="8" fontWeight="700" letterSpacing="1.2" className={sans.className}>
          <textPath href={`#${id}`} textLength="236" lengthAdjust="spacingAndGlyphs">{text}</textPath>
        </text>
      </motion.svg>
    </motion.div>
  );
}

/** Space-warp stage: dot field, receding perspective grid and concentric rings. */
function WarpGrid({ center = "62% 52%", dark = false }: { center?: string; dark?: boolean }) {
  const ink = dark ? "rgba(255,255,255,0.85)" : "rgba(21,21,21,0.9)";
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.28]" style={{ backgroundImage: `radial-gradient(${ink} 1px, transparent 1.4px)`, backgroundSize: "22px 22px", maskImage: `radial-gradient(52% 60% at ${center}, black 20%, transparent 75%)`, WebkitMaskImage: `radial-gradient(52% 60% at ${center}, black 20%, transparent 75%)` }} />
      <div className="absolute bottom-[-18%] left-1/2 h-[72%] w-[220%] -translate-x-1/2 opacity-[0.16]" style={{ backgroundImage: `linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px)`, backgroundSize: "88px 88px", transform: "perspective(640px) rotateX(66deg)", transformOrigin: "50% 100%", maskImage: "linear-gradient(to top, black 10%, transparent 90%)", WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 90%)" }} />
    </div>
  );
}

function Stars({ count = 14, dark = false }: { count?: number; dark?: boolean }) {
  const [stars, setStars] = useState<{ x: number; y: number; d: number; s: number }[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: count }, () => ({ x: Math.random() * 100, y: Math.random() * 100, d: 1.6 + Math.random() * 2.4, s: 2 + Math.random() * 3 })));
  }, [count]);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((star, index) => (
        <motion.span key={index} className={cn("absolute rounded-full", dark ? "bg-white" : "bg-[#151515]")} style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.s, height: star.s }} animate={{ opacity: [0.15, 0.9, 0.15], scale: [1, 1.5, 1] }} transition={{ duration: star.d, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }} />
      ))}
    </div>
  );
}

function ToConfirm({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-current/40 px-1.5 py-0.5 text-[11px] font-semibold">
      <span className="whitespace-nowrap text-[9px] uppercase tracking-[0.14em] opacity-60">To confirm</span>
      {children}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────
   Data
   ──────────────────────────────────────────────────────────────── */

const featuredProjects: { name: string; address: string; area: number; type: string; year?: string; award?: string; fill: Fill }[] = [
  { name: "Group-IB", address: "Innovis, 2 Fusionopolis Way", area: 7500, type: "Design-and-build", award: "SIDA 2023 Bronze", fill: "lime" },
  { name: "FIJI Water", address: "78 Shenton Way", area: 6800, type: "Design-and-build", year: "2026", fill: "blue" },
  { name: "Singapore Pools", address: "210 Middle Road", area: 12800, type: "Design-and-build", year: "2025", fill: "pink" },
  { name: "Sumitomo Chemical Asia", address: "Duo Tower, 3 Fraser Street", area: 12188, type: "A&A and reinstatement", year: "2025", fill: "ink" },
  { name: "Digital Edge", address: "Suntec City Tower 3", area: 5000, type: "Design-and-build", year: "2025", fill: "blue" },
  { name: "Sony Pictures", address: "77 Robinson Road", area: 7800, type: "Design-and-build", year: "2024", fill: "ink" },
];

const recentProjects = [
  { name: "Traveloka L10", address: "Capital Tower, 168 Robinson Road", type: "A&A and design-and-build", year: "2026" },
  { name: "OMS Geometra", address: "Excalibur Centre, 71 Ubi Crescent", type: "Design-and-build", year: "2026" },
  { name: "Singapore Kindness Movement", address: "Singapore Land Tower, 50 Raffles Place", type: "Design-and-build", year: "2025" },
  { name: "OCP Singapore", address: "Springleaf Tower, 3 Anson Road", type: "Design-and-build", year: "2025" },
  { name: "Tech-Component Resources", address: "8 Admiralty Street", type: "Design-and-build", year: "2025" },
  { name: "Traveloka L11", address: "Capital Tower, 168 Robinson Road", type: "Design-and-build", year: "2025" },
  { name: "Procter & Gamble (P&G)", address: "11 North Buona Vista Drive", type: "A&A and reinstatement", year: "2025" },
  { name: "Union Bancaire Privée (UBP)", address: "1 Raffles Quay", type: "A&A", year: "2025" },
  { name: "Nirmala", address: "SBF Centre, 160 Robinson Road", type: "Design-and-build", year: "2025" },
  { name: "Olam Food Ingredients", address: "342 Jalan Boon Lay", type: "A&A", year: "2024" },
  { name: "Aramco Trading Singapore", address: "OUE Bayfront, 50 Collyer Quay", type: "A&A", year: "2024" },
  { name: "HDFC Bank Limited", address: "Singapore Land Tower, 50 Raffles Place", type: "Design-and-build", year: "2024" },
  { name: "SeaLead Shipping", address: "78 Shenton Way", type: "Design-and-build", year: "2024" },
  { name: "Extreme Networks", address: "Millenia Tower, 1 Temasek Avenue", type: "A&A", year: "2024" },
  { name: "Embecta Singapore", address: "The Concourse, 300 Beach Road", type: "Design-and-build", year: "2024" },
  { name: "Edelman Singapore", address: "Beach Centre, 15 Beach Road", type: "A&A", year: "2024" },
];

const clientLogos = [
  "Group-IB", "Sony Pictures", "Mitsui Chemicals", "FIJI Water", "Edelman", "Standard Chartered", "Spotify", "Singtel",
  "Traveloka", "Singapore Pools", "Alibaba", "Grohe", "The World Bank", "SOTA", "Shiseido", "Sumitomo Chemical",
  "Digital Edge", "P&G", "UBP", "HDFC Bank", "Aramco Trading", "Extreme Networks", "Embecta", "Olam",
];

const leaders: ProfileCardItem[] = [
  { name: "Ronald Goh", role: "Managing Director", photo: TEAM.ronald, photoPosition: "50% 20%", experience: "25+ years in corporate interior fit-out", specialism: "Translating clients' commercial objectives into fit-out decisions; long-term client relationships built across repeat engagements", projects: ["Group-IB", "Sony Pictures", "Mitsui Chemicals", "FIJI Water", "Edelman"], projectLogos: [LOGO["Group-IB"], LOGO["Sony Pictures"], LOGO["Mitsui Chemicals"], LOGO["FIJI Water"], LOGO["Edelman"]] },
  { name: "Jayne Ong", role: "Head of Costing & Operation", photo: TEAM.jayne, photoPosition: "50% 18%", experience: <ToConfirm>Years and background</ToConfirm>, specialism: <ToConfirm>Costing and operations profile</ToConfirm>, projects: [], projectsLabel: "Featured projects (to confirm)" },
  { name: "Esther Choo", role: "Design Director", photo: HEADSHOT["Esther Choo"], photoPosition: "50% 15%", experience: "24+ years of professional practice", qualifications: "Diploma in Interior Design, Nanyang Academy of Fine Arts", specialism: "Pre-leasing feasibility and workspace strategy through detailed, buildable design; corporate, hospitality and retail interiors", projects: ["Standard Chartered", "Spotify", "Singtel", "Traveloka", "Singapore Pools"], projectLogos: [LOGO["Standard Chartered"], LOGO["Spotify"], LOGO["Singtel"], LOGO["Traveloka"], LOGO["Singapore Pools"]] },
  { name: "Sandrey Lim", role: "Project Director", photo: HEADSHOT["Sandrey Lim"], photoPosition: "50% 15%", experience: "26+ years in design-and-build workplace delivery", qualifications: "Specialist Diploma in Construction Productivity (BCA); Diploma in Personnel Management; bizSAFE Level 2", specialism: "End-to-end delivery of complex workplace transformations, coordinating design, cost and construction through to handover", projects: ["Alibaba", "Grohe", "The World Bank", "SOTA", "Shiseido"], projectLogos: [LOGO["Alibaba"], LOGO["Grohe"], LOGO["The World Bank"], LOGO["SOTA"], LOGO["Shiseido"]] },
  { name: "Steve Tan", role: "Senior Project Manager", experience: (<><ToConfirm>X+ years</ToConfirm> in project management and fit-out delivery</>), qualifications: <ToConfirm>Qualifications</ToConfirm>, specialism: <ToConfirm>e.g. large-floorplate fit-outs, live-environment works, tight-programme delivery</ToConfirm>, projects: ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"], projectsLabel: "Featured projects (5, to confirm)" },
  { name: "Danny Chua", role: "Senior Quantity Surveyor", photo: HEADSHOT["Danny Chua"], photoPosition: "50% 15%", experience: (<><ToConfirm>X+ years</ToConfirm> in quantity surveying and cost management</>), qualifications: <ToConfirm>QS qualification and accreditation</ToConfirm>, specialism: <ToConfirm>e.g. fit-out budgeting, value engineering, cost control through delivery</ToConfirm>, projects: ["Project 1", "Project 2", "Project 3", "Project 4", "Project 5"], projectsLabel: "Selected projects (5, to confirm)" },
];

const stages: { title: string; body: string; extra: ReactNode }[] = [
  { title: "Brief & feasibility", body: "Project and site evaluation, space planning, and workplace strategy. We study how your teams work before we design where they work.", extra: null },
  { title: "Design development", body: "Concept through detailed design, developed around your brand and the way your people actually work.", extra: null },
  { title: "Costing & documentation", body: "In-house quantity surveying, preliminary and detailed budgeting, and full design and contract documentation.", extra: <span className="font-semibold">Budgets are owned by our team, not outsourced.</span> },
  { title: "Construction & build", body: "Full turnkey fit-out, managed on site by a dedicated project team, under our ISO 45001 and bizSAFE Star safety systems.", extra: <span>Real-time site transparency: reality-capture walkthroughs and visual progress updates throughout the build.</span> },
  { title: "Handover & move", body: "Move management and handover to a completed, move-in-ready space.", extra: <span>Includes <ToConfirm>snagging, defects walkthrough, O&amp;M manual, as-built drawings</ToConfirm>. Defects liability period <ToConfirm>duration</ToConfirm>.</span> },
  { title: "Aftercare", body: "Post-occupancy maintenance and ongoing support.", extra: <span>Support period <ToConfirm>duration</ToConfirm>.</span> },
];

const orgTeams: { name: string; fill: Fill; members: { name: string; role: string }[] }[] = [
  { name: "Project Team", fill: "pink", members: [{ name: "Sandrey Lim", role: "Project Director" }, { name: "Steve Tan", role: "Senior Project Manager" }, { name: "Lim Fu Liang", role: "Construction Manager" }, { name: "Adrian Yen", role: "Project Executive" }] },
  { name: "BD Team", fill: "lime", members: [{ name: "Roseline Chung", role: "Business Development Manager" }] },
  { name: "Design Team", fill: "blue", members: [{ name: "Esther Choo", role: "Design Director" }, { name: "Tan Swee Lan", role: "Senior CAD Designer" }, { name: "Sapp Cheng", role: "Interior Designer" }, { name: "Steven Leng", role: "Interior Designer" }, { name: "Gilbert Penaflor", role: "3D Designer" }] },
  { name: "HR / Admin Operation", fill: "lime", members: [{ name: "Victoria Tan", role: "Senior HR Executive" }, { name: "Mi Mi Nay Win", role: "Admin & Account Executive" }] },
  { name: "Costing Team", fill: "pink", members: [{ name: "Danny Chua", role: "Senior Quantity Surveyor" }, { name: "Yong Yee Yee", role: "Quantity Surveyor" }] },
];

const testimonials: AnimatedTestimonial[] = [
  { quote: "The team was able to meet and deliver our needs in a timely manner despite the challenging Covid-19 situation as well as time constraints, and we are extremely satisfied with their efforts.", name: "Sergey Nikitin", designation: "CEO, Group-IB", initials: "SN", logo: LOGO["Group-IB"] },
  { quote: "We would like to thank you for your assistance in completing our office renovation on time and within budget. Your team was well-organised, capable, and displayed flexibility catering to our requests. D'trax's expertise, commitment and follow-through throughout the entire project was exceptional.", name: "Thomas Lin", designation: "Senior Manager, IT and Admin, Mitsui Chemicals", initials: "TL", logo: LOGO["Mitsui Chemicals"], logoClassName: "w-[96%] max-h-56 scale-[1.15]" },
  { quote: "The team provided their full commitment and dedication throughout the process, overcame challenges along the way, completed the project on time, and continued with further support on any adjustments we requested.", name: "Brett D. Hogg", designation: "Executive Vice President and Managing Director, Sony Pictures", initials: "BH", logo: LOGO["Sony Pictures"], logoClassName: "w-[92%] max-h-64 scale-[1.15]" },
];

interface Project { name: string; sector: string; location: string; area: string; type: string; award?: string; tagline: ReactNode; points: string[]; photosNote: string; fill: Tone }

const projects: Project[] = [
  { name: "Group-IB", sector: "Technology / Cybersecurity", location: "Innovis, 2 Fusionopolis Way", area: "7,500 sq ft", type: "Design-and-build", award: "SIDA 2023 Bronze, Best in Workspace Design", tagline: <>A dynamic, versatile HQ built for <Em>collaboration</Em>.</>, points: ["Multifunctional zones that flex between focused work, informal meetings and social use", "A social bar that doubles as a daytime working and lunch space", "Frosted glass-brick signage wall that glows into a sculptural feature when backlit"], photosNote: "Project photos pending", fill: "lime" },
  { name: "Singapore Pools", sector: "Government / Community", location: "210 Middle Road", area: "12,800 sq ft", type: "Design-and-build", tagline: <>A revitalised workplace shaped by <Em tone="pink">employee feedback</Em>.</>, points: ["Vibrant, engaging environment designed around staff needs and preferences", "Warm neutral tones in client-facing zones, softer pastels in the open office", "A collaborative process that gave staff a sense of ownership in the space"], photosNote: "Project photos to add", fill: "pink" },
  { name: "OMS ROC", sector: "Marine / Subsea Infrastructure", location: "Excalibur Centre, 71 Ubi Crescent", area: "2,000 sq ft", type: "Design-and-build", tagline: <>A bold, futuristic space inspired by <Em tone="blue">fibre-optic networks</Em>.</>, points: ["Metallic finishes and reflective surfaces echoing the technical nature of the business", "Optical-fibre and programmable RGB lighting symbolising data transmission", "An immersive environment mirroring the invisible networks OMS builds beneath land and sea"], photosNote: "Project photos to add", fill: "blue" },
  { name: "Mitsui Chemicals", sector: "Chemicals / Industrial", location: "Harbourfront Tower One, 3 Harbourfront Place", area: "10,000 sq ft", type: "Design-and-build", tagline: <>A biophilic workplace built for an <Em>activity-based</Em> way of working.</>, points: ["Concrete vinyl, wood-grain panelling and a curated moss wall inspired by nature", "Self-check-in system and activity-based zones in response to the client brief", "Neutral palette with vibrant accents bringing energy into meeting spaces"], photosNote: "Project photos pending", fill: "lime" },
  { name: "Sumitomo Chemical Asia", sector: "Chemicals / Industrial", location: "Duo Tower, 3 Fraser Street", area: "12,188 sq ft", type: "A&A and reinstatement", tagline: <>Design driven by how the company <Em tone="blue">actually works</Em>.</>, points: ["Began with a study of how teams interact and move between tasks through the day", "Space planned around operational workflow", "Warm, considered material palette across one of our largest recent fit-outs"], photosNote: "Project photos to add", fill: "blue" },
  { name: "Digital Edge", sector: "Technology / Data Centres", location: "Suntec City Tower 3", area: "5,000 sq ft", type: "Design-and-build", tagline: <>A workplace as a physical extension of the <Em tone="pink">brand</Em>.</>, points: ["Corporate colours and branding translated into an immersive environment", "Bold, forward-thinking spatial concept reflecting a digitally driven identity"], photosNote: "Project photos to add", fill: "pink" },
  { name: "Sony Pictures", sector: "Media / Entertainment", location: "77 Robinson Road", area: "7,800 sq ft", type: "Design-and-build", tagline: <>A cohesive, high-impact space for a <Em>global media brand</Em>.</>, points: ["Backlit feature wall with customised Sony branding for a striking first impression", "Monochromatic client area accented by film posters and a signature red chair", "Viewing room with high-performance AV and acoustic panelling drawn from the Sony logo"], photosNote: "Project photos pending", fill: "lime" },
  { name: "FIJI Water", sector: "FMCG / Consumer", location: "78 Shenton Way", area: "6,800 sq ft", type: "Design-and-build", tagline: <>A workplace that reflects the brand and its <Em tone="blue">identity</Em>.</>, points: ["Soft blue tones drawn from ocean water, balanced with warm earthy finishes", "Curved architectural elements and layered textures that soften the corporate feel", "Calm, refreshing atmosphere that reinforces the FIJI Water brand"], photosNote: "Project photos pending", fill: "blue" },
];

function TypewriterKeyword({ text, delay = 900, stepMs = 90, tone = "lime" }: { text: string; delay?: number; stepMs?: number; tone?: Tone }) {
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    setVisibleCount(0);
    let timeout: number | undefined;
    let count = 0;
    let direction: 1 | -1 = 1;
    const tick = () => {
      count += direction;
      setVisibleCount(count);
      if (count >= text.length) { direction = -1; timeout = window.setTimeout(tick, 1600); return; }
      if (count <= 0) { direction = 1; timeout = window.setTimeout(tick, 500); return; }
      timeout = window.setTimeout(tick, stepMs);
    };
    const start = window.setTimeout(tick, delay);
    return () => { window.clearTimeout(start); if (timeout) window.clearTimeout(timeout); };
  }, [delay, stepMs, text]);
  return (
    <span className="relative inline-block align-baseline">
      <span className="invisible"><Em tone={tone}>{text}</Em></span>
      <span className="absolute inset-0 whitespace-nowrap">
        <Em tone={tone}>{text.slice(0, visibleCount)}</Em>
        <span aria-hidden="true" className="ml-0.5 inline-block h-[0.85em] w-[2px] animate-pulse bg-current align-middle" />
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────
   01 · Cover: one photograph, one line of type
   ──────────────────────────────────────────────────────────────── */

function CoverSlide() {
  const strip = [OFFICE[1], SHOTS["Group-IB"][0], SHOTS["Singapore Pools"][0], SHOTS["OMS ROC"][0], SHOTS["Digital Edge"][0], SHOTS["Sumitomo Chemical Asia"][0], SHOTS["FIJI Water"][0]];
  return (
    <Sheet>
      <div className={cn("relative flex w-full flex-col justify-center px-20", SLIDE)}>
        <Stars count={10} />
        <motion.div variants={fadeUp} className="absolute left-20 top-4 flex items-center gap-4">
          <img src={asset("/logo/dtrax-logo.png")} alt="D'trax logo" className="h-auto w-[5.5rem] object-contain" />
          <Sticker tone="blue" rotate={-5}>Company profile · 2026</Sticker>
        </motion.div>
        <RotatingBadge text="D'TRAX DESIGN · SINCE 2003 · SINGAPORE · " className="absolute right-20 top-4" />
        <h1 className="text-[9.5vw] font-bold leading-[0.98] tracking-[-0.04em] text-[#151515]">
          <motion.span variants={fadeUp} className="block">Imagine.</motion.span>
          <motion.span variants={fadeUp} className="flex items-center gap-[2vw]">
            <span className="relative h-[6.6vw] w-[40vw] shrink-0 overflow-hidden rounded-[1.4vw] [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <Marquee className="h-full p-0 [--duration:36s] [--gap:0.6vw]">
                {strip.map((src) => <Photo key={src} src={src} alt="D'trax workplace" className="h-[6.6vw] w-[10.5vw] shrink-0 rounded-[1vw]" />)}
              </Marquee>
            </span>
            <span>Design.</span>
          </motion.span>
          <motion.span variants={fadeUp} className="block"><TypewriterKeyword text="Inspire." /></motion.span>
        </h1>
        <motion.div variants={fadeUp} className="mt-8 flex items-center justify-between border-t border-[#151515]/15 pt-4 text-[13px]">
          <span className="text-[#151515]">Commercial workplaces, exclusively.</span>
          <span className="text-[#151515]/60">Offices that work for the people inside them, and for the business behind them.</span>
        </motion.div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   02 · About: statement, proof, one photograph
   ──────────────────────────────────────────────────────────────── */

function AboutSlide() {
  const [phase, setPhase] = useState<"typing" | "loading" | "content">("typing");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (phase !== "loading") return;
    const start = performance.now();
    const duration = 1600;
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else window.setTimeout(() => setPhase("content"), 420);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  return (
    <Sheet label="About D'trax">
      <div className={cn("relative w-full px-20 pt-10", SLIDE)}>
        <AnimatePresence mode="wait">
          {phase === "typing" && (
            <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }} className="absolute inset-0 flex items-center justify-center">
              <div className="w-full max-w-[32rem]">
                <AnimatedGlowingSearchBar text="Who is D'trax?" onSequenceComplete={() => setPhase("loading")} />
              </div>
            </motion.div>
          )}
          {phase === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.35 }} className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#151515]/50">Searching</p>
              <p className="mt-2 text-[9rem] font-bold leading-none tracking-[-0.06em] text-[#151515] tabular-nums">{progress}<span className="text-[4rem] text-[#151515]/40">%</span></p>
              <div className="mt-6 h-1.5 w-[22rem] overflow-hidden rounded-full bg-[#151515]/10">
                <div className="h-full rounded-full bg-[#DDFF97]" style={{ width: `${progress}%`, boxShadow: "0 0 18px rgba(221,255,151,0.9)" }} />
              </div>
              <p className="mt-4 text-[12px] text-[#151515]/55">{progress < 40 ? "Finding 100+ offices" : progress < 80 ? "Checking 23 years of work" : "Loading D'trax"}</p>
            </motion.div>
          )}
          {phase === "content" && (
            <motion.div key="content" initial="hidden" animate="show" variants={stagger} className="grid h-[calc(100dvh-10rem)] w-full grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1fr]">
              <div className="flex flex-col justify-center pb-6">
                <Display size="md">Since 2003, D&apos;trax has built offices that work on <Em>two fronts</Em> at once: for the people inside them, and for the business behind them.</Display>
                <motion.div variants={fadeUp} className="mt-10 grid grid-cols-3 gap-6">
                  <Stat value={23} label="years in commercial workplaces, exclusively" delay={0.3} />
                  <Stat value={100} suffix="+" label="offices across five markets" delay={0.45} />
                  <Stat value={37} suffix="%" label="of projects from returning clients, last five years" delay={0.6} />
                </motion.div>
              </div>
              <motion.div variants={scaleIn} className="mb-6">
                <Photo src={OFFICE[1]} alt="D'trax studio" className="h-full min-h-[20rem] w-full" caption="D'trax studio, International Plaza" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   03 · What stays true
   ──────────────────────────────────────────────────────────────── */

function PillarsSlide() {
  const cards = [
    { icon: <Users className="size-4 text-[#151515]" />, title: "One team.", description: "Brief to handover, in-house", backgroundClassName: "bg-[#DDFF97]/55", className: "[grid-area:stack] -translate-x-44 -translate-y-24 after:hidden" },
    { icon: <ShieldCheck className="size-4 text-[#151515]" />, title: "Certified.", description: "ISO 45001:2018 · bizSAFE Star", backgroundClassName: "bg-[#9DD6FF]/55", className: "[grid-area:stack] after:hidden" },
    { icon: <Award className="size-4 text-[#151515]" />, title: "Award-winning.", description: "SIDA 2023 Bronze, Best in Workspace Design", backgroundClassName: "bg-[#FFB6B6]/55", className: "[grid-area:stack] translate-x-44 translate-y-24 after:hidden" },
  ];
  return (
    <Sheet label="About D'trax">
      <div className={cn("relative grid w-full grid-cols-1 items-center gap-10 px-20 pt-10 md:grid-cols-[0.85fr_1.15fr]", SLIDE)}>
        <WarpGrid center="70% 55%" />
        <Stars count={10} />
        <div className="relative">
          <Display size="md">What stays <Em>true</Em> on every project.</Display>
          <motion.p variants={fadeUp} className="mt-6 max-w-sm text-[14px] leading-relaxed text-[#151515]/65">One team from brief to handover, independently certified, and recognised for design. The people who start your project finish it.</motion.p>
          <motion.div variants={fadeUp} className="mt-20 flex items-center gap-4">
            <AnimatedTooltip size={44} items={leaders.slice(0, 4).map((leader, index) => ({ id: index + 1, name: leader.name, designation: leader.role, initials: leader.name.split(" ").map((part) => part[0]).join("") }))} />
            <Sticker tone="lime" rotate={3}>Buddy system</Sticker>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-6 text-[12px] text-[#151515]/55">BCA workhead and grade <ToConfirm>from eBACS</ToConfirm></motion.p>
        </div>
        <motion.div variants={scaleIn} className="relative flex h-[26rem] items-center justify-center">
          <div className="scale-[0.9] sm:scale-100"><DisplayCards cards={cards} /></div>
        </motion.div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   04 · Markets
   ──────────────────────────────────────────────────────────────── */


function MarketNode({ label, fill }: { label: string; fill: Tone }) {
  return (
    <span
      className="flex h-full w-full items-center justify-center rounded-full px-2 text-center text-[11px] font-bold uppercase leading-tight tracking-[0.08em] text-white"
      style={{ background: "radial-gradient(circle at 32% 28%, #3d3d3d 0%, #151515 58%, #050505 100%)", boxShadow: `0 0 40px ${hex[fill]}80, 0 24px 50px rgba(0,0,0,0.6)` }}
    >
      {label}
    </span>
  );
}

function MarketsSlide() {
  const markets = ["Singapore", "China", "Hong Kong", "Malaysia", "Thailand"];
  return (
    <Sheet>
      <div className="relative -mb-16 -mt-14 h-[100dvh] w-full overflow-hidden bg-[#151515] text-white">
        <WarpGrid center="68% 52%" dark />
        <Stars count={40} dark />
        <div aria-hidden="true" className="absolute right-[6%] top-1/2 h-[40rem] w-[40rem] -translate-y-1/2 rounded-full bg-[#9DD6FF]/15 blur-[120px]" />
        <motion.span variants={fadeUp} className="absolute left-20 top-16 text-[11px] font-medium tracking-[0.04em] text-white/55">Where we work</motion.span>
        <div className="relative grid h-full grid-cols-1 items-center gap-8 px-20 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <Display size="md" className="text-white"><NumberTicker value={100} suffix="+" className="tabular-nums" /> offices across <span className="whitespace-nowrap"><Em tone="blue">five markets</Em>.</span></Display>
            <motion.p variants={fadeUp} className="mt-5 max-w-sm text-[13px] leading-relaxed text-white/65">Headquartered in Singapore, delivering commercial workplaces across the region since 2003.</motion.p>
            <motion.div variants={stagger} className="mt-6 flex flex-wrap gap-2">
              {markets.map((market, index) => (
                <Sticker key={market} tone={(["white", "pink", "blue", "lime", "pink"] as Fill[])[index]} rotate={[-4, 3, -2, 4, -3][index]}>{market}{index === 0 ? " · HQ" : ""}</Sticker>
              ))}
            </motion.div>
          </div>
          <motion.div variants={scaleIn} className="relative flex items-center justify-center">
            <div className="relative flex h-[min(44rem,88vh)] w-[min(44rem,88vh)] items-center justify-center">
              <div aria-hidden="true" className="absolute rounded-full border border-white/12" style={{ width: "min(24rem,48vh)", height: "min(24rem,48vh)" }} />
              <div aria-hidden="true" className="absolute rounded-full border border-white/10" style={{ width: "min(38rem,76vh)", height: "min(38rem,76vh)" }} />
              <motion.div aria-hidden="true" className="absolute h-44 w-44 rounded-full border border-[#DDFF97]/60" animate={{ scale: [1, 1.5], opacity: [0.7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }} />
              <div className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full text-[#151515]" style={{ background: "radial-gradient(circle at 35% 30%, #f3ffcf 0%, #DDFF97 45%, #b9e65a 100%)", boxShadow: "0 0 90px rgba(221,255,151,0.55), 0 0 0 14px rgba(221,255,151,0.10)" }}>
                <MapPin className="h-5 w-5" />
                <span className="mt-1 text-[15px] font-semibold leading-none">Singapore</span>
                <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#151515]/60">HQ</span>
              </div>
              <OrbitingCircles radius={Math.min(192, typeof window === "undefined" ? 192 : window.innerHeight * 0.24)} iconSize={84} duration={30} path={false}>
                <MarketNode label="China" fill="pink" />
                <MarketNode label="Hong Kong" fill="blue" />
              </OrbitingCircles>
              <OrbitingCircles radius={Math.min(304, typeof window === "undefined" ? 304 : window.innerHeight * 0.38)} iconSize={84} duration={48} reverse path={false}>
                <MarketNode label="Malaysia" fill="lime" />
                <MarketNode label="Thailand" fill="pink" />
              </OrbitingCircles>
              <OrbitingCircles radius={Math.min(304, typeof window === "undefined" ? 304 : window.innerHeight * 0.38)} iconSize={10} duration={64} path={false}>
                <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                <span className="h-2 w-2 rounded-full bg-[#9DD6FF] shadow-[0_0_12px_rgba(157,214,255,0.9)]" />
              </OrbitingCircles>
            </div>
          </motion.div>
        </div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   05 · Services
   ──────────────────────────────────────────────────────────────── */

function ServicesSlide() {
  const [active, setActive] = useState<number | null>(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => ((current ?? 0) + 1) % 3), 2600);
    return () => window.clearInterval(timer);
  }, []);
  const services = [
    { title: "Design & consultancy", img: SHOTS["Singapore Pools"][1], tape: "bg-[#FFB6B6]", tilt: -3, items: ["Site evaluation and feasibility studies", "Space planning and workplace strategy", "Design consultancy and advisory", "Design and contract documentation"] },
    { title: "Costing & control", img: OFFICE[0], tape: "bg-[#9DD6FF]", tilt: 2, items: ["In-house quantity surveying", "Preliminary and detailed budgeting", "Cost management through delivery"] },
    { title: "Build & delivery", img: SHOTS["Group-IB"][1], tape: "bg-[#DDFF97]", tilt: -2, items: ["Full turnkey interior fit-out", "Reinstatement works", "Handover to a completed, move-in-ready space"] },
  ];
  const tabs = [
    { title: "Design", icon: PenTool },
    { title: "Costing", icon: Calculator },
    { title: "Build", icon: HardHat },
  ];
  return (
    <Sheet label="Services & capabilities">
      <div className={cn("relative flex w-full flex-col justify-center px-20 pt-10", SLIDE)}>
        <WarpGrid center="50% 70%" />
        <div className="relative grid grid-cols-1 items-end gap-8 pb-8 md:grid-cols-[1fr_auto]">
          <Display size="md">Full turnkey delivery from a <Em>single</Em> in-house team.</Display>
          <Sticker tone="ink" rotate={4} className="md:justify-self-end">Design · Costing · Build</Sticker>
        </div>
        <motion.div variants={stagger} className="relative grid grid-cols-1 gap-6 px-4 md:grid-cols-3">
          {services.map((service, index) => {
            const isActive = active === index;
            return (
              <motion.div
                key={service.title}
                variants={scaleIn}
                animate={{ rotate: isActive ? 0 : service.tilt, y: isActive ? -14 : 0, scale: isActive ? 1.03 : 1 }}
                transition={{ duration: 0.55, ease }}
                className={cn("relative rounded-2xl bg-white p-3 pb-4 transition-shadow duration-500", isActive ? "shadow-[0_30px_70px_rgba(21,21,21,0.18)]" : "shadow-[0_14px_40px_rgba(21,21,21,0.10)]")}
              >
                <span className={cn("absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-sm opacity-90", service.tape)} />
                <Photo src={service.img} alt={service.title} className="h-[clamp(8rem,22vh,13rem)] w-full rounded-xl" />
                <div className="px-2 pt-4">
                  <p className="text-lg font-semibold tracking-tight text-[#151515]"><span className="mr-2 text-[#151515]/40">0{index + 1}</span>{service.title}</p>
                  <ul className="mt-2 flex flex-col gap-1 text-[12px] leading-snug text-[#151515]/65">
                    {service.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div variants={fadeUp} className="relative mt-8 flex justify-center">
          <ExpandableTabs tabs={tabs} selectedIndex={active} onChange={(index) => setActive(index)} activeColor="text-neutral-900" activeBgClassName="bg-black/5" className="w-max" />
        </motion.div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   06 · Delivery approach: a plain six-stage timeline
   ──────────────────────────────────────────────────────────────── */

function StagePipeline({ active }: { active: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const r0 = useRef<HTMLDivElement>(null), r1 = useRef<HTMLDivElement>(null), r2 = useRef<HTMLDivElement>(null), r3 = useRef<HTMLDivElement>(null), r4 = useRef<HTMLDivElement>(null), r5 = useRef<HTMLDivElement>(null);
  const refs = [r0, r1, r2, r3, r4, r5];
  const icons = [Eye, PenTool, Calculator, HardHat, Key, Sparkles];
  const tones: Tone[] = ["pink", "blue", "lime", "pink", "blue", "lime"];
  const positions = [
    { left: "12%", top: "22%" }, { left: "50%", top: "22%" }, { left: "88%", top: "22%" },
    { left: "88%", top: "74%" }, { left: "50%", top: "74%" }, { left: "12%", top: "74%" },
  ];
  const links: [number, number, number][] = [[0, 1, -40], [1, 2, -40], [2, 3, 0], [3, 4, 40], [4, 5, 40]];
  return (
    <div ref={containerRef} className="relative h-full w-full">
      {links.map(([from, to, curvature]) => (
        <AnimatedBeam key={`${from}-${to}`} containerRef={containerRef} fromRef={refs[from]} toRef={refs[to]} curvature={curvature} pathColor={INK} pathOpacity={0.15} pathWidth={2.5} gradientStartColor={hex[tones[from]]} gradientStopColor={INK} duration={3.4} delay={from * 0.5} reverse={from >= 3} />
      ))}
      {positions.map((position, index) => {
        const Icon = icons[index];
        const isActive = index === active;
        const isDone = index < active;
        return (
          <div key={index} ref={refs[index]} className="absolute -translate-x-1/2 -translate-y-1/2" style={position}>
            <motion.div animate={{ scale: isActive ? 1.12 : 1 }} transition={{ duration: 0.4, ease }} className="relative flex flex-col items-center">
              {isActive ? <motion.span aria-hidden="true" className="absolute top-0 h-[4.5rem] w-[4.5rem] rounded-full border-2" style={{ borderColor: hex[tones[index]] }} animate={{ scale: [1, 1.7], opacity: [0.9, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }} /> : null}
              <span className={cn("relative z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-[3px] border-white shadow-[0_16px_40px_rgba(21,21,21,0.18)] transition-colors duration-500", isActive ? "bg-[#151515] text-white" : isDone ? cn(fillClass[tones[index]]) : "bg-white text-[#151515]/60")}>
                {isDone ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
              </span>
              <span className={cn("mt-2 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors", isActive ? "bg-[#151515] text-white" : "bg-white/80 text-[#151515]/70")}>{index + 1}. {stages[index].title}</span>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function ApproachSlide() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % stages.length), 3600);
    return () => window.clearInterval(timer);
  }, [paused]);
  const tones: Tone[] = ["pink", "blue", "lime", "pink", "blue", "lime"];
  return (
    <Sheet label="Our delivery approach">
      <div className={cn("relative grid w-full grid-cols-1 items-center gap-10 px-20 pt-6 md:grid-cols-[0.85fr_1.15fr]", SLIDE)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <WarpGrid center="72% 55%" />
        <Stars count={10} />
        <div className="relative flex flex-col justify-center pb-6">
          <Display size="md">Six stages. One <Em tone="pink">accountable</Em> team.</Display>
          <motion.p variants={fadeUp} className="mt-4 max-w-md text-[13px] leading-relaxed text-[#151515]/65">Buddy-system continuity keeps your project moving, with one point of contact from brief to handover.</motion.p>
          <motion.ol variants={stagger} className="mt-6 flex flex-col gap-1.5">
            {stages.map((item, index) => {
              const current = index === active;
              const done = index < active;
              return (
                <motion.li key={item.title} variants={fadeUp} layout>
                  <button type="button" onClick={() => setActive(index)} className={cn("flex w-full items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300", current ? "bg-white shadow-[0_14px_36px_rgba(21,21,21,0.10)]" : "hover:bg-white/60")}>
                    <motion.span animate={{ scale: current ? 1.1 : 1 }} className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-300", current ? "bg-[#151515] text-white" : done ? cn(fillClass[tones[index]]) : "border border-[#151515]/20 text-[#151515]/50")}>
                      {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </motion.span>
                    <span className="min-w-0 flex-1">
                      <span className={cn("block text-[14px] font-semibold leading-tight", current ? "text-[#151515]" : done ? "text-[#151515]/70 line-through decoration-[#151515]/30" : "text-[#151515]/60")}>{item.title}</span>
                      <AnimatePresence initial={false}>
                        {current ? (
                          <motion.span key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="block overflow-hidden">
                            <span className="mt-1.5 block text-[12px] leading-relaxed text-[#151515]/70">{item.body}</span>
                            {item.extra ? <span className="mt-1 block text-[11px] leading-relaxed text-[#151515]/60">{item.extra}</span> : null}
                          </motion.span>
                        ) : null}
                      </AnimatePresence>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
        <motion.div variants={scaleIn} className="relative mb-6 h-[calc(100dvh-12rem)] min-h-[22rem]">
          <StagePipeline active={active} />
        </motion.div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   07 · Site transparency: from plan to handover
   ──────────────────────────────────────────────────────────────── */

function RealityCaptureSlide() {
  const points = [
    { title: "Virtual walkthroughs", body: "Walk the site from your desk, at any stage of the build." },
    { title: "Visual progress updates", body: "Reality-capture records what was done, and when." },
    { title: "Safe by system", body: "Work is carried out under our ISO 45001 and bizSAFE Star safety systems." },
  ];
  return (
    <Sheet label="Real-time site transparency">
      <div className={cn("grid w-full grid-cols-1 gap-8 px-20 pt-10 md:grid-cols-[1.15fr_0.85fr]", SLIDE)}>
        <motion.div variants={scaleIn} className="mb-6 h-[calc(100dvh-12rem)]">
          <Compare
            className="h-full rounded-2xl"
            first={<Photo src={RENDER.sumitomoB} alt="Sumitomo Chemical Asia, design render" className="h-full w-full rounded-none" caption="Design render · Sumitomo Chemical Asia" />}
            second={<Photo src={SHOTS["Sumitomo Chemical Asia"][0]} alt="Sumitomo Chemical Asia, completed" className="h-full w-full rounded-none" caption="Handover · as built" />}
          />
        </motion.div>
        <div className="flex flex-col justify-center pb-6">
          <Display size="md">See site progress <Em>without being on site.</Em></Display>
          <motion.p variants={fadeUp} className="mt-5 max-w-md text-[13px] leading-relaxed text-[#151515]/65">Reality-capture technology gives you virtual walkthroughs and visual progress updates throughout the build.</motion.p>
          <motion.ul variants={stagger} className="mt-8">
            {points.map((point) => (
              <motion.li key={point.title} variants={fadeUp} className="border-t border-[#151515]/15 py-3">
                <p className="text-[14px] font-semibold text-[#151515]">{point.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#151515]/60">{point.body}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   08 · Team
   ──────────────────────────────────────────────────────────────── */

function TeamSlide() {
  return (
    <Sheet label="Our team">
      <div className={cn("relative grid w-full grid-cols-1 items-center gap-10 px-20 pt-10 md:grid-cols-[0.8fr_1.2fr]", SLIDE)}>
        <WarpGrid center="70% 50%" />
        <Stars count={8} />
        <div className="relative">
          <Display size="md">Led from the front, <span className="whitespace-nowrap"><Em>since 2003.</Em></span></Display>
          <motion.p variants={fadeUp} className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#151515]/65">Founders Ronald Goh and Jayne Ong run every project from the front. One team, brief to handover: the people who start your project finish it.</motion.p>
          <motion.ul variants={stagger} className="mt-7">
            {[{ name: "Ronald Goh", role: "Managing Director" }, { name: "Jayne Ong", role: "Head of Costing & Operation" }, { name: "Esther Choo", role: "Design Director" }, { name: "Sandrey Lim", role: "Project Director" }, { name: "Danny Chua", role: "Senior Quantity Surveyor" }].map((leader) => (
              <motion.li key={leader.name} variants={fadeUp} className="flex items-baseline justify-between border-t border-[#151515]/15 py-2.5">
                <span className="text-[14px] font-semibold text-[#151515]">{leader.name}</span>
                <span className="text-[11px] text-[#151515]/55">{leader.role}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
        <motion.div variants={scaleIn} className="relative flex items-center justify-center">
          <motion.div animate={{ rotate: [-2, -1.2, -2] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="relative w-full max-w-[36rem] rounded-2xl bg-white p-3 pb-12 shadow-[0_30px_80px_rgba(21,21,21,0.18)]">
            <span className="absolute -top-3 left-1/2 h-6 w-28 -translate-x-1/2 rotate-2 rounded-sm bg-[#9DD6FF] opacity-90" />
            <Photo src={TEAM.founders[1]} alt="Ronald Goh and Jayne Ong" className="h-[clamp(14rem,40vh,22rem)] w-full rounded-xl" position="50% 40%" />
            <p className="absolute bottom-4 left-5 text-[13px] font-semibold text-[#151515]">Ronald Goh and Jayne Ong</p>
            <p className="absolute bottom-4 right-5 text-[11px] text-[#151515]/50">Founders</p>
          </motion.div>
          <RotatingBadge text="ONE TEAM · BRIEF TO HANDOVER · " className="absolute -bottom-2 right-0" size={110} />
        </motion.div>
      </div>
    </Sheet>
  );
}

/** Soft grey connector with a travelling gradient highlight. */
function FlowLine({ d, index = 0, color = INK, delay = 0 }: { d: string; index?: number; color?: string; delay?: number }) {
  const id = `flow-${index}-${color.replace("#", "")}`;
  return (
    <g>
      <motion.path d={d} fill="none" stroke={INK} strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.2 + index * 0.03, ease }} />
      <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth="2.5" strokeLinecap="round" />
      <defs>
        <motion.linearGradient id={id} gradientUnits="userSpaceOnUse" initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }} animate={{ x1: ["-20%", "120%"], x2: ["0%", "140%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }} transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: delay + index * 0.12 }}>
          <stop stopColor={color} stopOpacity="0" />
          <stop offset="40%" stopColor={color} />
          <stop offset="60%" stopColor={INK} />
          <stop offset="100%" stopColor={INK} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </g>
  );
}

/* n8n-style workflow canvas for the organisation chart */
const FLOW_W = 1240;
const FLOW_H = 600;

type FlowNode = { id: string; x: number; y: number; w: number; h: number; kind: "person" | "router" | "team" | "member"; title: string; sub?: string; photo?: string; photoPosition?: string; tone?: Tone; icon?: ReactNode };

function flowLayout() {
  const nodes: FlowNode[] = [];
  const edges: [string, string][] = [];
  const memberH = 38, memberGap = 7, groupGap = 18;
  const teamIcons = [<ClipboardList key="p" className="h-4 w-4" />, <Briefcase key="b" className="h-4 w-4" />, <PenTool key="d" className="h-4 w-4" />, <Users key="h" className="h-4 w-4" />, <Calculator key="c" className="h-4 w-4" />];
  const tones: Tone[] = ["pink", "lime", "blue", "lime", "pink"];
  const totalMembers = orgTeams.reduce((sum, team) => sum + team.members.length, 0);
  const totalH = totalMembers * (memberH + memberGap) - memberGap + (orgTeams.length - 1) * groupGap;
  let y = (FLOW_H - totalH) / 2;
  orgTeams.forEach((team, teamIndex) => {
    const groupH = team.members.length * (memberH + memberGap) - memberGap;
    const teamId = `team-${teamIndex}`;
    nodes.push({ id: teamId, x: 560, y: y + groupH / 2 - 28, w: 230, h: 56, kind: "team", title: team.name, sub: `${team.members.length} ${team.members.length === 1 ? "person" : "people"}`, tone: tones[teamIndex], icon: teamIcons[teamIndex] });
    edges.push(["router", teamId]);
    team.members.forEach((member, memberIndex) => {
      const id = `m-${teamIndex}-${memberIndex}`;
      nodes.push({ id, x: 920, y: y + memberIndex * (memberH + memberGap), w: 320, h: memberH, kind: "member", title: member.name, sub: member.role, tone: tones[teamIndex] });
      edges.push([teamId, id]);
    });
    y += groupH + groupGap;
  });
  nodes.push({ id: "ronald", x: 0, y: FLOW_H / 2 - 118, w: 250, h: 96, kind: "person", title: "Ronald Goh", sub: "Managing Director", photo: TEAM.ronald, photoPosition: "50% 20%" });
  nodes.push({ id: "jayne", x: 0, y: FLOW_H / 2 + 22, w: 250, h: 96, kind: "person", title: "Jayne Ong", sub: "Head of Costing & Operation", photo: TEAM.jayne, photoPosition: "50% 12%" });
  nodes.push({ id: "router", x: 320, y: FLOW_H / 2 - 36, w: 190, h: 72, kind: "router", title: "Buddy system", sub: "one accountable contact", icon: <GitFork className="h-4 w-4" /> });
  edges.push(["ronald", "router"], ["jayne", "router"]);
  return { nodes, edges };
}

/** Hover preview card for a person node. Opens away from the canvas edge and never runs past the top or bottom. */
function HoverPreview({ photo, name, role, side, align, position = "50% 12%" }: { photo: string; name: string; role: string; side: "left" | "right"; align: "top" | "center" | "bottom"; position?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? 12 : -12, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: side === "left" ? 8 : -8, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "pointer-events-none absolute z-50 w-[11rem] overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_24px_60px_rgba(21,21,21,0.28)]",
        side === "left" ? "right-full mr-4" : "left-full ml-4",
        align === "top" ? "top-0" : align === "bottom" ? "bottom-0" : "top-1/2 -translate-y-1/2"
      )}
    >
      <img src={photo} alt={name} className="h-[13rem] w-full rounded-xl object-cover" style={{ objectPosition: position }} draggable={false} />
      <div className="px-2 pb-1.5 pt-2"><p className="text-[12px] font-semibold text-[#151515]">{name}</p><p className="text-[10px] text-[#151515]/55">{role}</p></div>
    </motion.div>
  );
}

function previewAlign(node: FlowNode): "top" | "center" | "bottom" {
  const centre = node.y + node.h / 2;
  if (centre < FLOW_H * 0.3) return "top";
  if (centre > FLOW_H * 0.7) return "bottom";
  return "center";
}

function MemberNode({ node, chip }: { node: FlowNode; chip: string }) {
  const [hovered, setHovered] = useState(false);
  const photo = HEADSHOT[node.title];
  return (
    <div className="relative h-full" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={cn("flex h-full items-center gap-2.5 rounded-xl border border-[#151515]/10 bg-white pl-1.5 pr-3 shadow-[0_8px_20px_rgba(21,21,21,0.07)] transition-shadow duration-300", hovered && "shadow-[0_16px_40px_rgba(21,21,21,0.16)]")}>
        {photo ? (
          <img src={photo} alt={node.title} className="h-7 w-7 shrink-0 rounded-full object-cover ring-2 ring-white" style={{ objectPosition: "50% 15%" }} draggable={false} />
        ) : (
          <span className={cn("ml-1.5 h-2.5 w-2.5 shrink-0 rounded-full", chip)} />
        )}
        <p className="truncate text-[12px] font-semibold text-[#151515]">{node.title}</p>
        <p className="ml-auto truncate text-[10px] text-[#151515]/55">{node.sub}</p>
        <span className="absolute -left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
      </div>
      <AnimatePresence>{hovered && photo ? <HoverPreview photo={photo} name={node.title} role={node.sub ?? ""} side="left" align={previewAlign(node)} /> : null}</AnimatePresence>
    </div>
  );
}

function PersonNode({ node }: { node: FlowNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative h-full" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={cn("flex h-full items-center gap-3 rounded-2xl border border-[#151515]/10 bg-white px-2.5 shadow-[0_14px_36px_rgba(21,21,21,0.12)] transition-shadow duration-300", hovered && "shadow-[0_22px_50px_rgba(21,21,21,0.2)]")}>
        <img src={node.photo} alt={node.title} className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-xl object-cover" style={{ objectPosition: node.photoPosition }} draggable={false} />
        <div className="min-w-0"><p className="truncate text-[13px] font-semibold leading-tight text-[#151515]">{node.title}</p><p className="truncate text-[10px] text-[#151515]/55">{node.sub}</p></div>
        <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
      </div>
      <AnimatePresence>{hovered && node.photo ? <HoverPreview photo={node.photo} name={node.title} role={node.sub ?? ""} side="right" align={previewAlign(node)} position={node.photoPosition} /> : null}</AnimatePresence>
    </div>
  );
}

function OrgChartSlide() {
  const { nodes, edges } = flowLayout();
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const pct = (value: number, total: number) => `${(value / total) * 100}%`;
  const path = (a: FlowNode, b: FlowNode) => {
    const x1 = a.x + a.w, y1 = a.y + a.h / 2, x2 = b.x, y2 = b.y + b.h / 2, dx = Math.max(40, (x2 - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };
  const chip: Record<Tone, string> = { pink: "bg-[#FFB6B6]", blue: "bg-[#9DD6FF]", lime: "bg-[#DDFF97]" };
  return (
    <Sheet label="Organisation chart">
      <div className={cn("relative flex w-full flex-col px-20 pb-8 pt-8", SLIDE)}>
        <WarpGrid center="50% 50%" />
        <div className="relative flex items-center gap-6">
          <Display size="sm">One team, <Em>five</Em> disciplines.</Display>
          <Sticker tone="lime" rotate={3}>Buddy system on every project</Sticker>
        </div>
        <motion.div variants={scaleIn} className="relative mx-auto mt-4 w-full max-w-[1240px] flex-1" style={{ aspectRatio: `${FLOW_W} / ${FLOW_H}`, maxHeight: "calc(100dvh - 14rem)" }}>
          <svg viewBox={`0 0 ${FLOW_W} ${FLOW_H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {edges.map(([from, to], index) => {
              const d = path(byId[from], byId[to]);
              const tone = byId[to].tone ?? byId[from].tone;
              return <FlowLine key={`${from}-${to}`} d={d} index={index} color={tone ? hex[tone] : LIME} />;
            })}
          </svg>
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.03, ease }}
              className="absolute"
              style={{ left: pct(node.x, FLOW_W), top: pct(node.y, FLOW_H), width: pct(node.w, FLOW_W), height: pct(node.h, FLOW_H) }}
            >
              {node.kind === "person" ? (
                <PersonNode node={node} />
              ) : node.kind === "router" ? (
                <div className="flex h-full items-center gap-3 rounded-2xl bg-[#151515] px-3 text-white shadow-[0_18px_44px_rgba(21,21,21,0.3)]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#DDFF97] text-[#151515]">{node.icon}</span>
                  <div className="min-w-0"><p className="truncate text-[13px] font-semibold leading-tight">{node.title}</p><p className="truncate text-[10px] text-white/60">{node.sub}</p></div>
                  <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
                  <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#DDFF97]" />
                </div>
              ) : node.kind === "team" ? (
                <div className="flex h-full items-center gap-3 rounded-2xl border border-[#151515]/10 bg-white px-3 shadow-[0_14px_36px_rgba(21,21,21,0.10)]">
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#151515]", chip[node.tone ?? "pink"])}>{node.icon}</span>
                  <div className="min-w-0"><p className="truncate text-[13px] font-semibold leading-tight text-[#151515]">{node.title}</p><p className="truncate text-[10px] text-[#151515]/55">{node.sub}</p></div>
                  <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
                  <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
                </div>
              ) : (
                <MemberNode node={node} chip={chip[node.tone ?? "pink"]} />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Sheet>
  );
}

type Spotlight = { name: string; role: string; photo?: string; photoPosition?: string; tone: Tone; facts: string[]; logos?: string[]; caption?: string };

function FocusStrips({ people, active, onActive, expanded = 2.6 }: { people: Spotlight[]; active: number; onActive: (index: number) => void; expanded?: number }) {
  return (
    <div className="flex h-full w-full gap-3">
      {people.map((person, index) => {
        const isActive = index === active;
        return (
          <motion.div
            key={person.name}
            layout
            animate={{ flexGrow: isActive ? expanded : 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 26 }}
            onMouseEnter={() => onActive(index)}
            className="relative min-w-0 basis-0 cursor-pointer overflow-hidden rounded-[1.75rem] bg-[#1f1f1f] shadow-[0_24px_60px_rgba(21,21,21,0.18)]"
          >
            {person.photo ? (
              <motion.img src={person.photo} alt={person.name} animate={{ scale: isActive ? 1 : 1.08, filter: isActive ? "grayscale(0%) brightness(1)" : "grayscale(100%) brightness(0.55)" }} transition={{ duration: 0.7, ease }} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: person.photoPosition ?? "50% 15%" }} draggable={false} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-white/15">{person.name.split(" ").map((part) => part[0]).join("")}</div>
            )}
            <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <motion.p layout="position" className={cn("font-bold leading-none tracking-tight", isActive ? "text-[2.6rem]" : "text-[1.4rem]")}>{person.name}</motion.p>
              <motion.p layout="position" className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">{person.role}</motion.p>
              <AnimatePresence>
                {isActive ? (
                  <motion.div key="details" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.4, delay: 0.15, ease }} className="mt-4">
                    {person.caption ? <p className="max-w-md text-[13px] leading-relaxed text-white/75">{person.caption}</p> : null}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {person.facts.map((fact) => <span key={fact} className="rounded-full border border-white/35 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm">{fact}</span>)}
                    </div>
                    {person.logos?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {person.logos.map((logo) => <span key={logo} className="flex h-9 w-20 items-center justify-center rounded-lg bg-white px-2"><img src={logo} alt="Client" className="max-h-5 w-full object-contain" /></span>)}
                      </div>
                    ) : null}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <span className="absolute left-5 top-5 h-2.5 w-2.5 rounded-full" style={{ background: hex[person.tone], boxShadow: isActive ? `0 0 16px ${hex[person.tone]}` : "none" }} />
          </motion.div>
        );
      })}
    </div>
  );
}

function FoundersSlide() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % 2), 4600);
    return () => window.clearInterval(timer);
  }, [paused]);
  const people: Spotlight[] = [
    { name: "Ronald Goh", role: "Managing Director · Co-founder", photo: TEAM.ronald, photoPosition: "50% 20%", tone: "lime", caption: "Translating clients' commercial objectives into fit-out decisions, with long-term client relationships built across repeat engagements.", facts: ["25+ years in corporate fit-out", "Founded D'trax in 2003"], logos: [LOGO["Group-IB"], LOGO["Sony Pictures"], LOGO["Mitsui Chemicals"], LOGO["FIJI Water"], LOGO["Edelman"]] },
    { name: "Jayne Ong", role: "Head of Costing & Operation · Co-founder", photo: TEAM.jayne, photoPosition: "50% 12%", tone: "pink", caption: "Budgets owned in-house from the first estimate to final account, and the operations that keep every project moving.", facts: ["Founded D'trax in 2003", "Costing and operations", "Profile to confirm"] },
  ];
  return (
    <Sheet label="The founders">
      <div className={cn("relative flex w-full flex-col px-20 pb-8 pt-10", SLIDE)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <WarpGrid center="50% 60%" />
        <div className="relative flex items-end justify-between gap-8">
          <Display size="sm">The <Em tone="pink">founders</Em>.</Display>
          <p className="max-w-xs text-right text-[12px] leading-relaxed text-[#151515]/60">Ronald Goh and Jayne Ong have run D&apos;trax from the front since 2003.</p>
        </div>
        <div className="relative mt-5 h-[clamp(20rem,62vh,32rem)]"><FocusStrips people={people} active={active} onActive={setActive} expanded={2.2} /></div>
      </div>
    </Sheet>
  );
}

function LeadersSlide() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % 4), 4000);
    return () => window.clearInterval(timer);
  }, [paused]);
  const people: Spotlight[] = [
    { name: "Esther Choo", role: "Design Director", photo: HEADSHOT["Esther Choo"], tone: "lime", caption: "Pre-leasing feasibility and workspace strategy through detailed, buildable design; corporate, hospitality and retail interiors.", facts: ["24+ years of practice", "Diploma in Interior Design, NAFA"], logos: [LOGO["Standard Chartered"], LOGO["Spotify"], LOGO["Singtel"], LOGO["Traveloka"], LOGO["Singapore Pools"]] },
    { name: "Sandrey Lim", role: "Project Director", photo: HEADSHOT["Sandrey Lim"], tone: "blue", caption: "End-to-end delivery of complex workplace transformations, coordinating design, cost and construction through to handover.", facts: ["26+ years in design-and-build", "BCA Specialist Diploma", "bizSAFE Level 2"], logos: [LOGO["Alibaba"], LOGO["Grohe"], LOGO["The World Bank"], LOGO["SOTA"], LOGO["Shiseido"]] },
    { name: "Steve Tan", role: "Senior Project Manager", tone: "pink", caption: "Project management and fit-out delivery.", facts: ["Profile to confirm"] },
    { name: "Danny Chua", role: "Senior Quantity Surveyor", photo: HEADSHOT["Danny Chua"], tone: "lime", caption: "Quantity surveying and cost management through delivery.", facts: ["Profile to confirm"] },
  ];
  return (
    <Sheet label="Key leaders">
      <div className={cn("relative flex w-full flex-col px-20 pb-8 pt-10", SLIDE)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <WarpGrid center="50% 60%" />
        <div className="relative flex items-end justify-between gap-8">
          <Display size="sm">Key <Em>leaders</Em>.</Display>
          <p className="max-w-xs text-right text-[12px] leading-relaxed text-[#151515]/60">Design, delivery and costing, led in-house.</p>
        </div>
        <div className="relative mt-5 h-[clamp(20rem,62vh,32rem)]"><FocusStrips people={people} active={active} onActive={setActive} expanded={2.8} /></div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   09 · Track record and recent projects
   ──────────────────────────────────────────────────────────────── */

function TrackRecordSlide() {
  type Tile = { src?: string; name: string; meta: string };
  const tiles: Tile[] = [];
  featuredProjects.forEach((project) => {
    const shots = SHOTS[project.name] ?? [];
    const meta = `${project.area.toLocaleString("en-US")} sq ft`;
    shots.slice(0, 8).forEach((src) => tiles.push({ src, name: project.name, meta }));
  });
  let seed = 7;
  const random = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = tiles.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
  const rowCount = 6;
  const rows: Tile[][] = Array.from({ length: rowCount }, () => []);
  tiles.forEach((tile, index) => rows[index % rowCount].push(tile));
  const Row = ({ items, reverse, speed }: { items: Tile[]; reverse?: boolean; speed: number }) => (
    <Belt reverse={reverse} speed={speed}>
      {items.map((tile, index) => (
        <div key={`${tile.name}-${index}`} className="relative h-[6rem] w-[13rem] shrink-0 overflow-hidden rounded-xl bg-[#2a2a2a]">
          {tile.src ? <img src={tile.src} alt={tile.name} className="absolute inset-0 h-full w-full object-cover" draggable={false} /> : <span className="absolute left-3 top-3 text-[10px] font-medium uppercase tracking-[0.14em] text-white/50">Photos pending</span>}
          <span className="absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 whitespace-nowrap rounded-full bg-white/92 px-2.5 py-1 text-[9.5px] font-semibold text-[#151515]"><span className="truncate">{tile.name}</span><span className="shrink-0 text-[#151515]/50">{tile.meta}</span></span>
        </div>
      ))}
    </Belt>
  );
  return (
    <Sheet>
      <div className="relative -mb-16 -mt-14 flex h-[100dvh] w-full flex-col justify-center gap-3 overflow-hidden bg-[#151515]">
        <Stars count={24} dark />
        {rows.slice(0, 3).map((items, index) => <Row key={index} items={items} reverse={index % 2 === 1} speed={34 + index * 6} />)}
        <div className="relative z-10 flex items-center justify-center py-2">
          <div className="absolute inset-x-0 top-1/2 h-[11rem] -translate-y-1/2 bg-[#151515]/80 backdrop-blur-md" />
          <Display size="md" className="relative max-w-4xl text-center text-white">A selection from <Em>100+</Em> offices delivered since 2003.</Display>
        </div>
        {rows.slice(3).map((items, index) => <Row key={index + 3} items={items} reverse={index % 2 === 0} speed={36 + index * 6} />)}
      </div>
    </Sheet>
  );
}

function RecentProjectsSlide() {
  const W = 1240, H = 520;
  const rowH = 26, gap = 6.5;
  const rows = recentProjects.map((project, index) => ({ ...project, y: 4 + index * (rowH + gap) }));
  const hub = { x: 640, y: H / 2 - 46, w: 280, h: 92 };
  const typeCounts = Object.entries(recentProjects.reduce<Record<string, number>>((acc, project) => ({ ...acc, [project.type]: (acc[project.type] ?? 0) + 1 }), {}));
  const outputs = typeCounts.map(([type, count], index) => ({ type, count, y: H / 2 - (typeCounts.length * 46) / 2 + index * 46 + 4, x: 990, w: 250, h: 36 }));
  const strokes = [PINK, BLUE, LIME];
  const curve = (x1: number, y1: number, x2: number, y2: number) => { const dx = (x2 - x1) * 0.55; return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`; };
  const pct = (value: number, total: number) => `${(value / total) * 100}%`;
  return (
    <Sheet label="Recent projects">
      <div className={cn("relative flex w-full flex-col px-20 pt-8", SLIDE)}>
        <WarpGrid center="55% 50%" />
        <Stars count={10} />
        <div className="relative flex items-center gap-6">
          <Display size="sm">Recent projects, 2024 to 2026.</Display>
          <Sticker tone="pink" rotate={-3}>16 offices in three years</Sticker>
        </div>
        <motion.div variants={scaleIn} className="relative mx-auto mt-4 w-full max-w-[1240px] flex-1" style={{ aspectRatio: `${W} / ${H}`, maxHeight: "calc(100dvh - 14rem)" }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {rows.map((row, index) => {
              const d = curve(300, row.y + rowH / 2, hub.x, hub.y + hub.h / 2);
              return <FlowLine key={row.name} d={d} index={index} color={strokes[index % strokes.length]} delay={index * 0.1} />;
            })}
            {outputs.map((output, index) => {
              const d = curve(hub.x + hub.w, hub.y + hub.h / 2, output.x, output.y + output.h / 2);
              return <FlowLine key={output.type} d={d} index={100 + index} color={LIME} delay={1 + index * 0.3} />;
            })}
          </svg>
          {rows.map((row, index) => (
            <motion.div key={row.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 + index * 0.04, ease }} className="absolute flex items-center gap-2.5 rounded-full border border-[#151515]/10 bg-white pl-2 pr-3 shadow-[0_8px_20px_rgba(21,21,21,0.07)]" style={{ left: 0, top: pct(row.y, H), width: pct(300, W), height: pct(rowH, H) }}>
              <img src={RECENT_LOGO[row.name]} alt={row.name} className="h-4 w-10 shrink-0 object-contain" />
              <span className="truncate text-[11px] font-semibold text-[#151515]">{row.name}</span>
              <span className="ml-auto shrink-0 text-[10px] text-[#151515]/50">{row.year}</span>
              <span className="absolute -right-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: strokes[index % strokes.length] }} />
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.9, ease }} className="absolute flex items-center gap-4 rounded-2xl bg-[#151515] px-5 text-white shadow-[0_24px_60px_rgba(21,21,21,0.35)]" style={{ left: pct(hub.x, W), top: pct(hub.y, H), width: pct(hub.w, W), height: pct(hub.h, H) }}>
            <img src={asset("/logo/dtrax-logo-light.png")} alt="D'trax" className="h-7 w-auto object-contain" />
            <div className="min-w-0"><p className="text-[13px] font-semibold leading-tight">Delivered by one team</p><p className="text-[10px] text-white/60">Brief to handover, in-house</p></div>
            <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
            <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-[#DDFF97]" />
          </motion.div>
          {outputs.map((output, index) => (
            <motion.div key={output.type} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 1.2 + index * 0.1, ease }} className="absolute flex items-center justify-between rounded-full border border-[#151515]/10 bg-white px-4 shadow-[0_8px_20px_rgba(21,21,21,0.07)]" style={{ left: pct(output.x, W), top: pct(output.y, H), width: pct(output.w, W), height: pct(output.h, H) }}>
              <span className="truncate text-[11px] font-semibold text-[#151515]">{output.type}</span>
              <span className={cn("ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-[#151515]", ["bg-[#DDFF97]", "bg-[#9DD6FF]", "bg-[#FFB6B6]", "bg-[#DDFF97]"][index % 4])}>{output.count}</span>
              <span className="absolute -left-1.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#151515]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   Featured project slides: the photograph leads
   ──────────────────────────────────────────────────────────────── */

type ProjectVariant = "split" | "full" | "band";

function ProjectMeta({ project, dark = false }: { project: Project; dark?: boolean }) {
  return (
    <div className={cn("flex flex-wrap gap-x-6 gap-y-1 text-[12px]", dark ? "text-white" : "text-[#151515]")}>
      <span><span className={dark ? "text-white/50" : "text-[#151515]/50"}>Area</span> {project.area}</span>
      <span><span className={dark ? "text-white/50" : "text-[#151515]/50"}>Type</span> {project.type}</span>
      {project.award ? <span className="inline-flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> {project.award}</span> : null}
    </div>
  );
}

function ProjectSlide({ project, index, variant = "split", reverse = false }: { project: Project; index: number; variant?: ProjectVariant; reverse?: boolean }) {
  const shots = SHOTS[project.name] ?? [];
  const hero = shots[0];
  const reel = shots.slice(0, 4);
  const thumbs = shots.slice(4, 6);
  const label = `Featured projects · ${index} of 8`;
  const Hero = ({ className, caption }: { className?: string; caption?: ReactNode }) => hero ? <Slideshow images={reel} alt={project.name} className={className} caption={caption} /> : <Pending label={`${project.name} · project photos pending`} className={className} />;

  if (variant === "full") {
    return (
      <Sheet>
        <div className="relative -mb-16 -mt-14 h-[100dvh] w-full">
          <Hero className="h-full w-full rounded-none" />
          <motion.span variants={fadeUp} className="absolute left-20 top-6 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium text-[#151515]">{label}</motion.span>
          <motion.div variants={fadeUp} className="absolute bottom-0 left-0 max-w-2xl rounded-tr-[1.5rem] bg-white p-8 pb-20 pl-12">
            <p className="text-[12px] text-[#151515]/55">{project.sector} · {project.location}</p>
            <Display size="md" className="mt-1">{project.name}</Display>
            <p className="mt-3 max-w-xl text-lg font-medium leading-snug tracking-tight text-[#151515]">{project.tagline}</p>
            <ul className="mt-4 border-t border-[#151515]/15 pt-3">
              {project.points.map((point) => <li key={point} className="py-1 text-[13px] leading-snug text-[#151515]/75">{point}</li>)}
            </ul>
            <div className="mt-4 border-t border-[#151515]/15 pt-3"><ProjectMeta project={project} /></div>
          </motion.div>
        </div>
      </Sheet>
    );
  }

  if (variant === "band") {
    return (
      <Sheet>
        <div className="relative -mb-16 -mt-14 flex h-[100dvh] w-full flex-col">
          <motion.div variants={scaleIn} className="relative min-h-0 flex-1">
            <Hero className="h-full w-full rounded-none" />
            <motion.span variants={fadeUp} className="absolute left-20 top-6 rounded-full bg-white/92 px-3 py-1 text-[11px] font-medium text-[#151515]">{label}</motion.span>
          </motion.div>
          <Panel fill="ink" className="shrink-0 px-20 pb-20 pt-8" grain={false}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-[12px] text-white/55">{project.sector} · {project.location}</p>
                <Display size="sm" className="mt-1 text-white">{project.name}</Display>
                <p className="mt-3 max-w-md text-[15px] font-medium leading-snug tracking-tight text-white/85">{project.tagline}</p>
              </div>
              <div className="flex flex-col justify-between gap-4">
                <ul className="border-t border-white/15 pt-3">
                  {project.points.map((point) => <li key={point} className="py-1 text-[13px] leading-snug text-white/75">{point}</li>)}
                </ul>
                <ProjectMeta project={project} dark />
              </div>
            </div>
          </Panel>
        </div>
      </Sheet>
    );
  }

  return (
    <Sheet label={label}>
      <div className={cn("grid w-full grid-cols-1 gap-8 px-20 pt-10 md:grid-cols-[1.15fr_0.85fr]", SLIDE, reverse && "md:[&>*:first-child]:order-2")}>
        <motion.div variants={scaleIn} className="mb-6 h-[calc(100dvh-12rem)]">
          <Hero className="h-full w-full" caption={project.name} />
        </motion.div>
        <div className="flex flex-col justify-center pb-6">
          <motion.p variants={fadeUp} className="text-[12px] text-[#151515]/55">{project.sector} · {project.location}</motion.p>
          <Display size="md" className="mt-2">{project.name}</Display>
          <motion.p variants={fadeUp} className="mt-4 max-w-lg text-xl font-medium leading-snug tracking-tight text-[#151515]">{project.tagline}</motion.p>
          <motion.ul variants={stagger} className="mt-6 border-t border-[#151515]/15 pt-4">
            {project.points.map((point) => <motion.li key={point} variants={fadeUp} className="py-1.5 text-[13px] leading-relaxed text-[#151515]/75">{point}</motion.li>)}
          </motion.ul>
          <motion.div variants={fadeUp} className="mt-5 border-t border-[#151515]/15 pt-4"><ProjectMeta project={project} /></motion.div>
          {thumbs.length ? (
            <motion.div variants={fadeUp} className="mt-5 grid grid-cols-2 gap-3">
              {thumbs.map((src, i) => <Photo key={i} src={src} alt={`${project.name} detail`} className="h-[clamp(8rem,22vh,12rem)] w-full" />)}
            </motion.div>
          ) : null}
        </div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   Testimonials · Certifications · Close
   ──────────────────────────────────────────────────────────────── */

function TestimonialsSlide() {
  return (
    <Sheet label="Testimonials">
      <div className={cn("flex w-full flex-col justify-center px-20 pt-10", SLIDE)}>
        <Display size="sm" className="mb-8">In their words.</Display>
        <motion.div variants={scaleIn}><AnimatedTestimonials testimonials={testimonials} /></motion.div>
      </div>
    </Sheet>
  );
}

function CertificationsSlide() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % 3), 2400);
    return () => window.clearInterval(timer);
  }, []);
  const cards = [
    { title: "ISO 45001:2018", stats: "Occupational Health & Safety", body: "Interior design, addition and alteration, and renovation works. Certified February 2024.", image: CERT.iso, theme: "205 100% 81%" },
    { title: "bizSAFE Star", stats: "Workplace Safety and Health Council", body: "The highest bizSAFE level. Valid to February 2027.", image: CERT.bizsafe, theme: "79 100% 80%" },
    { title: "SIDA 2023 Bronze", stats: "Best in Workspace Design", body: "Singapore Interior Design Awards, Completed Category, for the Group-IB office.", image: CERT.sida, theme: "0 100% 86%" },
  ];
  return (
    <Sheet label="Certifications & awards">
      <div className={cn("relative flex w-full flex-col justify-center px-20 pt-10", SLIDE)}>
        <Stars count={8} />
        <div className="relative flex items-end justify-between gap-8">
          <Display size="md" className="max-w-4xl">Certified for safety and quality. <Em>Recognised</Em> for design.</Display>
        </div>
        <motion.div variants={stagger} className="relative mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div key={card.title} variants={scaleIn} className="h-[clamp(18rem,54vh,28rem)]">
              <DestinationCard imageUrl={card.image} imageFit="contain" location={card.title} flag="" stats={card.stats} href="#" themeColor={card.theme} description={card.body} hideCta active={index === active} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Sheet>
  );
}

function ClosingSlide() {
  const [activeAvatar, setActiveAvatar] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActiveAvatar((current) => (current + 1) % 2), 2200);
    return () => window.clearInterval(timer);
  }, []);
  const caption = activeAvatar === 0 ? "10 Anson Road, #30-13 International Plaza, Singapore 079903" : "+65 6224 9242 · www.dtrax.com.sg";
  const line = (text: string) => Array.from({ length: 4 }, (_, index) => <span key={index} className="mx-1 inline-flex items-center whitespace-nowrap">{text} <span className="mx-3 inline-block h-6 w-6 rounded-full bg-[#151515]" /></span>);
  return (
    <Sheet>
      <div className={cn("relative flex w-full flex-col justify-center", SLIDE)}>
        <WarpGrid center="50% 80%" />
        <Stars count={12} />
        <motion.div variants={scaleIn} className="relative -rotate-2">
          <Marquee className="bg-[#DDFF97] py-4 text-[5.5rem] font-bold leading-none tracking-[-0.04em] text-[#151515] [--duration:40s] [--gap:0]">{line("Let's build your workplace.")}</Marquee>
          <Marquee reverse className={cn(serif.className, "-mt-1 bg-[#FFB6B6] py-4 text-[5.5rem] italic leading-none text-[#151515] [--duration:46s] [--gap:0]")}>{line("Talk to us about your project.")}</Marquee>
        </motion.div>
        <div className="relative mt-14 grid grid-cols-1 items-center gap-8 px-20 md:grid-cols-[1fr_auto_1fr]">
          <motion.div variants={fadeUp} className="text-[13px] leading-relaxed text-[#151515]/70">
            <p className="font-semibold text-[#151515]">D&apos;trax Design Pte Ltd</p>
            <p>10 Anson Road, #30-13 International Plaza, Singapore 079903</p>
            <p className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" /> +65 6224 9242 · www.dtrax.com.sg</p>
          </motion.div>
          <motion.div variants={scaleIn} className="flex flex-col items-center gap-3">
            <AvatarGroup avatars={[{ src: TEAM.ronald, alt: "Ronald Goh", label: "Ronald Goh" }, { src: TEAM.jayne, alt: "Jayne Ong", label: "Jayne Ong" }]} maxVisible={2} size={76} overlap={18} activeIndex={activeAvatar} />
            <div className="min-h-[1.25rem] text-center">
              <AnimatePresence mode="wait">
                <motion.p key={caption} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, ease }} className="text-[12px] text-[#151515]/70">{caption}</motion.p>
              </AnimatePresence>
            </div>
            <Pill href="https://www.dtrax.com.sg" solid>Talk to us <ArrowUpRight className="h-3 w-3" /></Pill>
          </motion.div>
          <motion.div variants={fadeUp} className="flex items-center justify-end gap-6">
            <img src={asset("/logo/dtrax-logo.png")} alt="D'trax logo" className="h-auto w-[6rem] object-contain" />
            <RotatingBadge text="IMAGINE · DESIGN · INSPIRE · " size={104} />
          </motion.div>
        </div>
      </div>
    </Sheet>
  );
}

/* ────────────────────────────────────────────────────────────────
   Deck
   ──────────────────────────────────────────────────────────────── */

const slide = (id: string, content: ReactNode): PresentationSlide => ({ id, content });

const slides: PresentationSlide[] = [
  slide("cover", <CoverSlide />),
  slide("about", <AboutSlide />),
  slide("pillars", <PillarsSlide />),
  slide("markets", <MarketsSlide />),
  slide("services", <ServicesSlide />),
  slide("approach", <ApproachSlide />),
  slide("reality-capture", <RealityCaptureSlide />),
  slide("team", <TeamSlide />),
  slide("org-chart", <OrgChartSlide />),
  slide("founders", <FoundersSlide />),
  slide("leaders", <LeadersSlide />),
  slide("track-record", <TrackRecordSlide />),
  slide("recent-projects", <RecentProjectsSlide />),
  ...projects.map((project, index) => {
    const variants: ProjectVariant[] = ["full", "split", "band", "split", "full", "split", "band", "split"];
    return slide(`project-${index + 1}`, <ProjectSlide project={project} index={index + 1} variant={variants[index]} reverse={index % 4 === 3} />);
  }),
  slide("testimonials", <TestimonialsSlide />),
  slide("certifications", <CertificationsSlide />),
  slide("closing", <ClosingSlide />),
];

export default function DtraxCompanyProfilePresentation() {
  return <SlideShell slides={slides} title="D'trax · Company Profile" logoRange={[1, slides.length - 2]} logoHidden={[3, 11]} />;
}
