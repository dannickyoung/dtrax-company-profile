"use client";

import type { MouseEvent, ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const dot = (fill: string) =>
  `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='16' height='16' fill='none'%3E%3Ccircle fill='${encodeURIComponent(fill)}' cx='10' cy='10' r='2.2'%3E%3C/circle%3E%3C/svg%3E")`;

/** Aceternity Hero Highlight: dot field with a pointer-following lime reveal. */
export function HeroHighlight({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mask = useMotionTemplate`radial-gradient(260px circle at ${mouseX}px ${mouseY}px, black 0%, transparent 100%)`;

  const onMove = ({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div className={cn("group relative flex w-full items-center justify-center", containerClassName)} onMouseMove={onMove}>
      <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: dot("#c9c9c4") }} />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ backgroundImage: dot("#151515"), maskImage: mask, WebkitMaskImage: mask }}
      />
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
}

export function Highlight({ children, className, delay = 0.6 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: "100% 100%" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay }}
      style={{ backgroundRepeat: "no-repeat", backgroundPosition: "left center", display: "inline" }}
      className={cn("relative inline-block rounded-[0.25em] bg-gradient-to-r from-[#DDFF97] to-[#DDFF97] px-[0.22em] font-normal italic tracking-normal text-[#151515]", className)}
    >
      {children}
    </motion.span>
  );
}
