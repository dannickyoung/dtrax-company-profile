"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const colors = ["#FFB6B6", "#9DD6FF", "#DDFF97"];

/** Aceternity Background Boxes: a skewed isometric grid whose cells light up under the pointer. */
function BoxesCore({ className, rows = 28, cols = 40 }: { className?: string; rows?: number; cols?: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ transform: "translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.7) rotate(0deg) translateZ(0)" }}
      className={cn("absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4", className)}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={`row-${i}`} className="relative h-10 w-20 border-l border-[#151515]/10">
          {Array.from({ length: cols }).map((_, j) => (
            <motion.div
              key={`col-${j}`}
              whileHover={{ backgroundColor: colors[(i + j) % colors.length], transition: { duration: 0 } }}
              animate={{ backgroundColor: "rgba(0,0,0,0)", transition: { duration: 2 } }}
              className="relative h-10 w-20 border-r border-t border-[#151515]/10"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="pointer-events-none absolute -left-[22px] -top-[14px] h-6 w-10 text-[#151515]/15">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

export const Boxes = memo(BoxesCore);
