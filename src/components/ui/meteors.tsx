"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Meteor { left: number; delay: number; duration: number }

/** Aceternity Meteors, tinted for light or ink surfaces. Positions are generated on the client only. */
export function Meteors({ number = 12, className, color = "#151515" }: { number?: number; className?: string; color?: string }) {
  const [meteors, setMeteors] = useState<Meteor[]>([]);
  useEffect(() => {
    setMeteors(
      Array.from({ length: number }, (_, index) => ({
        left: index * (100 / number) + Math.random() * 6,
        delay: Math.random() * 6,
        duration: Math.floor(Math.random() * 6 + 6),
      }))
    );
  }, [number]);
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {meteors.map((meteor, index) => (
        <span
          key={index}
          className="animate-meteor absolute top-[-10%] h-0.5 w-0.5 rotate-[215deg] rounded-full"
          style={{ left: `${meteor.left}%`, background: color, boxShadow: `0 0 0 1px ${color}1a`, animationDelay: `${meteor.delay}s`, animationDuration: `${meteor.duration}s` }}
        >
          <span className="absolute top-1/2 h-px w-[70px] -translate-y-1/2" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
        </span>
      ))}
    </div>
  );
}
