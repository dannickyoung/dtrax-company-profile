"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Aceternity Compare: before/after slider with autoplay. Accepts any React content for each side. */
export function Compare({
  first,
  second,
  className,
  initial = 50,
  autoplay = true,
  autoplayDuration = 5000,
}: {
  first: ReactNode;
  second: ReactNode;
  className?: string;
  initial?: number;
  autoplay?: boolean;
  autoplayDuration?: number;
}) {
  const [percent, setPercent] = useState(initial);
  const [hovering, setHovering] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!autoplay || hovering) return;
    const start = performance.now();
    const loop = (now: number) => {
      const progress = ((now - start) % (autoplayDuration * 2)) / autoplayDuration;
      const eased = progress <= 1 ? progress : 2 - progress;
      setPercent(8 + (0.5 - 0.5 * Math.cos(eased * Math.PI)) * 84);
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [autoplay, autoplayDuration, hovering]);

  const onMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPercent(Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)));
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative h-full w-full cursor-col-resize select-none overflow-hidden rounded-[1.75rem]", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onMouseMove={onMove}
    >
      <div className="absolute inset-0 z-[19]">{second}</div>
      <div className="absolute inset-0 z-20" style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}>
        {first}
      </div>
      <div className="absolute top-0 z-40 h-full w-px bg-gradient-to-b from-transparent via-[#151515] to-transparent" style={{ left: `${percent}%` }}>
        <div className="absolute left-0 top-1/2 h-full w-36 -translate-y-1/2 bg-gradient-to-r from-[#DDFF97]/70 via-transparent to-transparent opacity-80 [mask-image:radial-gradient(120px_at_left,white,transparent)]" />
        <div className="absolute -right-4 top-1/2 flex h-9 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#151515] text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
          <GripVertical className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
