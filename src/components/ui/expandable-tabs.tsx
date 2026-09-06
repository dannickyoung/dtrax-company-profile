"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { cn } from "@/lib/utils";

interface Tab {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  activeBgClassName?: string;
  onChange?: (index: number | null) => void;
  selectedIndex?: number | null;
}

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-violet-200",
  activeBgClassName = "bg-white/8",
  onChange,
  selectedIndex,
}: ExpandableTabsProps) {
  const [internalSelected, setInternalSelected] = React.useState<number | null>(null);
  const outsideClickRef = React.useRef<HTMLDivElement>(null);

  const selected = selectedIndex ?? internalSelected;

  useOnClickOutside(outsideClickRef as React.RefObject<HTMLElement>, () => {
    if (selectedIndex !== undefined) return;
    setInternalSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    if (selectedIndex === undefined) {
      setInternalSelected(index);
    }
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1.5 h-[22px] w-px bg-black/10" aria-hidden="true" />
  );

  const toolbarTransition = {
    type: "spring" as const,
    stiffness: 175,
    damping: 24,
    mass: 0.95,
  };

  return (
    <motion.div
      ref={outsideClickRef}
      className={cn(
        "inline-flex w-max flex-nowrap items-center justify-start gap-1 rounded-[1.2rem] border border-black/10 bg-white/90 p-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            onClick={() => handleSelect(index)}
            className={cn(
              "relative flex h-10 shrink-0 items-center justify-center overflow-hidden rounded-[0.95rem] py-2 text-[15px] font-medium transition-[background-color,color,padding] duration-300 ease-out",
              selected === index ? "px-4" : "px-2.5",
              selected === index
                ? cn(activeBgClassName, activeColor)
                : "text-neutral-500 hover:bg-black/5 hover:text-neutral-800"
            )}
          >
            <div className="flex w-full items-center justify-center">
              <Icon className="h-5 w-5 shrink-0" />
              <motion.span
                initial={false}
                animate={{
                  opacity: selected === index ? 1 : 0,
                  width: selected === index ? "auto" : 0,
                  marginLeft: selected === index ? 6 : 0,
                }}
                transition={toolbarTransition}
                className="inline-block shrink-0 overflow-hidden whitespace-nowrap text-center"
              >
                {tab.title}
              </motion.span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
