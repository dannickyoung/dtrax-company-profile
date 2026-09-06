"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  RectangleStackIcon as DeckOutline,
} from "@heroicons/react/24/outline";
import {
  RectangleStackIcon as DeckSolid,
} from "@heroicons/react/24/solid";

const NAV_ITEMS = [
  { id: "dashboard", path: "/", label: "My Decks", outline: DeckOutline, solid: DeckSolid },
] as const;

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isPresenting = pathname.startsWith("/present/");
  const isEditing = pathname.startsWith("/editor/");
  if (isPresenting || isEditing) return null;

  const activeId = pathname === "/" ? "dashboard" : "";

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-surface-base border-r border-wire-subtle z-20">
      {/* Brand */}
      <div className="px-6 pt-8 pb-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FFB6B6]/60 border border-[#FFB6B6] flex items-center justify-center">
            <span className="text-[#151515] font-bold text-sm">D</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary leading-tight">D&apos;trax</h1>
            <p className="text-2xs text-text-muted">Company deck</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <p className="px-3 mb-2 text-2xs font-medium text-text-muted uppercase tracking-wider">
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeId;
            const Icon = isActive ? item.solid : item.outline;
            return (
              <li key={item.id}>
                <button
                  onClick={() => router.push(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 h-11 rounded-xl text-sm font-medium
                    transition-all duration-150
                    ${
                      isActive
                        ? "bg-[#DDFF97]/70 text-[#151515]"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-raised"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#151515]" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
