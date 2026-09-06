"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Aceternity Flip Words: rotates through words, letters blurring in and sweeping out. */
export function FlipWords({ words, duration = 3000, className }: { words: string[]; duration?: number; className?: string }) {
  const [current, setCurrent] = useState(words[0]);
  const [animating, setAnimating] = useState(false);

  const advance = useCallback(() => {
    const next = words[(words.indexOf(current) + 1) % words.length];
    setCurrent(next);
    setAnimating(true);
  }, [current, words]);

  useEffect(() => {
    if (animating) return;
    const timer = window.setTimeout(advance, duration);
    return () => window.clearTimeout(timer);
  }, [animating, advance, duration]);

  return (
    <AnimatePresence onExitComplete={() => setAnimating(false)}>
      <motion.span
        key={current}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30, x: 30, filter: "blur(8px)", scale: 1.6, position: "absolute" }}
        transition={{ type: "spring", stiffness: 100, damping: 12 }}
        className={cn("relative z-10 inline-block", className)}
      >
        {current.split(" ").map((word, wordIndex) => (
          <motion.span
            key={`${word}-${wordIndex}`}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: wordIndex * 0.3, duration: 0.3 }}
            className="inline-block whitespace-nowrap"
          >
            {word.split("").map((letter, letterIndex) => (
              <motion.span
                key={`${letter}-${letterIndex}`}
                initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: wordIndex * 0.3 + letterIndex * 0.05, duration: 0.2 }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
