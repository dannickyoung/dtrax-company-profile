import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DeckState {
  completedSlugs: string[];
  toggleComplete: (slug: string) => void;
  isComplete: (slug: string) => boolean;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set, get) => ({
      completedSlugs: [],
      toggleComplete: (slug) =>
        set((state) => ({
          completedSlugs: state.completedSlugs.includes(slug)
            ? state.completedSlugs.filter((s) => s !== slug)
            : [...state.completedSlugs, slug],
        })),
      isComplete: (slug) => get().completedSlugs.includes(slug),
    }),
    { name: "deck-status" }
  )
);
