"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Star { id: number; x: number; y: number; angle: number; scale: number; speed: number; distance: number }

/** Aceternity Shooting Stars: a streak crosses the panel every few seconds. Sized to its container. */
export function ShootingStars({
  minSpeed = 8,
  maxSpeed = 22,
  minDelay = 900,
  maxDelay = 3200,
  starColor = "#DDFF97",
  trailColor = "#9DD6FF",
  starWidth = 14,
  starHeight = 1.5,
  className,
}: {
  minSpeed?: number; maxSpeed?: number; minDelay?: number; maxDelay?: number;
  starColor?: string; trailColor?: string; starWidth?: number; starHeight?: number; className?: string;
}) {
  const [star, setStar] = useState<Star | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradientId = `shooting-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let timer: number;
    const create = () => {
      const box = svgRef.current?.getBoundingClientRect();
      const width = box?.width ?? 800;
      const height = box?.height ?? 500;
      const side = Math.floor(Math.random() * 4);
      const offset = Math.random();
      const startPoints = [
        { x: offset * width, y: 0, angle: 45 },
        { x: width, y: offset * height, angle: 135 },
        { x: offset * width, y: height, angle: 225 },
        { x: 0, y: offset * height, angle: 315 },
      ];
      setStar({ id: Date.now(), ...startPoints[side], scale: 1, speed: Math.random() * (maxSpeed - minSpeed) + minSpeed, distance: 0 });
      timer = window.setTimeout(create, Math.random() * (maxDelay - minDelay) + minDelay);
    };
    create();
    return () => window.clearTimeout(timer);
  }, [minSpeed, maxSpeed, minDelay, maxDelay]);

  useEffect(() => {
    if (!star) return;
    const frame = requestAnimationFrame(() => {
      const box = svgRef.current?.getBoundingClientRect();
      const width = box?.width ?? 800;
      const height = box?.height ?? 500;
      setStar((previous) => {
        if (!previous) return null;
        const x = previous.x + previous.speed * Math.cos((previous.angle * Math.PI) / 180);
        const y = previous.y + previous.speed * Math.sin((previous.angle * Math.PI) / 180);
        const distance = previous.distance + previous.speed;
        if (x < -40 || x > width + 40 || y < -40 || y > height + 40) return null;
        return { ...previous, x, y, distance, scale: 1 + distance / 100 };
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [star]);

  return (
    <svg ref={svgRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      {star && (
        <rect
          x={star.x}
          y={star.y}
          width={starWidth * star.scale}
          height={starHeight}
          fill={`url(#${gradientId})`}
          transform={`rotate(${star.angle}, ${star.x + (starWidth * star.scale) / 2}, ${star.y + starHeight / 2})`}
        />
      )}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: trailColor, stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: starColor, stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
