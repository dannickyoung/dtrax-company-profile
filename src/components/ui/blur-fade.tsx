"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blur?: string;
  inline?: boolean;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.45,
  yOffset = 10,
  blur = "8px",
  inline = false,
}: BlurFadeProps) {
  const Component = inline ? motion.span : motion.div;
  return (
    <Component
      initial={{ y: yOffset, opacity: 0, filter: `blur(${blur})` }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{ delay: 0.04 + delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={inline ? { display: "inline-block" } : undefined}
    >
      {children}
    </Component>
  );
}
