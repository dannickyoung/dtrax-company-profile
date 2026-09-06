import Dexie, { type Table } from "dexie";
import type { Presentation, Slide, Media, UserPreferences } from "@/types";

export class ChronoAIDB extends Dexie {
  presentations!: Table<Presentation>;
  slides!: Table<Slide>;
  media!: Table<Media>;
  preferences!: Table<UserPreferences>;

  constructor() {
    super("chronoai-weekly");

    this.version(1).stores({
      presentations: "id, [weekNumber+year], createdAt, status",
      slides: "id, presentationId, [presentationId+order]",
      media: "id",
      preferences: "id",
    });
  }
}

export const db = new ChronoAIDB();
