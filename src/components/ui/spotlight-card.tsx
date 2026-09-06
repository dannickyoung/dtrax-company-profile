"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  active?: boolean;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(157, 214, 255, 0.45)",
  active = false,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
  };

  const origin = position ? `${position.x}px ${position.y}px` : "28% 18%";
  const visible = hovered || active;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPosition(null);
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow,transform] duration-500",
        visible
          ? "border-black/20 shadow-[0_18px_44px_rgba(0,0,0,0.10)]"
          : "border-black/10 shadow-[0_6px_18px_rgba(0,0,0,0.04)]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(520px circle at ${origin}, ${spotlightColor}, transparent 48%)`,
        }}
      />
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
