"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Drifting pastel blobs in the brand palette. Absolutely positioned; parent must be relative. */
export function Aurora({
  className,
  intensity = 1,
  dark = false,
}: {
  className?: string;
  intensity?: number;
  dark?: boolean;
}) {
  const blobs = [
    { color: "#FFB6B6", x: ["-10%", "20%", "-5%"], y: ["-10%", "15%", "-10%"], size: 46, delay: 0 },
    { color: "#9DD6FF", x: ["60%", "35%", "65%"], y: ["-20%", "10%", "-15%"], size: 52, delay: 2 },
    { color: "#DDFF97", x: ["30%", "55%", "25%"], y: ["55%", "35%", "60%"], size: 44, delay: 4 },
  ];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={cn("absolute rounded-full blur-3xl", dark ? "mix-blend-screen" : "mix-blend-multiply")}
          style={{
            width: `${blob.size}rem`,
            height: `${blob.size}rem`,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 65%)`,
            opacity: (dark ? 0.35 : 0.55) * intensity,
          }}
          animate={{ left: blob.x, top: blob.y, scale: [1, 1.15, 1] }}
          transition={{ duration: 18 + index * 3, ease: "easeInOut", repeat: Infinity, delay: blob.delay }}
        />
      ))}
    </div>
  );
}
