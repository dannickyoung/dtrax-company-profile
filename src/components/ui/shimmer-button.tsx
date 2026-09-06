"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const brandConic =
  "conic-gradient(from var(--gradient-angle), #FFB6B6, #9DD6FF, #DDFF97, #FFB6B6)";

interface ShimmerButtonProps extends ComponentPropsWithoutRef<"a"> {
  children: ReactNode;
  className?: string;
}

export function ShimmerButton({ children, className, ...props }: ShimmerButtonProps) {
  return (
    <a
      {...props}
      className={cn(
        "group relative inline-flex overflow-hidden rounded-full p-[2px] transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="gradient-border-auto absolute inset-[-120%]"
        style={{ background: brandConic, ["--animation-duration" as string]: "4s" }}
      />
      <span className="relative inline-flex items-center gap-2.5 rounded-full bg-[#151515] px-7 py-3.5 text-sm font-semibold tracking-wide text-white sm:text-base">
        {children}
      </span>
    </a>
  );
}

interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  duration?: string;
}

export function GradientBorderCard({
  children,
  className,
  innerClassName,
  duration = "6s",
}: GradientBorderCardProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-[1.5px]", className)}>
      <span
        aria-hidden="true"
        className="gradient-border-auto absolute inset-[-120%]"
        style={{ background: brandConic, ["--animation-duration" as string]: duration }}
      />
      <div className={cn("relative h-full rounded-[calc(1rem-1.5px)] bg-white", innerClassName)}>
        {children}
      </div>
    </div>
  );
}
