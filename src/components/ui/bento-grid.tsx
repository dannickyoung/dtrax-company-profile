"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Magic UI Bento Grid, in brand fills. Cards lift on hover and reveal a CTA row, the Magic UI way. */
export function BentoGrid({ children, className, cols = 3, rows = "16rem", style, ...props }: ComponentPropsWithoutRef<"div"> & { cols?: number; rows?: string }) {
  return (
    <div className={cn("grid w-full gap-4", className)} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gridAutoRows: rows, ...style }} {...props}>
      {children}
    </div>
  );
}

export type BentoFill = "white" | "pink" | "blue" | "lime" | "ink";

const fills: Record<BentoFill, string> = {
  white: "bg-white text-[#151515]",
  pink: "bg-[#FFB6B6] text-[#151515]",
  blue: "bg-[#9DD6FF] text-[#151515]",
  lime: "bg-[#DDFF97] text-[#151515]",
  ink: "bg-[#151515] text-white",
};

export function BentoCard({
  name,
  className,
  background,
  icon,
  description,
  cta,
  href,
  fill = "white",
  children,
  eyebrow,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  name?: ReactNode;
  className?: string;
  background?: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  cta?: string;
  href?: string;
  fill?: BentoFill;
  eyebrow?: ReactNode;
}) {
  const isInk = fill === "ink";
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1",
        isInk ? "shadow-[0_20px_60px_rgba(21,21,21,0.25)]" : "shadow-[0_10px_40px_rgba(21,21,21,0.06)]",
        fills[fill],
        className
      )}
      {...props}
    >
      <div className="pointer-events-none absolute inset-0">{background}</div>
      {eyebrow ? <div className="relative z-10 flex items-center justify-between px-5 pt-5 text-[11px] font-medium opacity-60">{eyebrow}</div> : null}
      <div className="relative z-10 flex flex-1 flex-col justify-end p-5 transition-transform duration-500 group-hover:-translate-y-8">
        {icon ? (
          <span className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-90", isInk ? "bg-white/15" : "bg-[#151515] text-white")}>
            {icon}
          </span>
        ) : null}
        {name ? <div className="text-2xl leading-tight">{name}</div> : null}
        {description ? <div className={cn("mt-2 max-w-md text-[13px] leading-relaxed", isInk ? "text-white/70" : "text-[#151515]/70")}>{description}</div> : null}
        {children}
      </div>
      {cta ? (
        <div className="pointer-events-none absolute bottom-0 z-10 flex w-full translate-y-10 items-center p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="pointer-events-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]">
              {cta} <ArrowUpRight className="h-3 w-3" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]">{cta} <ArrowUpRight className="h-3 w-3" /></span>
          )}
        </div>
      ) : null}
      <div className={cn("pointer-events-none absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0", isInk ? "bg-white/[0.04]" : "bg-[#151515]/[0.035]")} />
    </div>
  );
}
