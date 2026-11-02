"use client";

import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { PAGE_H, PAGE_W, slides } from "@/decks/handbook/slides";

export default function DtraxEmployeeHandbook() {
  return <DeckPlayer slides={slides} size={{ width: PAGE_W, height: PAGE_H }} />;
}
