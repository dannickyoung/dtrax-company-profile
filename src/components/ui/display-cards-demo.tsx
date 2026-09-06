"use client";

import { Palette, PenTool, Shapes, Sparkles } from "lucide-react";
import DisplayCards from "@/components/ui/display-cards";

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-violet-300" />,
    title: "Typography",
    description: "Sharper hierarchy",
    date: "Before -> After",
    titleClassName: "text-violet-300",
    iconClassName: "text-violet-300",
    className:
      "[grid-area:stack] -translate-x-24 -translate-y-12 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/40 before:content-['']",
  },
  {
    icon: <Palette className="size-4 text-cyan-300" />,
    title: "Colour tokens",
    description: "Systemized palette",
    date: "Before -> After",
    titleClassName: "text-cyan-300",
    iconClassName: "text-cyan-300",
    className:
      "[grid-area:stack] -translate-x-8 translate-y-4 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/35 before:content-['']",
  },
  {
    icon: <Shapes className="size-4 text-lime-300" />,
    title: "Component library",
    description: "Cleaner primitives",
    date: "Before -> After",
    titleClassName: "text-lime-300",
    iconClassName: "text-lime-300",
    className:
      "[grid-area:stack] translate-x-10 translate-y-20 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/25 before:content-['']",
  },
  {
    icon: <PenTool className="size-4 text-orange-300" />,
    title: "App Store assets",
    description: "Launch-ready polish",
    date: "Before -> After",
    titleClassName: "text-orange-300",
    iconClassName: "text-orange-300",
    className: "[grid-area:stack] translate-x-28 translate-y-36",
  },
];

export function DisplayCardsDemo() {
  return (
    <div className="flex min-h-[460px] w-full items-center justify-center py-20">
      <div className="w-full max-w-4xl">
        <DisplayCards cards={defaultCards} />
      </div>
    </div>
  );
}
