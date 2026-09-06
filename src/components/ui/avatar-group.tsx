"use client";

import * as React from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface AvatarGroupProps {
  avatars: { src: string; alt?: string; label?: string }[];
  maxVisible?: number;
  size?: number;
  overlap?: number;
  activeIndex?: number | null;
}

const AvatarGroup = ({
  avatars,
  maxVisible = 5,
  size = 40,
  overlap = 14,
  activeIndex = null,
}: AvatarGroupProps) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const visibleAvatars = avatars.slice(0, maxVisible);
  const extraCount = avatars.length - maxVisible;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-3">
        {visibleAvatars.map((avatar, idx) => {
          const isHovered = hoveredIdx === idx || (hoveredIdx === null && activeIndex === idx);
          return (
            <div
              key={idx}
              className="relative rounded-full border-4 border-white bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition-all duration-500"
              style={{
                width: size,
                height: size,
                zIndex: isHovered ? 100 : visibleAvatars.length - idx,
                marginLeft: -overlap,
                position: "relative",
                transition:
                  "margin-left 0.45s cubic-bezier(0.22,1,0.36,1), z-index 0s, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
                transform: isHovered ? "translateY(-7px)" : "translateY(0)",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <img
                src={avatar.src}
                alt={avatar.alt || `Avatar ${idx + 1}`}
                width={size}
                height={size}
                className="h-full w-full rounded-full object-cover"
                draggable={false}
              />
              <AnimatePresence>
                {isHovered && avatar.label ? (
                  <motion.div
                    key="tooltip"
                    initial={{
                      x: "-50%",
                      y: 10,
                      opacity: 0,
                      scale: 0.7,
                    }}
                    animate={{
                      x: "-50%",
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      x: "-50%",
                      y: 10,
                      opacity: 0,
                      scale: 0.7,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 24,
                    }}
                    className="pointer-events-none absolute z-50 whitespace-nowrap rounded bg-[#151515] px-2 py-1 text-xs font-semibold text-white shadow-lg"
                    style={{
                      top: -size * 0.46,
                      left: "50%",
                    }}
                  >
                    {avatar.label}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
        {extraCount > 0 ? (
          <div
            className="flex items-center justify-center rounded-full border-4 border-white bg-[#DDFF97] font-semibold text-[#151515]"
            style={{
              width: size,
              height: size,
              marginLeft: -overlap,
              zIndex: 0,
              fontSize: size * 0.32,
              transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            +{extraCount}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export { AvatarGroup };
