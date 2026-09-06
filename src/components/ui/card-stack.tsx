"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CardStackItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  description: string;
}

export default function CardStack({
  cards: initialCards,
}: {
  cards: CardStackItem[];
}) {
  const neonCardColors = [
    "border-[#9DD6FF]",
    "border-[#DDFF97]",
    "border-[#FFB6B6]",
  ];

  const [cards, setCards] = useState<CardStackItem[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);

  const offset = 9;
  const scaleStep = 0.055;
  const borderRadius = 20;

  const spring = {
    type: "spring" as const,
    stiffness: 170,
    damping: 26,
  };

  const moveToEnd = () => {
    setCards((prev) => [...prev.slice(1), prev[0]]);
    setCurrentIndex((prev) => (prev + 1) % initialCards.length);
  };

  const moveToStart = () => {
    setCards((prev) => [prev[prev.length - 1], ...prev.slice(0, -1)]);
    setCurrentIndex((prev) => (prev - 1 + initialCards.length) % initialCards.length);
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      <div className="relative flex w-full max-w-7xl items-center justify-center">
        <button
          type="button"
          onClick={moveToStart}
          className="absolute left-0 z-20 translate-x-3 text-black/40 transition-colors duration-200 hover:text-black"
          aria-label="Previous workflow frame"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div className="relative w-[32rem] max-w-full aspect-[16/10] overflow-visible sm:w-[40rem] lg:w-[48rem]">
          <ul className="relative h-full w-full m-0 p-0">
            <AnimatePresence initial={false}>
              {cards.map(({ id, src, alt }, i) => {
                const isFront = i === 0;
                const baseZ = cards.length - i;
                const neonColor =
                  neonCardColors[(currentIndex + i) % neonCardColors.length];

                return (
                  <motion.li
                    key={id}
                    className={`absolute h-full w-full list-none overflow-hidden bg-transparent ${isFront ? "border border-black/10" : `border-2 ${neonColor}`}`}
                    style={{
                      borderRadius: `${borderRadius}px`,
                      boxShadow: isFront
                        ? "0 25px 50px rgba(0,0,0,0.16)"
                        : "0 15px 30px rgba(0,0,0,0.08)",
                  }}
                  animate={{
                    top: `${i * -offset}%`,
                    scale: 1 - i * scaleStep,
                    opacity: isFront ? 1 : 0.1,
                      zIndex: baseZ,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.84,
                    transition: { duration: 0.18 },
                  }}
                  transition={spring}
                  >
                    <img
                      src={src}
                      alt={alt}
                      className={`h-full w-full object-contain pointer-events-none select-none ${
                        isFront ? "bg-white opacity-100" : "bg-transparent opacity-0"
                      }`}
                      draggable={false}
                    />
                </motion.li>
              );
            })}
            </AnimatePresence>
          </ul>
        </div>

        <button
          type="button"
          onClick={moveToEnd}
          className="absolute right-0 z-20 -translate-x-3 text-black/40 transition-colors duration-200 hover:text-black"
          aria-label="Next workflow frame"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <div className="flex w-full max-w-5xl items-center justify-center">
        <div className="flex gap-2">
          {initialCards.map((card, i) => (
            <button
              key={card.id}
              type="button"
              onClick={() => {
                setCards([
                  ...initialCards.slice(i),
                  ...initialCards.slice(0, i),
                ]);
                setCurrentIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-8 bg-[#151515]" : "w-1.5 bg-black/20 hover:bg-black/35"
              }`}
              aria-label={`Go to workflow frame ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
