"use client";

import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { asset } from "@/lib/base-path";
import { slides } from "@/decks/bd/slides";

export default function DtraxBdDeckPresentation() {
  return <DeckPlayer slides={slides} intro={asset("/assets/bd/showcase-intro.mp4")} />;
}
