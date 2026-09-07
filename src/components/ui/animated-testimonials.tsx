"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AnimatedTestimonial {
  quote: string;
  name: string;
  designation: string;
  initials: string;
  logo?: string;
  logoClassName?: string;
}

const tones = [
  "bg-[#FFB6B6]",
  "bg-[#9DD6FF]",
  "bg-[#DDFF97]",
];

/** Aceternity Animated Testimonials: a rotating stack of portrait cards with word-by-word quote reveal. */
export function AnimatedTestimonials({
  testimonials,
  autoplay = true,
  intervalMs = 7000,
}: {
  testimonials: AnimatedTestimonial[];
  autoplay?: boolean;
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);
  const [rotations] = useState(() => testimonials.map((_, index) => ((index * 7) % 21) - 10));

  const next = () => setActive((current) => (current + 1) % testimonials.length);
  const previous = () => setActive((current) => (current - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(next, intervalMs);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay, intervalMs]);

  const current = testimonials[active];

  return (
    <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <div className="relative h-[24rem] w-full">
        <AnimatePresence>
          {testimonials.map((testimonial, index) => {
            const isActive = index === active;
            return (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9, z: -100, rotate: rotations[index] }}
                animate={{
                  opacity: isActive ? 1 : 0.7,
                  scale: isActive ? 1 : 0.95,
                  z: isActive ? 0 : -100,
                  rotate: isActive ? 0 : rotations[index],
                  zIndex: isActive ? 40 : testimonials.length + 2 - index,
                  y: isActive ? [0, -60, 0] : 0,
                }}
                exit={{ opacity: 0, scale: 0.9, z: 100, rotate: rotations[index] }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0 origin-bottom"
              >
                <div
                  className={cn(
                    "relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.14)]",
                    tones[index % tones.length]
                  )}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-40"
                    style={{ backgroundImage: "repeating-linear-gradient(135deg, rgba(21,21,21,0.06) 0 2px, transparent 2px 14px)" }}
                  />
                  {testimonial.logo ? (
                    <img src={testimonial.logo} alt={testimonial.name} className={cn("relative object-contain drop-shadow-[0_10px_20px_rgba(21,21,21,0.18)]", testimonial.logoClassName ?? "max-h-32 w-[64%]")} />
                  ) : (
                    <span className="relative text-7xl font-black tracking-[-0.06em] text-[#151515]/80">{testimonial.initials}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-between py-2">
        <motion.div key={active} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
          <h3 className="text-2xl font-bold tracking-tight text-[#151515]">{current.name}</h3>
          <p className="text-sm text-[#151515]/55">{current.designation}</p>
          <motion.p className="mt-7 text-xl font-medium leading-relaxed tracking-tight text-[#151515] sm:text-2xl">
            {current.quote.split(" ").map((word, index) => (
              <motion.span
                key={`${active}-${index}`}
                initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut", delay: 0.02 * index }}
                className="inline-block"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
        <div className="mt-8 flex items-center gap-3">
          <button type="button" onClick={previous} aria-label="Previous testimonial" className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-[#151515] text-white">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/button:rotate-12" />
          </button>
          <button type="button" onClick={next} aria-label="Next testimonial" className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-[#151515] text-white">
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:-rotate-12" />
          </button>
          <div className="ml-2 flex gap-1.5">
            {testimonials.map((testimonial, index) => (
              <span key={testimonial.name} className={cn("h-1.5 rounded-full transition-all duration-300", index === active ? "w-7 bg-[#151515]" : "w-1.5 bg-black/20")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
