"use client";

import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "pink" | "blue" | "lime" | "neutral";

const tones: Record<Tone, string> = {
  pink: "bg-[#FFB6B6]/30 border-[#FFB6B6]",
  blue: "bg-[#9DD6FF]/30 border-[#9DD6FF]",
  lime: "bg-[#DDFF97]/35 border-[#DDFF97]",
  neutral: "bg-black/[0.03] border-black/20",
};

interface PlaceholderImageProps {
  label: string;
  note?: string;
  aspect?: string;
  tone?: Tone;
  className?: string;
  compact?: boolean;
  fill?: boolean;
}

export function PlaceholderImage({
  label,
  note,
  aspect = "4 / 3",
  tone = "neutral",
  className,
  compact = false,
  fill = false,
}: PlaceholderImageProps) {
  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed",
        fill ? "h-full" : "",
        tones[tone],
        className
      )}
      style={fill ? undefined : { aspectRatio: aspect }}
      role="img"
      aria-label={`Image placeholder: ${label}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(21,21,21,0.06) 0 2px, transparent 2px 14px)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <span
          className={cn(
            "flex items-center justify-center rounded-full bg-white/80 text-[#151515]",
            compact ? "h-8 w-8" : "h-11 w-11"
          )}
        >
          <ImageIcon className={compact ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.6} />
        </span>
        <span
          className={cn(
            "font-semibold text-[#151515]",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {label}
        </span>
        {note && !compact ? (
          <span className="text-2xs uppercase tracking-[0.18em] text-[#151515]/55">
            {note}
          </span>
        ) : null}
      </div>
    </div>
  );
}
