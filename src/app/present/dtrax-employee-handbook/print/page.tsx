"use client";

import { DeckProvider } from "@/components/deck/Deck";
import { PAGE_H, PAGE_W, slides } from "@/decks/handbook/slides";

/** Every page fully revealed and still, one per 1240 × 1754 portrait page. Source for the PDF. */
export default function DtraxEmployeeHandbookPrint() {
  return (
    <DeckProvider step={Infinity} print>
      <style>{`@page { size: ${PAGE_W}px ${PAGE_H}px; margin: 0; } html, body { background: #ffffff !important; min-height: 0 !important; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }`}</style>
      {slides.map((slide, index) => (
        <section key={slide.id} id={`page-${index + 1}`} className="deck-print-page relative overflow-hidden bg-white" style={{ width: PAGE_W, height: PAGE_H }}>
          {slide.render()}
        </section>
      ))}
    </DeckProvider>
  );
}
