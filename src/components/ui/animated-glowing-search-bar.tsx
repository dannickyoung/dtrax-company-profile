"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface AnimatedGlowingSearchBarProps {
  text?: string;
  placeholder?: string;
  delayMs?: number;
  stepMs?: number;
  onSequenceComplete?: () => void;
}

export default function AnimatedGlowingSearchBar({
  text = "",
  placeholder = "Search...",
  delayMs = 420,
  stepMs = 130,
  onSequenceComplete,
}: AnimatedGlowingSearchBarProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [iconPressed, setIconPressed] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (hasCompletedRef.current) return;

    setVisibleCount(0);
    setIconPressed(false);
    let timeout: number | undefined;

    const tick = (nextCount: number) => {
      setVisibleCount(nextCount);

      if (nextCount >= text.length) {
        timeout = window.setTimeout(() => {
          setIconPressed(true);
          timeout = window.setTimeout(() => {
            hasCompletedRef.current = true;
            onSequenceComplete?.();
          }, 1100);
        }, 600);
        return;
      }

      timeout = window.setTimeout(() => tick(nextCount + 1), stepMs);
    };

    const start = window.setTimeout(() => tick(1), delayMs);

    return () => {
      window.clearTimeout(start);
      if (timeout) {
        window.clearTimeout(timeout);
      }
    };
  }, [delayMs, onSequenceComplete, stepMs, text]);

  const typedText = text.slice(0, visibleCount);

  return (
    <div className="relative mx-auto flex w-full max-w-[27rem] items-center justify-center">
      <div className="relative flex w-full items-center justify-center">
        <div className="absolute inset-0 rounded-[1.75rem] border border-[#9DD6FF] shadow-[0_0_20px_rgba(157,214,255,0.35),0_0_52px_rgba(157,214,255,0.22)]" />
        <div className="absolute inset-[1px] rounded-[1.65rem] bg-white/90 backdrop-blur-2xl" />
        <div
          className="absolute inset-[2px] rounded-[1.55rem] opacity-90"
          style={{
            background:
              "radial-gradient(circle at left center, rgba(255,182,182,0.22), transparent 24%), radial-gradient(circle at right center, rgba(157,214,255,0.20), transparent 22%)",
          }}
        />

        <div className="relative flex h-[5.6rem] w-full items-center rounded-[1.75rem] border border-black/10 bg-white/85 px-7 shadow-[0_0_56px_rgba(157,214,255,0.18)]">
          <div className="relative flex-1 pr-12">
            <div
              aria-label={placeholder}
              className="flex h-full min-h-[5.6rem] items-center overflow-hidden text-[1.65rem] font-medium tracking-[0.01em] text-neutral-900"
            >
              <span className="inline-flex items-center whitespace-nowrap">
                <span>{typedText}</span>
                <span
                  aria-hidden="true"
                  className="ml-1 inline-block h-8 w-[2px] animate-pulse bg-neutral-900"
                />
              </span>
              {typedText.length === 0 && (
                <span className="absolute left-0 text-black/35">{placeholder}</span>
              )}
            </div>
          </div>

          <motion.div
            animate={
              iconPressed
                ? {
                    scale: [1, 0.82, 1.08, 1],
                    y: [0, 3, -1, 0],
                    opacity: [1, 0.9, 1, 1],
                    backgroundColor: [
                      "rgba(221, 255, 151, 0.5)",
                      "rgba(221, 255, 151, 1)",
                      "rgba(221, 255, 151, 0.8)",
                    ],
                    borderColor: [
                      "rgba(21, 21, 21, 0.12)",
                      "rgba(21, 21, 21, 0.35)",
                      "rgba(21, 21, 21, 0.18)",
                    ],
                  }
                : {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    backgroundColor: "rgba(221, 255, 151, 0.5)",
                    borderColor: "rgba(21, 21, 21, 0.12)",
                  }
            }
            transition={{ duration: 0.7, times: [0, 0.3, 0.7, 1], ease: [0.22, 1, 0.36, 1] }}
            className="ml-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-[1rem] border border-black/10 bg-[#DDFF97] shadow-[0_0_22px_rgba(221,255,151,0.5)]"
          >
            <Search className="h-6 w-6 text-[#151515]" strokeWidth={1.8} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
