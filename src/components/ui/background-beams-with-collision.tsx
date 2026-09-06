"use client";

import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const beams = [
  { initialX: 10, translateX: 10, duration: 7, repeatDelay: 3, delay: 2 },
  { initialX: 600, translateX: 600, duration: 3, repeatDelay: 3, delay: 4 },
  { initialX: 100, translateX: 100, duration: 7, repeatDelay: 7, className: "h-6" },
  { initialX: 400, translateX: 400, duration: 5, repeatDelay: 14, delay: 4 },
  { initialX: 800, translateX: 800, duration: 11, repeatDelay: 2, className: "h-20" },
  { initialX: 1000, translateX: 1000, duration: 4, repeatDelay: 2, className: "h-12" },
  { initialX: 1200, translateX: 1200, duration: 6, repeatDelay: 4, delay: 2, className: "h-6" },
];

/** Aceternity Background Beams With Collision: ink beams fall and burst into pastel sparks on the floor. */
export function BackgroundBeamsWithCollision({ children, className }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={parentRef} className={cn("relative flex w-full items-center justify-center overflow-hidden", className)}>
      {beams.map((beam) => (
        <CollisionMechanism key={`${beam.initialX}-beam`} beamOptions={beam} containerRef={containerRef} parentRef={parentRef} />
      ))}
      {children}
      <div ref={containerRef} className="pointer-events-none absolute inset-x-0 bottom-0 h-px w-full bg-[#151515]/20" />
    </div>
  );
}

const CollisionMechanism = forwardRef<
  HTMLDivElement,
  {
    containerRef: RefObject<HTMLDivElement | null>;
    parentRef: RefObject<HTMLDivElement | null>;
    beamOptions: { initialX?: number; translateX?: number; initialY?: number; translateY?: number; rotate?: number; className?: string; duration?: number; delay?: number; repeatDelay?: number };
  }
>(({ parentRef, containerRef, beamOptions }, _ref) => {
  const beamRef = useRef<HTMLDivElement>(null);
  const [collision, setCollision] = useState<{ detected: boolean; coordinates: { x: number; y: number } | null }>({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleDetected, setCycleDetected] = useState(false);

  useEffect(() => {
    const check = () => {
      if (!beamRef.current || !containerRef.current || !parentRef.current || cycleDetected) return;
      const beamRect = beamRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const parentRect = parentRef.current.getBoundingClientRect();
      if (beamRect.bottom >= containerRect.top) {
        setCollision({ detected: true, coordinates: { x: beamRect.left - parentRect.left + beamRect.width / 2, y: beamRect.bottom - parentRect.top } });
        setCycleDetected(true);
      }
    };
    const interval = window.setInterval(check, 50);
    return () => window.clearInterval(interval);
  }, [cycleDetected, containerRef, parentRef]);

  useEffect(() => {
    if (!collision.detected || !collision.coordinates) return;
    const reset = window.setTimeout(() => {
      setCollision({ detected: false, coordinates: null });
      setCycleDetected(false);
      setBeamKey((key) => key + 1);
    }, 2000);
    return () => window.clearTimeout(reset);
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{ translateY: beamOptions.initialY ?? "-200px", translateX: beamOptions.initialX ?? "0px", rotate: beamOptions.rotate ?? 0 }}
        variants={{ animate: { translateY: beamOptions.translateY ?? "1800px", translateX: beamOptions.translateX ?? "0px", rotate: beamOptions.rotate ?? 0 } }}
        transition={{ duration: beamOptions.duration ?? 8, repeat: Infinity, repeatType: "loop", ease: "linear", delay: beamOptions.delay ?? 0, repeatDelay: beamOptions.repeatDelay ?? 0 }}
        className={cn("absolute left-0 top-20 m-auto h-14 w-px rounded-full bg-gradient-to-t from-[#151515] via-[#151515]/60 to-transparent", beamOptions.className)}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion key={`${collision.coordinates.x}-${collision.coordinates.y}`} style={{ left: `${collision.coordinates.x}px`, top: `${collision.coordinates.y}px`, transform: "translate(-50%, -50%)" }} />
        )}
      </AnimatePresence>
    </>
  );
});
CollisionMechanism.displayName = "CollisionMechanism";

const sparkColors = ["#FFB6B6", "#9DD6FF", "#DDFF97"];

function Explosion({ style }: { style: CSSProperties }) {
  const spans = Array.from({ length: 20 }, (_, index) => ({
    id: index,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
    color: sparkColors[index % sparkColors.length],
  }));
  return (
    <div style={style} className="absolute z-50 h-2 w-2">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-[#151515] to-transparent blur-sm" />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{ background: span.color }}
        />
      ))}
    </div>
  );
}
