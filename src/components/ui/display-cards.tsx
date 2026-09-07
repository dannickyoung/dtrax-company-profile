"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  backgroundClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-[#151515]" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "",
  iconClassName = "text-[#151515]",
  titleClassName = "text-[#151515]",
  backgroundClassName = "bg-[#9DD6FF]/30",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] max-w-full -skew-y-[8deg] select-none flex-col justify-between rounded-xl border border-black/10 px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:z-0 after:h-[110%] after:w-[20rem] after:max-w-[85%] after:bg-gradient-to-l after:from-[#f4f4f2] after:to-transparent after:content-[''] hover:border-black/20 [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        backgroundClassName,
        className
      )}
    >
      <div className="relative z-10">
        <span
          className={cn(
            "relative inline-flex rounded-full bg-white/70 p-1.5",
            iconClassName
          )}
        >
          {icon}
        </span>
        <p className={cn("text-base font-semibold", titleClassName)}>{title}</p>
      </div>
      <p className="relative z-10 truncate text-[13px] text-text-primary">{description}</p>
      {date ? <p className="relative z-10 text-text-secondary">{date}</p> : null}
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  className?: string;
}

export default function DisplayCards({ cards, className }: DisplayCardsProps) {
  const defaultCards: DisplayCardProps[] = [
    {
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/40 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0",
    },
    {
      className:
        "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/40 before:content-[''] before:transition-opacity before:duration-700 hover:before:opacity-0",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div
      className={cn(
        "grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700",
        className
      )}
    >
      {displayCards.map((cardProps, index) => (
        <motion.div
          key={`${cardProps.title || "card"}-${index}`}
          className="[grid-area:stack]"
          animate={{ y: [0, -32, 0] }}
          transition={{
            duration: 2.8,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: index * 0.3,
            repeatDelay: 0.2,
          }}
        >
          <DisplayCard {...cardProps} className={cn("!m-0", cardProps.className)} />
        </motion.div>
      ))}
    </div>
  );
}
