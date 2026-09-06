"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  summary: string;
  details?: ReactNode;
}

interface TimelineStepperProps {
  steps: TimelineStep[];
  intervalMs?: number;
  className?: string;
}

const tones = ["#FFB6B6", "#9DD6FF", "#DDFF97"];

export function TimelineStepper({
  steps,
  intervalMs = 3600,
  className,
}: TimelineStepperProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % steps.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, intervalMs, steps.length]);

  const progress = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 100;
  const current = steps[active];
  const tone = tones[active % tones.length];

  return (
    <div
      className={cn("flex w-full flex-col gap-8", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative px-6">
        <div className="absolute left-6 right-6 top-[1.35rem] h-[2px] -translate-y-1/2 rounded-full bg-black/10" />
        <motion.div
          className="absolute left-6 top-[1.35rem] h-[2px] -translate-y-1/2 rounded-full bg-[#151515]"
          animate={{ width: `calc((100% - 3rem) * ${progress / 100})` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <ol className="relative grid" style={{ gridTemplateColumns: `repeat(${steps.length}, 1fr)` }}>
          {steps.map((step, index) => {
            const isActive = index === active;
            const isDone = index < active;
            return (
              <li key={step.title} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                  className="group flex flex-col items-center gap-3"
                >
                  <motion.span
                    animate={{
                      scale: isActive ? 1.12 : 1,
                      backgroundColor: isActive || isDone ? "#151515" : "#ffffff",
                      color: isActive || isDone ? "#ffffff" : "#151515",
                      boxShadow: isActive
                        ? `0 0 0 6px ${tone}`
                        : "0 0 0 0px rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-sm font-semibold tabular-nums"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </motion.span>
                  <span
                    className={cn(
                      "max-w-[9rem] text-center text-xs font-semibold leading-snug transition-colors sm:text-sm",
                      isActive ? "text-[#151515]" : "text-[#151515]/50 group-hover:text-[#151515]/80"
                    )}
                  >
                    {step.title}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative min-h-[11rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-6 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
          >
            <div className="flex flex-col gap-2">
              <span
                className="w-max rounded-full px-3 py-1 text-2xs font-semibold uppercase tracking-[0.2em] text-[#151515]"
                style={{ backgroundColor: tone }}
              >
                Stage {String(active + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}
              </span>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-[#151515] sm:text-3xl">
                {current.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#151515]/70 sm:text-base">
                {current.summary}
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 text-sm leading-relaxed text-[#151515]/80">
              {current.details}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
