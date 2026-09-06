"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Aceternity Wobble Card: the panel and its content drift in opposite directions under the pointer. */
export function WobbleCard({
  children,
  containerClassName,
  className,
}: {
  children: ReactNode;
  containerClassName?: string;
  className?: string;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const onMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({
      x: (event.clientX - (rect.left + rect.width / 2)) / 24,
      y: (event.clientY - (rect.top + rect.height / 2)) / 24,
    });
  };

  return (
    <motion.section
      onMouseMove={onMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setPosition({ x: 0, y: 0 });
      }}
      style={{
        transform: hovering ? `translate3d(${position.x}px, ${position.y}px, 0)` : "translate3d(0,0,0)",
        transition: "transform 0.12s ease-out",
      }}
      className={cn("relative mx-auto w-full overflow-hidden rounded-[2.25rem] bg-[#151515]", containerClassName)}
    >
      <div
        className="relative h-full overflow-hidden rounded-[2.25rem] [background-image:radial-gradient(88%_100%_at_top,rgba(255,255,255,0.10),rgba(255,255,255,0))]"
        style={{ boxShadow: "0 24px 80px rgba(21,21,21,0.28), 0 0 0 1px rgba(255,255,255,0.06) inset" }}
      >
        <motion.div
          style={{
            transform: hovering ? `translate3d(${-position.x}px, ${-position.y}px, 0) scale3d(1.02,1.02,1)` : "translate3d(0,0,0) scale3d(1,1,1)",
            transition: "transform 0.12s ease-out",
          }}
          className={cn("h-full", className)}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}
