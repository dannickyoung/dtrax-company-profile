// Stand-in for next/font/google in the standalone build. The page loads the
// same faces from Google Fonts, and these classes point at them (see deck.css).
type Options = Record<string, unknown>;
export const DM_Sans = (_options?: Options) => ({ className: "font-dm-sans" });
export const Instrument_Serif = (_options?: Options) => ({ className: "font-instrument-serif" });
