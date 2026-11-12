"use client";

import { DeckProvider, STAGE_H, STAGE_W } from "@/components/deck/Deck";
import { slidesJohnathan as slides } from "@/decks/bd/slides";

/** Every slide fully revealed and still, one per 1920 × 1080 page. Source for the PDF. */
export default function DtraxBdDeckJohnathanPrint() {
  return (
    <DeckProvider step={Infinity} print>
      <style>{`@page { size: ${STAGE_W}px ${STAGE_H}px; margin: 0; } html, body { background: #ffffff !important; min-height: 0 !important; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>
      {slides.map((slide) => (
        <section key={slide.id} className="deck-print-page relative overflow-hidden bg-white" style={{ width: STAGE_W, height: STAGE_H }}>
          {slide.render()}
        </section>
      ))}
    </DeckProvider>
  );
}
