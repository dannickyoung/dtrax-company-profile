import { create } from "zustand";

interface NavState {
  activeTab: string;
  scrollPositions: Record<string, number>;
  setActiveTab: (tab: string) => void;
  saveScrollPosition: (tab: string, scrollY: number) => void;
  getScrollPosition: (tab: string) => number;
}

export const useNavStore = create<NavState>((set, get) => ({
  activeTab: "dashboard",
  scrollPositions: {},
  setActiveTab: (tab) => set({ activeTab: tab }),
  saveScrollPosition: (tab, scrollY) =>
    set((state) => ({
      scrollPositions: { ...state.scrollPositions, [tab]: scrollY },
    })),
  getScrollPosition: (tab) => get().scrollPositions[tab] ?? 0,
}));
