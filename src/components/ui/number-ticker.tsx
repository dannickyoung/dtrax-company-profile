"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  startValue?: number;
  delay?: number;
  duration?: number;
  className?: string;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  grouping?: boolean;
}

export function NumberTicker({
  value,
  startValue = 0,
  delay = 0,
  duration = 1.6,
  className,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  grouping = true,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const format = (latest: number) =>
      `${prefix}${Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
        useGrouping: grouping,
      }).format(Number(latest.toFixed(decimalPlaces)))}${suffix}`;

    const controls = animate(startValue, value, {
      delay,
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        if (ref.current) ref.current.textContent = format(latest);
      },
    });
    return () => controls.stop();
  }, [isInView, startValue, value, delay, duration, decimalPlaces, prefix, suffix, grouping]);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums tracking-tight", className)}>
      {prefix}
      {startValue}
      {suffix}
    </span>
  );
}
