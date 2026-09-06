"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const randomString = (length: number) =>
  Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join("");

/** Aceternity Evervault Card: encrypted-text reveal following the pointer, on an ink surface. */
export function EvervaultCard({
  children,
  className,
  active = false,
  gradient = "linear-gradient(135deg, #FFB6B6, #9DD6FF 50%, #DDFF97)",
}: {
  children: ReactNode;
  className?: string;
  /** Sweeps the reveal across the card on its own, for presentation mode. */
  active?: boolean;
  gradient?: string;
}) {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const [text, setText] = useState("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => setText(randomString(1600)), []);

  useEffect(() => {
    if (!active || hovered) return;
    const tick = window.setInterval(() => setText(randomString(1600)), 180);
    const sweepX = animate(mouseX, [40, 320, 60], { duration: 6, repeat: Infinity, ease: "easeInOut" });
    const sweepY = animate(mouseY, [60, 260, 90], { duration: 5, repeat: Infinity, ease: "easeInOut" });
    return () => {
      window.clearInterval(tick);
      sweepX.stop();
      sweepY.stop();
    };
  }, [active, hovered, mouseX, mouseY]);

  const onMove = ({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
    setText(randomString(1600));
  };

  const mask = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const show = active || hovered;

  return (
    <div
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        if (!active) {
          mouseX.set(-400);
          mouseY.set(-400);
        }
      }}
      className={cn("group/card relative h-full w-full overflow-hidden rounded-[1.75rem] bg-[#151515] text-white", className)}
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: gradient, maskImage: mask, WebkitMaskImage: mask, opacity: show ? 0.75 : 0 }}
        />
        <motion.div
          className="absolute inset-0 mix-blend-overlay transition-opacity duration-500"
          style={{ maskImage: mask, WebkitMaskImage: mask, opacity: show ? 1 : 0 }}
        >
          <p className="absolute inset-x-0 h-full break-words whitespace-pre-wrap font-mono text-[11px] font-bold leading-[1.15] text-white opacity-40">
            {text}
          </p>
        </motion.div>
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
