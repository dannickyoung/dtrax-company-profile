"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Aceternity Card Hover Effect: a shared pastel backdrop glides between items. */
export function HoverEffect({
  items,
  activeIndex,
  onActiveChange,
  className,
  backdropClassName,
}: {
  items: { key: string; content: ReactNode }[];
  activeIndex?: number | null;
  onActiveChange?: (index: number | null) => void;
  className?: string;
  backdropClassName?: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const current = hovered ?? activeIndex ?? null;

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3", className)}>
      {items.map((item, index) => (
        <div
          key={item.key}
          className="group relative block h-full w-full p-2"
          onMouseEnter={() => {
            setHovered(index);
            onActiveChange?.(index);
          }}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {current === index && (
              <motion.span
                layoutId="hover-effect-backdrop"
                className={cn("absolute inset-0 block rounded-[2rem]", backdropClassName ?? "bg-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.10)] backdrop-blur-xl")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.15 } }}
              />
            )}
          </AnimatePresence>
          <div className="relative z-10 h-full">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
