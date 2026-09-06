"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Aceternity Infinite Moving Cards: a seamlessly looping row of any content. */
export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: { key: string; content: ReactNode }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current || scrollerRef.current.dataset.cloned) return;
    Array.from(scrollerRef.current.children).forEach((child) => {
      scrollerRef.current?.appendChild(child.cloneNode(true));
    });
    scrollerRef.current.dataset.cloned = "true";
    containerRef.current.style.setProperty("--animation-direction", direction === "left" ? "forwards" : "reverse");
    containerRef.current.style.setProperty("--animation-duration", speed === "fast" ? "24s" : speed === "normal" ? "44s" : "80s");
    setStart(true);
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5 py-6",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li key={item.key} className="relative shrink-0">
            {item.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
