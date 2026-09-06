"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease } },
};

/* ─── Title Slide ─── */

export function TitleSlide({
  title,
  subtitle,
  accent,
  accentClassName,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  accent?: string;
  accentClassName?: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center w-full h-full px-8"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {accent && (
        <motion.span
          variants={fadeUp}
          className={`${accentClassName || "text-[#151515]/55"} text-sm font-medium tracking-[0.2em] uppercase mb-6`}
        >
          {accent}
        </motion.span>
      )}
      <motion.h1
        variants={fadeUp}
        className="text-5xl sm:text-6xl md:text-8xl font-bold text-text-primary leading-[0.95] tracking-tight"
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.div
          variants={fadeUp}
          className="text-lg sm:text-xl text-text-secondary mt-6 max-w-md"
        >
          {subtitle}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Section Slide ─── */

export function SectionSlide({
  label,
  title,
  number,
}: {
  label?: string;
  title: ReactNode;
  number?: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-start justify-center w-full h-full px-8 sm:px-16 md:px-24 max-w-5xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {number && (
        <motion.span
          variants={fadeUp}
          className="text-[120px] sm:text-[160px] font-black text-black/[0.05] leading-none absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        >
          {number}
        </motion.span>
      )}
      {label && (
        <motion.span
          variants={fadeUp}
          className="text-[#151515]/55 text-xs font-medium tracking-[0.2em] uppercase mb-4"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="text-4xl sm:text-5xl md:text-7xl font-bold text-text-primary leading-[1.05] tracking-tight"
      >
        {title}
      </motion.h2>
    </motion.div>
  );
}

/* ─── Bento Slide ─── */

export function BentoSlide({
  title,
  label,
  children,
  cols,
}: {
  title: ReactNode;
  label?: string;
  children: ReactNode;
  cols?: number;
}) {
  return (
    <motion.div
      className="flex flex-col justify-center w-full min-h-full px-6 sm:px-12 md:px-20 py-12 max-w-6xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="mb-8">
        {label && (
          <motion.span
            variants={fadeUp}
            className="text-[#151515]/55 text-xs font-medium tracking-[0.2em] uppercase block mb-2"
          >
            {label}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[0.94]"
        >
          {title}
        </motion.h2>
      </div>
      <motion.div
        variants={stagger}
        className="grid gap-3 sm:gap-4"
        style={{ gridTemplateColumns: `repeat(${cols || 2}, 1fr)` }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Bento Card ─── */

export function BentoCard({
  icon,
  title,
  description,
  span = 1,
  accent = false,
  accentClassName,
  accentIconClassName,
  accentTitleClassName,
  accentDescriptionClassName,
  image,
  video,
  compactImage = false,
}: {
  icon: ReactNode;
  title?: ReactNode;
  description: ReactNode;
  span?: 1 | 2;
  accent?: boolean;
  accentClassName?: string;
  accentIconClassName?: string;
  accentTitleClassName?: string;
  accentDescriptionClassName?: string;
  image?: string;
  video?: string;
  compactImage?: boolean;
}) {
  const accentStyles = accentClassName || "bg-neon-cyan/[0.08] border-neon-cyan/25";
  const accentIconStyles = accentIconClassName || (accentClassName
    ? "bg-white/60 text-[#151515]"
    : "bg-neon-cyan/15 text-neon-cyan");
  const accentTitleStyles = accentTitleClassName || (accentClassName ? "text-[#151515]" : "text-neon-cyan");
  const accentDescriptionStyles = accentDescriptionClassName || (accentClassName
    ? "text-[#151515]/75"
    : "text-text-secondary");

  return (
    <motion.div
      variants={scaleIn}
      className={`
        rounded-2xl border overflow-hidden flex flex-col flex-1 h-full
        ${span === 2 ? "col-span-2" : "col-span-2 sm:col-span-1"}
        ${
          accent
            ? accentStyles
            : "bg-surface-raised border-wire-subtle"
        }
      `}
    >
      {video && (
        <div className="w-full">
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
          />
        </div>
      )}
      {image && !video && (
        <div className={`w-full ${compactImage ? "max-h-36 overflow-hidden" : ""}`}>
          <img
            src={image}
            alt={typeof title === "string" ? title : ""}
            className={compactImage ? "w-full h-full object-cover" : "w-full h-auto"}
          />
        </div>
      )}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              accent
                ? accentIconStyles
                : "bg-black/[0.04] text-text-muted"
            }`}
          >
            {icon}
          </div>
          {title && (
            <p
              className={`text-sm font-semibold ${
                accent ? accentTitleStyles : "text-text-primary"
              }`}
            >
              {title}
            </p>
          )}
        </div>
        <p
          className={`text-sm leading-relaxed ${
            accent ? accentDescriptionStyles : "text-text-secondary"
          }`}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Video Slide (large video center, talking points bottom) ─── */

export function VideoSlide({
  title,
  label,
  video,
  poster,
  children,
}: {
  title: string;
  label?: string;
  video: string;
  poster?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col justify-center w-full min-h-full px-6 sm:px-12 md:px-20 py-12 max-w-6xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        {label && (
          <motion.span
            variants={fadeUp}
            className="text-[#151515]/55 text-xs font-medium tracking-[0.2em] uppercase block mb-2"
          >
            {label}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight"
        >
          {title}
        </motion.h2>
      </div>

      <motion.div variants={scaleIn} className="w-full aspect-video rounded-2xl border border-wire-subtle overflow-hidden bg-black mb-6">
        <video
          src={video}
          poster={poster}
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-2 gap-3 sm:gap-4">
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Image Slide (large hero image, talking points bottom) ─── */

export function ImageSlide({
  title,
  label,
  image,
  alt,
  children,
}: {
  title: string;
  label?: string;
  image: string;
  alt?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col justify-center w-full min-h-full px-6 sm:px-12 md:px-20 py-12 max-w-6xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="mb-6">
        {label && (
          <motion.span
            variants={fadeUp}
            className="text-[#151515]/55 text-xs font-medium tracking-[0.2em] uppercase block mb-2"
          >
            {label}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight"
        >
          {title}
        </motion.h2>
      </div>

      <motion.div variants={scaleIn} className="w-full rounded-2xl border border-wire-subtle overflow-hidden bg-surface-base mb-6">
        <img src={image} alt={alt || title} className="w-full h-auto" />
      </motion.div>

      <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ─── Split Slide (two-column: content left, image right) ─── */

export function SplitSlide({
  title,
  label,
  image,
  children,
}: {
  title: string;
  label?: string;
  image: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col justify-center w-full min-h-full px-6 sm:px-12 md:px-20 py-12 max-w-6xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="mb-8">
        {label && (
          <motion.span
            variants={fadeUp}
            className="text-[#151515]/55 text-xs font-medium tracking-[0.2em] uppercase block mb-2"
          >
            {label}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight"
        >
          {title}
        </motion.h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <motion.div variants={stagger} className="flex flex-col gap-3 sm:gap-4">
          {children}
        </motion.div>
        <motion.div
          variants={scaleIn}
          className="rounded-2xl border border-wire-subtle overflow-hidden"
        >
          <img src={image} alt={title} className="w-full h-auto" />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Inline helpers ─── */

export function Bold({ children }: { children: ReactNode }) {
  return <span className="text-text-primary font-semibold">{children}</span>;
}

export function Accent({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[0.25em] bg-[#FFB6B6]/70 box-decoration-clone px-[0.22em] text-[#151515] font-semibold">
      {children}
    </span>
  );
}

export function Keyword({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-[0.25em] bg-[#DDFF97] box-decoration-clone px-[0.22em] text-[#151515] italic font-light"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {children}
    </span>
  );
}

export function KeywordWarm({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-[0.25em] bg-[#9DD6FF]/70 box-decoration-clone px-[0.22em] text-[#151515] italic font-light"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
    >
      {children}
    </span>
  );
}

export function AccentWarm({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[0.25em] bg-[#9DD6FF]/70 box-decoration-clone px-[0.22em] text-[#151515] font-semibold">
      {children}
    </span>
  );
}

/* ─── Video Grid Slide (hero 16:9 + grid of 1:1 videos) ─── */

export function VideoGridSlide({
  title,
  label,
  heroVideo,
  videos,
}: {
  title: string;
  label?: string;
  heroVideo?: string;
  videos: string[];
}) {
  const cols = videos.length <= 4 ? 2 : videos.length <= 6 ? 3 : 3;

  return (
    <motion.div
      className="flex flex-col justify-center w-full min-h-full px-6 sm:px-12 md:px-20 py-10 max-w-6xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <div className="mb-5">
        {label && (
          <motion.span
            variants={fadeUp}
            className="text-neon-cyan text-xs font-medium tracking-[0.2em] uppercase block mb-2"
          >
            {label}
          </motion.span>
        )}
        <motion.h2
          variants={fadeUp}
          className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight"
        >
          {title}
        </motion.h2>
      </div>

      {heroVideo && (
        <motion.div
          variants={scaleIn}
          className="relative w-full aspect-video rounded-2xl overflow-hidden border border-wire-subtle bg-black mb-4"
        >
          <video
            src={heroVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      )}

      <motion.div
        variants={stagger}
        className="grid gap-2 sm:gap-3"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {videos.map((src, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className="relative aspect-square rounded-xl overflow-hidden border border-wire-subtle bg-black"
          >
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── Quote Slide ─── */

export function QuoteSlide({
  quote,
  attribution,
}: {
  quote: string;
  attribution?: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center w-full h-full px-8 sm:px-16 max-w-3xl mx-auto"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      <motion.span
        variants={scaleIn}
        className="text-neon-cyan text-6xl mb-6 leading-none"
      >
        &ldquo;
      </motion.span>
      <motion.blockquote
        variants={fadeUp}
        className="text-2xl sm:text-3xl md:text-4xl text-text-primary leading-relaxed font-light italic"
      >
        {quote}
      </motion.blockquote>
      {attribution && (
        <motion.p variants={fadeUp} className="text-text-muted text-base mt-8">
          — {attribution}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Logo Wall Slide ─── */

export function LogoWallSlide({
  title,
  label,
  logos,
  footnote,
}: {
  title: string;
  label?: string;
  logos: { src: string; alt: string; dark?: boolean }[];
  footnote?: ReactNode;
}) {
  const cols = logos.length <= 4 ? 2 : logos.length <= 6 ? 3 : 4;

  return (
    <motion.div
      className="flex flex-col items-center justify-center w-full h-full px-6 sm:px-10"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {label && (
        <motion.span
          variants={fadeUp}
          className="text-[#151515]/55 text-xs font-medium tracking-[0.2em] uppercase mb-4"
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 text-center"
      >
        {title}
      </motion.h2>
      <motion.div
        variants={stagger}
        className="grid gap-4 sm:gap-5 w-full max-w-3xl"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {logos.map((logo, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className={`flex items-center justify-center border border-wire-subtle rounded-2xl p-5 aspect-[3/2] ${logo.dark ? "bg-black" : "bg-white"}`}
          >
            <img
              src={logo.src}
              alt={logo.alt}
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        ))}
      </motion.div>
      {footnote && (
        <motion.p
          variants={fadeUp}
          className="text-text-muted text-sm mt-6 text-center"
        >
          {footnote}
        </motion.p>
      )}
    </motion.div>
  );
}
