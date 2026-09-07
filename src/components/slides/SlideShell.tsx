"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { PresentationSlide } from "@/types";
import { BASE, asset } from "@/lib/base-path";

interface SlideShellProps {
  slides: Array<ReactNode | PresentationSlide>;
  title?: string;
  /** Zero-based inclusive range of slide indexes that show the corner logo. */
  logoRange?: [number, number];
  /** Zero-based slide indexes that never show the corner logo (dark full-bleed slides). */
  logoHidden?: number[];
}

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 40 : -40,
    scale: 0.98,
  }),
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -40 : 40,
    scale: 0.98,
  }),
};

export function SlideShell({ slides, title, logoRange = [1, 10], logoHidden = [] }: SlideShellProps) {
  const normalizedSlides = slides.map((slide, index) =>
    isPresentationSlide(slide)
      ? slide
      : {
          id: `slide-${index + 1}`,
          content: slide,
        }
  );
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isInteractiveOpen, setIsInteractiveOpen] = useState(false);
  const total = normalizedSlides.length;
  const currentSlide = normalizedSlides[current];
  const interactiveElement = currentSlide?.interactive;

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= total) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
      setHasNavigated(true);
      setIsInteractiveOpen(false);
    },
    [current, total]
  );

  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Deep-link support: /present/<slug>/#7 opens slide 7 (1-based).
  useEffect(() => {
    const fromHash = Number.parseInt(window.location.hash.replace("#", ""), 10);
    if (Number.isFinite(fromHash) && fromHash >= 1 && fromHash <= total) {
      setCurrent(fromHash - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${current + 1}`);
  }, [current]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (isTypingTarget) return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Escape") {
        window.location.href = `${BASE}/`;
      }
      if (e.key === "f") {
        document.documentElement.requestFullscreen?.();
      }
      if (e.key.toLowerCase() === "i" && interactiveElement) {
        e.preventDefault();
        setIsInteractiveOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [interactiveElement, next, prev]);

  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const onStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
        dx < 0 ? next() : prev();
      }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [next, prev]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    window.addEventListener("mousemove", resetTimer);
    resetTimer();
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      clearTimeout(timeout);
    };
  }, []);

  const progress = ((current + 1) / total) * 100;

  return (
    <div className="fixed inset-0 bg-surface-deepest overflow-hidden select-none">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(rgba(0,0,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.015) 1px, transparent 1px)",
          backgroundSize: "96px 96px, 96px 96px, 24px 24px, 24px 24px",
          backgroundPosition: "center center",
        }}
      />

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-wire-subtle/30">
        <motion.div
          className="h-full bg-neon-cyan"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Back + slide counter (auto-hide) */}
      <motion.div
        className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none"
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <a
          href={`${BASE}/`}
          className="pointer-events-auto flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{title || "Back"}</span>
        </a>
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="text-text-muted text-sm font-mono">
            {current + 1} / {total}
          </span>
        </div>
      </motion.div>

      {current >= logoRange[0] && current <= logoRange[1] && !logoHidden.includes(current) ? (
        <div className="pointer-events-none absolute bottom-12 left-12 z-20">
          <img
            src={asset("/logo/dtrax-logo.png")}
            alt="D'trax logo"
            className="h-auto w-[5rem] object-contain opacity-95"
          />
        </div>
      ) : null}

      {/* Slide content */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={slideVariants}
          initial={hasNavigated ? "enter" : "center"}
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 overflow-y-auto flex items-start justify-center pt-14 pb-16"
        >
          {currentSlide.content}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {interactiveElement && isInteractiveOpen && (
          <motion.aside
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-4 top-18 bottom-16 z-40 w-[min(32rem,calc(100vw-2rem))] rounded-3xl border border-wire-emphasis bg-surface-base/95 backdrop-blur-md shadow-2xl"
          >
            <div className="flex h-full flex-col overflow-hidden">
              <div className="flex items-start justify-between gap-4 border-b border-wire-subtle px-5 py-4">
                <div>
                  <p className="text-2xs font-medium uppercase tracking-[0.2em] text-neon-cyan">
                    Interactive Slot
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-text-primary">
                    {interactiveElement.title}
                  </h2>
                  {interactiveElement.description && (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                      {interactiveElement.description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsInteractiveOpen(false)}
                  className="rounded-full border border-wire-subtle bg-black/5 p-2 text-text-muted transition-colors hover:text-text-primary"
                  aria-label="Close interactive panel"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-5">
                <InteractiveElementPanel interactive={interactiveElement} />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Nav arrows (auto-hide) */}
      <motion.div
        className="absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-4 pointer-events-none"
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          onClick={prev}
          disabled={current === 0}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center
            text-text-muted hover:text-text-primary hover:bg-black/10 disabled:opacity-0
            transition-all duration-200"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/5 backdrop-blur-sm flex items-center justify-center
            text-text-muted hover:text-text-primary hover:bg-black/10 disabled:opacity-0
            transition-all duration-200"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Dot indicators */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {normalizedSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-1.5 bg-neon-cyan"
                : "w-1.5 h-1.5 bg-black/20 hover:bg-black/35"
            }`}
          />
        ))}
      </motion.div>
    </div>
  );
}

function InteractiveElementPanel({
  interactive,
}: {
  interactive: NonNullable<PresentationSlide["interactive"]>;
}) {
  if (interactive.kind === "custom" && interactive.render) {
    return (
      <div className="rounded-2xl border border-wire-subtle bg-surface-raised p-4">
        {interactive.render}
      </div>
    );
  }

  if (interactive.kind === "iframe" && interactive.src) {
    return (
      <div className="space-y-4">
        <div
          className="overflow-hidden rounded-2xl border border-wire-subtle bg-black"
          style={{ aspectRatio: interactive.aspectRatio || "16 / 10" }}
        >
          <iframe
            src={interactive.src}
            title={interactive.title}
            className="h-full w-full"
            allow="clipboard-read; clipboard-write; fullscreen"
            loading="lazy"
            sandbox={
              interactive.sandbox ||
              "allow-scripts allow-same-origin allow-forms allow-popups"
            }
          />
        </div>
        <p className="text-xs text-text-muted">
          This slide is already configured for an external interactive embed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-64 flex-col justify-between rounded-2xl border border-dashed border-neon-cyan/25 bg-neon-cyan/[0.05] p-5">
      <div>
        <p className="text-sm font-semibold text-text-primary">
          Reserved for future 21st.dev interactive content
        </p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          This panel is wired for each slide already. Later, we can swap this
          placeholder for an iframe embed or a custom React module without
          changing the presentation shell.
        </p>
      </div>
      <div className="rounded-2xl border border-wire-subtle bg-surface-raised p-4">
        <p className="text-2xs uppercase tracking-[0.2em] text-text-muted">
          Suggested next step
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Attach a `src` URL for an embed or pass a `render` node on the slide
          config when your 21st.dev element is ready.
        </p>
      </div>
    </div>
  );
}

function isPresentationSlide(
  slide: ReactNode | PresentationSlide
): slide is PresentationSlide {
  return (
    typeof slide === "object" &&
    slide !== null &&
    "id" in slide &&
    "content" in slide
  );
}
