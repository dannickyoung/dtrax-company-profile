"use client";

import { useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  RectangleStackIcon as DeckOutline,
} from "@heroicons/react/24/outline";
import {
  RectangleStackIcon as DeckSolid,
} from "@heroicons/react/24/solid";
import { useNavStore } from "@/lib/store/nav-store";

const TABS = [
  { id: "dashboard", path: "/", label: "My Decks", outline: DeckOutline, solid: DeckSolid },
] as const;

export function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { saveScrollPosition } = useNavStore();

  const isPresenting = pathname.startsWith("/present/");
  const isEditing = pathname.startsWith("/editor/");
  if (isPresenting || isEditing) return null;

  const getActiveTab = () => {
    if (pathname === "/") return "dashboard";
    return "";
  };

  const activeTab = getActiveTab();

  const handleTabClick = useCallback(
    (tab: (typeof TABS)[number]) => {
      saveScrollPosition(activeTab, window.scrollY);
      router.push(tab.path);
    },
    [router, activeTab, saveScrollPosition]
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-base/90 backdrop-blur-lg border-t border-wire-subtle">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = isActive ? tab.solid : tab.outline;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                relative flex flex-col items-center justify-center gap-1
                w-16 h-full transition-colors duration-150
                ${isActive ? "text-neon-cyan" : "text-text-muted"}
              `}
              aria-label={tab.label}
            >
              <Icon className="w-6 h-6" />
              <span className="text-2xs">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-0.5 rounded-full bg-neon-cyan" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
