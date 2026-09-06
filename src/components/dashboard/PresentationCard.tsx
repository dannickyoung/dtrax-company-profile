"use client";

import { PlayIcon } from "@heroicons/react/24/solid";
import {
  RectangleStackIcon,
  CheckCircleIcon as CheckOutline,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon as CheckSolid } from "@heroicons/react/24/solid";
import { formatDateRange } from "@/lib/utils/week";
import type { PresentationEntry } from "@/lib/presentations/registry";
import { useDeckStore } from "@/lib/store/deck-store";
import { BASE } from "@/lib/base-path";

interface PresentationCardProps {
  presentation: PresentationEntry;
  isCurrentWeek?: boolean;
}

export function PresentationCard({
  presentation,
  isCurrentWeek = false,
}: PresentationCardProps) {
  const { isComplete, toggleComplete } = useDeckStore();
  const complete = isComplete(presentation.slug);

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleComplete(presentation.slug);
  };

  const statusLabel = complete ? "Complete" : "Draft";

  return (
    <a
      href={`${BASE}/present/${presentation.slug}/`}
      className={`
        block relative group cursor-pointer rounded-2xl overflow-hidden
        bg-surface-raised border transition-all duration-200
        ${isCurrentWeek ? "border-[#9DD6FF]" : "border-wire-subtle"}
        hover:border-wire-emphasis hover:-translate-y-0.5
        active:scale-[0.97] active:opacity-80
      `}
    >
      {/* Thumbnail preview area */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-[#FFB6B6]/35 via-[#9DD6FF]/30 to-[#DDFF97]/40">
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.05) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="absolute bottom-2 right-4 text-5xl font-black text-[#151515]/[0.07] leading-none select-none">
          W{presentation.weekNumber}
        </div>

        {isCurrentWeek && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#151515]" />
            <span className="text-2xs font-medium text-[#151515]/70">
              This Week
            </span>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span
            className={`text-2xs px-2 py-0.5 rounded-md font-medium ${
              complete
                ? "bg-[#DDFF97] text-[#151515]"
                : "bg-white/70 text-text-secondary"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/15">
          <div
            className="w-11 h-11 rounded-full bg-[#151515] flex items-center justify-center
              text-white transition-transform duration-150
              hover:scale-110 active:scale-95"
          >
            <PlayIcon className="w-5 h-5 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-text-primary truncate mb-1">
          {presentation.title}
        </h3>

        <p className="text-2xs text-text-muted mb-3">
          {formatDateRange(presentation.dateRangeStart, presentation.dateRangeEnd)}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-2xs text-text-muted">
            <RectangleStackIcon className="w-3.5 h-3.5" />
            {presentation.slideCount} slides
          </span>

          <button
            onClick={handleToggleStatus}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-150 active:scale-95 ${
              complete
                ? "bg-[#DDFF97] text-[#151515] hover:bg-[#DDFF97]/80"
                : "bg-black/5 text-text-secondary hover:bg-black/10 hover:text-text-primary"
            }`}
          >
            {complete ? (
              <CheckSolid className="w-4 h-4" />
            ) : (
              <CheckOutline className="w-4 h-4" />
            )}
            {complete ? "Done" : "Mark Done"}
          </button>
        </div>
      </div>
    </a>
  );
}
