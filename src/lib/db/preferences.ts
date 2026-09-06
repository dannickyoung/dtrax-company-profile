import { db } from "./index";
import type { UserPreferences } from "@/types";

const SINGLETON_ID = "user-prefs";

const defaultPreferences: UserPreferences = {
  id: SINGLETON_ID,
  language: "en",
  lastActiveTab: "dashboard",
  lastEditedPresentationId: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getPreferences(): Promise<UserPreferences> {
  const existing = await db.preferences.get(SINGLETON_ID);
  if (existing) return existing;

  await db.preferences.add({ ...defaultPreferences });
  return { ...defaultPreferences };
}

export async function updatePreferences(
  updates: Partial<Omit<UserPreferences, "id" | "createdAt">>
): Promise<void> {
  const existing = await db.preferences.get(SINGLETON_ID);
  if (!existing) {
    await db.preferences.add({
      ...defaultPreferences,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } else {
    await db.preferences.update(SINGLETON_ID, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
}
