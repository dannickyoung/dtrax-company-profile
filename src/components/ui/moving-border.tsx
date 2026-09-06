"use client";

import { useRef, type ReactNode } from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/** Aceternity Moving Border: a glowing dot travels around the element's rounded rectangle. */
export function MovingBorder({
  children,
  duration = 3000,
  rx = "30%",
  ry = "30%",
}: {
  children: ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
}) {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) progress.set((time * (length / duration)) % length);
  });

  const x = useTransform(progress, (value) => pathRef.current?.getPointAtLength(value).x ?? 0);
  const y = useTransform(progress, (value) => pathRef.current?.getPointAtLength(value).y ?? 0);
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg aria-hidden="true" preserveAspectRatio="none" className="absolute h-full w-full" width="100%" height="100%">
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}>{children}</motion.div>
    </>
  );
}

export function MovingBorderBox({
  children,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  duration = 3200,
  glow = "#DDFF97",
  active = true,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  duration?: number;
  glow?: string;
  active?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-transparent p-[2px]", containerClassName)} style={{ borderRadius }}>
      {active ? (
        <div className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
          <MovingBorder duration={duration} rx="30%" ry="30%">
            <div className="h-24 w-24 opacity-90" style={{ background: `radial-gradient(${glow} 40%, transparent 60%)` }} />
          </MovingBorder>
        </div>
      ) : null}
      <div
        className={cn("relative flex h-full w-full items-center justify-center", className)}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </div>
    </div>
  );
}
