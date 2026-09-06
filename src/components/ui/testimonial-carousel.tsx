"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  quote: string;
  name: string;
  title: string;
  company: string;
}

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  intervalMs?: number;
  className?: string;
}

const tones = ["bg-[#FFB6B6]", "bg-[#9DD6FF]", "bg-[#DDFF97]"];

function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 1 || /[A-Z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TestimonialCarousel({
  testimonials,
  intervalMs = 6500,
  className,
}: TestimonialCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % testimonials.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, intervalMs, testimonials.length]);

  const current = testimonials[index];
  const tone = tones[index % tones.length];

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[20rem] overflow-hidden rounded-[2rem] border border-black/10 bg-white px-8 py-10 shadow-[0_20px_60px_rgba(0,0,0,0.07)] sm:px-14 sm:py-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-2 -top-8 select-none text-[11rem] font-black leading-none text-black/[0.05]"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          &ldquo;
        </span>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.figure
            key={index}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col gap-8"
          >
            <blockquote
              className="text-xl font-light italic leading-relaxed text-[#151515] sm:text-2xl md:text-[1.75rem] md:leading-[1.45]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              &ldquo;{current.quote}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[#151515]",
                  tone
                )}
              >
                {initials(current.name)}
              </span>
              <div>
                <p className="text-base font-semibold text-[#151515]">{current.name}</p>
                <p className="text-sm text-[#151515]/60">
                  {current.title}, {current.company}
                </p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.company}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show testimonial from ${testimonial.company}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-[#151515]" : "w-1.5 bg-black/20 hover:bg-black/35"
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#151515]/60 transition-colors hover:text-[#151515]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-[#151515]/60 transition-colors hover:text-[#151515]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
