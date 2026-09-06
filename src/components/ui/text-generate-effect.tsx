"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

/** Aceternity Text Generate Effect: words blur in one after another. */
export function TextGenerateEffect({ words, className, duration = 0.5, delay = 0.2 }: { words: string; className?: string; duration?: number; delay?: number }) {
  const [scope, animate] = useAnimate();
  const list = words.split(" ");
  useEffect(() => {
    animate("span", { opacity: 1, filter: "blur(0px)" }, { duration, delay: stagger(0.06, { startDelay: delay }) });
  }, [animate, duration, delay]);
  return (
    <motion.p ref={scope} className={cn("leading-relaxed", className)}>
      {list.map((word, index) => (
        <motion.span key={`${word}-${index}`} className="opacity-0" style={{ filter: "blur(10px)" }}>
          {word}{" "}
        </motion.span>
      ))}
    </motion.p>
  );
}
