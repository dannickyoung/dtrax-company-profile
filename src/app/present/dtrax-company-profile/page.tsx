"use client";

import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { slides } from "@/decks/dtrax/slides";

export default function DtraxCompanyProfilePresentation() {
  return <DeckPlayer slides={slides} />;
}
