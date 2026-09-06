"use client";

import { create } from "zustand";
import type { Language } from "@/types";

interface PreferencesState {
  language: Language;
  isHydrated: boolean;
  setLanguage: (lang: Language) => void;
  hydrate: (prefs: { language: Language }) => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  language: "en",
  isHydrated: false,
  setLanguage: (lang) => {
    set({ language: lang });
    import("@/lib/db/preferences").then(({ updatePreferences }) => {
      updatePreferences({ language: lang });
    });
  },
  hydrate: (prefs) => set({ language: prefs.language, isHydrated: true }),
}));
