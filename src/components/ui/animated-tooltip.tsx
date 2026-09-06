"use client";

import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const tones = ["bg-[#FFB6B6]", "bg-[#9DD6FF]", "bg-[#DDFF97]"];

/** Aceternity Animated Tooltip: overlapping avatars with a springy name card on hover. */
export function AnimatedTooltip({
  items,
  size = 64,
}: {
  items: { id: number; name: string; designation: string; initials: string }[];
  size?: number;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const x = useMotionValue(0);
  const frame = useRef<number | null>(null);
  const spring = { stiffness: 100, damping: 15 };
  const rotate = useSpring(useTransform(x, [-100, 100], [-30, 30]), spring);
  const translateX = useSpring(useTransform(x, [-100, 100], [-40, 40]), spring);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    if (frame.current) cancelAnimationFrame(frame.current);
    const target = event.currentTarget;
    const offsetX = event.nativeEvent.offsetX;
    frame.current = requestAnimationFrame(() => x.set(offsetX - target.offsetWidth / 2));
  };

  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="group relative -mr-3"
          onMouseEnter={() => setHovered(item.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 12 } }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate, whiteSpace: "nowrap" }}
                className="absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center rounded-xl bg-[#151515] px-4 py-2 text-xs shadow-xl"
              >
                <div className="absolute inset-x-8 -bottom-px z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-[#DDFF97] to-transparent" />
                <div className="absolute -bottom-px left-6 z-30 h-px w-[30%] bg-gradient-to-r from-transparent via-[#9DD6FF] to-transparent" />
                <p className="relative z-30 text-sm font-bold text-white">{item.name}</p>
                <p className="text-xs text-white/70">{item.designation}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={onMove}
            style={{ width: size, height: size, fontSize: size * 0.3 }}
            className={cn(
              "relative flex items-center justify-center rounded-full border-[3px] border-[#f4f4f2] font-bold text-[#151515] transition duration-500 group-hover:z-30 group-hover:scale-110",
              tones[index % tones.length]
            )}
          >
            {item.initials}
          </div>
        </div>
      ))}
    </div>
  );
}
