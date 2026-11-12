"use client";

import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { asset } from "@/lib/base-path";
import { slidesJohnathan as slides } from "@/decks/bd/slides";

export default function DtraxBdDeckJohnathanPresentation() {
  return <DeckPlayer slides={slides} intro={asset("/assets/bd/showcase-intro.mp4")} />;
}
